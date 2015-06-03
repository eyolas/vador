'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isNotEmpty = isNotEmpty;
exports.normalizeUrl = normalizeUrl;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _normalizeUrl = require('normalize-url');

var _normalizeUrl2 = _interopRequireDefault(_normalizeUrl);

var IS_ABSOLUTE = /^http.*/;

function isNotEmpty(arr) {
  return arr && Array.isArray(arr) && arr.length;
}

function normalizeUrl(url) {
  if (!IS_ABSOLUTE.test(url)) {
    return (0, _normalizeUrl2['default'])(url).replace('http://', '');
  } else {
    return (0, _normalizeUrl2['default'])(url);
  }
}