import {config} from './restClient/config';

if (process.env.TYPE_BUILD === "yaku") {
  config.Promise = require('yaku');
}

export {config};
export * from './restClient/';
export * from './core/baseInterceptors';
