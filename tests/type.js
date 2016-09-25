"use strict";

const type = require('../lib/type');
const expect = require('chai').expect;
const promise = require('../lib/promise');
const task = require('../lib/task');

describe('XCaneType', () => {
  describe('#isString()', () => {
    it('should return true for string', () => {
      expect(type.isString('salam')).to.be.true;
      expect(type.isString('a' + 'b')).to.be.true;
      expect(type.isString(`5 + 4 = ${5 + 4};`)).to.be.true;
    });

    it('should return false for non-strings', () => {
      expect(type.isString(54.2)).to.be.false;
      expect(type.isString([1, 2])).to.be.false;
      expect(type.isString(['a'])).to.be.false;
      expect(type.isString(null)).to.be.false;
      expect(type.isString(undefined)).to.be.false;
      expect(type.isString(v => v + 2)).to.be.false;
      expect(type.isString({
        a: 's'
      })).to.be.false;
    });
  });

  describe('#isArray()', () => {
    it('should return true for arrays', () => {
      expect(type.isArray([1, 2])).to.be.true;
      expect(type.isArray(new Array(4))).to.be.true;
    });

    it('should return false for non-arrays', () => {
      expect(type.isArray(54.2)).to.be.false;
      expect(type.isArray('s')).to.be.false;
      expect(type.isArray(null)).to.be.false;
      expect(type.isArray(undefined)).to.be.false;
      expect(type.isArray(v => v + 2)).to.be.false;
      expect(type.isArray({
        a: 's'
      })).to.be.false;
    });
  });

  describe('#isFunction()', () => {
    it('should return true for functions', () => {
      expect(type.isFunction(function () {})).to.be.true;
      expect(type.isFunction(v => v + 2)).to.be.true;
    });

    it('should return false for non-functions', () => {
      expect(type.isFunction(54.2)).to.be.false;
      expect(type.isFunction('s')).to.be.false;
      expect(type.isFunction(null)).to.be.false;
      expect(type.isFunction(undefined)).to.be.false;
      expect(type.isFunction([1, 2])).to.be.false;
      expect(type.isFunction({
        a: 's'
      })).to.be.false;
    });
  });

  describe('#isNull()', () => {
    it('should return true for nulls', () => {
      expect(type.isNull(null)).to.be.true;
    });

    it('should return false for non-nulls', () => {
      expect(type.isNull(54.2)).to.be.false;
      expect(type.isNull('s')).to.be.false;
      expect(type.isNull(undefined)).to.be.false;
      expect(type.isNull([1, 2])).to.be.false;
      expect(type.isNull(v => v + 2)).to.be.false;
      expect(type.isNull({
        a: 's'
      })).to.be.false;
    });
  });

  describe('#isUndefined()', () => {
    it('should return true for undefineds', () => {
      expect(type.isUndefined(undefined)).to.be.true;
    });

    it('should return false for non-undefineds', () => {
      expect(type.isUndefined(54.2)).to.be.false;
      expect(type.isUndefined('s')).to.be.false;
      expect(type.isUndefined(null)).to.be.false;
      expect(type.isUndefined([1, 2])).to.be.false;
      expect(type.isUndefined(v => v + 2)).to.be.false;
      expect(type.isUndefined({
        a: 's'
      })).to.be.false;
    });
  });

  describe('#isOptional()', () => {
    it('should return true for optionals', () => {
      expect(type.isOptional(null)).to.be.true;
      expect(type.isOptional(undefined)).to.be.true;
    });

    it('should return false for non-optionals', () => {
      expect(type.isOptional(54.2)).to.be.false;
      expect(type.isOptional('s')).to.be.false;
      expect(type.isOptional([1, 2])).to.be.false;
      expect(type.isOptional(v => v + 2)).to.be.false;
      expect(type.isOptional({
        a: 's'
      })).to.be.false;
    });
  });

  describe('#isIterable()', () => {
    it('should return true for iterables', () => {
      expect(type.isIterable([1, 2])).to.be.true;
      expect(type.isIterable({
        [Symbol.iterator]: function () {}
      })).to.be.true;
    });

    it('should return false for non-iterables', () => {
      expect(type.isIterable(54.2)).to.be.false;
      expect(type.isIterable(v => v + 2)).to.be.false;
      expect(type.isIterable({
        a: 's'
      })).to.be.false;
      expect(type.isIterable(null)).to.be.false;
      expect(type.isIterable(undefined)).to.be.false;
    });
  });

  describe('#isNumber()', () => {
    it('should return true for iterables', () => {
      expect(type.isNumber(54.2)).to.be.true;
      expect(type.isNumber(5)).to.be.true;
      expect(type.isNumber(-5)).to.be.true;
      expect(type.isNumber(0)).to.be.true;
    });

    it('should return false for non-iterables', () => {
      expect(type.isNumber(v => v + 2)).to.be.false;
      expect(type.isNumber({
        a: 's'
      })).to.be.false;
      expect(type.isNumber(null)).to.be.false;
      expect(type.isNumber(undefined)).to.be.false;
    });
  });

  describe('#isPromise()', () => {
    it('should return true for promises', () => {
      let p = new Promise((resolve, reject) => {
        resolve('hello');
      });

      expect(type.isPromise(p));
    });

    it('should return true for tasks', () => {
      let p = task.spawn(function* () {
        return 'hello';
      });

      expect(type.isPromise(p));
    });

    it('should return true for promise.fromNode', () => {
      let p = promise.fromNode(cb => cb(null, 'hello'));

      expect(type.isPromise(p));
    });

    it('should return false for non-promises', () => {
      expect(type.isPromise(54.2)).to.be.false;
      expect(type.isPromise(v => v + 2)).to.be.false;
      expect(type.isPromise({
        a: 's'
      })).to.be.false;
      expect(type.isPromise(null)).to.be.false;
      expect(type.isPromise(undefined)).to.be.false;
      expect(type.isPromise([1, 2])).to.be.false;
    });
  });
});
