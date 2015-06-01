'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _request2 = require('./request');

var _response = require('./response');

var _http = require('./http');

var _utils = require('./utils');

var _coreBaseInterceptors = require('../core/baseInterceptors/');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var RestResource = (function () {
  function RestResource(baseUrl, resourceName) {
    var config = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, RestResource);

    this._baseUrl = baseUrl + '/';
    this._defaultHeaders = config.defaultHeaders || [];
    this._interceptors = config.interceptors || [];
    this._http = config.http || new _http.Http();
    this._resourceName = resourceName;
    this._request = new _request2.Request(resourceName, this);
    this._allConfig = config;
    this._config = config[resourceName] || {};
    this._restKeys = ['findAll', 'search', 'findOne', 'save', 'toJSON'];
  }

  _createClass(RestResource, [{
    key: 'constructBaseRequest',

    /****** Request wrapper *****************/
    value: function constructBaseRequest() {
      var method = arguments[0] === undefined ? 'get' : arguments[0];
      var responseType = arguments[1] === undefined ? Array : arguments[1];
      var addUrl = arguments[2] === undefined ? '' : arguments[2];

      this._request.reset();
      this._request.responseType = responseType;
      this._request.url = this._baseUrl + this._resourceName + addUrl;
      this._request.method = method;
      this._request.headers = this._defaultHeaders;
      return this;
    }
  }, {
    key: 'interceptors',
    set: function (interceptor) {
      this._interceptors = interceptor;
    }
  }, {
    key: 'config',
    set: function (config) {
      this._config = config;
    }
  }, {
    key: 'query',
    value: function query(val) {
      this._request.query(val);
      return this;
    }
  }, {
    key: 'set',
    value: function set(field, val) {
      this._request.set(field, val);
      return this;
    }
  }, {
    key: 'send',
    value: function send(data) {
      this._request.send(data);
      return this;
    }
  }, {
    key: 'findAll',

    /*********** end wrapper ************/

    value: function findAll() {
      return this.constructBaseRequest();
    }
  }, {
    key: 'search',
    value: function search() {
      var query = arguments[0] === undefined ? {} : arguments[0];

      return this.findAll().query(query);
    }
  }, {
    key: 'findOne',
    value: function findOne(id) {
      return this.constructBaseRequest('get', Object, '/' + id);
    }
  }, {
    key: 'save',
    value: function save(obj) {
      var p = undefined;
      if (obj.hasOwnProperty('id')) {
        p = this.merge(obj);
      } else {
        p = this.create(obj);
      }

      return p.sendRequest();
    }
  }, {
    key: 'create',
    value: function create(obj) {
      return this.constructBaseRequest('post', Object).send(obj);
    }
  }, {
    key: 'merge',
    value: function merge(obj) {
      return this.constructBaseRequest('put', Object, '/' + obj.id).send(obj);
    }
  }, {
    key: '_createSubInstance',
    value: function _createSubInstance(url, resource) {
      return new RestResource(url, resource, this._allConfig);
    }
  }, {
    key: '_proxifyOne',
    value: function _proxifyOne(object) {
      var _this = this;

      var toJSON = function toJSON(objToConvert) {
        if (!objToConvert) {
          return objToConvert;
        }

        var json = {};
        Object.keys(objToConvert).forEach(function (key) {
          if (! ~_this._restKeys.indexOf(key)) {
            json[key] = objToConvert[key];
          }
        });
        return json;
      };

      var obj = toJSON(object);

      Object.defineProperty(obj, '**oldState**', { value: toJSON(object) });

      ['findAll', 'search', 'findOne'].forEach(function (method) {
        obj[method] = function (resource) {
          for (var _len = arguments.length, other = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            other[_key - 1] = arguments[_key];
          }

          var url = _this._baseUrl + _this._resourceName + '/' + obj.id + '/';
          var r = _this._createSubInstance(url, resource);
          return r[method].apply(r, other).sendRequest();
        };
      });

      obj.save = function () {
        return _this.save(obj.toJSON());
      };

      obj.toJSON = function () {
        return toJSON(this);
      };

      return obj;
    }
  }, {
    key: 'proxify',
    value: function proxify(res) {
      var _this2 = this;

      var value = res.value;
      var request = res.request;

      if (Array.isArray(value)) {
        var _ret = (function () {
          var values = [];
          value.forEach(function (val) {
            return values.push(_this2._proxifyOne(val));
          });
          return {
            v: values
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      } else {
        return this._proxifyOne(value);
      }
    }
  }, {
    key: 'sendRequest',
    value: function sendRequest() {
      var _this3 = this;

      var withProxy = arguments[0] === undefined ? true : arguments[0];

      var _request = function _request(request) {
        return _this3._http.request(request).then(function (result) {
          var value = result.body;
          if (!value && result.text) {
            try {
              value = JSON.parse(result.text);
            } catch (e) {
              value = null;
            }
          }
          return new _response.Response(value, result, request);
        });
      };

      var chain = [_request, undefined];

      if ((0, _utils.isNotEmpty)(this._interceptors)) {
        this._interceptors.forEach(function (interceptor) {
          if (interceptor instanceof _coreBaseInterceptors.RequestInterceptor) {
            chain.unshift(interceptor.request.bind(interceptor), interceptor.requestError.bind(interceptor));
          }

          if (interceptor instanceof _coreBaseInterceptors.ResponseInterceptor) {
            chain.push(interceptor.response.bind(interceptor), interceptor.responseError.bind(interceptor));
          }
        });
      }

      var promise = _bluebird2['default'].resolve(this._request);
      while (chain.length) {
        var thenFn = chain.shift();
        var rejectFn = chain.shift();

        promise = promise.then(thenFn, rejectFn);
      }

      promise = promise.then(function (res) {
        if (withProxy) {
          res.value = _this3.proxify(res);
        }
        var r = [res.value, res.result];
        return r;
      });

      return promise;
    }
  }]);

  return RestResource;
})();

exports.RestResource = RestResource;