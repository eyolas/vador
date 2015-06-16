import {ResponseInterceptor} from '../../src/core/baseInterceptors/';

export class ResponseInterceptorMock extends ResponseInterceptor {
  constructor(tag) {
    super();
    this.tag = tag;
  }

  response(response){
    response[this.tag] = true;
    return response;
  }
}
