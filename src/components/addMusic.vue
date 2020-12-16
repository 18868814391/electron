<template>
  <div class="addMusic">
    <button @click="addMusic()">添加音乐</button>
    {{musicPathList}}
    <div class="musicList">
      <div class="item" v-for="(item,index) in musicPathList" :key="index">{{item.fileName}}</div>
    </div>
    <button @click="pushMusic()">导入音乐</button>
  </div>
</template>
<script>
const { ipcRenderer } = require('electron')
export default {
  data() {
    return {
      musicPathList: []
    }
  },
  created() {
    this.$store.state.showNav = false
    // this.redMusic()
    this.listen1()
    this.listen2()
  },
  methods: {
    redMusic() {
      // 请求主进程读取本地列表
      ipcRenderer.send('read-local-list')
    },
    addMusic() {
      // 请求主进程打开文件选择
      ipcRenderer.send('open-music-file')
    },
    listen1() {
      const self = this
      // 主进程返回来的新的文件列表
      ipcRenderer.on('selected-file', (event, pathList) => {
        console.log('backList', pathList)
        if (Array.isArray(pathList)) {
          self.musicPathList = pathList
        }
      })
    },
    pushMusic() {
      // 请求主进程存储文件
      const self = this;
      ipcRenderer.send('add-tracks', self.musicPathList)
    },
    listen2() {
      const self = this;
      ipcRenderer.on('giveMusicList', (event, tracks) => {
        console.log('addPage', tracks)
        self.musicPathList = tracks
      })
    }
  }
}
</script>
<style lang="less" scoped>
.addMusic{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .musicList{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .tit{
      width: 100%;
      text-align: left;
      margin-top:10px;
      font-weight: bold;
      margin-bottom:5px ;
      text-indent: 10px;
    }
    .item{
      width: 100%;
      text-align: left;
      text-indent: 20px;
    }
  }
}
</style>
