import {Http} from './http';
import {RestResource} from './restResource';
import assign from 'lodash.assign';

export class RestClient {

  constructor(baseUrl, config = {}) {
    this._baseUrl = baseUrl;
    this._interceptors = config.interceptors || [];
    this._headers = config.headers || {};
    this._http = config.http || null;
    this._cache = {};
  }

  set baseUrl(baseUrl) {
    this._baseUrl = baseUrl;
  }

  addHeader(field, val) {
    this._headers[field] = val;
  }

  set http(http) {
    this._http = http;
  }

  addInterceptor(interceptor, onEnd = true) {
    if (onEnd) {
      this._interceptors.push(interceptor);
    } else {
       this._interceptors.unshift(interceptor);
    }
  }

  resource(resourceName, config = {}) {
    if (!this._cache[resourceName]) {
      let conf = assign({}, this._config, config);
      conf.defaultHeaders = assign({}, this._headers, config.defaultHeaders || {});
      conf.interceptors = (config.interceptors || []).concat(this._interceptors);
      if (!conf.http) {
        conf.http = this._http;
      }

      this._cache[resourceName] = new RestResource(this._baseUrl, resourceName , conf);
    }

    return this._cache[resourceName];
  }
}
