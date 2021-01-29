<template>
  <div class="postman">
    <div class="head">
      <div class="head-l">
        <select v-model="sendType" @change="gpchange">
          <option v-for="(item,index) in sendTypes" :key="index" :value ="item">{{item}}</option>
        </select>
      </div>
      <div class="head-c">
        <textarea class="head-c-inp" type="text" placeholder="请输入地址" v-model="sendUrl" @input="urlInpFun"></textarea>
      </div>
      <div class="head-r">
        <button @click="goSend()" v-if="!loading">send</button>
        <button  v-if="loading">loding...</button>
      </div>
    </div>
    <div class="option">
      <div class="option-nav">
        <div class="navs" @click="changeType(1)" :class="optionType==1?'op-select':''">Params</div>
        <div class="navs" @click="changeType(2)" :class="optionType==2?'op-select':''">Headers</div>
        <div class="navs" @click="changeType(3)" :class="optionType==3?'op-select':''">Body</div>
      </div>
      <paramsPart ref="paramsPart" @giveParams="giveParams" v-show="optionType==1"></paramsPart>
      <headersPart @giveHeaders="giveHeaders" v-show="optionType==2"></headersPart>
      <bodyPart @giveBody="giveBody" v-show="optionType==3"></bodyPart>
    </div>
    <div class="response">
      <pre>{{responseData}}</pre>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import qs from 'qs'
import paramsPart from './components/postman/paramsPart'
import headersPart from './components/postman/headersPart'
import bodyPart from './components/postman/bodyPart'
export default {
  components: {
    paramsPart,
    headersPart,
    bodyPart
  },
  data() {
    return {
      loading: false,
      sendType: 'GET',
      sendTypes: ['GET', 'POST'],
      sendUrl: '',
      optionType: 1,
      params: [],
      headers: [],
      bodys: {},
      responseData: {}
    }
  },
  created() {
    axios.defaults.adapter = require('axios/lib/adapters/http');
  },
  methods: {
    gpchange(e) {
      console.log(e)
      if (this.sendType === 'GET') {
        this.$refs.paramsPart.selectAll()
      } else if (this.sendType === 'POST') {
        this.$refs.paramsPart.cancelAll()
      }
    },
    goSend() {
      const self = this;
      if (this.sendType === 'GET') {
        self.loading = true
        axios.get(self.sendUrl).then((d) => {
          self.responseData = d.data
        }).catch((d) => {
          self.responseData = d
        }).finally(() => {
          self.loading = false
        })
      } else if (this.sendType === 'POST') {
        self.loading = true
        let body = null
        if (this.bodys.type === 1) { // ------------------------------------------------------------none
          body = null
          axios.defaults.headers['Content-Type'] = ''
        } else if (this.bodys.type === 2) { // --------------------------------------------------form-data
          const formDataArr = this.bodys.formData
          const obj = {}
          formDataArr.forEach((v) => {
            if (v.select) {
              obj[v.key] = v.value
            }
          })
          body = obj
          axios.defaults.headers['Content-Type'] = 'multipart/form-data'
        } else if (this.bodys.type === 3) { // -------------------------------------------x-www-form-urlencoded
          const xwwwFormArr = this.bodys.xwwwForm
          const obj = {}
          xwwwFormArr.forEach((v) => {
            if (v.select) {
              obj[v.key] = v.value
            }
          })
          body = qs.stringify(obj)
          axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        } else if (this.bodys.type === 4) { // -----------------------------------------------------json
          body = this.bodys.json
          axios.defaults.headers['Content-Type'] = 'application/json'
        } else if (this.bodys.type === 5) { // ------------------------------------------------------binary
          body = this.bodys.binary
          axios.defaults.headers['Content-Type'] = 'multipart/form-data'
        }
        axios.post(self.sendUrl, body)
          .then((d) => { self.responseData = d.data }).catch((d) => {
            self.responseData = d
          }).finally(() => {
            self.loading = false
          })
      }
    },
    changeType(e) {
      this.optionType = e
    },
    urlInpFun() {
      // let paramsPart = this.sendUrl.split('?')[1]
      // if(paramsPart&&paramsPart.indexOf('=')!=-1){
      //   let arr=paramsPart.split('&')
      //   let arr2=[]
      //   arr.forEach((v,i,a)=>{

      //   })
      // }
    },
    giveParams(e) {
      this.sendUrl = this.sendUrl.split('?')[0]
      this.params = e
      let addUrl = ''
      this.params.forEach((v, i, a) => {
        if (v.select) {
          addUrl = addUrl + `${i === 0 ? '?' : '&'}${v.key}=${v.value}`
        }
      })
      this.sendUrl = this.sendUrl + addUrl
    },
    giveHeaders(e) {
      this.headers = e
      this.headers.forEach((v, i, a) => {
        axios.defaults.headers[v.key] = v.select ? v.value : ''
      })
    },
    giveBody(e) {
      console.log(e)
      this.bodys = e
    }
  }
}
</script>
<style lang="less" scoped>
.postman{
  width: 100%;
  .head{
    width: 100%;
    display: flex;
    align-items: center;
    .head-l{
      width: 100px;
    }
    .head-c{
      flex:1;
      .head-c-inp{
        width: 100%;
        border: 1px solid lavender;
        border-radius:5px ;
      }
    }
    .head-r{
      width: 100px;
    }
  }
  .option{
    width: 100%;
    .option-nav{
      width: 100%;
      display: flex;
      .navs{
        width: 80px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        border: 1px solid #999;
        border-radius:5px;
        margin: 0 5px;
        cursor: pointer;
      }
      .op-select{
        background: lightblue;
      }
    }
  }
  .response{
    max-width: 600px;
    word-break: break-all;
    text-align: left;
  }
}
</style>
