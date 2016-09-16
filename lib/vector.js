"use strict";

/**
 * @desc Represents a dynamic resize-able piece of memory
 * that is able to perform insertions/deletions at the end
 * of array in O(1)
 * @author Mohamad mehdi Kharatizadeh - m_kharatizadeh@yahoo.com
 */
class XCaneVector {
  /**
   * @desc creates a new instance of XCaneVector
   */
  constructor() {
    this._arr = [];
    this._length = 0;
  }

  /**
   * @desc clears items of vector
   */
  clear() {
    this._arr = [];
    this._length = 0;
  }

  /**
   * @desc gets length of vector
   * @return {number} - number of items
   */
  get length() {
    return this._length;
  }

  /**
   * @desc gets capacity of vector
   * @return {number} - capacity
   */
  get capacity() {
    return this._arr.length;
  }

  /**
   * @desc returns true if array is empty
   * @return {boolean} - true if empty
   */
  get empty() {
    return this.length < 1;
  }

  /**
   * @desc sets/gets value at specified index
   * @param {number} index - index of item
   * @param {*=} value - value to set
   * @return {*} - old/new value at specified index
   */
  at(index, value) {
    if (index >= this.length || index < 0) {
      throw new Error(
        `provided index '${index}' is less than '${this.length}'`);
    }

    if (arguments.length < 2) {
      return this._arr[index];
    }

    this._arr[index] = value;
    return value;
  }

  /**
   * @desc gets/sets item at front of vector
   * @param {*=} value - value to set
   * @return {*} - old/new value at front of array
   */
  front(value) {
    if (arguments.length < 1) {
      return this.at(0);
    }

    return this.at(0, value);
  }

  /**
   * @desc gets/sets item at back of vector
   * @param {*=} value - value to set
   * @return {*} - old/new value at back of array
   */
  back(value) {
    if (arguments.length < 1) {
      return this.at(this.length - 1);
    }

    return this.at(this.length - 1, value);
  }

  /**
   * @desc iterates through items in vector
   * @return {ES6Iterator}
   */
  *
  [Symbol.iterator]() {
    for (let i = 0; i < this.length; i++) {
      yield this.at(i);
    }
  }

  /**
   * @desc resizes vector capacity
   * @param {number} newCapacity - new capacity of vector
   * @private
   */
  _resize(newCapacity) {
    if (newCapacity < this.length) {
      throw new Error(
        `new capacity '${newCapacity}' is less than current ` +
        `length '${this.length}'`);
    }

    let newArray = new Array(newCapacity);
    let index = 0;
    for (const value of this) {
      newArray[index++] = value;
    }

    this._arr = newArray;
  }

  /**
   * @desc doubles internal capacity if necessary
   * @private
   */
  _expand() {
    if (this.length >= this.capacity) {
      this._resize(Math.max(1, this.length * 2));
    }
  }

  /**
   * @desc decreases internal storage capacity
   * @private
   */
  _contract() {
    if (this.length <= (this.capacity / 4)) {
      this._resize(this.length * 2);
    }
  }

  /**
   * @desc adds a new item to end of array
   * @param {*} value - value to add
   */
  pushBack(value) {
    this._expand();
    this._arr[this._length] = value;
    this._length++;
  }

  /**
   * @desc removes item from end of array
   */
  popBack() {
    if (this.empty) {
      throw new Error('array is empty');
    }

    this._length--;
    this._arr[this._length] = null;
    this._contract();
  }
}

module.exports = XCaneVector;
