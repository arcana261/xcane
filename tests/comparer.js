"use strict";

const comparer = require('../lib/comparer');
const expect = require('chai').expect;

const ali = {name: 'ali', age: 19};
const hasan = {name: 'hasan', age: 20};
const hashem = {name: 'hashem', age: 19};

describe('XCaneComparer', () => {
  describe('#ascending()', () => {
    it('should create correct default comparer', () => {
      const c = comparer.ascending();

      expect(c(1, 2)).to.be.below(0);
      expect(c(2, 1)).to.be.above(0);
      expect(c(5, 5)).to.be.equal(0);

      expect(c('aaa', 'aab')).to.be.below(0);
      expect(c('z', 'aaa')).to.be.above(0);
      expect(c('dd', 'dd')).to.be.equal(0);

      expect(c([1, 4], [1, 5])).to.be.below(0);
      expect(c(['z'], ['a', 'b'])).to.be.above(0);
      expect(c([1], [1])).to.be.equal(0);
    });

    it('should create correct property comparer', () => {
      const c = comparer.ascending('age');

      expect(c(ali, hasan)).to.be.below(0);
      expect(c(hasan, hashem)).to.be.above(0);
      expect(c(ali, hashem)).to.be.equal(0);
    });

    it('should create correct array comparer', () => {
      const c = comparer.ascending(['age', 'name']);

      expect(c(ali, hasan)).to.be.below(0);
      expect(c(ali, hashem)).to.be.below(0);
      expect(c(ali, ali)).to.be.equal(0);
    });

    it('should create correct function comparer', () => {
      const c = comparer.ascending((le, ri) => ri - le);

      expect(c(1, 2)).to.be.above(0);
      expect(c(5, 0)).to.be.below(0);
      expect(c(10, 10)).to.be.equal(0);
    });

    it('should throw error if non-standard input provided', () => {
      expect(() => {
        comparer.ascending(3);
      }).to.throw(Error);

      expect(() => {
        comparer.ascending({a: 2});
      }).to.throw(Error);

      expect(() => {
        comparer.ascending([3]);
      });
    });
  });

  describe('#descending', () => {
    it('should create correct default comparer', () => {
      const c = comparer.descending();

      expect(c(1, 2)).to.be.above(0);
      expect(c(2, 1)).to.be.below(0);
      expect(c(5, 5)).to.be.equal(0);

      expect(c('aaa', 'aab')).to.be.above(0);
      expect(c('z', 'aaa')).to.be.below(0);
      expect(c('dd', 'dd')).to.be.equal(0);

      expect(c([1, 4], [1, 5])).to.be.above(0);
      expect(c(['z'], ['a', 'b'])).to.be.below(0);
      expect(c([1], [1])).to.be.equal(0);
    });

    it('should create correct property comparer', () => {
      const c = comparer.descending('age');

      expect(c(ali, hasan)).to.be.above(0);
      expect(c(hasan, hashem)).to.be.below(0);
      expect(c(ali, hashem)).to.be.equal(0);
    });

    it('should create correct array comparer', () => {
      const c = comparer.descending(['age', 'name']);

      expect(c(ali, hasan)).to.be.above(0);
      expect(c(ali, hashem)).to.be.above(0);
      expect(c(ali, ali)).to.be.equal(0);
    });

    it('should create correct function comparer', () => {
      const c = comparer.descending((le, ri) => ri - le);

      expect(c(1, 2)).to.be.below(0);
      expect(c(5, 0)).to.be.above(0);
      expect(c(10, 10)).to.be.equal(0);
    });

    it('should throw error if non-standard input provided', () => {
      expect(() => {
        comparer.descending(3);
      }).to.throw(Error);

      expect(() => {
        comparer.descending({a: 2});
      }).to.throw(Error);

      expect(() => {
        comparer.descending([3]);
      });
    });
  });
});
