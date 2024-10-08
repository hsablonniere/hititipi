/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 */

/**
 * @return {HititipiMiddleware}
 */
export function requestId() {
  return async (context) => {
    context.responseHeaders.set('x-request-id', context.requestId);
    return context;
  };
}
