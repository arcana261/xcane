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

/**
 * @typedef ES6IterableIteratorFunction
 * @desc a function which should be provided by iterable prototypes
 * @type {function}
 * @return {ES6Iterator}
 */

/**
 * @typedef ES6Iterable
 * @desc represents a ES6 complient iterable
 * @type {object}
 * @property {ES6IterableIteratorFunction} [Symbol.iterator]
 */

/**
 * @typedef Predicate
 * @desc is used to filter elements
 * @type {function}
 * @param {*} value - value
 * @param {number=} index - index of item
 * @return {boolean} - whether to take an item or not
 */

 /**
  * @typedef AsyncPredicate
  * @desc is used to filter through an async collection
  * @type {function}
  * @param {*} value - value
  * @param {number=} index - index of item
  * @return {Promise.<boolean>|boolean=} - whether to take an item or not
  */

/**
 * @typedef Enumerator
 * @desc is used to iterate over elements
 * @type {function}
 * @param {*} value - value
 * @param {number=} index - index of item
 * @return {boolean=} - return false to stop enumeration
 */

/**
 * @typedef AsyncEnumerator
 * @desc is used to iterate over an async collection
 * @type {function}
 * @param {*} value - value
 * @param {number=} index - index of item
 * @return {Promise.<boolean>|Promise} - return false to stop enumeration
 */

/**
 * @typedef Mapper
 * @desc is used to map item to another item by iterating through elements
 * @type {function}
 * @param {*} value - value to map
 * @param {number=} index - index of item
 * @return {*} - mapped value
 */

 /**
  * @typedef AsyncMapper
  * @desc is used to map items to another item by iterating through async
  * collections
  * @param {*} value - vlaue to map
  * @param {number=} index - index of item
  * @return {Promise|*} - a promise or a mapped value
  */

/**
 * @typedef Comparer
 * @desc is used to compare elements against each other
 * @type {function}
 * @param {*} left - left value
 * @param {*} right - right value
 * @return {number} - negative means left is lower than right, positive means
 * left is greater than right, and zero means they are equal
 */

 /**
  * @typedef AsyncComparer
  * @desc is used to compare elements against each other
  * @type {function}
  * @param {*} left - left value
  * @param {*} right - right value
  * @return {Promise.<number>|number} - negative means left is lower than right,
  * positive means left is greater than right and zero means they are equal
  */

/**
 * @typedef Accumulator
 * @desc is used to aggregate data over an iterable
 * @type {function}
 * @param {*} prev - value calculated previously
 * @param {*} value - value to consider
 * @param {number=} index - index of current value
 * @return {*} - final value
 */

 /**
  * @typedef AsyncAccumulator
  * @desc is used to aggregate data over an async collection
  * @type {function}
  * @param {*} prev - value calculated previously
  * @param {*} value - value to consider
  * @param {number=} index - index of current value
  * @return {*|Promise} - new value
  */

/**
 * @typedef PromiseCallback
 * @desc represents a resolve/reject promise function
 * @type {function}
 * @param {*=} value - error or result of operation
 */

/**
 * @typedef PromiseConstructor
 * @desc represents a function with resolve/reject callbacks
 * @type {function}
 * @param {PromiseCallback} resolve -
 * function to call if promise is succesful
 * @param {PromiseCallback} reject -
 * function to call if promise has failed
 */
