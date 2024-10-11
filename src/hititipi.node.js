import { pipeline } from 'node:stream/promises';
import {
  getRandomId,
  getRequestIps,
  getRequestUrl,
  hasResponseBody,
  toObjectHeaders,
  toStandardHeaders,
} from './hititipi.common.js';

/**
 * @typedef {import('./types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./types/hititipi.types.d.ts').HititipiContext} HititipiContext
 * @typedef {import('node:http').IncomingHttpHeaders} NodeRequestHeaders
 * @typedef {import('node:http').IncomingMessage} NodeRequest
 * @typedef {import('node:http').OutgoingHttpHeaders} NodeResponseHeaders
 * @typedef {import('node:http').RequestListener} RequestListener
 */

/**
 * Takes a middleware function and returns a Node.js HTTP RequestListener callback
 * @param {HititipiMiddleware} applyMiddleware
 * @return {RequestListener}
 */
export function hititipi(applyMiddleware) {
  return async (nodeRequest, nodeResponse) => {
    const requestHeaders = toStandardHeaders(nodeRequest.headers);

    /** @type {HititipiContext} */
    const context = {
      requestTimestamp: Date.now(),
      requestId: getRandomId(),
      requestIps: getRequestIps(nodeRequest.socket.remoteAddress, requestHeaders),
      requestHttpVersion: nodeRequest.httpVersionMajor,
      requestMethod: nodeRequest.method ?? 'GET',
      requestUrl: getRequestUrl(nodeRequest.url ?? '/', requestHeaders),
      requestHeaders,
      responseHeaders: new Headers(),
      writeEarlyHints(hints) {
        return new Promise((resolve) => {
          nodeResponse.writeEarlyHints(hints, resolve);
        });
      },
    };

    try {
      await applyMiddleware(context);
      const statusCode = context.responseStatus ?? 501;
      const responseHeaders = toObjectHeaders(context.responseHeaders);
      nodeResponse.writeHead(statusCode, responseHeaders);
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
