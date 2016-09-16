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

  describe('#select()', () => {
    it('should map objects correctly', () => {
      expect(iterable.from(data).select(v => v * 2).toArray())
        .to.be.deep.equal(data.map(v => v * 2));
    });
  });

  describe('#[Symbol.iterator]()', () => {
    it('should iterate over raw iterables correctly', () => {
      let arr = [];
      for (const value of iterable.from(data)) {
        arr.push(value);
      }

      expect(arr).to.be.deep.equal(data);
    });

    it('should iterate over iterators correctly', () => {
      function* generator() {
        yield *data;
      }

      let arr = [];
      for (const value of iterable.from(generator())) {
        arr.push(value);
      }

      expect(arr).to.be.deep.equal(data);
    });
  });

  describe('#accumulate()', () => {
    it('should compute accumulation correctly', () => {
      let result = 0;
      for (const value of data) {
        result += value * 3;
      }

      expect(iterable.from(data).accumulate(0, (prev, v) => prev + v * 3))
        .to.be.equal(result);
    });
  });

  describe('#count()', () => {
    it('should compute count correctly', () => {
      expect(iterable.from(data).count()).to.be.equal(data.length);
    });
  });

  describe('#sum()', () => {
    it('should compute sum correctly', () => {
      let result = 0;
      for (const value of data) {
        result += value;
      }

      expect(iterable.from(data).sum()).to.be.equal(result);
    });
  });

  describe('#average()', () => {
    it('should compute average of items correctly', () => {
      let sum = 0;
      for (const value of data) {
        sum += value;
      }

      expect(iterable.from(data).average()).to.be.equal(sum / data.length);
    });
  });

  describe('#empty()', () => {
    it('should return true for empty collections', () => {
      expect(iterable.from([]).empty()).to.be.true;
    });

    it('should return false for non-empty collections', () => {
      expect(iterable.from(data).empty()).to.be.false;
    });
  });

  describe('#firstOrValue()', () => {
    it('should return default value for empty collections', () => {
      expect(iterable.from([]).firstOrValue('salam')).to.be.equal('salam');
    });

    it('should return first for non-empty collections', () => {
      expect(iterable.from(data).firstOrValue('salam')).to.be.equal(data[0]);
    });
  });

  describe('#lastOrValue()', () => {
    it('should return default value for empty collections', () => {
      expect(iterable.from([]).lastOrValue('salam')).to.be.equal('salam');
    });

    it('should return last for non-empty collections', () => {
      expect(iterable.from(data).lastOrValue('salam')).to.be.equal(
        data[data.length - 1]);
    });
  });

  describe('#firstOrNull()', () => {
    it('should return null for empty collections', () => {
      expect(iterable.from([]).firstOrNull()).to.be.null;
    });

    it('should return first for non-empty collections', () => {
      expect(iterable.from(data).firstOrNull()).to.be.equal(data[0]);
    });
  });

  describe('#lastOrNull()', () => {
    it('should return null for empty collections', () => {
      expect(iterable.from([]).lastOrNull()).to.be.null;
    });

    it('should return last for non-empty collections', () => {
      expect(iterable.from(data).lastOrNull()).to.be.equal(
        data[data.length - 1]);
    });
  });

  describe('#first()', () => {
    it('should throw error for empty collections', () => {
      expect(() => {
        iterable.from([]).first();
      }).to.throw(Error);
    });

    it('should return first for non-empty collections', () => {
      expect(iterable.from(data).first()).to.be.equal(data[0]);
    });
  });

  describe('#last()', () => {
    it('should throw error for empty collections', () => {
      expect(() => {
        iterable.from([]).last();
      }).to.throw(Error);
    });

    it('should return last for non-empty collections', () => {
      expect(iterable.from(data).last()).to.be.equal(data[data.length - 1]);
    });
  });
});
