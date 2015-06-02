import {isNotEmpty} from './utils';
import normalizeUrl from 'normalize-url';
import {Response} from './response';
import {ResponseInterceptor, RequestInterceptor} from '../core/baseInterceptors/'

export class Request {
  constructor(baseUrl, resourceName, restResource, config = {}) {
    this._baseUrl = baseUrl;
    this._interceptors = config.interceptors || [];
    this._http = config.http;
    this._resourceName = resourceName;
    this._allConfig = config;
    this._config = config[resourceName] || {};
    this._restKeys = ['findAll', 'search', 'findOne', 'save', 'toJSON'];

    this._url = null;
    this.method = 'get';
    this.responseType = Object;
    this.restResource = restResource;

    this.headers = config.defaultHeaders;
    this.query = [];
    this.data = [];
  }

  set url(url) {
    this._url = normalizeUrl(url);
  }

  get url() {
    return normalizeUrl(this._url);
  }

  addInterceptor(interceptor, onEnd = true) {
    if (onEnd) {
      this._interceptors.push(interceptor);
    } else {
       this._interceptors.unshift(interceptor);
    }

    return this;
  }

  query(val) {
    this.query.push(val);
    return this;
  }

  set(field, val) {
    this.headers[field] = val;
    return this;
  }

  send(data) {
    this.data.push(data);
    return this;
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
        let r = this.restResource._createSubInstance(url, resource);
        return r[method](...other).sendRequest();
      };
    });


    obj.save = () => {
      return this.restResource.save(obj.toJSON());
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

    var promise = Promise.resolve(this);
    while (chain.length) {
      let thenFn = chain.shift();
      let rejectFn = chain.shift();

      promise = promise.then(thenFn, rejectFn);
    }

    promise = promise.then((res) => {
      if (withProxy) {
        res.value = this.proxify(res);
      }
      return res;
    });

    return promise;
  }
}
