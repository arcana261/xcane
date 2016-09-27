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

  /**
   * @desc checks to see if value is number
   * @param {*} value - value to check if is number
   * @return {boolean} - true if value is number
   */
  static isNumber(value) {
    return typeof (value) === 'number';
  }

  /**
   * @desc checks to see if value is boolean
   * @param {*} value - value to check if is boolean
   * @return {boolean} - true if value is boolean
   */
  static isBoolean(value) {
    return typeof (value) === 'boolean';
  }

  /*
   * @desc checks if value is an instance of error
   * @param {*} value - value to check if it is an exception
   * @return {boolean} - true if value is an exception
   */
  static isError(value) {
    return value instanceof Error;
  }

  /**
   * @desc tests to check whether value is number or can be converted to number
   * @param {*} value - any value
   * @return {boolean} - true if value can be converted to number
   */
  static isNumeric(value) {
    return XCaneType.isNumber(value) ||
      XCaneType.isBoolean(value) ||
      (XCaneType.isString(value) && value !== '' &&
        (value === 'NaN' || !Number.isNaN(Number(value))));
  }
}

module.exports = XCaneType;
