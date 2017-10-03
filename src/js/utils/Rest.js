/**
 * @description Utility functions for performing REST calls. Applications that interact with REST APIs should use fetch andpromises. This Rest module provides a few helper functions along the way.
 * 
 * @example 
 * 
 * import { headers, buildQuery, processStatus } from 'grommet/utils/Rest';
 * 
 * export default class MyComponent extends Component {
 * 
 *   _getData (filters) {
 *     const query = buildQuery(filters);
 *     const options = { method: 'GET', headers: { ...headers, Auth: _token };
 *     fetch(`/rest/index/resources${query}`, options)
 *     .then(processStatus)
 *     .then(response => response.json())
 *     .then(result => this.setState({ result: result, error: undefined }))
 *     .catch(error => this.setState({ result: undefined, error: error }));
 *   }
 * 
 * })
 */

// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

export const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

// converts object to parameter array, handles arrays
export function buildParams (object) {
  let params = [];
  if (object) {
    for (const property in object) {
      if (object.hasOwnProperty(property)) {
        const value = object[property];
        if (null !== value && undefined !== value) {
          if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
              params.push(property + '=' + encodeURIComponent(value[i]));
            }
          } else {
            params.push(property + '=' + encodeURIComponent(value));
          }
        }
      }
    }
  }
  return params;
}

/**
 * 
 * @property {function} buildParams - Converts object to parameter array of strings of name=URI-encoded-value. Handles array values.
 * 
 * @property {function} buildQuery - Calls buildParams if passed an object. Then joins the params array with '&' and adds a '?' prefix if needed
 * 
 * @property {function} processStatus - For use in a promisechain. Rejects promise if response is not ok.
 */

// joins params array and adds '?' prefix if needed
export function buildQuery (object) {
  const params = (Array.isArray(object) ? object : buildParams(object));
  return (params.length > 0 ? `?${params.join('&')}` : '');
}

// reject promise of response isn't ok
export function processStatus (response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(response.statusText || `Error ${response.status}`);
  }
}

// Deprecated superagent functions

import request from 'superagent';

let _headers = { ...headers };

let _timeout = 10000; // 10s

export default {

  setTimeout (timeout) {
    _timeout = timeout;
  },

  setHeaders (headers) {
    _headers = headers;
  },

  setHeader (name, value) {
    _headers[name] = value;
  },

  head (uri, params) {
    var op = request.head(uri).query(buildParams(params).join('&'));
    op.timeout(_timeout);
    op.set(_headers);
    return op;
  },

  get (uri, params) {
    var op = request.get(uri).query(buildParams(params).join('&'));
    op.timeout(_timeout);
    op.set(_headers);
    return op;
  },

  patch (uri, data) {
    var op = request.patch(uri).send(data);
    op.timeout(_timeout);
    op.set(_headers);
    return op;
  },

  post (uri, data) {
    var op = request.post(uri).send(data);
    op.timeout(_timeout);
    op.set(_headers);
    return op;
  },

  put (uri, data) {
    var op = request.put(uri).send(data);
    op.timeout(_timeout);
    op.set(_headers);
    return op;
  },

  del (uri) {
    var op = request.del(uri);
    op.timeout(_timeout);
    op.set(_headers);
    return op;
  }
};
