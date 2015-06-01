'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _http = require('./http');

var _restResource = require('./restResource');

var _lodashAssign = require('lodash.assign');

var _lodashAssign2 = _interopRequireDefault(_lodashAssign);

var RestClient = (function () {
  function RestClient(baseUrl) {
    var config = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, RestClient);

    this._baseUrl = baseUrl;
    this._interceptors = config.interceptors || [];
    this._headers = config.headers || {};
    this._http = config.http || null;
    this._cache = {};
  }

  _createClass(RestClient, [{
    key: 'baseUrl',
    set: function (baseUrl) {
      this._baseUrl = baseUrl;
    }
  }, {
    key: 'addHeader',
    value: function addHeader(field, val) {
      this._headers[field] = val;
    }
  }, {
    key: 'http',
    set: function (http) {
      this._http = http;
    }
  }, {
    key: 'addInterceptor',
    value: function addInterceptor(interceptor) {
      var onEnd = arguments[1] === undefined ? true : arguments[1];

      if (onEnd) {
        this._interceptors.push(interceptor);
      } else {
        this._interceptors.unshift(interceptor);
      }
    }
  }, {
    key: 'resource',
    value: function resource(resourceName) {
      var config = arguments[1] === undefined ? {} : arguments[1];

      if (!this._cache[resourceName]) {
        var conf = (0, _lodashAssign2['default'])({}, this._config, config);
        conf.defaultHeaders = (0, _lodashAssign2['default'])({}, this._headers, config.defaultHeaders || {});
        conf.interceptors = (config.interceptors || []).concat(this._interceptors);
        if (!conf.http) {
          conf.http = this._http;
        }

        this._cache[resourceName] = new _restResource.RestResource(this._baseUrl, resourceName, config);
      }

      return this._cache[resourceName];
    }
  }]);

  return RestClient;
})();

exports.RestClient = RestClient;