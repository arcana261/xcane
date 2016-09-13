"use strict";

/**
 * @desc exports various utility constructs
 * @author Mohamad mehdi Kharatizadeh - m_kharatizadeh@yahoo.com
 */
class XCane {
  /**
   * @desc creates a new instance
   */
  constructor() {}

  /**
   * @desc gets promise utilities
   * @return {XCanePromise} - promise utilities
   */
  get promise() {
    return require('./promise');
  }

  /**
   * @desc gets iterable utilities
   * @return {XCaneIterable} - iterable utilities
   */
  get iterable() {
    return require('./iterable');
  }

  /**
   * @desc gets task utilities
   * @return {XCaneTask} - task utilities
   */
  get task() {
    return require('./task');
  }
}

module.exports = new XCane();
