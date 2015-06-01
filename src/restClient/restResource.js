import {Request} from './request';
import {Response} from './response';
import {Http} from './http';
import {isNotEmpty} from './utils';
import {ResponseInterceptor, RequestInterceptor} from '../core/baseInterceptors/'
import Promise from 'bluebird';

export class RestResource {
  constructor(baseUrl, resourceName , config = {}) {
    this._baseUrl = baseUrl + '/';
    this._defaultHeaders = config.defaultHeaders || [];
    this._interceptors = config.interceptors || [];
    this._http = config.http || new Http();
    this._resourceName = resourceName;
    this._request = new Request(resourceName, this);
    this._allConfig = config;
    this._config = config[resourceName] || {};
    this._restKeys = ['findAll', 'search', 'findOne', 'save', 'toJSON'];
  }

  /****** Request wrapper *****************/
  constructBaseRequest(method = 'get', responseType = Array, addUrl = '') {
    this._request.reset();
    this._request.responseType = responseType;
    this._request.url = this._baseUrl + this._resourceName + addUrl;
    this._request.method = method;
    this._request.headers = this._defaultHeaders;
    return this;
  }

  set config(config) {
    this._allConfig = config;
  }

  query(val) {
    this._request.query(val);
    return this;
  }

  set(field, val) {
    this._request.set(field, val);
    return this;
  }

  send(data) {
    this._request.send(data);
    return this;
  }

  /*********** end wrapper ************/

  findAll() {
    return this.constructBaseRequest();
  }

  search(query = {}) {
    return this.findAll().query(query);
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

  _createSubInstance(url, resource) {
    return new RestResource(url, resource, this._allConfig);
  }

  _proxifyOne(object) {
    let toJSON = (objToConvert) => {
      if (!objToConvert) {
        return objToConvert;
      }

      let json = {};
      Object.keys(objToConvert).forEach(key => {
        if (!~this._restKeys.indexOf(key)) {
          json[key] = objToConvert[key];
        }
      });
      return json;
    };

    var obj = toJSON(object);

    Object.defineProperty(obj, '**oldState**', {value: toJSON(object)});

    ['findAll', 'search', 'findOne'].forEach(method => {
      obj[method] = (resource, ...other) => {
        let url = this._baseUrl + this._resourceName + '/' + obj.id + '/';
        let r = this._createSubInstance(url, resource);
        return r[method](...other).sendRequest();
      };
    });


    obj.save = () => {
      return this.save(obj.toJSON());
    };

    obj.toJSON = function() {
      return toJSON(this);
    };

    return obj;
  }

  proxify(res) {
    let {value, request} = res;

    if (Array.isArray(value)) {
      let values = [];
      value.forEach(val => values.push(this._proxifyOne(val)));
      return values;
    } else {
      return this._proxifyOne(value);
    }
  }

  sendRequest(withProxy = true) {
    let _request = request => {
      return this._http
        .request(request)
        .then(result => {
          let value = result.body;
          if (!value && result.text) {
            try {
              value = JSON.parse(result.text);
            } catch(e) {
              value = null;
            }
          }
          return new Response(value, result, request);
        });
    }

    let chain = [_request, undefined];

    if (isNotEmpty(this._interceptors)) {
      this._interceptors.forEach(interceptor => {
        if (interceptor instanceof RequestInterceptor) {
          chain.unshift(
            interceptor.request.bind(interceptor),
            interceptor.requestError.bind(interceptor)
          );
        }

        if (interceptor instanceof ResponseInterceptor) {
          chain.push(
            interceptor.response.bind(interceptor),
            interceptor.responseError.bind(interceptor)
          );
        }
      });
    }

    var promise = Promise.resolve(this._request);
    while (chain.length) {
      let thenFn = chain.shift();
      let rejectFn = chain.shift();

      promise = promise.then(thenFn, rejectFn);
    }

    promise = promise.then((res) => {
      if (withProxy) {
        res.value = this.proxify(res);
      }
      let r = [res.value, res.result];
      return r;
    });

    return promise;
  }
}
