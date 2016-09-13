"use strict";

const promise = require('./promise');

/**
 * @desc provides mechanism to turn async operations to sync
 * @author Mohamad mehdi Kharatizadeh - m_kharatizadeh@yahoo.com
 */
class XCaneTask {
  /**
   * @desc spawn a generator task function
   * @param {ES6Generator} fn - the generator task function
   * @return {Promise} - a promise which is resolved once task
   * gets completed.
   */
  static fromPromise(fn) {
    return promise.fromNode(function wrapper() {
      const args = Array.from(arguments);
      const cb = args[args.length - 1];
      const iterator = fn.apply(this, args.slice(0, args.length - 1));

      /**
       * @desc internal loop executor
       * @param {*=} lastResult - last known result obtained through generator
       */
      function loopExecutor(lastResult) {
        /**
         * @desc executes a nested promise
         * @param {Promise} p - the promise to execute
         */
        function executePromise(p) {
          p
            .then(nextResult => loopExecutor(nextResult))
            .catch(err => {
              try {
                let throwResult = iterator.throw(err);

                if (throwResult.done) {
                  cb(null, throwResult.value);
                } else {
                  executePromise(throwResult.value);
                }
              } catch (err) {
                cb(err);
              }
            });
        }

        try {
          let result = iterator.next(lastResult);

          if (result.done) {
            cb(null, result.value);
          } else {
            executePromise(result.value);
          }
        } catch (err) {
          cb(err);
        }
      }

      loopExecutor();
    });
  }
}

module.exports = XCaneTask;
