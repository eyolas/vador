import {Request} from './request';
import {Http} from './http';


export class RestResource {
  constructor(baseUrl, resourceName , config = {}) {
    this._baseUrl = baseUrl + '/';
    this.resourceName = resourceName;
    this._config = config;

    this._config.defaultHeaders = config.defaultHeaders || {};
    this._config.interceptors = config.interceptors || [];
    this._config.http = config.http || new Http();
  }

  constructBaseRequest(method = 'get', responseType = Array, addUrl = '') {
    var request = new Request(this._baseUrl, this.resourceName, this, this._config);
    request.responseType = responseType;
    request.url = this._baseUrl + this.resourceName + addUrl;
    request.method = method;
    return request;
  }

  set config(config) {
    this._config = config;
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
