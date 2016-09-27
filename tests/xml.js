"use strict";

const XML = require('../lib/xml');
const expect = require('chai').expect;

describe('XCaneXml', () => {
  describe('#stringify()', () => {
    it('should convert to XML without options', () => {
      expect(XML.stringify({a: 10, b: 20})).to.be.equal('<a>10</a><b>20</b>');
    });

    it('should convert array to XML without options', () => {
      expect(XML.stringify({a: [{x: 10}, {x: 20}]})).to.be.equal('');
    });
  });
});
