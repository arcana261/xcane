"use strict";

const type = require('./type');
const objectPath = require('object-path');

class XCaneComparer {
  /**
   * @desc creates an ascending comparer from provided one
   * @param {Comparer|string|Array.<string>} [fn] - comparer
   * @return {Comparer} - comparer function
   */
  static ascending(fn) {
    if (type.isString(fn)) {
      return (le, ri) => {
        const left = objectPath.get(le, fn);
        const right = objectPath.get(ri, fn);

        if (left < right) {
          return -1;
        }

        if (right < left) {
          return 1;
        }

        return 0;
      };
    }

    if (type.isArray(fn)) {
      if (fn.some(v => !type.isString(v))) {
        throw new Error('Array value should contain only strings');
      }

      return (le, ri) => {
        for (const key of fn) {
          const left = objectPath.get(le, key);
          const right = objectPath.get(ri, key);

          if (left < right) {
            return -1;
          }

          if (right < left) {
            return 1;
          }
        }

        return 0;
      };
    }

    if (type.isFunction(fn)) {
      return fn;
    }

    if (type.isOptional(fn)) {
      return (le, ri) => {
        if (le < ri) {
          return -1;
        }

        if (ri < le) {
          return 1;
        }

        return 0;
      };
    }

    throw new Error(`Unexpected argument ${fn} of type ${typeof(fn)}`);
  }

  /**
   * @desc creates a descending comparer from ascending complient comparer
   * @param {Comparer|string|Array.<string>} [fn] - comparer function
   * @return {Comparer}
   */
  static descending(fn) {
    const gn = XCaneComparer.ascending(fn);

    return (le, ri) => {
      const result = gn(le, ri);

      if (result < 0) {
        return 1;
      }

      if (result > 0) {
        return -1;
      }

      return 0;
    };
  }
}

module.exports = XCaneComparer;
