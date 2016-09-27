"use strict";

const xmlJs = require('xml-js');
const type = require('./type');

/**
 * @desc Helper utilities for converting from/to XML
 * @author Mohamad mehdi Kharatizadeh - m_kharatizadeh@yahoo.com
 * @namespace XCaneXml
 */
module.exports = Object.freeze({
  _ensureArray: value => type.isArray(value) ? value : [value],

  /**
   * @desc converts value to XML
   * @param {*} - any javascript object
   * @param {*=} options - optional options to pass
   * @return {string} - XML
   * @memberof XCaneXml
   */
  stringify: (value, options) => {
    /**
     * @desc internal recursive function to convert values to XML friendly
     * format
     * @param {*} value - any value
     * @return {*} - converted value
     * @private
     */
    function convertValue(value, key) {
      if (type.isOptional(value) || type.isNumber(value) ||
        type.isString(value)) {
        return {
          type: 'element',
          name: key,
          elements: [{
            type: 'text',
            text: String(value)
          }]
        };
      }

      if (type.isArray(value)) {
        return value.map(x => ({
          type: 'element',
          name: key,
          elements: module.exports._ensureArray(convertValue(x))
        }));
      }

      return {
        declaration: {
          elements: Object.keys(value).map(k => convertValue(value[k], k))
        }
      };
    }

    return xmlJs.js2xml(convertValue(value),
      Object.assign({compact: false}, options));
  }
});
