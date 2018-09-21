import axios from 'axios';

export default class Service {
  /**
   * Creates an instance of Service.
   *
   * @param {any} namespace  namespace of service (without trailing '/')
   *
   * @memberOf Service
   */
  constructor(namespace) {
    const baseURL = process.env.VUE_APP_SERVICE_ENDPOINT || '';
    this.namespace = namespace;
    this.axios = axios.create({
      baseURL: `${baseURL}/${namespace}/`,
      responseType: 'json'
    });
  }

  /**
   * Call a service action via REST API
   *
   * @param {any} action  name of action
   * @param {any} params  parameters to request
   * @returns  {Promise}
   *
   * @memberOf Service
   */
  rest(action, params, options = { method: 'post', headers: {} }) {
    // console.log({
    //   method: options.method,
    //   data: params,
    //   headers: options.headers
    // });
    return new Promise((resolve, reject) => {
      this.axios
        .request(action, {
          method: options.method,
          data: params,
          headers: options.headers
        })
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch(error => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            // console.error(
            //   '[service][rest] > REST request error: ',
            //   error.response.data.errors
            // );
            reject(error.response.data.errors);
          } else {
            reject(error);
          }
        });
    });
  }

  get(action, params) {
    return this.rest(action, params, { method: 'get' });
  }
}
