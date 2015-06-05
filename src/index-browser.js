if (process.env.TYPE_BUILD === "yaku") {
  global.Promise = require('yaku');
}

export * from './restClient/';
export * from './core/baseInterceptors';
