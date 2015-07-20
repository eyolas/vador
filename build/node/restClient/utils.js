'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isNotEmpty = isNotEmpty;
exports.normalizeUrl = normalizeUrl;
exports.isPromise = isPromise;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _normalizeUrl = require('normalize-url');

var _normalizeUrl2 = _interopRequireDefault(_normalizeUrl);

var IS_ABSOLUTE = /^http.*/;

/**
 * Check if `arr` is not empty
 *  - null return false
 *  - {} return false
 *  - [] return false
 * @param  {Mixed}  arr
 * @return {Boolean}
 */

function isNotEmpty(arr) {
  return arr && Array.isArray(arr) && arr.length;
}

/**
 * Normalize an url.
 * @param  {String} url
 * @return {String}
 */

function normalizeUrl(url) {
  if (!IS_ABSOLUTE.test(url)) {
    return (0, _normalizeUrl2['default'])(url).replace('http://', '');
  } else {
    return (0, _normalizeUrl2['default'])(url);
  }
}

/**
 * Check if `obj` is a promise.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 */

function isPromise(obj) {
  return obj && 'function' == typeof obj.all;
}