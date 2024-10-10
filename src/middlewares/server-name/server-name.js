/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 */

/**
 * @param {string} serverName
 * @return {HititipiMiddleware}
 */
export function serverName(serverName) {
  return async (context) => {
    context.responseHeaders.set('server', serverName);
  };
}
