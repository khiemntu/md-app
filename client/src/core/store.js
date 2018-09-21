import Vue from 'vue';
import Vuex from 'vuex';

import home from '../modules/home/store';
import label from '../modules/label/store';
import global from '../modules/global/store';
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    home,
    label,
    global
  },
  strict: process.env.NODE_ENV !== 'production'
});
