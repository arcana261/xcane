"use strict";

const xmlJs = require('xml-js');
const type = require('./type');
const iterable = require('./iterable');

/**
 * @desc Helper utilities for converting from/to XML
 * @author Mohamad mehdi Kharatizadeh - m_kharatizadeh@yahoo.com
 */
class XCaneXml {
  /**
   * @desc converts value to XML
   * @param {*} value - any javascript object
   * @param {*=} options - optional options to pass
   * @return {string} - XML
   */
  static stringify(value, options) {
    /**
     * @desc internal recursive function to convert values to XML friendly
     * format
     * @param {*} value - any value
     * @param {string=} key - parent key to current value
     * @return {*} - converted value
     * @private
     */
    const convertValue = (value, key) => {
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
        return value.map(x => convertValue(x, key));
      }

      return {
        type: 'element',
        name: key,
        elements: iterable.from(Object.keys(value))
          .select(k => convertValue(value[k], k))
          .flatten()
          .toArray()
      };
    };

    return xmlJs.js2xml({
      elements: convertValue(value).elements
    },
    Object.assign({}, options, {
      compact: false
    }));
  }

  /**
   * @desc parses an XML string into javascript object
   * @param {string} value - XML string
   * @param {*=} options - options to pass to underlying parser
   * @return {*} - a javascript object
   */
  static parse(value, options) {
    /**
     * @desc internal result convertor utility
     * @param {*} node - a xml-js compatible node
     * @return {*} - a javascript compatible object
     * @private
     */
    const parseValue = node => {
      if (node.type === 'text') {
        if (type.isNumeric(node.text)) {
          return Number(node.text);
        }

        if (node.text === 'true') {
          return true;
        }

        if (node.text === 'false') {
          return false;
        }

        return node.text;
      }

      return {
        [node.name]: node.elements.reduce((prev, elem) => {
          const parsed = parseValue(elem);

          if (type.isNumber(parsed) || type.isBoolean(parsed) ||
            type.isString(parsed)) {
            return parsed;
          }

          return Object.keys(parsed).reduce((p, k) => {
            if (p.hasOwnProperty(k)) {
              if (!type.isArray(p[k])) {
                p[k] = [p[k]];
              }

              p[k].push(parsed[k]);
            } else {
              p[k] = parsed[k];
            }

            return p;
          }, prev);
        }, {})
      };
    };

    return parseValue(xmlJs.xml2js(value,
       Object.assign({}, options, {compact: false})))[undefined];
  }
}

module.exports = XCaneXml;
