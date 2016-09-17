"use strict";

const Heap = require('./heap');
const objectPath = require('object-path');
const type = require('./type');
const promise = require('./promise');

/**
 * @desc represents result of groupBy statement
 * @author Mohamad mehdi Kharatizadeh - m_kharatizadeh@yahoo.com
 */
class XCaneIterableGroupBy {
  /**
   * @desc creates a new instance of XCaneIterableGroupBy
   * @param {*} key - key of groupBy
   * @param {XCaneSynchronIterable} items - items to put
   * @private
   */
  constructor(key, items) {
    this._key = key;
    this._items = items;
  }

  /**
   * @desc gets key associated with item
   * @return {*} - key object
   */
  get key() {
    return this._key;
  }

  /**
   * @desc gets list of items associated with this key
   * @return {XCaneSynchronIterable} - items with same key
   */
  get items() {
    return this._items;
  }
}

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
    let result = {
      used: false
    };
    result[Symbol.iterator] = function getIterator() {
      if (result.used) {
        throw new Error('computed value can not be iterated more than once');
      }

      result.used = true;
      return iterator;
    };

    return result;
  }

  /**
   * @desc makes sure an item is iterable
   * @param {ES6Iterator|ES6Iterable} item - the item to check for
   * @return {ES6Iterable} - iterable over items
   */
  static ensureIterable(item) {
    if (type.isIterable(item)) {
      return item;
    }

    return _XCaneIterableUtils.iteratorToIterable(item);
  }

  /**
   * @desc makes sure an item is actually a promise
   * @param {Promise|*} item - item to check
   * @return {Promise} - a non-async item is also converted to a promise
   */
  static ensurePromise(item) {
    if (type.isPromise(item)) {
      return item;
    }

    return Promise.resolve(item);
  }

  /**
   * @desc contructs a ES6 Promise complient constructor
   * @param {*|Promise} item - item to construct a promise constructor for
   * @return {PromiseConstructor} - promise constructor
   */
  static toPromiseConstructor(item) {
    return (resolve, reject) => {
      _XCaneIterableUtils.ensurePromise(item).then(resolve).catch(reject);
    };
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
   * @return {ES6Iterator} - an iterator over all items
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
   * @private
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

  /**
   * @desc sort items in ascending order given comparer function
   * @param {Comparer|string|Array.<string>} [fn] -
   * comparer function to sort by
   * @return {XCaneSynchronIterable} - resulting ordered items
   */
  orderBy(fn) {
    let heap = new Heap(fn);
    this.each(v => heap.push(v));
    let result = new Array(heap.length);
    let index = 0;

    while (!heap.empty) {
      result[index++] = heap.min;
      heap.popFront();
    }

    return new XCaneSynchronIterable(result);
  }

  /**
   * @desc reverses order of items
   * @return {XCaneSynchronIterable} - resulting items
   */
  reverse() {
    return new XCaneSynchronIterable(this.toArray().reverse());
  }

  /**
   * @desc checks to see if all items match a predicate
   * @param {Predicate} fn - predicate to check
   * @return {boolean} - true if all items match
   */
  all(fn) {
    let result = true;

    this.each((v, i) => {
      if (!fn(v, i)) {
        result = false;
        return false;
      }
    });

    return result;
  }

  /**
   * @desc checks to see if all items match a predicate
   * @param {Predicate} fn - predicate to check
   * @return {boolean} - true if all items match
   */
  every(fn) {
    return this.all(fn);
  }

  /**
   * @desc checks to see if at least one item matches a predicate
   * @param {Predicate} fn - predicate to check
   * @return {boolean} - true if at least one element matches
   */
  some(fn) {
    let result = false;

    this.each((v, i) => {
      if (fn(v, i)) {
        result = true;
        return false;
      }
    });

    return result;
  }

  /**
   * @desc checks to see if at least one item matches a predicate
   * @param {Predicate} fn - predicate to check
   * @return {boolean} - true if at least one element matches
   */
  any(fn) {
    return this.some(fn);
  }

  /**
   * @desc copies values into new iterable. useful for making copies of
   * calculated results to make subqueries on them.
   * @return {XCaneSynchronIterable} - iterable containing copies
   */
  toIterable() {
    return new XCaneSynchronIterable(this.toArray());
  }

  /**
   * @desc returns value at specified index or a default value
   * @param {number} index - index of value
   * @param {*} value - default value to use
   * @return {*} - value at specified index or default value
   */
  atOrValue(index, value) {
    let result = value;

    this.each((v, i) => {
      if (i === index) {
        result = v;
        return false;
      }
    });

    return result;
  }

  /**
   * @desc returns value at specified index or a null value
   * @param {number} index - index of value
   * @return {*} - value found at specified index
   */
  atOrNull(index) {
    return this.atOrValue(index, null);
  }

  /**
   * @desc returns value at specified index or throws an error
   * @param {number} index - index of item to seek
   * @return {*} - value found at specified index
   */
  at(index) {
    let result = null;
    let hasResult = false;

    this.each((v, i) => {
      if (i === index) {
        result = v;
        hasResult = true;
        return false;
      }
    });

    if (!hasResult) {
      throw new Error(`index ${index} is out of bounds`);
    }

    return result;
  }

  /**
   * @desc flatterns result by 1 level
   * @return {XCaneSynchronIterable} - flattened items
   */
  flatten() {
    function* generator(self) {
      for (const value of self) {
        if (type.isIterable(value)) {
          yield* value;
        } else {
          yield value;
        }
      }
    }

    return new XCaneSynchronIterable(generator(this));
  }

  /**
   * @desc groups items using specified keys
   * @param {Array.<string>} keys - keys to group by
   * @return {XCaneSynchronIterable.<XCaneIterableGroupBy>} - resulting items
   */
  groupBy(keys) {
    let hash = {};
    let result = [];

    this.each(v => {
      let x = hash;

      for (const key of keys) {
        const keyValue = objectPath.get(v, key);

        if (!x.hasOwnProperty(keyValue)) {
          x[keyValue] = {};
        }

        x = x[keyValue];
      }

      if (!x.hasOwnProperty('index')) {
        result.push({
          key: v,
          items: []
        });
        x.index = result.length - 1;
      }

      result[x.index].items.push(v);
    });

    return new XCaneSynchronIterable(result).select(
      v => new XCaneIterableGroupBy(
        v.key, new XCaneSynchronIterable(v.items)));
  }
}

