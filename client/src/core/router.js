'use strict';

import Vue from 'vue';
import Router from 'vue-router';
import Home from '../modules/home';
import Label from '../modules/label';
Vue.use(Router);

const router = new Router({
  mode: 'history',
  linkActiveClass: 'open active',
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/labeling',
      name: 'Label',
      alias: '/nowyouseeme',
      component: Label,
      meta: {
        title: 'Label'
      }
    }
  ]
});

export default router;
