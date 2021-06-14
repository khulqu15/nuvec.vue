import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/store/Api.js'
import Auth from '@/store/Auth.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    Api,
    Auth,
  }
})
