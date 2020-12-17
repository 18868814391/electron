<template>
  <div class="postman">
    <div class="head">
      <div class="head-l">
        <select v-model="sendType">
          <option v-for="(item,index) in sendTypes" :key="index" :value ="item">{{item}}</option>
        </select>
      </div>
      <div class="head-c">
        <textarea class="head-c-inp" type="text" placeholder="请输入地址" v-model="sendUrl"></textarea>
      </div>
      <div class="head-r">
        <button>send</button>
      </div>
    </div>
    <div class="option">
      <div class="option-nav">
        <div class="navs" @click="optionType=1" :class="optionType==1?'op-select':''">Params</div>
        <div class="navs" @click="optionType=2" :class="optionType==2?'op-select':''">Headers</div>
        <div class="navs" @click="optionType=3" :class="optionType==3?'op-select':''">Body</div>
      </div>
      <paramsPart></paramsPart>
    </div>
  </div>
</template>>
<script>
import paramsPart from './components/postman/paramsPart'
export default {
  components: {
    paramsPart
  },
  data() {
    return {
      sendType: 'GET',
      sendTypes: ['GET', 'POST'],
      sendUrl: '',
      optionType: 1
    }
  },
  created() {

  },
  methods: {

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
}
</style>
