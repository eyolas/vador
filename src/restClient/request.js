import {isNotEmpty} from './utils';
import normalizeUrl from 'normalize-url';

export class Request {
  constructor(resourceName, restResource) {
    this._url = null;
    this.method = 'get';
    this.responseType = Object;
    this.resourceName = resourceName;
    this.headers = {};
    this.query = [];
    this.data = [];
    this.restResource = restResource;
  }

  set url(url) {
    this._url = normalizeUrl(url);
  }

  get url() {
    return normalizeUrl(this._url);
  }

  reset() {
    this.headers = [];
    this.query = [];
    this.data = [];
  }

  query(val) {
    this.query.push(val);
  }

  set(field, val) {
    this.headers[field] = val;
  }

  send(data) {
    this.data.push(data);
  }
}
