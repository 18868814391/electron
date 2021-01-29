<template>
  <div class="pap">
    <div class="pap-nav">
      <div class="pap-c1">ind</div>
      <div class="pap-c2">KEY</div>
      <div class="pap-c3">VALUE</div>
    </div>
    <div class="pap-con" v-for="(item,index) in paramArr" :key="index">
      <div class="pap-c1" :class="item.select?'pap-c1-select':''" @click="selectOne(index)">{{index+1}}</div>
      <div class="pap-c2">
        <input v-blank v-model="item.key" type="text" @input="inpFun(index,$event)">
        <button class="pap-c2btn" @click="changeFile(index)">{{item.type}}</button>
      </div>
      <div class="pap-c3">
        <input v-blank v-model="item.value" type="text" @input="inpFun(index,$event)" v-if="item.type==='text'">
        <input type="file"  @change="upload(index,$event)" v-if="item.type==='file'">
        <span class="pap-c3-del" @click="delectOne(index)">&times;</span>
      </div>
    </div>
    <button @click="goAdd()">添加</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paramArr: [{key: '', value: '', select: false, type: 'text'}]
    }
  },
  methods: {
    upload(i, f) {
      console.log(i, f)
      console.log(f.target.files[0])
      this.paramArr[i].value = f.target.files[0]
      this.$emit('giveParams', this.paramArr)
      console.log(this.paramArr)
    },
    changeFile(index) {
      this.paramArr[index].key = 'file'
      this.paramArr[index].type = this.paramArr[index].type === 'text' ? 'file' : 'text'
      this.$emit('giveParams', this.paramArr)
    },
    cancelAll() {
      this.paramArr.forEach((v) => {
        v.select = false
      })
      this.$emit('giveParams', this.paramArr)
    },
    selectAll() {
      this.paramArr.forEach((v) => {
        v.select = true
      })
      this.$emit('giveParams', this.paramArr)
    },
    goAdd() {
      this.paramArr.push({key: '', value: '', select: false, type: 'text'})
    },
    selectOne(ind) {
      this.paramArr[ind].select = !this.paramArr[ind].select
      this.$emit('giveParams', this.paramArr)
    },
    delectOne(ind) {
      this.paramArr.splice(ind, 1)
      this.$emit('giveParams', this.paramArr)
    },
    inpFun(i, e) {
      this.paramArr.forEach((v) => {
        v.key = v.key.replace(/\s+/g, '');
        v.value = v.value.replace(/\s+/g, '');
      })
      this.paramArr[i].select = true
      this.$emit('giveParams', this.paramArr)
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
    .pap-c2btn{
      width: 30px;
      height: 20px;
      font-size: 11px;
    }
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
