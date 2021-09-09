<template>
  <div class="historyFile">
    <button @click="clearAll()">清空</button>
    <div v-for="(item,index) in uploadHistoryList" :key="index">{{item.fileName}}</div>
  </div>
</template>

<script>
const { ipcRenderer } = require('electron')
export default {
  data() {
    return {
      uploadHistoryList: []
    }
  },
  created() {
    this.$store.state.showNav = false
    this.listen1()
    this.readHistory()
  },
  methods: {
    readHistory() {
      ipcRenderer.send('read-file')
    },
    listen1() {
      const self = this;
      ipcRenderer.on('giveUploadedList', (event, tracks) => {
        self.uploadHistoryList = tracks
      })
    },
    clearAll() {
      ipcRenderer.send('delete-all')
    }
  }
}
</script>

<style lang="less" scoped>
.historyFile{
  width: 100%;
}
</style>
