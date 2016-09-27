"use strict";

const XML = require('../lib/xml');
const expect = require('chai').expect;

describe('XCaneXml', () => {
  describe('#stringify()', () => {
    it('should convert to XML without options', () => {
      expect(XML.stringify({a: 10, b: 20})).to.be.equal('<a>10</a><b>20</b>');
    });

    it('should convert array to XML without options', () => {
      expect(XML.stringify({a: [1, 2]})).to.be.equal(
        '<a>1</a><a>2</a>');
    });

    it('should convert complex objects without options', () => {
      expect(XML.stringify({a: [{b: 5}, {c: [6, 7]}]})).to.be.equal(
        '<a><b>5</b></a><a><c>6</c><c>7</c></a>');
    });
  });

  describe('#parse()', () => {
    it('should parse simple XML without options', () => {
      expect(XML.parse('<x><a>10</a><b>20</b></x>')).to.be.deep.equal({
        x: {
          a: 10,
          b: 20
        }
      });
    });

    it('should parse array without options', () => {
      expect(XML.parse('<x><a>1</a><a>2</a></x>')).to.be.deep.equal({
        x: {
          a: [1, 2]
        }
      });
    });

    it('should parse complex objects without options', () => {
      expect(XML.parse('<x><a><b>5</b></a><a><c>6</c><c>7</c></a></x>'))
        .to.be.deep.equal({
          x: {
            a: [{
              b: 5
            }, {
              c: [6, 7]
            }]
          }
        });
    });
  });
});
