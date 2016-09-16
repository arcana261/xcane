"use strict";

const heap = require('../lib/heap');
const vector = require('../lib/vector');
const expect = require('chai').expect;

const sampleData = [8, 3, 5, 9, 1, 10, 0, 2, 6, 7];
const maxHeapPredicate = (le, ri) => ri - le;
const sortedData = sampleData.slice();
sortedData.sort((le, ri) => le - ri);

describe('XCaneHeap', () => {
  describe('#construtor()', () => {
    it('should return an instance of vector', () => {
      let h = new heap();
      expect(h).to.be.an.instanceof(vector);
      expect(h).to.be.an.instanceof(heap);
    });
  });

  describe('#min()', () => {
    it('should always point to front', () => {
      let h = new heap();
      for (const value of sampleData) {
        h.push(value);
        expect(h.min).to.be.equal(h.front());
      }
    });

    it('should always point to minimum value', () => {
      let h = new heap();
      let min = sampleData[0];
      for (const value of sampleData) {
        if (value < min) {
          min = value;
        }

        h.push(value);
        expect(h.min).to.be.equal(min);
      }
    });

    it('should always point to maximum value using custom comparer', () => {
      let h = new heap(maxHeapPredicate);
      let max = sampleData[0];

      for (const value of sampleData) {
        if (value > max) {
          max = value;
        }

        h.push(value);
        expect(h.min).to.be.equal(max);
      }
    });
  });

  describe('#push', () => {
    it('should increase length', () => {
      let h = new heap();
      let index = 0;

      for (const value of sampleData) {
        h.push(value);
        index++;
        expect(h.length).to.be.equal(index);
      }
    });

    it('should maintain heap struture', () => {
      let h = new heap();

      for (const value of sampleData) {
        h.push(value);

        for (let i = 0; i < h.length; i++) {
          let q = (i * 2) + 1;
          let w = q + 1;

          if (q < h.length) {
            expect(h.at(i)).to.be.below(h.at(q));
          }

          if (w < h.length) {
            expect(h.at(i)).to.be.below(h.at(w));
          }
        }
      }
    });
  });

  describe('#popFront()', () => {
    it('should decrese length', () => {
      let h = new heap();

      for (const value of sampleData) {
        h.push(value);
      }

      expect(h.length).to.be.equal(sampleData.length);

      for (let i = 0; i < sampleData.length; i++) {
        h.popFront();
        expect(h.length).to.be.equal(sampleData.length - 1 - i);
      }
    });

    it('should maintain heap structure', () => {
      let h = new heap();

      for (const value of sampleData) {
        h.push(value);
      }

      while (!h.empty) {
        h.popFront();

        for (let i = 0; i < h.length; i++) {
          let q = (i * 2) + 1;
          let w = q + 1;

          if (q < h.length) {
            expect(h.at(i)).to.be.below(h.at(q));
          }

          if (w < h.length) {
            expect(h.at(i)).to.be.below(h.at(w));
          }
        }
      }
    });

    it('should be able to sort items', () => {
      let h = new heap();

      for (const value of sampleData) {
        h.push(value);
      }

      let arr = [];
      while (!h.empty) {
        arr.push(h.min);
        h.popFront();
      }

      expect(arr).to.be.deep.equal(sortedData);
    });

    it('should be able to sort items in reverse', () => {
      let h = new heap(maxHeapPredicate);

      for (const value of sampleData) {
        h.push(value);
      }

      let arr = [];
      while (!h.empty) {
        arr.push(h.min);
        h.popFront();
      }

      expect(arr).to.be.deep.equal(sortedData.reverse());
    });
  });
});
