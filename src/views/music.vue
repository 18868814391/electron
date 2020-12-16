<template>
  <div class="music">
    <button @click="addMusic()">添加</button>
    <audio ref='audio' controls v-show="false">
        <source src="" />
        您的浏览器不支持 audio 元素。
    </audio>
    <div class="musicList">
      <div class="songs" v-for="(item,index) in musicList" :key="index" :class="musicIndex==index?'selected':''">
        <div class="songs-t" @click="goPlay(item,index)">{{item.fileName}}</div>
        <div class="songs-op">
          <button class="op-like">喜爱</button>
          <button class="op-dis">一般</button>
          <button class="op-del" @click="goDelate(item)">删除</button>
        </div>
      </div>
    </div>
    <div class="myAudio">
      <div class="option">
        <div class="option-pre" @click="goPre()">上一首</div>
        <div class="option-pause" @click="goPuse()">{{actionState=="play"?'暂停':'开始'}}</div>
        <div class="option-next" @click="goNext()">下一首</div>
        <div class="option-modal" @click="changeModal()">播放模式：{{modal==1?'顺序播放':modal==2?'随机播放':'单曲循环'}}</div>
      </div>
      <div class="myAudio-tit">{{currentTrack.fileName}}</div>
      <div class="barCon" ref="barCon">
        <div class="progress-bar" :style="{width:percent*100+'%'}"></div>
        <div class="barBall" draggable="true" @dragstart="dragstart2" @dragend="dragend2"  :style="{left:percent*100+'%'}"></div>
      </div>
      <div class="bar-right">
        {{daojishi}}
        <div class="volume">
          <!-- {{volumPer}} -->
          <div class="volume-block" draggable="true" @dragstart="dragstart" @dragend="dragend" :style="{left:`${volumPer*100}%`}"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import fs from 'fs'
