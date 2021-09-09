<template>
  <div class="keyword">
    <div class="close" @click="closeIt()">关闭</div>
    <br>
    <button @click="saveKey()">保存</button>
    <div class="tips">区分大小写,不要输入特殊字符,多个字符串间使用<span style="font-size:25px;color:red">,</span>逗号分隔</div>
    <div class="kk1">
      <div class="key1">
        包含关键字
        <textarea v-model="passA" class="texa"/>
        <div class="tips">文件名必须包含了输入字符串之一才可上传</div>
      </div>
      <div class="key1">
        不含关键字
        <textarea v-model="refuseA" class="texa"/>
        <div class="tips">文件名只要包含了输入字符串之一就不可上传</div>
      </div>
    </div>
    <br>
    <div class="tips">都输入的话，则都会校验，先校验包含</div>
  </div>
</template>

<script>
const ObjStore = require('../../../../objDataStore.js')
const keyWordObj = new ObjStore({ name: 'keyWordObj' })
export default {
  data() {
    return {
      passA: '',
      refuseA: ''
    }
  },
  created() {
    this.getKey()
  },
  methods: {
    saveKey() {
      const arr1 = this.passA ? this.passA.split(',') : ''
      const arr2 = this.refuseA ? this.refuseA.split(',') : ''
      const arr3 = arr1 ?? arr1.filter((v) => {
        return v
      })
      const arr4 = arr2 ?? arr2.filter((v) => {
        return v
      })
      const obj = {
        pass: arr3,
        refuse: arr4
      }
      keyWordObj.saveTracks(obj)
      this.$emit('getKeys')
      this.closeIt()
    },
    getKey() {
      const key = keyWordObj.getTracks()
      console.log(key)
      if (key && key.pass && key.pass[0]) {
        this.passA = key.pass.join(',')
      }
      if (key && key.refuse && key.refuse[0]) {
        this.refuseA = key.refuse.join(',')
      }
    },
    closeIt() {
      this.$emit('setKey')
    }
  }
}
</script>

<style lang="less" scoped>
.keyword{
  width:500px;
  height: 300px;
  background: white;
  position: fixed;
  left: 50%;
  top: 10%;
  transform: translateX(-50%);
  border: 1px solid #666;
  border-radius: 20px;
  box-shadow:0px 0px 10px #aaa;
  .close{
    font-size: 12px;
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
    color:blue;
  }
  .tips{
    font-size: 12px;
    color: #666;
  }
  .kk1{
    display: flex;
  }
  .key1{
    width: 50%;
    overflow: hidden;
    .texa{
      width: 85%;
      height: 100px;
      resize: vertical;
      font-size: 16px;
      padding: 5px;
      box-sizing: border-box;
    }
  }
}
</style>
