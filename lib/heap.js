"use strict";

const vector = require('./vector');

/**
 * @desc Max/Min-Heap data structure
 * @augments XCaneVector
 */
class XCaneHeap extends vector {
  /**
   * @desc creates a new instance of XCaneHeap
   * @param {Comparer=} comparer - is used to compare between elements
   */
  constructor(comparer) {
    super();

    this._comparer = comparer || ((le, ri) => le - ri);
  }

  /**
   * @desc swaps items in array
   * @param {number} i - index to left item
   * @param {number} j - index to right item
   * @private
   */
  _swap(i, j) {
    let temp = this.at(i);
    this.at(i, this.at(j));
    this.at(j, temp);
  }

  /**
   * @desc returns true if element at i is less than element at j
   * @param {number} i - index to item i
   * @param {number} j - index to item j
   * @return {boolean} - true if item at i is less than item at j
   * @private
   */
  _less(i, j) {
    return this._comparer(this.at(i), this.at(j)) < 0;
  }

  /**
   * @desc pushes value to heap and maintains order
   * @param {*} value - value to push
   */
  push(value) {
    this.pushBack(value);

    let x = this.length - 1;
    while (x > 0) {
      let parent = Math.floor((x - 1) / 2);

      if (this._less(x, parent)) {
        this._swap(x, parent);
        x = parent;
      } else {
        break;
      }
    }
  }

  /**
   * @desc removes item from start of heap but maintains order
   */
  popFront() {
    if (this.length < 2) {
      this.popBack();
    } else {
      this._swap(0, this.length - 1);
      this.popBack();

      let x = 0;
      let child = 1;
      while (child < this.length) {
        if ((child + 1) < this.length && this._less(child + 1, child)) {
          child++;
        }

        if (this._less(child, x)) {
          this._swap(x, child);
          x = child;
          child = (x * 2) + 1;
        } else {
          break;
        }
      }
    }
  }

  /**
   * @desc gets minimum item in heap
   * @return {*} - minimum item in heap
   */
  get min() {
    return this.front();
  }
}

module.exports = XCaneHeap;
