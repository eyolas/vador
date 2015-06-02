'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _request = require('./request');

var _http = require('./http');

var RestResource = (function () {
  function RestResource(baseUrl, resourceName) {
    var config = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, RestResource);

    this._baseUrl = baseUrl + '/';
    this.resourceName = resourceName;
    this._config = config;

    this._config.defaultHeaders = config.defaultHeaders || {};
    this._config.interceptors = config.interceptors || [];
    this._config.http = config.http || new _http.Http();
  }

  _createClass(RestResource, [{
    key: 'constructBaseRequest',
    value: function constructBaseRequest() {
      var method = arguments[0] === undefined ? 'get' : arguments[0];
      var responseType = arguments[1] === undefined ? Array : arguments[1];
      var addUrl = arguments[2] === undefined ? '' : arguments[2];

      var request = new _request.Request(this._baseUrl, this.resourceName, this, this._config);
      request.responseType = responseType;
      request.url = this._baseUrl + this.resourceName + addUrl;
      request.method = method;
      return request;
    }
  }, {
    key: 'config',
    set: function (config) {
      this._config = config;
    }
  }, {
    key: 'findAll',
    value: function findAll() {
      return this.constructBaseRequest();
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
    value: function _createSubInstance(url, resource, config) {
      return new RestResource(url, resource, config);
    }
  }]);

  return RestResource;
})();

exports.RestResource = RestResource;