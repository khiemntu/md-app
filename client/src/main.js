import Vue from 'vue';
import axios from 'axios';

import router from 'core/router';
import Filters from 'core/filters';
import store from 'core/store';
import App from 'core/App';
import UpdateData from 'core/mixins/updateData';
import Vuetify from 'vuetify';
import message from './message';

import 'assets/css/custom.css';
import 'assets/css/animate.min.css';
import './themes/default.styl';

Vue.use(Filters);
Vue.mixin(UpdateData);
Vue.use(Vuetify, {
  iconfont: 'md', // 'md' || 'mdi' || 'fa' || 'fa4'
  theme: {
    primary: '#1976D2',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  }
});
// Notifications
Vue.prototype.$message = message;

axios.defaults.headers.post['Content-Type'] = 'application/json';

new Vue({
  // eslint-disable-line no-new
  el: '#app',
  components: {
    App
  },
  router,
  store,
  render: h => h('app')
});