/**
 * @desc provides functional programming goodies on asynchron collections
 * @author Mohamad mehdi Kharatizadeh - m_kharatizadeh@yahoo.com
 * @augments Promise
 */
class XCaneAsynchronIterable extends Promise {
  /**
   * @desc allows iterating over items in collection
   * @param {AsyncEnumerator} fn - function to enumerate through items
   * @return {XCaneAsynchronIterable} - an instance to self
   */
  each(fn) {
    return new XCaneAsynchronIterable(_XCaneIterableUtils.toPromiseConstructor(
      this.then(values => {
        const iterator = values[Symbol.iterator]();
        const executor = promise.method(index => {
          const current = iterator.next();

          if (current.done) {
            return Promise.resolve(this);
          }

          return _XCaneIterableUtils.ensurePromise(fn(current.value, index))
            .then(result => {
              if (result === false) {
                return Promise.resolve(this);
              }

              return executor(index + 1);
            });
        });

        return executor(0);
      })));
  }

  /**
   * @desc allows filtering and mapping of elements
   * @param {AsyncPredicate} take - whether to take an item
   * @param {AsyncPredicate} stop - whether to stop enumeration
   * @param {AsyncMapper} map - used to transform items
   * @return {Promise.<XCaneAsynchronIterable>} - an instance to new items
   * @private
   */
  _filter(take, stop, map) {
    let result = [];

    return new XCaneAsynchronIterable(_XCaneIterableUtils.toPromiseConstructor(
      this.each((v, i) => {
        return _XCaneIterableUtils.ensurePromise(take(v, i))
          .then(shouldTake => {
            if (shouldTake) {
              return _XCaneIterableUtils.ensurePromise(map(v, i))
                .then(mappedValue => {
                  result.push(mappedValue);

                  return _XCaneIterableUtils.ensurePromise(stop(v, i));
                });
            }

            return _XCaneIterableUtils.ensurePromise(stop(v, i));
          }).then(shouldStop => Promise.resolve(!shouldStop));
      }).then(() => Promise.resolve(result))));
  }

  /**
   * @desc filters items matching a predicate
   * @param {AsyncPredicate} fn - predicate to check on items
   * @return {Promise.<XCaneAsynchronIterable>} - an instance to filtered items
   */
  where(fn) {
    return this._filter(fn, (v, i) => false, (v, i) => v);
  }

  /**
   * @desc mapps items of collection
   * @param {AsyncMapper} fn - function to map items using it
   * @return {Promise.<XCaneAsynchronIterable>} - an instance to mapped items
   */
  select(fn) {
    return this._filter((v, i) => true, (v, i) => false, fn);
  }

  /**
   * @desc converts items to an array
   * @return {Promise.<Array>} - an array to collection items
   */
  toArray() {
    let result = [];

    return this.each((v, i) => result.push(v))
      .then(() => Promise.resolve(result));
  }
}

/**
 * @desc provides access to functional programming goodies based on
 * ES6 iterables and generators
 * @author Mohamad mehdi Kharatizadeh - m_kharatizadeh@yahoo.com
 */
class XCaneIterable {
  /**
   * @desc creates a query object on iterable item
   * @param {ES6Iterable|ES6Iterator} item - iterable item
   * @return {XCaneSynchronIterable} - query object
   */
  static from(item) {
    return new XCaneSynchronIterable(_XCaneIterableUtils.ensureIterable(item));
  }

  static async(item) {
    return new XCaneAsynchronIterable(
      _XCaneIterableUtils.toPromiseConstructor(item));
  }
}

module.exports = XCaneIterable;
