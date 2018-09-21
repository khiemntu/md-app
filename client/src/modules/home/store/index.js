import { GET_LIST } from './types';
import * as getters from './getters';
import * as actions from './actions';

const state = {
  posts: []
};

const mutations = {
  [GET_LIST](state, data) {
    state.posts.splice(0);
    state.posts = [...data];
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
