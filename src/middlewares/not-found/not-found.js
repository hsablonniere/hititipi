/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 */

/**
 * @return {HititipiMiddleware}
 */
export function notFound() {
  return async (context) => {
    context.responseStatus = 404;
    context.responseBody = '';
    return context;
  };
}
