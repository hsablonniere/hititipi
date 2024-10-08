/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 */

/**
 * @return {HititipiMiddleware}
 */
export function contentLength() {
  return async (context) => {
    if (typeof context.responseSize === 'number') {
      const contentLength = String(context.responseSize);
      context.responseHeaders.set('content-length', contentLength);
    }
    return context;
  };
}
