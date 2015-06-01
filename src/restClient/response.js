import isObject from 'lodash.isobject';

export class Response {
  constructor(value, result, request) {
    this.value = value;
    this.result = result;
    this.request = request;
  }

  hasValue() {
    return Array.isArray(this.value) || isObject(this.value);
  }
}
