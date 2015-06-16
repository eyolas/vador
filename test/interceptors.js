import {createServer} from './mocks/serverMock';
import {ResponseInterceptorMock} from './mocks/responseInterceptorMock.js';
import {RestClient} from '../src';
import {expect} from 'chai';

var interfake;


describe('interceptors global restClient', function() {
  this.timeout(15000);
  var restClient;

  beforeEach((done) => {
    restClient = new RestClient('http://localhost:3000');
    interfake = createServer();
    interfake.listen(3000, done);
  });

  it('one ResponseInterceptor', () => {
    restClient.addInterceptor(new ResponseInterceptorMock('first'));
    let resource = restClient.resource('interceptors');
    return resource
      .findAll()
      .sendRequest()
      .then(res => {
        expect(res).to.have.property('first')
          .that.is.ok;
      });
  });

  afterEach(() => {
    interfake.stop();
    interfake = null;
  })
});
