"use strict";

/**
 * @desc provides various utilities for iterables/iterators
 * @author Mohamad mehdi Kharatizadeh - m_kharatizadeh@yahoo.com
 * @private
 */
class _XCaneIterableUtils {
  /**
   * @desc converts a iterator to an iterable
   * @param {ES6Iterator} iterator - the iterator function
   * @return {ES6Iterable} - converted iterable
   */
  static iteratorToIterable(iterator) {
    let result = {};
    result[Symbol.iterator] = function getIterator() {
      return iterator;
    };

    return result;
  }

  /**
   * @desc returns true if item is iterable
   * @param {ES6Iterator|ES6Iterable} item - the item to check for
   * @return {boolean} - whether item is iterable or not
   */
  static isIterable(item) {
    return item.hasOwnProperty(Symbol.iterator) ||
      Object.getPrototypeOf(item).hasOwnProperty(Symbol.iterator);
  }

  /**
   * @desc makes sure an item is iterable
   * @param {ES6Iterator|ES6Iterable} item - the item to check for
   * @return {ES6Iterable} - iterable over items
   */
  static ensureIterable(item) {
    if (_XCaneIterableUtils.isIterable(item)) {
      return item;
    }

    return _XCaneIterableUtils.iteratorToIterable(item);
  }
}

/**
 * @desc is used to provide functional programming paradign
 * @author Mohamad mehdi Kharatizadeh - m_kharatizadeh@yahoo.complient
 */
class XCaneSynchronIterable {
  /**
   * @desc creates a new instance of XCaneSynchronIterable
   * @param {ES6Iterable} iterable - ES6 iterable object
   */
  constructor(iterable) {
    this._iterable = iterable;
  }

  /**
   * @desc return iterator to iterator over elements
   * @return {ES6Iterator}
   */
  [Symbol.iterator]() {
    return this._iterable[Symbol.iterator]();
  }

  /**
   * @desc allows enumeration throgh items
   * @param {Enumerator} fn - enumerate through items
   * @return {XCaneSynchronIterable} - an instance to self
   */
  each(fn) {
    let index = 0;

    for (const value of this._iterable) {
      if (fn(value, index++) === false) {
        break;
      }
    }

    return this;
  }

  /**
   * @desc filters or mapps through items
   * @param {Predicate} take - whether to yield item or not
   * @param {Predicate} stop - whether to stop iterating or not
   * @param {Mapper} map - used to convert value before yielding
   * @return {XCaneSynchronIterable} - a new iterable
   */
  _filter(take, stop, map) {
    /**
     * @desc generator function which filters through items
     * @param {XCaneSynchronIterable} self - reference to self
     */
    function* generatorFn(self) {
      let index = 0;

      for (const value of self._iterable) {
        if (take(value, index)) {
          yield map(value, index);
        }

        if (stop(value, index)) {
          break;
        }

        index++;
      }
    }

    return new XCaneSynchronIterable(
      _XCaneIterableUtils.iteratorToIterable(generatorFn(this)));
  }

  /**
   * @desc creates an array out of items
   * @return {Array.<*>} - items
   */
  toArray() {
    let result = [];

    this.each(v => result.push(v));

    return result;
  }

  /**
   * @desc filters items who match a predicate
   * @param {Predicate} fn - predicate to call on items
   * @return {XCaneSynchronIterable} - reference to self
   */
  where(fn) {
    return this._filter(fn, (v, i) => false, (v, i) => v);
  }

  /**
   * @desc transforms items of iterabla
   * @param {Mapper} fn - function to call on each object
   * @return {XCaneSynchronIterable} - reference to result
   */
  select(fn) {
    return this._filter((v, i) => true, (v, i) => false, fn);
  }

  /**
   * @desc accumulate/aggregate data
   * @param {*} start - starting value
   * @param {Accumulator} fn - accumulator function
   * @return {*} - computed value
   */
  accumulate(start, fn) {
    this.each((v, i) => {
      start = fn(start, v, i);
    });

    return start;
  }

  /**
   * @desc counts number of objects
   * @return {number} - number of objects
   */
  count() {
    return this.accumulate(0, prev => prev + 1);
  }

  /**
   * @desc computes sum of elements
   * @return {number} - sum of elements
   */
  sum() {
    return this.accumulate(0, (prev, value) => prev + value);
  }

  /**
   * @desc calculates average of data
   * @return {number} - average of data
   */
  average() {
    return this.sum() / this.count();
  }

  /**
   * @desc returns true if collection is empty
   * @return {boolean} - true if collection is empty
   */
  empty() {
    let result = true;

    this.each(v => {
      result = false;
      return false;
    });

    return result;
  }

  /**
   * @desc returns first item in collection or a default value
   * @param {*} value - default value to use
   * @return {*} - item at first of collection
   */
  firstOrValue(value) {
    let result = value;

    this.each(v => {
      result = v;
      return false;
    });

    return result;
  }

  /**
   * @desc returns first item in collection or a null
   * @return {*|null} - first item in collection or null
   */
  firstOrNull() {
    return this.firstOrValue(null);
  }

  /**
   * @desc returns first element in collection or an error
   * @return {*} - first item in collection
   */
  first() {
    let result = null;
    let hasResult = false;

    this.each(v => {
      result = v;
      hasResult = true;
      return false;
    });

    if (!hasResult) {
      throw new Error('collection is empty');
    }

    return result;
  }

  /**
   * @desc returns last item in collection or a default value
   * @param {*} value - default value to use
   * @return {*} - last item in collection or a default value
   */
  lastOrValue(value) {
    let result = value;

    this.each(v => {
      result = v;
    });

    return result;
  }

  /**
   * @desc returns last item in collection or a null
   * @return {*|null} - last item in collection or a null
   */
  lastOrNull() {
    return this.lastOrValue(null);
  }

  /**
   * @desc returns last item in collection or throws an error
   * @return {*} - last item in collection
   */
  last() {
    let result = null;
    let hasResult = false;

    this.each(v => {
      result = v;
      hasResult = true;
    });

    if (!hasResult) {
      throw new Error('collection is empty');
    }

    return result;
  }
}

class XCaneIterable {
  /**
   * @desc creates a query object on iterable item
   * @param {ES6Iterable|ES6Iterator} item - iterable item
   * @return {XCaneSynchronIterable} - query object
   */
  static from(item) {
    return new XCaneSynchronIterable(_XCaneIterableUtils.ensureIterable(item));
  }
}

module.exports = XCaneIterable;
