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
    return function () {
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
}

module.exports = XCanePromise;
