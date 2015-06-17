import {isPromise} from './utils';

class Config {
  constructor() {
    this._promise = Promise;
  }

  set Promise(promise) {
    if (!isPromise(promise)) {
      throw new Error('Promise must be a promise');
    } else {
      this._promise = promise;
    }
  }

  get Promise() {
    return this._promise;
  }
}

export var config = new Config();
