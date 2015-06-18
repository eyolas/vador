import normalizeurl from 'normalize-url';

const IS_ABSOLUTE = /^http.*/;

/**
 * Check if `arr` is not empty
 *  - null return false
 *  - {} return false
 *  - [] return false
 * @param  {Mixed}  arr
 * @return {Boolean}
 */
export function isNotEmpty(arr) {
  return arr && Array.isArray(arr) && arr.length;
}

/**
 * Normalize an url.
 * @param  {String} url
 * @return {String}
 */
export function normalizeUrl(url) {
  if (!IS_ABSOLUTE.test(url)) {
    return normalizeurl(url).replace('http://', '');
  } else {
    return normalizeurl(url)
  }
}

/**
 * Check if `obj` is a promise.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 */
export function isPromise(obj) {
  return 'function' == typeof obj.all;
}
