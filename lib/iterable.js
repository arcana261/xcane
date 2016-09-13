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
   * @param {Maper} map - used to convert value before yielding
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
