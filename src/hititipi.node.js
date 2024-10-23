import { pipeline } from 'node:stream/promises';
import { getRandomId, getRequestIps, getRequestUrl, hasResponseBody } from './hititipi.common.js';
import { readableToWebReadableStream } from './lib/node-streams.js';

/**
 * @typedef {import('./types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./types/hititipi.types.d.ts').HititipiContext} HititipiContext
 * @typedef {import('./types/hititipi.types.d.ts').RequestHeaders} RequestHeaders
 * @typedef {import('./types/hititipi.types.d.ts').ResponseHeaders} ResponseHeaders
 * @typedef {import('node:http').RequestListener} RequestListener
 */

/**
 * Takes a middleware function and returns a Node.js HTTP RequestListener callback
 * @param {HititipiMiddleware} applyMiddleware
 * @return {RequestListener}
 */
export function hititipi(applyMiddleware) {
  return async (nodeRequest, nodeResponse) => {
    // Not sure that there's a way Node.js can produce a request header with an undefined value so let's ignore it
    const requestHeaders = new RequestHeadersNode(
      /** @type {Record<string, string|Array<string>>} */ (nodeRequest.headers),
    );
    const responseHeaders = new ResponseHeadersNode();

    /** @type {HititipiContext} */
    const context = {
      requestTimestamp: Date.now(),
      requestId: getRandomId(),
      requestIps: getRequestIps(nodeRequest.socket.remoteAddress, requestHeaders),
      requestHttpVersion: nodeRequest.httpVersionMajor,
      requestMethod: nodeRequest.method ?? 'GET',
      requestUrl: getRequestUrl(nodeRequest.url ?? '/', requestHeaders),
      requestHeaders,
      requestBody: readableToWebReadableStream(nodeRequest),
      responseHeaders,
      writeEarlyHints(hints) {
        return new Promise((resolve) => {
          nodeResponse.writeEarlyHints(hints, resolve);
        });
      },
    };

    try {
      await applyMiddleware(context);
      const statusCode = context.responseStatus ?? 501;
      nodeResponse.writeHead(statusCode, responseHeaders.getObject());
      if (hasResponseBody(context)) {
        if (context.responseBody instanceof ReadableStream) {
          await pipeline(context.responseBody, nodeResponse).catch((err) => {
            if (err.code === 'ERR_STREAM_PREMATURE_CLOSE') {
              // This happens if the request is aborted early by the client so we can ignore this
            } else {
              console.error(err);
            }
          });
        } else {
          nodeResponse.write(context.responseBody);
        }
      }
      nodeResponse.end();
    } catch (error) {
      console.error(error);
      if (!nodeResponse.headersSent) {
        nodeResponse.writeHead(500);
      }
      nodeResponse.end();
    }
  };
}

/**
 * @implements {RequestHeaders}
 */
export class RequestHeadersNode {
  // We cannot use private fields as they don't work with inheritance
  /** @type {Record<string, string|Array<string>>} */
  _nodeHeaders;

  /**
   * @param {Record<string, string|Array<string>>} nodeHeaders
   */
  constructor(nodeHeaders) {
    this._nodeHeaders = nodeHeaders;
  }

  /**
   * @param {string} name
   * @return {string|null}
   */
  get(name) {
    if (typeof this._nodeHeaders[name] === 'string') {
      return this._nodeHeaders[name];
    }
    return null;
  }

  /**
   * @param {string} name
   * @return {number|null}
   */
  getNumber(name) {
    if (typeof this._nodeHeaders[name] === 'string') {
      return Number(this._nodeHeaders[name]);
    }
    return null;
  }

  /**
   * @param {string} name
   * @return {Date|null}
   */
  getDate(name) {
    if (typeof this._nodeHeaders[name] === 'string') {
      return new Date(this._nodeHeaders[name]);
    }
    return null;
  }

  /**
   * @param {string} name
   * @return {boolean}
   */
  has(name) {
    return typeof this._nodeHeaders[name] === 'string';
  }

  /**
   * @return {Record<string, string|Array<string>>}
   */
  getObject() {
    return this._nodeHeaders;
  }
}

/**
 * @implements {ResponseHeaders}
 */
export class ResponseHeadersNode extends RequestHeadersNode {
  constructor() {
    super(Object.create(null));
  }

  /**
   * @return {Array<string>}
   */
  getSetCookie() {
    if (Array.isArray(this._nodeHeaders['set-cookie'])) {
      return this._nodeHeaders['set-cookie'];
    }
    return [];
  }

  /**
   * @param {string} name
   * @param {string|null|undefined} value
   */
  set(name, value) {
    if (value == null) {
      delete this._nodeHeaders[name];
    } else if (name !== 'set-cookie') {
      this._nodeHeaders[name] = value;
    }
  }

  /**
   * @param {string} name
   * @param {number|null|undefined} value
   */
  setNumber(name, value) {
    if (value == null) {
      delete this._nodeHeaders[name];
    } else if (name !== 'set-cookie') {
      this._nodeHeaders[name] = value.toString();
    }
  }

  /**
   * @param {string} name
   * @param {Date|null|undefined} value
   */
  setDate(name, value) {
    if (value == null) {
      delete this._nodeHeaders[name];
    } else if (name !== 'set-cookie') {
      this._nodeHeaders[name] = value.toUTCString();
    }
  }

  /**
   * @param {string} value
   */
  appendSetCookie(value) {
    if (Array.isArray(this._nodeHeaders['set-cookie'])) {
      this._nodeHeaders['set-cookie'].push(value);
    } else {
      this._nodeHeaders['set-cookie'] = [value];
    }
  }

  /**
   * @param {string} name
   */
  delete(name) {
    delete this._nodeHeaders[name];
  }

  /**
   * @param {RegExp} pattern
   */
  deleteMany(pattern) {
    for (const name in this._nodeHeaders) {
      if (name.match(pattern) != null) {
        delete this._nodeHeaders[name];
      }
    }
  }

  /**
   * @param {Array<string>} namesToKeep
   */
  deleteAllExcept(namesToKeep) {
    for (const name in this._nodeHeaders) {
      if (!namesToKeep.includes(name)) {
        delete this._nodeHeaders[name];
      }
    }
  }

  /**
   * @param {Record<string, string|Array<string>>} nodeHeaders
   */
  reset(nodeHeaders) {
    this._nodeHeaders = nodeHeaders;
  }
}
