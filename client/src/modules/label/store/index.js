import {
  FOLDERS,
  FILE_IN_FOLDER,
  ADD_FOLDER,
  DELETE_FOLDER,
  DELETE_FILES,
  MOVE_FILES
} from './types';
import * as getters from './getters';
import * as actions from './actions';
import _ from 'lodash';

const state = {
  folders: [],
  files: []
};

const mutations = {
  [FOLDERS](state, data) {
    state.folders.splice(0);
    state.folders = [...data];
  },
  [FILE_IN_FOLDER](state, data) {
    state.files.splice(0);
    state.files = [...data];
  },
  [ADD_FOLDER]() {},
  [DELETE_FOLDER]() {},
  [DELETE_FILES](state, query) {
    const { folder, files } = query;
    const idx = _.findIndex(state.folders, item => item.name == folder);
    if (idx > -1) {
      state.folders[idx].totalFile -= files.length;
    }
  },
  [MOVE_FILES](state, query) {
    const { from, to, files } = query;
    const idx = _.findIndex(state.folders, item => item.name == from);
    if (idx > -1) {
      state.folders[idx].totalFile -= files.length;
    }
    const jdx = _.findIndex(state.folders, item => item.name == to);
    if (jdx > -1) {
      state.folders[jdx].totalFile += files.length;
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
