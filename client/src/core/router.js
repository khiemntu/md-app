'use strict';

import Vue from 'vue';
import Router from 'vue-router';
import Home from '../modules/home';
import Label from '../modules/label';
Vue.use(Router);

const router = new Router({
  mode: 'hash',
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
      path: '/label',
      name: 'Label',
      component: Label,
      meta: {
        title: 'Label'
      }
    }
  ]
});

export default router;
