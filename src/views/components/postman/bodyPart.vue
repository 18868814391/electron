<template>
  <div class="bodyPart">
    <div class="types">
      <div class="types-item" v-for="(item,index) in types" :key="index" :class="type==item.id?'types-item-sel':''" @click="selectType(item)">{{item.name}}</div>
    </div>

    <div v-show="type==1"></div>
    <div v-show="type==2">
      <formDataPart @giveParams="getFormData"></formDataPart>
    </div>
    <div v-show="type==3">
      <paramsPart @giveParams="getXwwwForm"></paramsPart>
    </div>
    <div v-show="type==4">
      <textarea class="jst" v-model="jsonText" @input="getJson"></textarea>
    </div>
    <div v-show="type==5">
      <input type="file"  @change="upload">
    </div>

  </div>
</template>

<script>
import formDataPart from './formDataPart'
import paramsPart from './paramsPart'
export default {
  components: {
    paramsPart,
    formDataPart
  },
  data() {
    return {
      type: 4,
      types: [{name: 'none', id: 1}, {name: 'form-data', id: 2}, {name: 'x-www-form-urlencoded', id: 3}, {name: 'json', id: 4}, {name: 'binary', id: '5'}],
      formData: [],
      xwwwForm: [],
      json: {},
      binary: null,
      jsonText: ''
    }
  },
  methods: {
    selectType(d) {
      this.type = d.id
      this.giveData()
    },
    getFormData(e) {
      this.formData = e
      this.giveData()
    },
    getXwwwForm(e) {
      this.xwwwForm = e
      this.giveData()
    },
    getJson(e) {
      this.json = JSON.parse(this.jsonText)
      this.giveData()
    },
    upload(e) {
      const file = e.target.files[0];
      this.binary = new FormData();// 创建 formdata对象
      this.binary.append('file', file);
      // console.log(this.binary.get('file'))
      this.giveData()
    },
    giveData() {
      console.log({type: this.type, formData: this.formData, xwwwForm: this.xwwwForm, json: this.json, binary: this.binary})
      this.$emit('giveBody', {type: this.type, formData: this.formData, xwwwForm: this.xwwwForm, json: this.json, binary: this.binary})
    }
  }
}
</script>

<style lang="less" scoped>
.bodyPart{
  width: 100%;
  .types{
    width: 100%;
    display: flex;
    margin-top:5px ;
    .types-item{
      padding: 5px;
      border: 1px solid #ddd;
      border-radius:3px ;
      margin-right:5px ;
      cursor: pointer;
    }
    .types-item-sel{
      background: lightcoral;
    }
  }
  .jst{
    width: 100%;
    height: 120px;
    padding: 10px;
    box-sizing: border-box;

  }
}
</style>
