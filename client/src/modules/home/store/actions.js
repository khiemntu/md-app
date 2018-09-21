import { GET_LIST } from './types';
import Service from 'core/service';
import toastr from 'core/toastr';

const service = new Service('home');

export const getList = ({ commit }, query) => {
  return service
    .rest('posts', query)
    .then(res => {
      // eslint-disable-next-line
      console.log(res);
      commit(GET_LIST, res);
    })
    .catch(err => {
      // console.log(err);
      toastr.console.error(err.message);
    });
};
