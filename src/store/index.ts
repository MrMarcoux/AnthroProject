import Vue from 'vue'
import Vuex from 'vuex'
import { Model } from '@/models/model'

Vue.use(Vuex);

function download(filename: string, text: string) {
    const pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        const event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

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
    },
    saveFile(context) {

      try {
        const name = this.state.model.name ? this.state.model.name : 'My project.apf';

        download(name, this.state.model.asProjectFile());
      } catch (Error) {
        alert(Error);
      }
      
    }
  },
  modules: {
  }
})
