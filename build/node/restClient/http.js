'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _superagentInterfacePromise = require('superagent-interface-promise');

var _superagentInterfacePromise2 = _interopRequireDefault(_superagentInterfacePromise);

var _utils = require('./utils');

var _config = require('./config');

var Http = (function () {
  function Http() {
    _classCallCheck(this, Http);
  }

  _createClass(Http, [{
    key: 'request',
    value: function request(_request) {
      _superagentInterfacePromise2['default'].Promise = _config.config.Promise;
      var r = (0, _superagentInterfacePromise2['default'])(_request.method, _request.url);

      Object.keys(_request.headers).forEach(function (header) {
        return r.set(header, _request.headers[header]);
      });

      if ((0, _utils.isNotEmpty)(_request.query)) {
        _request.query.forEach(r.query.bind(r));
      }

      if ((0, _utils.isNotEmpty)(_request.data)) {
        _request.data.forEach(r.send.bind(r));
      }
      return r;
    }
  }]);

  return Http;
})();

exports.Http = Http;