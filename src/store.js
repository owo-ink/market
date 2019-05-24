import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  // 分类列表
  type: null,
  activeType: null
}

const getters = {
}

const mutations = {
  changeActiveType(state, activeType) {
    state.activeType = activeType
  },
  changeType(state, type) {
    state.type = type
  }
}

const store = new Vuex.Store({
  state,
  getters,
  mutations
})
 
export default store