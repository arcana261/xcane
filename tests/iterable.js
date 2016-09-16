"use strict";

const iterable = require('../lib/iterable');
const expect = require('chai').expect;

const data = [0, 1, 2, 3, 4, 5];
const university = [{
  name: 'ali',
  age: 18,
  residence: 'tehran'
}, {
  name: 'sara',
  age: 18,
  residence: 'tehran'
}, {
  name: 'mahyar',
  age: 18,
  residence: 'mashhad'
}, {
  name: 'mitra',
  age: 18,
  residence: 'mashhad'
}, {
  name: 'taghi',
  age: 19,
  residence: 'tehran'
}, {
  name: 'nazanin',
  age: 19,
  residence: 'tehran'
}, {
  name: 'mamali',
  age: 19,
  residence: 'mashhad'
}, {
  name: 'maryam',
  age: 19,
  residence: 'mashhad'
}];

const descendingComparer = (le, ri) => ri - le;

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
        yield* data;
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

  describe('#orderBy()', () => {
    it('should default sort an array', () => {
      expect(iterable.from([3, 2, 1, 0]).orderBy().toArray())
        .to.be.deep.equal([0, 1, 2, 3]);
    });

    it('should default sort calculated result', () => {
      expect(iterable.from([0, 1, 2, 3, 4, 5, 6])
          .where(v => v % 2 === 0).select(v => -v).orderBy().toArray())
        .to.be.deep.equal([-6, -4, -2, -0]);
    });

    it('should descending sort an array', () => {
      expect(iterable.from([0, 1, 2, 3]).orderBy(descendingComparer).toArray())
        .to.be.deep.equal([3, 2, 1, 0]);
    });
  });

  describe('#reverse()', () => {
    it('should reverse an array', () => {
      expect(iterable.from([1, 0, 3, 4]).reverse().toArray())
        .to.be.deep.equal([4, 3, 0, 1]);
    });
  });

  describe('#all()', () => {
    it('should return true for an empty array', () => {
      expect(iterable.from([]).all(v => v > 2)).to.be.true;
    });

    it('should return true for all matching', () => {
      expect(iterable.from([5, 4, 3]).all(v => v > 2)).to.be.true;
    });

    it('should return false for one non-matching', () => {
      expect(iterable.from([5, 4, 3, 2]).all(v => v > 2)).to.be.false;
    });
  });

  describe('#some()', () => {
    it('should return false for an empty array', () => {
      expect(iterable.from([]).some(v => v > 2)).to.be.false;
    });

    it('should return true for one matching', () => {
      expect(iterable.from([-1, 0, 1, 2, 3]).some(v => v > 2)).to.be.true;
    });

    it('should return false for none matching', () => {
      expect(iterable.from([-1, 0, 1, 2]).some(v => v > 2)).to.be.false;
    });
  });

  describe('#toIterable()', () => {
    it('should allow query on queries', () => {
      let res = iterable.from(data).select(v => v * 2).toIterable();

      expect(res.count()).to.be.equal(data.length);
      expect(res.first()).to.be.equal(data[0] * 2);
    });

    it('should not be possible to query on queries without it', () => {
      let res = iterable.from(data).select(v => v * 2);

      expect(res.count()).to.be.equal(data.length);
      expect(() => {
        res.first();
      }).to.throw(Error);
    });
  });

  describe('#atOrValue()', () => {
    it('should return value in range', () => {
      expect(iterable.from([0, 1, 2]).select(v => v * 10).atOrValue(1, 0))
        .to.be.equal(10);
    });

    it('should return default value when not in range', () => {
      expect(iterable.from([0, 1, 2]).select(v => v * 10).atOrValue(10, -1))
        .to.be.equal(-1);
    });
  });

  describe('#atOrNull()', () => {
    it('should return value in range', () => {
      expect(iterable.from([0, 1, 2]).select(v => v * 10).atOrNull(1))
        .to.be.equal(10);
    });

    it('should return null when not in range', () => {
      expect(iterable.from([0, 1, 2]).select(v => v * 10).atOrNull(10))
        .to.be.null;
    });
  });

  describe('#at()', () => {
    it('should return value in range', () => {
      expect(iterable.from([0, 1, 2]).select(v => v * 10).at(1))
        .to.be.equal(10);
    });

    it('should throw exception when not in range', () => {
      expect(() => {
        iterable.from([0, 1, 2]).select(v => v * 10).at(10);
      }).to.throw(Error);
    });
  });

  describe('#flatten()', () => {
    it('should flatten nested arrays', () => {
      expect(iterable.from([
          [0, 1],
          [2, 3],
          [4, 5]
        ]).flatten().toArray())
        .to.be.deep.equal([0, 1, 2, 3, 4, 5]);
    });

    it('should flatten mixed arrays', () => {
      expect(iterable.from([
          [0, 1], 2, [3]
        ]).flatten().toArray())
        .to.be.deep.equal([0, 1, 2, 3]);
    });

    it('should flatten flat array', () => {
      expect(iterable.from([0, 1, 2, 3]).flatten().toArray())
        .to.be.deep.equal([0, 1, 2, 3]);
    });
  });

  describe('#groupBy()', () => {
    it('should group single property', () => {
      let res = iterable.from(university).groupBy(['age']).toIterable();

      expect(res.count()).to.be.equal(2);
      expect(res.select(x => x.key.age).orderBy().toArray())
        .to.be.deep.equal([18, 19]);
      expect(res.where(x => x.key.age === 18).select(x => x.items).flatten()
        .orderBy('name').toArray()).to.be.deep.equal(
        [university[0], university[2], university[3], university[1]]);
      expect(res.where(x => x.key.age === 19).select(x => x.items).flatten()
        .orderBy('name').toArray()).to.be.deep.equal(
        [university[6], university[7], university[5], university[4]]);

      expect(res.every(x => x.items.count() === 4)).to.be.true;
      expect(res.every(x => x.items.every(y => y.age === x.key.age)))
        .to.be.true;
    });

    it('should group complex properties', () => {
      let res = iterable.from(university).groupBy(['age', 'residence'])
        .toIterable();

      expect(res.count()).to.be.equal(4);
      expect(res.every(x => x.items.count() === 2)).to.be.true;
      expect(res.every(x => x.items.every(y => y.age === x.key.age &&
        y.residence === x.key.residence))).to.be.true;
      expect(res.where(x => x.key.age === 18 && x.key.residence === 'tehran')
        .select(x => x.items).flatten().select(x => x.name)
        .orderBy('name').toArray()).to.be.deep.equal(['ali', 'sara']);
      expect(res.where(x => x.key.age === 18 && x.key.residence === 'mashhad')
        .select(x => x.items).flatten().select(x => x.name).orderBy()
        .toArray()).to.be.deep.equal(['mahyar', 'mitra']);
      expect(res.where(x => x.key.age === 19 && x.key.residence === 'mashhad')
        .select(x => x.items).flatten().select(x => x.name).orderBy()
        .toArray()).to.be.deep.equal(['mamali', 'maryam']);
      expect(res.where(x => x.key.age === 19 && x.key.residence === 'tehran')
        .select(x => x.items).flatten().select(x => x.name).orderBy()
        .toArray()).to.be.deep.equal(['nazanin', 'taghi']);
    });
  });
});
