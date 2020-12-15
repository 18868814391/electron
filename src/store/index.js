import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showNav: true,
    navType: 1
  },
  mutations: {
    SET_NAVTYPE: (state, data) => {
      state.navType = data
    },
    SET_SHOWNAV: (state, data) => {
      state.showNav = data
    }
  },
  actions: {
  },
  modules: {
  }
})
