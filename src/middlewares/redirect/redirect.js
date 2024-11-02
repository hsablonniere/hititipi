/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('../../types/hititipi.types.d.ts').UrlParts} UrlParts
 */

/**
 * @param {300|301|302|303|304|305|306|307|308} code
 * @param {string} url
 * @return {HititipiMiddleware}
 */
export function redirect(code, url) {
  return async (context) => {
    context.responseStatus = code;
    context.responseHeaders.set('location', url);
  };
}
