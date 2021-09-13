<template>
  <div class="about">
    <div class="about-b1">
      <button class="about-b1-btn" @click="selectPath()">选择监听目录</button>
      <div :style="{color:(listening?'#3eb370':'#ec6d51')}">监听状态：{{listening?'监听中':'未监听'}}</div>
      <button class="about-b1-btn2" @click="startWatch()" v-if="!listening">开始监听</button>
      <button class="about-b1-btn2" @click="stopWatch()" v-else>取消监听</button>
      <div style="margin-left:30px;flex:1" >
        <button class="keyword" @click="openHistory()" >查看已上传文件</button>
        <button class="keyword" @click="setKey()">关键字设置</button>
      </div>
    </div>
    <div class="about-b2">
      当前的监听目录为:
      <span class="pathName" @click="openPath(dicPath)" v-if="dicPath">{{dicPath}}</span>
      <div class="latestTime">最近一次上传时间：{{latestTime?latestTime:'暂无'}}</div>
    </div>
    <div class="fileBox">
      <div class="fb1">
        <div class="title">【{{yima}}】监听开始时已有文件</div>
        <div class="fileItem" v-for="(item,index) in originFile" :key="index">
          <span>{{item.name}}</span>
          <button class="fileUp" @click="goUpload(item.path,item)" v-if="item.status==0">手动上传</button>
          <button class="fileUp" disabled v-if="item.status==1">上传中...</button>
          <button class="fileUp" disabled v-if="item.status==2" style="background:#3eb370">上传完成</button>
          <button class="fileUp" @click="goUpload(item.path,item)" style="background:#ec6d51" v-if="item.status==3">上传失败，点击重传</button>
          <button class="fileUp" @click="goUpload(item.path,item)" style="background:orange" v-if="item.status==4">关键字拦截，点击重传</button>
        </div>
      </div>
      <div class="fb1">
        <div class="title">后续监听文件记录</div>
        <div class="fileItem" v-for="(item,index) in history" :key="index">
          <span>{{item.name}}</span>
          <button class="fileUp" @click="goUpload(item.path,item)" v-if="item.status==0">手动上传</button>
          <button class="fileUp" disabled v-if="item.status==1">上传中...</button>
          <button class="fileUp" disabled v-if="item.status==2" style="background:#3eb370">上传完成</button>
          <button class="fileUp" @click="goUpload(item.path,item)" style="background:#ec6d51" v-if="item.status==3">上传失败，点击重传</button>
          <button class="fileUp" @click="goUpload(item.path,item)" style="background:orange" v-if="item.status==4">关键字拦截，点击重传</button>
        </div>
      </div>
    </div>
    <Keyword v-if="showKeyword" @setKey="setKey" @getKeys="getKeys"></Keyword>
  </div>
