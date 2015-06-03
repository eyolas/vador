import normalizeurl from 'normalize-url';

const IS_ABSOLUTE = /^http.*/;

export function isNotEmpty(arr) {
  return arr && Array.isArray(arr) && arr.length;
}

export function normalizeUrl(url) {
  if (!IS_ABSOLUTE.test(url)) {
    return normalizeurl(url).replace('http://', '');
  } else {
    return normalizeurl(url)
  }
}
