<template>
  <div class="pap">
    <div class="pap-nav">
      <div class="pap-c1">ind</div>
      <div class="pap-c2">KEY</div>
      <div class="pap-c3">VALUE</div>
    </div>
    <div class="pap-con" v-for="(item,index) in paramArr" :key="index">
      <div class="pap-c1" :class="item.select?'pap-c1-select':''" @click="item.select=!item.select">{{index+1}}</div>
      <div class="pap-c2"><input v-model="item.key" type="text" @input="inpFun(index,$event)"></div>
      <div class="pap-c3"><input v-model="item.value" type="text" @input="inpFun(index,$event)"><span class="pap-c3-del" @click="delectOne(index)">&times;</span></div>
    </div>
    <button @click="goAdd()">添加</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paramArr: [{key: '', value: '', select: false}]
    }
  },
  methods: {
    goAdd() {
      this.paramArr.push({key: '', value: '', select: false})
    },
    delectOne(ind) {
      this.paramArr.splice(ind, 1)
      this.$emit('giveHeaders', this.paramArr)
    },
    inpFun(i, e) {
      this.paramArr[i].select = true
      this.$emit('giveHeaders', this.paramArr)
    }
  }
}
</script>

<style lang="less" scoped>
.pap{
  width: 100%;
  .pap-nav{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 25px;
    border-bottom:1px solid #ddd;
  }
  .pap-con{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-bottom: 1px solid #ddd;
  }
  .pap-c1{
    width: 25px;
    border-right:1px solid #ddd;
    cursor: pointer;
  }
  .pap-c1-select{
    background: lightcoral;
  }
  .pap-c2{
    width: 150px;
    border-right:1px solid #ddd;
  }
  .pap-c3{
    flex: 1;
    border-right:1px solid #ddd;
    .pap-c3-del{
      cursor: pointer;
      margin-left:10px;
    }
  }
}
</style>
