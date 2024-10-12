/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 */

export const HTML = 'text/html';
export const CSS = 'text/css';
export const JAVASCRIPT = 'application/javascript';

/**
 * @param {string} contentType
 * @param {HititipiMiddleware} middleware
 * @return {HititipiMiddleware}
 */
export function ifContentType(contentType, middleware) {
  return async (context) => {
    const contentTypeHeader = context.responseHeaders.get('content-type');
    if (contentTypeHeader === contentType || contentTypeHeader?.startsWith(contentType + ';')) {
      return middleware(context);
    }
  };
}
