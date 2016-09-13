/**
 * @typedef PromisifiedMethod
 * @desc represents a promesified async method
 * @type {function}
 * @param {...*} any - any parameters.
 * @return {Promise}
 */

/**
 * @typedef NodeCallback
 * @desc represents a nodejs-compatible callback function
 * @type {function}
 * @param {*=} error - the error object if present
 * @param {*=} result - result of operation
 */

/**
 * @typedef NodifiedMethod
 * @desc represents a nodejs-compatible async method
 * @type {function}
 * @param {...*} args - variable number of arguments
 * @param {NodeCallback} callback - the callback to all upon end of operation
 */

/**
 * @typedef ES6IteratorNextFunction
 * @desc represents a ES6 complient iterator next function
 * @type {function}
 * @param {*=} option
 * @return {{value: *, done: boolean}}
 */

/**
 * @typedef ES6Iterator
 * @desc represents a ES6 iterator object
 * @type {object}
 * @property {ES6IteratorNextFunction} next
 * @property {ES6IteratorNextFunction} throw
 */

/**
 * @typedef ES6Generator
 * @desc represents a ES6 complient generator function
 * @type {function}
 * @param {...*} args - variable number of arguments
 * @return {ES6Iterator} - iterator over elements
 */
