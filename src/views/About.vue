<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="selectPath()">选择监听目录</button>
    <div>
      监听状态：{{listening}}
    </div>
    <p>当前选择的目录为:{{dicPath}}</p>
    <div class="hisBox">
      <div v-for="(item,index) in history" :key="index">
        {{item}}
        <button v-if="index!==0" @click="goUpload(item)">手动上传</button>
      </div>

    </div>
  </div>
</template>
<script>
import axios from 'axios';
const { ipcRenderer } = require('electron')
// const watch = require('watch')
const chokidar = require('chokidar');
const fs = require('fs');
// const mime = require('mime');
// const request = require('request');
const pathModal = require('path');
export default {
  data() {
    return {
      dicPath: '',
      listening: false,
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
          self.dicPath = pathList[0]
          self.startWatch(self.dicPath)
        }
      })
    },
    startWatch(dicPath) {
      const self = this;
      const watcher = chokidar.watch(dicPath);
      watcher
        .on('add', function(path) {
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
    onWatcherReady() {
      console.log('watch ready')
      this.listening = true
    },
    getFile(file) {
      console.log('监听到该文件add：', file)
      if (this.history.indexOf(file) === -1) {
        this.history.push(file)
      }
    },
    goUpload(path) {
      // const self = this
      console.log(path)
      const fileName = pathModal.basename(path);
      console.log('fileName', fileName)
      fs.readFile(path, function(err, data) {
        if (err) {
          console.log('读取错误', err)
        } else {
          console.log('bufferData', data)
        }
        var fff = new File([data], fileName, {type: 'text/plain'})
        // fff.path = path
        // console.log('ffff', fff)
        // console.log('binary', fff)
        const param = new FormData(); // 创建form对象
        param.append('file', fff); // 通过append向form对象添加数据
        param.append('isOriginalFilename', false); // 添加form表单中其他数据
        param.append('applicationMark', 'health'); // 添加form表单中其他数据
        axios.post('https://api.qdsgvision.com/upload/upload/single',
          param,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        // const reader = new FileReader();
        // reader.readAsBinaryString(fff);
        // reader.onloadend = (e) => {
        //   console.log('binary', e)
        //   const param = new FormData(); // 创建form对象
        //   param.append('file', e); // 通过append向form对象添加数据
        //   param.append('isOriginalFilename', false); // 添加form表单中其他数据
        //   param.append('applicationMark', 'health'); // 添加form表单中其他数据
        //   axios.post('https://apitest.qdsgvision.com/upload/upload/single',
        //     param,
        //     {
        //       headers: {
        //         'Content-Type': 'multipart/form-data'
        //       }
        //     }
        //   )
        //   // axios({
        //   //   url: 'https://apitest.qdsgvision.com/upload/upload/single',
        //   //   method: 'post',
        //   //   headers: {
        //   //     'Content-Type': 'multipart/form-data'
        //   //   },
        //   //   data: {
        //   //     file: e,
        //   //     isOriginalFilename: false,
        //   //     applicationMark: 'health'
        //   //   }
        //   // })
        // }
      })
      // const buffer = fs.createReadStream(path)
      // console.log('流', buffer)
      // const fff = new File([buffer._readableState.buffer.tail.data], fileName, {type: 'text/plain'})
      // console.log('ffff', fff)
      // axios({
      //   url: 'https://apitest.qdsgvision.com/upload/upload/single',
      //   method: 'post',
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   },
      //   data: {
      //     file: buffer,
      //     isOriginalFilename: true
      //   }
      // })

      // request.post({
      //   url: 'https://apitest.qdsgvision.com/upload/upload/single',
      //   formData: {
      //     file: buffer,
      //     isOriginalFilename: true
      //   }
      // },
      // function optionalCallback(err, httpResponse, body) {
      //   if (err) {
      //     return console.error('upload failed:', err);
      //   }
      // }
      // )
      // fs.stat(path, (err, stats) => {
      //   if (err) throw err;
      //   console.log(stats)
      // })
    }
    // bytesToBinary(bytes) {
    //   const length = bytes.length;
    //   let result = '';
    //   for (let i = 0; i < length; i++) {
    //     const binStr = Number(bytes[i]).toString(16)
    //     result += '0'.repeat(2 - binStr.length) + binStr; // 不足二位前置补0
    //   }
    //   return result.toString();
    // },
    // 读取文件信息
    // getFileStats(path, callback) {
    //   fs.stat(path, (err, status) => {
    //     if (err) {
    //       callback(err);
    //     } else {
    //       const index = path.lastIndexOf('\\');
    //       const len = path.length;
    //       const filename = index !== -1 ? path.substring(index + 1, len) : path;
    //       const mimetype = mime.lookup(path)
    //       callback(null, {size: status.size, name: filename, path: path, type: mimetype});
    //     }
    //   })
    // }
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
