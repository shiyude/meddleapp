import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    logo: window.localStorage.getItem('logo') || "",
  },
  mutations: {
    changeLogo(state, url) {
      window.localStorage.setItem('logo', url)
      state.logo = url;
    }
  }
})
export default store
