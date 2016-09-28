"use strict";

const type = require('./type');
const clone = require('clone');
const YAML = require('yamljs');
const XML = require('./xml');
const rp = require('request');
const promise = require('./promise');

/**
 * @desc provides an abstract base class for errors
 * @author Mohamad mehdi Kharatizadeh - m_kharatizadeh@yahoo.com
 */
class XCaneAjaxError extends Error {
}

/**
 * @desc shows an error with network connectivity or server is unreachable
 * @author Mohamad mehdi Kharatizadeh - m_kharatizadeh@yahoo.com
 */
class XCaneAjaxNetworkError extends XCaneAjaxError {
}

/**
 * @desc shows a HTTP error response returned by server
 * @author Mohamad mehdi Kharatizadeh - m_kharatizadeh@yahoo.com
 */
class XCaneAjaxHttpError extends XCaneAjaxError {
  /**
   * @desc creates a new instance of XCaneAjaxHttpError
   * @param {number} statusCode - HTTP status code returned by server
   * @param {*} response - contains full response
   * @param {*} body - contains full body
   * @param {string} message - contains error message
   */
  constructor(statusCode, response, body, message) {
    super(`AJAX failed with status code ${statusCode} - ${message}`);

    this._statusCode = statusCode;
    this._response = response;
    this._body = body;
  }

  /**
   * @desc gets HTTP status code returned by server
   * @return {number} - HTTP status code returned by server
   */
  get statusCode() {
    return this._statusCode;
  }

  /**
   * @desc gets full response object
   * @return {*} - full response object
   */
  get response() {
    return this._response;
  }

  /**
   * @desc gets full body
   * @return {*} - full body
   */
  get body() {
    return this._body;
  }
}

/**
 * @desc Provides easy abstration over popular request module to do things in
 * promisified fashion
 * @author Mohamad mehdi Kharatizadeh - m_kharatizadeh@yahoo.com
 * @namespace XCaneAjax
 */
