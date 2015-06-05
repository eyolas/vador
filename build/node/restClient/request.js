'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('./utils');

var _response = require('./response');

var _coreBaseInterceptors = require('../core/baseInterceptors/');

var Request = (function () {
  function Request(baseUrl, resourceName, restResource) {
    var config = arguments[3] === undefined ? {} : arguments[3];

    _classCallCheck(this, Request);

    this._baseUrl = baseUrl;
    this._interceptors = config.interceptors || [];
    this._http = config.http;
    this.resourceName = resourceName;
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

  _createClass(Request, [{
    key: 'addInterceptor',
    value: function addInterceptor(interceptor) {
      var onEnd = arguments[1] === undefined ? true : arguments[1];

      if (onEnd) {
        this._interceptors.push(interceptor);
      } else {
        this._interceptors.unshift(interceptor);
      }

      return this;
    }
  }, {
    key: 'query',
    value: function query(val) {
      this.query.push(val);
      return this;
    }
  }, {
    key: 'set',
    value: function set(field, val) {
      this.headers[field] = val;
      return this;
    }
  }, {
    key: 'send',
    value: function send(data) {
      this.data.push(data);
      return this;
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

          var url = _this._baseUrl + _this.resourceName + '/' + obj.id + '/';
          var r = _this.restResource._createSubInstance(url, resource, _this._allConfig);
          return r[method].apply(r, other).sendRequest();
        };
      });

      obj.save = function () {
        return _this.restResource.save(obj.toJSON());
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

      var promise = Promise.resolve(this);
      while (chain.length) {
        var thenFn = chain.shift();
        var rejectFn = chain.shift();

        promise = promise.then(thenFn, rejectFn);
      }

      promise = promise.then(function (res) {
        if (withProxy) {
          res.value = _this3.proxify(res);
        }
        return res;
      });

      return promise;
    }
  }, {
    key: 'url',
    set: function (url) {
      this._url = (0, _utils.normalizeUrl)(url);
    },
    get: function () {
      return (0, _utils.normalizeUrl)(this._url);
    }
  }]);

  return Request;
})();

exports.Request = Request;