'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('./utils');

function getLocalPromise() {
  var local = undefined;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      return null;
    }
  }

  var P = local.Promise;
  if (!(0, _utils.isPromise)(P)) {
    return null;
  }

  return P;
}

var Config = (function () {
  function Config() {
    _classCallCheck(this, Config);

    this._promise = getLocalPromise();
  }

  _createClass(Config, [{
    key: 'Promise',
    set: function (promise) {
      if (!(0, _utils.isPromise)(promise)) {
        throw new Error('Promise must be a promise');
      } else {
        this._promise = promise;
      }
    },
    get: function () {
      if (!(0, _utils.isPromise)(this._promise)) {
        throw new Error('No promise exist');
      }
      return this._promise;
    }
  }]);

  return Config;
})();

var config = new Config();
exports.config = config;