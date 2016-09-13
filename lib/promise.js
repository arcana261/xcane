"use strict";

/**
 * @desc provides helper utilities to ES6 promises
 * @author Mohamad mehdi Kharatizadeh - m_kharatizadeh@yahoo.co m
 */
class XCanePromise {
  /**
   * @desc converts a node-compatible method to promises
   * @param {NodifiedMethod} fn - function to convert
   * @return {PromisifiedMethod} promisified method
   */
  static fromNode(fn) {
    return function wrapper() {
      const args = Array.from(arguments);

      return new Promise((resolve, reject) => {
        try {
          fn.apply(this, args.concat([(err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }]));
        } catch (err) {
          reject(err);
        }
      });
    };
  }

  /**
   * @desc wrapps a function so that it is able to catch synchron
   * exceptions
   * @param {PromisifiedMethod} fn - a promisified method
   * @return {PromisifiedMethod} - wrapped function
   */
  static method(fn) {
    return function wrapper() {
      try {
        return fn.apply(this, Array.from(arguments));
      } catch (err) {
        return Promise.reject(err);
      }
    };
  }

  /**
   * @desc pause for specified amount of time
   * @param {number} n - number of milliseconds
   * @return {Promise} - a promise which fulfils after delay
   */
  static delay(n) {
    const p = XCanePromise.fromNode(cb => {
      setTimeout(() => {
        cb();
      }, n);
    });

    return p();
  }
}

module.exports = XCanePromise;
