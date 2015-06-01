'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('./utils');

var _normalizeUrl = require('normalize-url');

var _normalizeUrl2 = _interopRequireDefault(_normalizeUrl);

var Request = (function () {
  function Request(resourceName, restResource) {
    _classCallCheck(this, Request);

    this._url = null;
    this.method = 'get';
    this.responseType = Object;
    this.resourceName = resourceName;
    this.headers = {};
    this.query = [];
    this.data = [];
    this.restResource = restResource;
  }

  _createClass(Request, [{
    key: 'url',
    set: function (url) {
      this._url = (0, _normalizeUrl2['default'])(url);
    },
    get: function () {
      return (0, _normalizeUrl2['default'])(this._url);
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.headers = [];
      this.query = [];
      this.data = [];
    }
  }, {
    key: 'query',
    value: function query(val) {
      this.query.push(val);
    }
  }, {
    key: 'set',
    value: function set(field, val) {
      this.headers[field] = val;
    }
  }, {
    key: 'send',
    value: function send(data) {
      this.data.push(data);
    }
  }]);

  return Request;
})();

exports.Request = Request;