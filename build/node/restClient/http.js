'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _superagentEs6Promise = require('superagent-es6-promise');

var _superagentEs6Promise2 = _interopRequireDefault(_superagentEs6Promise);

var _utils = require('./utils');

var Http = (function () {
  function Http() {
    _classCallCheck(this, Http);
  }

  _createClass(Http, [{
    key: 'request',
    value: function request(_request) {
      var r = (0, _superagentEs6Promise2['default'])(_request.method, _request.url);

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