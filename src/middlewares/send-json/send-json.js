import { updateResponseBody } from '../../lib/response.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 */

/**
 * @param {number} status
 * @param {object} data
 * @return {HititipiMiddleware}
 */
export function sendJson(status, data) {
  return async (context) => {
    context.responseStatus = status;
    context.responseHeaders.set('content-type', 'application/json');
    const responseBody = JSON.stringify(data);
    updateResponseBody(context, responseBody);
  };
}
