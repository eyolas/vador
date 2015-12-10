import {Request} from './request';
import {Http} from './http';
import isObject from 'lodash/lang/isObject';
import {parse} from 'uri-template';


export class RestResource {
  constructor(baseUrl, resourceName , config = {}) {
    this._baseUrl = baseUrl + '/';
    this.resourceName = resourceName;
    this._config = config;
    this._config.defaultHeaders = config.defaultHeaders || {};
    this._config.interceptors = config.interceptors || [];
    this._config.http = config.http || new Http();

    config = this._config[resourceName] || {};

    if (isObject(config.methods)) {
      let methods = config.methods;
      Object.keys(methods)
        .forEach(method => {
          let type = Array;
          let href = methods[method];

          if (isObject(methods[method])) {
            ({type, href} = methods[method]);
          }

          let url = parse(href);

          this[method] = ((url, type) => {
            return (obj = {}) => {

              let addUrl = url.expand(obj);

              return this.constructBaseRequest('get', type, addUrl);
            };
          })(url, type);
        });
    }
  }

  constructBaseRequest(method = 'get', responseType = Array, addUrl = '') {
    var request = new Request(this._baseUrl, this.resourceName, this, this._config);
    request.responseType = responseType;
    request.url = this._baseUrl + this.resourceName + addUrl;
    request.method = method;
    return request;
  }

  findAll() {
    return this.constructBaseRequest();
  }

  findOne(id) {
    return this.constructBaseRequest('get', Object, `/${id}`);
  }

  save(obj) {
    let p;
    if (obj.hasOwnProperty('id')) {
      p = this.merge(obj);
    } else {
      p = this.create(obj);
    }

    return p.sendRequest();
  }

  create(obj) {
    return this.constructBaseRequest('post', Object)
      .send(obj);
  }

  merge(obj) {
    return this.constructBaseRequest('put', Object, `/${obj.id}`)
      .send(obj);
  }

  _createSubInstance(url, resource, config) {
    return new RestResource(url, resource, config);
  }
}
