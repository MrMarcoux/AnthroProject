import Vue from 'vue'
import Vuex from 'vuex'
import { Model } from '@/models/model'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    model: new Model(),
    initialized: false
  },
  mutations: {
    loadFile(state, file: any) {
      try {
        state.model = Model.fromProjectFile(file);       
        state.initialized = true;
      } catch(e) {
        alert(e); //TODO: Implement better error handling
      }
    }
  },
  actions: {
    loadFile(context, file: any) {
      context.commit('loadFile', file);
    }
  },
  modules: {
  }
})
