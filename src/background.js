'use strict'

import { app, protocol, BrowserWindow, globalShortcut, Menu, ipcMain, dialog, Notification } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const DataStore = require('../MusicDataStore')
const MusicData = new DataStore({ name: 'Music Data' })
const upLoadFiles = new DataStore({ name: 'opLoad Files' })

let minWin = null // 主应用窗口

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow () {
  // Create the browser window.
  minWin = new BrowserWindow({
    width: 1200,
    height: 620,
    webPreferences: {
      webSecurity: false, // 跨域
      // nodeIntegration: true
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
    // icon: '../public/syf.ico'
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await minWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) minWin.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    minWin.loadURL('app://./index.html')
  }

  createMenu()
}

// 设置菜单栏
function createMenu() {
  // darwin表示macOS，针对macOS的设置
  if (process.platform === 'darwin') {
    const template = [
      {
        label: 'App Demo',
        submenu: [
          {
            role: 'about'
          },
          {
            role: 'quit'
          }]
      }]
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  } else {
    // windows及linux系统
    Menu.setApplicationMenu(null)
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    showNotification()
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  // 在开发环境和生产环境均可通过快捷键打开devTools
  globalShortcut.register('CommandOrControl+Shift+i', function () {
    // const win = new BrowserWindow()
    minWin.webContents.openDevTools()
  })
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

function showNotification () {
  const notification = {
    title: 'syf提示',
    body: '欢迎使用syf桌面端'
  }
  new Notification(notification).show()
}

// 添加窗口发来的信息：打开文件夹去选择音乐
ipcMain.on('open-music-file', (event) => {
  console.log('open-music-file')
  dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Music', extensions: ['mp3', 'flac'] }]
  }).then((res) => {
    // 拿到结果
    const { canceled, filePaths } = res
    if (!canceled && filePaths.length) {
      event.sender.send('selected-file', filePaths)
    }
  })
})

// 添加窗口发来的信息： 导入音乐
ipcMain.on('add-tracks', (event, tracks) => {
  // 数据持久化
  const updateTracks = MusicData.addTracks(tracks).getTracks() // 先保存再拿最新的出来
  minWin.send('getTracks', updateTracks) // 通知渲染
  // closeAddWindow() // 关闭add页面
})

// 读取本地音乐列表
ipcMain.on('read-local-list', (event) => {
  console.log(MusicData.getTracks())
  const musicList = MusicData.getTracks()
  event.sender.send('giveMusicList', musicList)
})

// 删除本地音乐列表
ipcMain.on('deleteMusic', (event, item) => {
  MusicData.removeTrack(item.id)
  const musicList = MusicData.getTracks()
  event.sender.send('giveMusicList', musicList)
})

// 选择文件路径
ipcMain.on('open-doc-file', (event) => {
  console.log('open-doc-file')
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }).then((res) => {
    // 拿到结果
    console.log(res)
    const { canceled, filePaths } = res
    if (!canceled && filePaths.length) {
      event.sender.send('selected-path', filePaths)
    }
  })
})

// 添加窗口发来的信息： 导入文件
ipcMain.on('add-file', (event, tracks) => {
  // 数据持久化
  const updateTracks = upLoadFiles.addTracks(tracks).getTracks() // 先保存再拿最新的出来
  minWin.send('updataFile', updateTracks) // 通知渲染
  // closeAddWindow() // 关闭add页面
})

// 读取文件列表
ipcMain.on('read-file', (event) => {
  const fileList = upLoadFiles.getTracks()
  event.sender.send('giveUploadedList', fileList)
})

// 删除文件列表
ipcMain.on('delete-all', (event, item) => {
  upLoadFiles.removeAll()
  const fileList = upLoadFiles.getTracks()
  event.sender.send('giveUploadedList', fileList)
})
