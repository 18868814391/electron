<template>
  <div class="music">
    <button @click="addMusic()">添加</button>
  </div>
</template>
<script>
import electron from 'electron'
const { BrowserWindow} = electron.remote
export default {
  data() {
    return {
      win: null

    }
  },
  created() {

  },
  methods: {
    addMusic() {
      const modalPath = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8081/#/addMusic'
        : `file://${__dirname}/index.html#addMusic`
      this.win = new BrowserWindow({
        width: 500,
        height: 350,
        webPreferences: {
          nodeIntegration: true
        }
      })
      this.win.loadURL(modalPath)
      this.win.on('closed', () => {
        this.win = null
      })
    }
  }
}
</script>
<style lang="less" scoped>
.music{
  width: 100%;
}
</style>
