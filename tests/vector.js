"use strict";

const vector = require('../lib/vector');
const expect = require('chai').expect;

describe('XCaneVector', () => {
  describe('#constructor', () => {
    it('should construct correctly', () => {
      let v = new vector();

      expect(v.length).to.be.equal(0);
      expect(v.capacity).to.be.equal(0);
      expect(v.empty).to.be.true;
    });
  });

  describe('#pushBack', () => {
    it('should increase length', () => {
      let v = new vector();

      for (let i = 0; i < 10; i++) {
        v.pushBack(i);
        expect(v.length).to.be.equal(i + 1);
      }
    });

    it('should clear empty flag', () => {
      let v = new vector();
      v.pushBack(0);
      expect(v.empty).to.be.equal(false);
    });

    it('should show front correctly', () => {
      let v = new vector();

      for (let i = 0; i < 10; i++) {
        v.pushBack(i);
        expect(v.front()).to.be.equal(0);
      }
    });

    it('should show back correctly', () => {
      let v = new vector();

      for (let i = 0; i < 10; i++) {
        v.pushBack(i);
        expect(v.back()).to.be.equal(i);
      }
    });

    it('should compute capacity by multiplication', () => {
      let v = new vector();

      expect(v.capacity).to.be.equal(0);
      v.pushBack(0);
      expect(v.capacity).to.be.equal(1);
      v.pushBack(1);
      expect(v.capacity).to.be.equal(2);
      v.pushBack(2);
      expect(v.capacity).to.be.equal(4);
      v.pushBack(3);
      expect(v.capacity).to.be.equal(4);
      v.pushBack(4);
      expect(v.capacity).to.be.equal(8);
      v.pushBack(5);
      expect(v.capacity).to.be.equal(8);
      v.pushBack(6);
      expect(v.capacity).to.be.equal(8);
      v.pushBack(7);
      expect(v.capacity).to.be.equal(8);
      v.pushBack(8);
      expect(v.capacity).to.be.equal(16);
      v.pushBack(9);
      expect(v.capacity).to.be.equal(16);
    });

    it('should maintain order of items', () => {
      let v = new vector();

      for (let i = 0; i < 10; i++) {
        v.pushBack(i);

        for (let j = 0; j <= i; j++) {
          expect(v.at(j)).to.be.equal(j);
        }
      }
    });
  });

  describe('#popBack', () => {
    it('should decrease length', () => {
      let v = new vector();
      for (let i = 0; i < 10; i++) {
        v.pushBack(i);
      }

      for (let i = 0; i < 10; i++) {
        expect(v.length).to.be.equal(10 - i);
        v.popBack();
      }

      expect(v.length).to.be.equal(0);
    });

    it('should maintain front correctly', () => {
      let v = new vector();
      for (let i = 0; i < 10; i++) {
        v.pushBack(i);
      }

      for (let i = 0; i < 10; i++) {
        expect(v.front()).to.be.equal(0);
        v.popBack();
      }
    });

    it('should maintain back correctly', () => {
      let v = new vector();
      for (let i = 0; i < 10; i++) {
        v.pushBack(i);
      }

      for (let i = 0; i < 10; i++) {
        expect(v.back()).to.be.equal(9 - i);
        v.popBack();
      }
    });

    it('should maintain capacity correctly', () => {
      let v = new vector();
      for (let i = 0; i < 10; i++) {
        v.pushBack(i);
      }

      expect(v.capacity).to.be.equal(16);
      v.popBack();
      expect(v.capacity).to.be.equal(16);
      v.popBack();
      expect(v.capacity).to.be.equal(16);
      v.popBack();
      expect(v.capacity).to.be.equal(16);
      v.popBack();
      expect(v.capacity).to.be.equal(16);
      v.popBack();
      expect(v.capacity).to.be.equal(16);
      v.popBack();
      expect(v.capacity).to.be.equal(8);
      v.popBack();
      expect(v.capacity).to.be.equal(8);
      v.popBack();
      expect(v.capacity).to.be.equal(4);
      v.popBack();
      expect(v.capacity).to.be.equal(2);
      v.popBack();
      expect(v.capacity).to.be.equal(0);
    });

    it('should maintain order of items', () => {
      let v = new vector();
      for (let i = 0; i < 10; i++) {
        v.pushBack(i);
      }

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10 - i; j++) {
          expect(v.at(j)).to.be.equal(j);
        }

        v.popBack();
      }
    });

    it('should set empty flag', () => {
      let v = new vector();
      v.pushBack(0);
      v.popBack();
      expect(v.empty).to.be.true;
    });

    it('should throw exception if empty', () => {
      expect(() => {
        let v = new vector();
        v.popBack();
      }).to.throw(Error);
    });
  });

  describe('#clear()', () => {
    it('should reset flags', () => {
      let v = new vector();
      for (let i = 0; i < 10; i++) {
        v.pushBack(i);
      }

      v.clear();
      expect(v.length).to.be.equal(0);
      expect(v.empty).to.be.true;
    });
  });

  describe('#[Symbol.iterator]()', () => {
    it('should enumerate items correctly', () => {
      let v = new vector();
      for (let i = 0; i < 10; i++) {
        v.pushBack(i);
      }

      let index = 0;
      for (const value of v) {
        expect(value).to.be.equal(index);
        index++;
      }
    });
  });

  describe('#at()', () => {
    it('should read items correctly', () => {
      let v = new vector();
      for (let i = 0; i < 10; i++) {
        v.pushBack(i);
      }

      for (let i = 0; i < 10; i++) {
        expect(v.at(i)).to.be.equal(i);
      }
    });

    it('should write front correctly', () => {
      let v = new vector();
      for (let i = 0; i < 10; i++) {
        v.pushBack(i);
      }

      expect(v.front()).to.be.equal(0);
      expect(v.at(0, 10)).to.be.equal(10);
      expect(v.front()).to.be.equal(10);
    });

    it('should write back correctly', () => {
      let v = new vector();
      for (let i = 0; i < 10; i++) {
        v.pushBack(i);
      }

      expect(v.back()).to.be.equal(9);
      expect(v.at(v.length - 1, 10)).to.be.equal(10);
      expect(v.back()).to.be.equal(10);
    });

    it('should write items correctly', () => {
      let v = new vector();
      for (let i = 0; i < 10; i++) {
        v.pushBack(i);
      }

      for (let i = 0; i < 10; i++) {
        v.at(i, v.at(i) * 2);
      }

      for (let i = 0; i < 10; i++) {
        expect(v.at(i)).to.be.equal(i * 2);
      }
    });

    it('should throw out of bounds correctly', () => {
      let v = new vector();
      for (let i = 0; i < 10; i++) {
        v.pushBack(i);
      }

      expect(() => {
        v.at(10);
      }).to.throw(Error);

      expect(() => {
        v.at(-1);
      }).to.throw(Error);
    });
  });

  describe('#front()', () => {
    it('should return item correctly', () => {
      let v = new vector();
      for (let i = 0; i < 10; i++) {
        v.pushBack(i);
      }

      expect(v.front()).to.be.equal(0);
    });

    it('should set item correctly', () => {
      let v = new vector();
      for (let i = 0; i < 10; i++) {
        v.pushBack(i);
      }

      expect(v.front()).to.be.equal(0);
      expect(v.front(10)).to.be.equal(10);
      expect(v.front()).to.be.equal(10);
      expect(v.at(0)).to.be.equal(10);
    });
  });

  describe('#back()', () => {
    it('should return item correctly', () => {
      let v = new vector();
      for (let i = 0; i < 10; i++) {
        v.pushBack(i);
      }

      expect(v.back()).to.be.equal(9);
    });

    it('should set item correctly', () => {
      let v = new vector();
      for (let i = 0; i < 10; i++) {
        v.pushBack(i);
      }

      expect(v.back()).to.be.equal(9);
      expect(v.back(10)).to.be.equal(10);
      expect(v.back()).to.be.equal(10);
      expect(v.at(v.length - 1)).to.be.equal(10);
    });
  });
});
