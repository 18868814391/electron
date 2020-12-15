<template>
  <div class="blogDetail">
    <div class="blogDetail-tit">{{detail.title}}</div>
    <div class="blogDetail-int">由用户{{detail.adm}}在{{detail.updatatime}}上传</div>
    <div class="blogDetail-det" v-html="detail.content"></div>
  </div>
</template>
<script>
import { blogDetail } from '@/api/index'
export default {
  data() {
    return {
      id: '',
      detail: {}
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getDetail()
  },
  methods: {
    getDetail() {
      blogDetail({
        id: this.id
      }).then((d) => {
        console.log('detail', d.data)
        this.detail = d.data
      })
    }
  }
}
</script>
<style lang="less">
.blogDetail{
  width: 100%;
  .blogDetail-tit{
    font-size: 20px;
    font-weight: bold;
    margin: 10px;
    width: 80%;
    text-align: center;
  }
  .blogDetail-int{
    font-size: 10px;
    width: 100%;
    text-align: center;
    color: #999;
  }
  .blogDetail-det{
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
    img{
      max-width: 80%;
    }
  }
}
</style>
