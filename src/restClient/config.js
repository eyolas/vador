import {isPromise} from './utils';

function getLocalPromise() {
  let local;

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

  let P = local.Promise;
  if (!isPromise(P)) {
    return null;
  }

  return P;
}

class Config {
  constructor() {
    this._promise = getLocalPromise();
  }

  set Promise(promise) {
    if (!isPromise(promise)) {
      throw new Error('Promise must be a promise');
    } else {
      this._promise = promise;
    }
  }

  get Promise() {
    if (!isPromise(this._promise)) {
      throw new Error('No promise exist');
    }
    return this._promise;
  }
}

export var config = new Config();
