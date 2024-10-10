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
    context.responseBody = JSON.stringify(data);
    context.responseSize = context.responseBody.length;
    context.responseHeaders.set('content-type', 'application/json');
  };
}
