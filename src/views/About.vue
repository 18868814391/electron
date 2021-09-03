<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="selectPath()">选择监听目录</button>
    <p>当前选择的目录为:{{path}}</p>
    <div class="hisBox">
      <p v-for="(item,index) in history" :key="index">{{item}}</p>
    </div>
  </div>
</template>
<script>
const { ipcRenderer } = require('electron')
// const watch = require('watch')
const chokidar = require('chokidar');
export default {
  data() {
    return {
      path: '',
      history: ['文件夹日志:']
    }
  },
  created() {
    this.listen1()
  },
  methods: {
    selectPath() {
      // 请求主进程打开文件选择
      ipcRenderer.send('open-doc-file')
    },
    listen1() {
      const self = this
      // 主进程返回来的新的文件列表
      ipcRenderer.on('selected-path', (event, pathList) => {
        console.log('backList', pathList)
        if (Array.isArray(pathList)) {
          self.path = pathList[0]
          self.startWatch(self.path)
        }
      })
    },
    startWatch(path) {
      const watcher = chokidar.watch(path);
      watcher
        .on('add', function(path) {
          console.log('File', path, 'has been added');
        })
        .on('addDir', function(path) {
          console.log('Directory', path, 'has been added');
        })
        .on('change', function(path) {
          console.log('File', path, 'has been changed');
        })
        .on('unlink', function(path) {
          console.log('File', path, 'has been removed');
        })
        .on('unlinkDir', function(path) {
          console.log('Directory', path, 'has been removed');
        })
        .on('error', function(error) {
          console.log('Error happened', error);
        })
        .on('ready', self.onWatcherReady)
    },
    onWatcherReady() {
      console.log('watch ready')
    }
  }

}
</script>
<style lang="less" scoped>
.hisBox{
  width: 100%;
  height: 350px;
  padding: 0 20px;
  box-sizing: border-box;
  overflow: hidden;
  text-align: left;
}
</style>
