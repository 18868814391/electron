const Store = require('electron-store')

// 实现一个本地存储类
class ObjDataStore extends Store {
  constructor(settings) {
    super(settings)
    this._tracks = this.getTracks() // 保存的列表
  }

  // 保存
  saveTracks(tracks) {
    this.set('tracks', tracks)
    return this
  }

  // 获取
  getTracks() {
    return this.get('tracks') || []
  }

  // 添加
  addTracks(tracks) {
    this._tracks = tracks
    return this.saveTracks()
  }
}

module.exports = ObjDataStore
