"use strict";

/**
 * @desc provides type checking utilities
 * @author Mohamad mehdi Kharatizadeh - m_kharatizadeh@yahoo.com
 */
class XCaneType {
  /**
   * @desc checks if value is string
   * @param {*} value - value to check type of
   * @return {boolean} - true if value is an string
   */
  static isString(value) {
    return typeof (value) === 'string';
  }

  /**
   * @desc checks if value is an Array
   * @param {*} value - value to check if is an Array
   * @return {boolean} - true if value is an Array
   */
  static isArray(value) {
    return value instanceof Array;
  }

  /**
   * @desc checks if value is a function
   * @param {*} value - value to check
   * @return {boolean} - true if value is a function
   */
  static isFunction(value) {
    return typeof (value) === 'function';
  }

  /**
   * @desc checks if value is undefined
   * @param {*} value - value to check
   * @return {boolean} - true if value is undefined
   */
  static isUndefined(value) {
    return typeof (value) === 'undefined';
  }

  /**
   * @desc checks if value is null
   * @param {*} value - value to check
   * @return {boolean} - true if value is null
   */
  static isNull(value) {
    return value === null;
  }

  /**
   * @desc checks if value is null or undefined
   * @param {*} value - value to check type of
   * @return {boolean} - true if value is null or undefined
   */
  static isOptional(value) {
    return XCaneType.isUndefined(value) || XCaneType.isNull(value);
  }

  /**
   * @desc checks if value is iterable-like object
   * @param {*} value - value to check iterativeness
   * @return {boolean} - true if value is iterable
   */
  static isIterable(value) {
    return (!XCaneType.isNull(value)) && (typeof (value) === 'object') &&
      (value.hasOwnProperty(Symbol.iterator) ||
      Object.getPrototypeOf(value).hasOwnProperty(Symbol.iterator));
  }

  /**
   * @desc checks if value is a Promise
   * @param {*} value - value to check if is promise
   * @return {boolean} - true if value is promise
   */
  static isPromise(value) {
    return value instanceof Promise;
  }
}

module.exports = XCaneType;