import electron from 'electron'
const { ipcRenderer } = require('electron')
const { BrowserWindow} = electron.remote
export default {
  data() {
    return {
      audio: null,
      currentTrack: {}, // 当前歌曲数据
      actionState: 'paush', // 当前状态
      total: '', // 当前音乐总时长秒数
      current: '', // 当前播放的秒数
      percent: 0, // 当前播放的占总时长的小数
      daojishi: '00:00',
      musicIndex: 0, // 当前选择的index
      modal: 1, // 播放模式:1  顺序播放    2随机播放   3单曲循环
      openWin: null,
      musicList: [],
      volumStart: 0,
      volumEnd: 0,
      langStart: 0,
      langEnd: 0,
      domWidth: 1
    }
  },
  created() {
    this.redMusic()
    this.listen1()
    this.listen2()
  },
  mounted() {
    this.audio = this.$refs.audio
  },
  watch: {
    musicList: {
      deep: true,
      handler: function(newVal, oldVal) {
        if (newVal.length) {
          this.goPlay(newVal[0], 0)
        }
      }
    }
  },
  computed: {
    volumPer() {
      if (+((this.volumEnd - this.volumStart) / 100).toFixed(3) >= 1) {
        return 1
      } else if (+((this.volumEnd - this.volumStart) / 100).toFixed(3) <= 0) {
        return 0
      } else {
        return +((this.volumEnd - this.volumStart) / 100).toFixed(3)
      }
    },
    langPer() {
      if (+((this.langEnd - this.langStart) / this.domWidth).toFixed(3) >= 1) {
        return 1
      } else if (+((this.langEnd - this.langStart) / this.domWidth).toFixed(3) <= 0) {
        return 0
      } else {
        return +((this.langEnd - this.langStart) / this.domWidth).toFixed(3)
      }
    }
  },
  methods: {
    dragstart(e) {
      if (!this.volumStart) {
        this.volumStart = e.screenX
      }
    },
    dragend(e) {
      this.volumEnd = e.screenX
      this.audio.volume = this.volumPer
    },
    dragstart2(e) {
      if (!this.langStart) {
        this.langStart = e.screenX
      }
    },
    dragend2(e) {
      this.langEnd = e.screenX
      this.domWidth = this.$refs.barCon.clientWidth
      this.audio.currentTime = this.langPer * this.total
      this.percent = this.langPer
    },
    redBuffer(item) {
      const buf = fs.readFileSync(item.path);// 读取文件，并将缓存区进行转换
      const uint8Buffer = Uint8Array.from(buf);
      const bolb = new Blob([uint8Buffer]);// 转为一个新的Blob文件流
      return window.URL.createObjectURL(bolb); // 转换为url地址并直接给到audio
    },
    goPlay(item, index) { // 播放
      this.musicIndex = index
      this.audio = this.$refs.audio
      this.currentTrack = item
      this.audio.src = this.redBuffer(item)
      this.audio.play()
      this.actionState = 'play'
      this.allListen()
    },
    goPuse() {
      if (this.actionState === 'play') {
        this.audio.pause()
        this.actionState = 'pause'
      } else {
        this.audio.play()
        this.actionState = 'play'
      }
    },
    goPre() {
      if (this.musicIndex === 0) {
        this.goPlay(this.musicList[this.musicList.length - 1], this.musicList.length - 1)
      } else {
        this.goPlay(this.musicList[this.musicIndex - 1], this.musicIndex - 1)
      }
    },
    goNext() {
      if (this.musicIndex === this.musicList.length - 1) {
        this.goPlay(this.musicList[0], 0)
      } else {
        this.goPlay(this.musicList[this.musicIndex + 1], this.musicIndex + 1)
      }
    },
    allListen() {
      const self = this;
      this.audio.addEventListener('timeupdate', function () {
        self.total = this.duration // 总时长  秒
        self.current = this.currentTime // 当前进度时长  秒
        self.percent = (this.currentTime / this.duration).toFixed(3)
        const cha = self.total * 1 - self.current * 1
        self.daojishi = `${(+parseInt(cha / 60)) <= 9 ? '0' + parseInt(cha / 60) : parseInt(cha / 60)}:${(+parseInt(cha % 60)) <= 9 ? '0' + parseInt(cha % 60) : parseInt(cha % 60)}`
        if (cha <= 1) { // 播放结束
          self.goModal()
        }
      })
    },
    goModal() { // 根据模式  选择下一首
      if (this.modal === 1) { // 下一首
        this.goNext()
      } else if (this.modal === 2) { // 随机
        const ran = Math.round(Math.random() * (this.musicList.length - 1))
        this.goPlay(this.musicList[ran], ran)
      } else if (this.modal === 3) { // 单曲
        this.goPlay(this.musicList[this.musicIndex], this.musicIndex)
      }
    },
    changeModal() {
      if (this.modal === 1) {
        this.modal = 2
      } else if (this.modal === 2) {
        this.modal = 3
      } else if (this.modal === 3) {
        this.modal = 1
      }
    },
    redMusic() {
      // 请求主进程读取本地列表
      ipcRenderer.send('read-local-list')
    },
    addMusic() {
      const modalPath = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8081/#/addMusic'
        : `file://${__dirname}/index.html#addMusic`
      this.openWin = new BrowserWindow({
        width: 500,
        height: 350,
        webPreferences: {
          nodeIntegration: true
        }
      })
      this.openWin.loadURL(modalPath)
      // this.openWin.on('closed', () => {
      // 加了这个再打开窗口就.close()不掉
      // })
    },
    listen1() {
      // 监听获取音乐列表改变  获取到了最终导入列表
      const self = this
      ipcRenderer.on('getTracks', (event, tracks) => {
        self.musicList = tracks
        // 然后关闭窗口
        self.openWin.hide()
      })
    },
    listen2() {
      const self = this;
      ipcRenderer.on('giveMusicList', (event, tracks) => {
        self.musicList = tracks
        // self.goPlay(this.musicList[0], 0)
      })
    },
    goDelate(d) {
      console.log(d)
      ipcRenderer.send('deleteMusic', d)
    }
  }
}
</script>
<style lang="less" scoped>
.music{
  width: 100%;
  .musicList{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 10px 10px 300px 10px;
    box-sizing: border-box;
    .songs{
      width: 100%;
      height: 20px;
      border: 1px solid lavender;
      border-radius:10px;
      margin: 5px;
      display: flex;
      align-items: center;
      .songs-t{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
      }
      .songs-op{
        margin-left:auto;
        display: flex;
        align-items: center;
        .op-like{

        }
        .op-dis{

        }
        .op-del{

        }
      }
    }
    .selected{
      background: lightblue;
    }
  }
  .myAudio{
    width: 100%;
    height: 80px;
    background: lavender;
    position: fixed;
    bottom: 0;
    padding: 0 30px;
    box-sizing: border-box;
    .option{
      display: flex;
      align-items: center;
      justify-content: center;
      .option-pre{
        cursor: pointer;
      }
      .option-pause{
        cursor: pointer;
        margin: 0 30px;
      }
      .option-next{
        margin-right:20px ;
        cursor: pointer;
      }
    }
    .myAudio-tit{
      width: 100%;
      text-align: center;
    }
    .barCon{
      width: 100%;
      position: relative;
      .progress-bar{
        height: 10px;
        background: blue;
      }
      .barBall{
        width: 15px;
        height: 15px;
        background: lightcoral;
        border-radius:50%;
        top: -3px;
        position: absolute;
      }
    }

    .bar-right{
      text-align: left;
      display: flex;
      align-items: center;
      .volume{
        margin-left:20px;
        height: 10px;
        width: 100px;
        background: lightblue;
        position: relative;
        display: flex;
        align-items: center;
        .volume-block{
          width: 10px;
          height: 10px;
          background: lightcoral;
          border-radius:50%;
          position: relative;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