module.exports = Object.freeze({
  /**
   * @desc base class for all AJAX generated errors
   * @type XCaneAjaxError
   * @memberof XCaneAjax
   */
  Error: XCaneAjaxError,

  /**
   * @desc shows network-related errors
   * @type XCaneAjaxNetworkError
   * @memberof XCaneAjax
   */
  NetworkError: XCaneAjaxNetworkError,

  /**
   * @desc shows HTTP-related errors
   * @type XCaneAjaxHttpError
   * @memberof XCaneAjax
   */
  HttpError: XCaneAjaxHttpError,

  /**
   * @desc converts options to Request.js friendly options
   * @param {XCaneAjaxOptions|string} options - options to call ajax
   * @return {*} - Request.js friendly options
   * @private
   * @memberof XCaneAjax
   */
  _formatOptions: options => {
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

    if (options.method === 'GET') {
      if (['json', 'xml', 'yaml', 'form', 'multipart'].some(x => options[x])) {
        throw new Error('GET request should not contain JSON or form data');
      }

      if (type.isBoolean(options.query)) {
        if (options.query === false) {
          throw new Error(
            'GET request should not have query parameter set to false');
        }
      }

      options.query = Object.assign({}, options.data || {}, options.query);
      options.data = null;
    } else if (options.query === true) {
      options.query = options.data;
      options.data = null;
    } else {
      options.query = {};
    }

    if (type.isOptional(options.headers)) {
      options.headers = {};
    }

    let result = {
      uri: options.url,
      method: options.method,
      resolveWithFullResponse: options.resolveWithFullResponse
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
        payload: YAML.stringify(options.data, 2)
      });

      options.headers = Object.assign(options.headers, {
        'Content-Type': 'text/yaml'
      });
    } else if (options.xml === true) {
      result = Object.assign(result, {
        payload: XML.stringify(options.data)
      });

      options.headers = Object.assign(options.headers, {
        'Content-Type': 'application/xml'
      });
    } else if (options.query !== true && options.method !== 'GET' &&
        !type.isOptional(options.data)) {
      result = Object.assign(result, {
        payload: JSON.stringify(options.data)
      });

      options.headers = Object.assign(options.headers, {
        'Content-Type': 'application/json'
      });
    }

    if (Object.keys(options.headers).length > 0) {
      result = Object.assign(result, {
        headers: options.headers
      });
    }

    if (!type.isOptional(options.auth)) {
      result = Object.assign(result, {
        auth: options.auth
      });
    }

    if (Object.keys(options.query)) {
      result = Object.assign(result, {
        qs: options.query
      });
    }

    return result;
  },

  /**
   * @desc converts data type of response into javascript friendly
   * @param {*} response - request response object
   * @return {*} - parsed value based on response content type
   * @memberof XCaneAjax
   * @private
   */
  _transformBody: response => {
    switch (response.headers['content-type']) {
      case 'text/yaml':
      case 'text/x-yaml':
      case 'application/yaml':
      case 'application/x-yaml':
        return YAML.parse(response.body);

      case 'application/json':
        return JSON.parse(response.body);

      case 'application/xml':
        return XML.parse(response.body);

      default:
        return response.body;
    }
  },

  /**
   * @desc converts an error returned by remote server to human friendly format
   * @param {*} response - request response object
   * @return {string} - human readable error if available
   * @memberof XCaneAjax
   * @private
   */
  _transformError: response => {
    switch (response.headers['content-type']) {
      case 'text/plain':
      case 'text/html':
        return response.body;
      default:
        return 'Request failed with response of type ' +
          `${response.headers['content-type']}`;
    }
  },

  /**
   * @desc sends an HTTP AJAX request to a remote server
   * @param {XCaneAjaxOptions|string} options - options to use
   * @return {Promise.<*>} - resulting response
   * @memberof XCaneAjax
   */
  request: options => promise.fromNode(cb => {
    options = module.exports._formatOptions(options);
    let req = rp(options, (err, response, body) => {
      if (!err && response.statusCode === 200) {
        response.body = module.exports._transformBody(response);
        if (options.resolveWithFullResponse === true) {
          response.originalBody = body;
          cb(null, response);
        } else {
          cb(null, response.body);
        }
      } else if (err) {
        cb(new module.exports.NetworkError(err));
      } else {
        cb(new module.exports.HttpError(
          response.statusCode, response,
          module.exports._transformBody(response),
          module.exports._transformError(response)));
      }
    });

    if (type.isString(options.payload)) {
      req.end(options.payload);
    }
  })(),

  /**
   * @desc sends a HTTP GET AJAX request to a remote server
   * @param {XCaneAjaxOptions|string} options - options to use
   * @return {Promise.<*>} - result
   * @memberof XCaneAjax
   */
  get: options =>
    module.exports.request(Object.assign({}, options, {method: 'GET'})),

  /**
   * @desc sends a HTTP POST AJAX request to a remote server
   * @param {XCaneAjaxOptions|string} options - options to use
   * @return {Promise.<*>} - result
   * @memberof XCaneAjax
   */
  post: options =>
    module.exports.request(Object.assign({}, options, {method: 'POST'})),

  /**
   * @desc sends a HTTP PUT AJAX request to a remote server
   * @param {XCaneAjaxOptions|string} options - options to use
   * @return {Promise.<*>} - result
   * @memberof XCaneAjax
   */
  put: options =>
    module.exports.request(Object.assign({}, options, {method: 'PUT'})),

  /**
   * @desc sends a HTTP PATCH AJAX request to a remote server
   * @param {XCaneAjaxOptions|string} options - options to use
   * @return {Promise.<*>} - result
   * @memberof XCaneAjax
   */
  patch: options =>
    module.exports.request(Object.assign({}, options, {method: 'PATCH'})),

  /**
   * @desc sends a HTTP DELETE AJAX request to a remote server
   * @param {XCaneAjaxOptions|string} options - options to use
   * @return {Promise.<*>} - result
   * @memberof XCaneAjax
   */
  delete: options =>
    module.exports.request(Object.assign({}, options, {method: 'DELETE'}))
});
