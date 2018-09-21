import {
  FOLDERS,
  FILE_IN_FOLDER,
  ADD_FOLDER,
  DELETE_FOLDER,
  DELETE_FILES,
  MOVE_FILES
} from './types';
import Service from 'core/service';
import toastr from 'core/toastr';

const service = new Service('label');

export const getFolderList = ({ commit }, query) => {
  return service
    .rest('folders', query)
    .then(data => {
      commit(FOLDERS, data);
    })
    .catch(err => {
      toastr.console.error(err.message);
    });
};

export const getFilesInFolder = ({ commit }, query) => {
  return service
    .rest('files', query)
    .then(data => {
      commit(FILE_IN_FOLDER, data);
    })
    .catch(err => {
      toastr.console.error(err.message);
    });
};

export const addFolder = ({ commit }, query) => {
  return new Promise((resolve, reject) => {
    service
      .rest('addFolder', query)
      .then(data => {
        commit(ADD_FOLDER, data);
        resolve(data);
      })
      .catch(err => {
        // eslint-disable-next-line
        console.log(err);
        reject(err);
      });
  });
};

export const removeFolder = ({ commit }, query) => {
  return new Promise((resolve, reject) => {
    service
      .rest('removeFolder', query)
      .then(() => {
        commit(DELETE_FOLDER, query);
        resolve(query);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const removeFiles = ({ commit }, query) => {
  return new Promise((resolve, reject) => {
    service
      .rest('removeFiles', query)
      .then(() => {
        commit(DELETE_FILES, query);
        resolve(query);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const moveFiles = ({ commit }, query) => {
  return new Promise((resolve, reject) => {
    service
      .rest('moveFiles', query)
      .then(() => {
        commit(MOVE_FILES, query);
        resolve(query);
      })
      .catch(err => {
        reject(err);
      });
  });
};
