import {Response} from '../src/restClient/response';
import {expect} from 'chai';

var response;
describe('response', () => {
  beforeEach(() => {
    response = new Response();
  });

  it('empty', () => {
    expect(response).to.have.property('value')
      .that.undefined;
    expect(response).to.have.property('result')
      .that.undefined;
    expect(response).to.have.property('request')
      .that.undefined;
  });

  it('not empty', () => {
    response = new Response('Luke', 'Yoda', 'Han');
    expect(response).to.have.property('value')
      .that.is.a('string')
      .that.equal('Luke');

    expect(response).to.have.property('result')
      .that.is.a('string')
      .that.equal('Yoda');

    expect(response).to.have.property('request')
      .that.is.a('string')
      .that.equal('Han');

    expect(response.hasValue()).to.be.not.ok;
  });

  it('has value', () => {
    response = new Response({'jedy': 'Luke'}, 'Yoda', 'Han');
    expect(response).to.have.property('value')
      .that.is.a('object')
      .that.deep.equal({'jedy': 'Luke'});

    expect(response).to.have.property('result')
      .that.is.a('string')
      .that.equal('Yoda');

    expect(response).to.have.property('request')
      .that.is.a('string')
      .that.equal('Han');

    expect(response.hasValue()).to.be.ok;
  });
});
