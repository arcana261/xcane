"use strict";

const type = require('./type');
const clone = require('clone');
const YAML = require('yamljs');
const XML = require('xml-js');
const promise = require('./promise');
const request = require('./request-promise');

/**
 * @desc Provides easy abstration over popular request module to do things in
 * promisified fashion
 * @author Mohamad mehdi Kharatizadeh - m_kharatizadeh@yahoo.com
 */
class XCaneAjax {
  /**
   * @desc converts options to Request.js friendly options
   * @param {XCaneAjaxOptions|string} options - options to call ajax
   * @return {*} - Request.js friendly options
   * @private
   */
  static _formatOptions(options) {
    if (type.isString(options)) {
      return {
        method: 'GET',
        uri: options
      };
    }

    options = clone(options);

    if (type.isOptional(options.method)) {
      if (['json', 'xml', 'yaml', 'form', 'multipart'].some(x => options[x])) {
        options.method = 'POST';
      } else {
        options.method = 'GET';
      }
    } else {
      options.method = options.method.toUpperCase();
    }

    if (type.isOptional(options.data)) {
      options.data = {};
    }

    if (options.method === 'GET') {
      if (['json', 'xml', 'yaml', 'form', 'multipart'].some(x => options[x])) {
        throw new Error('GET request should not contain JSON or form data');
      }

      if (type.isBoolean(options.query)) {
        if (options.query === false) {
          throw new Error(
            'GET request should not have query parameter set to false');
        }

        options.query = {};
      }

      options.query = Object.assign({}, options.data, options.query);
      options.data = null;
    } else if (options.query === true) {
      options.query = options.data;
      options.data = null;
    }

    if (type.isOptional(options.headers)) {
      options.headers = {};
    }

    let result = {
      uri: options.url,
      method: options.method
    };

    if (Object.keys(options.query).length > 0) {
      result = Object.assign(result, {
        qs: options.query
      });
    }

    if (options.form === true) {
      result = Object.assign(result, {
        form: options.data
      });
    } else if (options.multipart === true) {
      result = Object.assign(result, {
        formData: options.data
      });
    } else if (options.yaml === true) {
      result = Object.assign(result, {
        body: YAML.stringify(options.data, 2)
      });

      options.headers = Object.assign(options.headers, {
        'Content-Type': 'text/yaml'
      });
    } else if (options.xml === true) {
      result = Object.assign(result, {
        body: XML.json2xml(options.data)
      });

      options.headers = Object.assign(options.headers, {
        'Content-Type': 'application/xml'
      });
    } else {
      result = Object.assign(result, {
        json: true,
        body: options.data
      });
    }

    if (Object.keys(options.headers).length > 0) {
      result = Object.assign(result, {
        headers: options.headers
      });
    }

    if (!type.isOptional(options.auth)) {
      result.auth = options.auth;
    }

    return result;
  }

  /**
   * @param {XCaneAjaxOptions|string} options - options to use
   * @return {Promise.<*>} - resulting response
   */
  static request(options) {
    return promise.fromNode(cb => {
      request(XCaneAjax._formatOptions(options), (err, response, body) => {
        if (!err && response.statusCode === 200) {
          cb(null, body);
        } else {
          cb(err || body || response.statusMessage || response.statusCode);
        }
      });
    })();
  }
}

module.exports = XCaneAjax;
