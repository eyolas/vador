import superagent from 'superagent-es6-promise';
import {isNotEmpty} from './utils';

export class Http {

  request(request) {
    var r = superagent(request.method, request.url);

    Object.keys(request.headers)
      .forEach(header => r.set(header, request.headers[header]));

    if (isNotEmpty(request.query)) {
      request.query.forEach(r.query.bind(r));
    }

    if (isNotEmpty(request.data)) {
      request.data.forEach(r.send.bind(r));
    }

    return r;
  }
}
