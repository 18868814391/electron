<template>
  <div class="home">
    <button class="blog-add" @click="goAdd">新增</button>
    <div class="search">
      <input class="ser-inp" v-model="keyword" type="text" placeholder="搜索关键字" @keyup.enter.prevent="searchEnterFun($event)">
      <button class="ser-btn" @click="goSearch()">搜索</button>
    </div>
    <div class="blogList">
      <div class="blog-item" v-for="(item,index) in blogList" :key="index" @click="goDetail(item)">
        {{item.title}}
      </div>
      <button :disabled="loading" v-if="!finish" @click="getNext()">下一页</button>
      <div v-if="loading">加载中.....</div>
      <div v-if="finish">没有更多了</div>
    </div>
  </div>
</template>

<script>
import { BlogList, yiiBlogSearch } from '@/api/index'
export default {
  name: 'Home',
  components: {

  },
  data() {
    return {
      keyword: '',
      loading: false,
      finish: false,
      blogList: [],
      params: {start_page: 0, pages: 25}
    }
  },
  created() {
    this.getBlog()
    this.listenBottom()
  },
  methods: {
    goDetail(d) {
      this.$router.push({path: '/blogDetail', query: {id: d.id}})
    },
    searchEnterFun(e) {
      const keyCode = window.event ? e.keyCode : e.which;
      if (keyCode === 13) {
        this.goSearch()
      }
    },
    goSearch() {
      yiiBlogSearch({
        keyword: this.keyword
      }).then((d) => {
        this.blogList = d.data
      })
    },
    getBlog() {
      this.loading = true
      BlogList(this.params).then((d) => {
        this.blogList = this.blogList.concat(d.data)
        if (this.blogList.length >= d.total_page) {
          this.finish = true
        }
      }).finally(() => {
        this.loading = false
      })
    },
    goAdd() {
      this.$router.push({path: '/blogAdd'})
    },
    getNext() {
      this.params.start_page++
      this.getBlog()
    },
    listenBottom() {
      const self = this;
      this.$nextTick(() => {
        // this.initScroll()
        window.onscroll = function() {
          const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
          const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
          if (scrollTop + windowHeight === scrollHeight) {
            // 写后台加载数据的函数
            if (!this.loading && !this.finish) {
              self.getNext()
            }
          }
        }
      })
    }
  }
}
</script>
<style lang="less">
.home{
  width: 100%;
  .blog-add{
    margin: 10px auto;
    font-size: 18px;
  }
  .search{
    width: 100%;
    display: flex;
    margin: 10px auto;
    align-items: center;
    justify-content: center;
    .ser-inp{
      width: 300px;
      height: 20px;
    }
    .ser-btn{
      margin-left:5px;
    }
  }
  .blogList{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .blog-item{
      width: 80%;
      border: 1px solid #000;
      border-radius:5px;
      padding: 10rpx;
      box-sizing: border-box;
      margin-bottom:10px;
      cursor: pointer;
    }
  }
}
</style>
