<template>
  <div class="blogAdd">
    <input class="blogAdd-inp" type="text" placeholder="标题" v-model="novelName">
    <div  class="blogAdd-edit">
     <quill-editor v-model="content"></quill-editor>
    </div>
    <button v-if="!loading" class="blogAdd-sub" @click="goSub()">提交</button>
  </div>
</template>
<script>
import { yiiBlogAdd } from '@/api/index'
export default {
  data() {
    return {
      loading: false,
      novelName: '',
      content: ''
    }
  },
  created() {

  },
  methods: {
    goSub() {
      const self = this;
      this.content = this.content.replace(new RegExp('\\+', 'g'), '%2B');
      this.loading = true
      yiiBlogAdd({
        adm: 'syf',
        title: self.novelName,
        content: self.content,
        updataTime: self.getTime(),
        state: ''
      }).then((d) => {
        alert('提交成功了')
        window.history.go(-1)
      }).finally((d) => {
        this.loading = false
      })
    },
    getTime() {
      const time = new Date();
      return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
    }
  }
}
</script>
<style lang="less">
.blogAdd{
  width: 100%;
  .blogAdd-inp{
    width: 300px;
    height: 35px;
    margin: 10px auto;
  }
  .blogAdd-edit{
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
  .blogAdd-sub{
    margin: 10px auto;
  }
}
</style>
