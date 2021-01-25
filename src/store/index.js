// 根组件
import Vue from 'vue';
import Vuex from 'vuex';

import auth from './module/auth';
import base from './module/base';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    base
  }
});
