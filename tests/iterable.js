"use strict";

const iterable = require('../lib/iterable');
const expect = require('chai').expect;

const data = [0, 1, 2, 3, 4, 5];

describe('XCaneSynchronIterable', () => {
  describe('#each()', () => {
    it('should iterate items of iterable', () => {
      let arr = [];
      iterable.from(data).each(v => arr.push(v));

      expect(arr).to.deep.equal(data);
    });

    it('should stop by returning false', () => {
      let arr = [];
      iterable.from(data).each(v => {
        arr.push(v);

        if (v == 2) {
          return false;
        }
      });

      expect(arr).to.be.deep.equal([0, 1, 2]);
    });
  });

  describe('#constructor()', () => {
    it('should iterate items of iterator', () => {
      function* generator() {
        for (const value of data) {
          yield value;
        }
      }

      let arr = [];
      iterable.from(generator()).each(v => arr.push(v));

      expect(arr).to.be.deep.equal(data);
    });
  });

  describe('#toArray()', () => {
    it('should convert items to array', () => {
      function* generator() {
        for (const value of data) {
          yield value;
        }
      }

      expect(iterable.from(generator()).toArray()).to.be.deep.equal(data);
    });
  });

  describe('#where()', () => {
    it('should filter items correctly', () => {
      expect(iterable.from(data).where(v => v % 2 === 0).toArray())
        .to.be.deep.equal([0, 2, 4]);
    });
  });
});