</template>
<script>
import axios from 'axios';
import electron from 'electron'
import Keyword from './components/about/keyword'
const { ipcRenderer } = require('electron')
const {shell} = require('electron').remote
const chokidar = require('chokidar');
const fs = require('fs');
const pathModal = require('path');
const { BrowserWindow} = electron.remote
const ObjStore = require('../../objDataStore.js')
const keyWordObj = new ObjStore({ name: 'keyWordObj' })
export default {
  components: {
    Keyword
  },
  data() {
    return {
      dicPath: '',
      listening: false,
      originFile: [],
      history: [],
      yima: '',
      step: 0,
      watcher: null,
      latestTime: '',
      uploadHistoryList: [],
      showKeyword: false,
      keyObj: {}
    }
  },
  created() {
    this.listen1()
    this.listen3()
    this.uploadedFile()
    this.getKeys()
  },
  methods: {
    setKey() {
      this.showKeyword = !this.showKeyword
    },
    getKeys() {
      this.keyObj = keyWordObj.getTracks()
    },
    openPath(path) {
      shell.showItemInFolder(path);
    },
    selectPath() {
      // 请求主进程打开文件选择
      ipcRenderer.send('open-doc-file')
    },
    listen1() {
      const self = this
      // 主进程返回来的新的文件列表
      ipcRenderer.on('selected-path', (event, pathList) => {
        if (Array.isArray(pathList)) {
          self.dicPath = pathList[0]
        }
      })
    },
    readAll(path) {
      const self = this;
      return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
          if (err) {
            reject(err)
          } else {
            self.originFile = self.dealFile(files)
            resolve()
          }
        })
      })
    },
    dealFile(files) {
      const arr = []
      files.forEach((v) => {
        const obj = {name: '', path: '', status: 0}
        obj.name = v
        obj.path = this.dicPath + '\\' + v
        if (this.uploadHistoryList.some((vv) => vv.fileName === v)) {
          obj.status = 2
        }
        arr.push(obj)
      })

      return arr
    },
    getNowTime(type) {
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      const hh = new Date().getHours()
      const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes()
        : new Date().getMinutes()
      const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds()
        : new Date().getSeconds()
      const dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
      if (type === 1) {
        this.latestTime = dateTime
      } else {
        this.yima = dateTime
      }
    },
    async startWatch() {
      const self = this;
      const dicPath = self.dicPath
      if (!dicPath) {
        alert('请选择需要监听的目录')
        return false
      }
      self.getNowTime()
      await self.readAll(self.dicPath)
      self.watcher = chokidar.watch(dicPath);
      self.watcher
        .on('add', function(path) {
          console.log('file', path, 'has been added')
          self.getFile(path)
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
    stopWatch() {
      this.watcher.close()
      this.listening = false
      this.originFile = []
      this.history = []
      this.yima = ''
      console.log('watchEnd')
    },
    onWatcherReady() {
      this.listening = true
    },
    getFile(file) {
      const self = this
      const fileName = pathModal.basename(file);
      const flag = this.originFile.some((v) => {
        return v.name === fileName
      })
      const flag2 = this.history.some((v) => {
        return v.name === fileName
      })
      if (!flag && !flag2) {
        const obj = {name: '', path: '', status: 0}
        obj.name = fileName
        obj.path = file
        this.history.unshift(obj)
        this.goUpload(file, self.history[0])
      }
    },
    goUpload(path, item) {
      const self = this
      const fileName = pathModal.basename(path);
      if (this.keyObj.pass && this.keyObj.pass[0]) {
        const flag = this.keyObj.pass.some((item) => {
          return fileName.indexOf(item) !== -1
        })
        if (!flag) {
          item.status = 4
          return false
        }
      }
      if (this.keyObj.refuse && this.keyObj.refuse[0]) {
        const flag = this.keyObj.refuse.some((item) => {
          return fileName.indexOf(item) !== -1
        })
        if (flag) {
          item.status = 4
          return false
        }
      }
      fs.readFile(path, function(err, data) {
        if (err) {
          alert(`读取错误${err}`)
          console.log('读取错误', err)
        } else {
          console.log('bufferData', data)
        }
        var fff = new File([data], fileName, {type: 'text/plain'})
        const param = new FormData(); // 创建form对象
        param.append('file', fff); // 通过append向form对象添加数据
        param.append('isOriginalFilename', false); // 添加form表单中其他数据
        param.append('applicationMark', 'health'); // 添加form表单中其他数据
        item.status = 1
        axios.post('https://apitest.qdsgvision.com/upload/upload/single',
          param,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        ).then(() => {
          item.status = 2
          self.getNowTime(1)
          self.recordIt(path)
        }).catch(() => {
          item.status = 3
        })
      })
    },
    recordIt(path) {
      ipcRenderer.send('add-file', [path])
    },
    uploadedFile() {
      ipcRenderer.send('read-file')
    },
    listen3() {
      const self = this;
      ipcRenderer.on('giveUploadedList', (event, tracks) => {
        self.uploadHistoryList = tracks
      })
    },
    listen4() {
      const self = this
      ipcRenderer.on('updataFile', (event, tracks) => {
        self.uploadHistoryList = tracks
      })
    },
    openHistory() {
      const modalPath = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8080/#/historyFile'
        : `file://${__dirname}/index.html#historyFile`
      this.openWin = new BrowserWindow({
        width: 500,
        height: 350,
        webPreferences: {
          nodeIntegration: true
        }
      })
      this.openWin.loadURL(modalPath)
    }
  }

}
</script>
<style lang="less" scoped>
.about{
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .about-b1{
    width: 100%;
    margin: 10px 0;
    display: flex;
    align-items: center;
    .about-b1-btn{
      width: 100px;
      margin-right:10px ;
    }
    .about-b1-btn2{
      margin-left:10px;
    }
  }
  .about-b2{
    width: 100%;
    text-align: left;
    margin-bottom:5px;
    display: flex;
    align-items: center;
    .latestTime{
      margin-left:auto;
    }
  }
  .fileBox{
    width: 100%;
    flex: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .fb1{
      width: 49%;
      padding: 5px;
      box-sizing: border-box;
      height: 100%;
      border: 1px solid #666;
      border-radius:10px;
      overflow: auto;
      .fileItem{
        width: 100%;
        text-align: left;
        margin-top: 2px;
        border-bottom:1px solid #bbb ;
        .fileUp{
          margin-left: 5px;
        }
      }
    }
  }
  .pathName{
    color: blue;
    text-decoration-line: underline;
    cursor: pointer;
  }
  .keyword{
    margin-right:10px ;
  }
}
.hisBox{
  width: 100%;
  height: 350px;
  padding: 0 20px;
  box-sizing: border-box;
  overflow: hidden;
  text-align: left;
}
</style>
