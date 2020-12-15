<template>
  <div class="addMusic">
    <button @click="addMusic()">添加音乐</button>
    {{musicPathList}}
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
    this.listen1()
  },
  methods: {
    addMusic() {
      ipcRenderer.send('open-music-file')
    },
    pushMusic() {
      const self = this;
      ipcRenderer.send('add-tracks', self.musicPathList)
    },
    listen1() {
      const self = this
      // 主进程发来的选择文件信息
      ipcRenderer.on('selected-file', (event, pathList) => {
        if (Array.isArray(pathList)) {
          self.musicPathList = pathList
        }
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
}
</style>
