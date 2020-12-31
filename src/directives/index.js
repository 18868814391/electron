import emoji from './emoji'
import blank from './blank'
// 自定义指令
const directives = {
  emoji,
  blank
}

export default {
  install(Vue) {
    Object.keys(directives).forEach(key => {
      Vue.directive(key, directives[key])
    })
  }
}
