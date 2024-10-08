/**
 * @typedef {import('../types/hititipi.types.d.ts').HititipiContext} HititipiContext
 */

/**
 * @return {HititipiContext}
 */
export function initTestContext(pathAndSearch = '/foo?bar=42') {
  return {
    requestTimestamp: Date.now(),
    requestId: 'random-id',
    requestIps: ['127.0.0.1'],
    requestMethod: 'GET',
    requestUrl: new URL(pathAndSearch, 'http://localhost:8080'),
    requestHeaders: new Headers(),
    responseHeaders: new Headers(),
  };
}
