"use strict";

/**
 * @desc exports public API of xcane
 * @namespace xcane
 * @author Mohamad mehdi Kharatizadeh - m_kharatizadeh@yahoo.com
 */
module.exports = {
  /**
   * @desc utilities for ES6 promises
   * @memberof xcane
   * @type XCanePromise
   */
  promise: require('./promise'),
  /**
   * @desc functional programming goodies with iterables and
   * generator functions
   * @memberof xcane
   * @type XCaneIterable
   */
  iterable: require('./iterable'),
  /**
   * @desc task-like execution of async methods using ES6 generators
   * @memberof xcane
   * @type XCaneTask
   */
  task: require('./task'),
  /**
   * @desc provides various type checking utilities
   * @memberof xcane
   * @type XCaneType
   */
  type: require('./type'),
  /**
   * @desc provides tools to creating comparers in ascending or
   * desceding orders
   * @memberof xcane
   * @type XCaneComparer
   */
  comparer: require('./comparer'),
  /**
   * @desc a resize-able dynamic array providing good performance
   * with insertions
   * @memberof xcane
   * @type XCaneVector
   */
  vector: require('./vector'),
  /**
   * @desc a min-heap data structure
   * @memberof xcane
   * @type XCaneHeap
   */
  heap: require('./heap')
};
