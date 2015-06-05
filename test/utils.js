import {isNotEmpty, normalizeUrl} from '../src/restClient/utils';
import {expect} from 'chai';

describe('utils tests', () => {
  it('isNotEmpty', () => {
    expect(isNotEmpty(null)).to.not.be.ok;
    expect(isNotEmpty({})).to.not.be.ok;
    expect(isNotEmpty([])).to.not.be.ok;
    expect(isNotEmpty(['test'])).to.be.ok;
  });

  describe('normalizeUrl', () => {
    it('relative', () => {
      expect(normalizeUrl('api///rest')).to.be.equal('api/rest');
      expect(normalizeUrl('api/rest')).to.be.equal('api/rest');
    });

    it('absolute', () => {
      expect(normalizeUrl('http://localhost/api///rest'))
        .to.be.equal('http://localhost/api/rest');

      expect(normalizeUrl('http://localhost:80/api///rest'))
        .to.be.equal('http://localhost/api/rest');

      expect(normalizeUrl('http://localhost:80/api/../rest'))
        .to.be.equal('http://localhost/rest');
    });
  });
});
