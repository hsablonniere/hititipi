/**
 * @typedef {import('../types/hititipi.types.d.ts').HititipiContext} HititipiContext
 * @typedef {import('../types/hititipi.types.d.ts').HititipiMethod} HititipiMethod
 */

/**
 * @param {{requestMethod?: HititipiMethod, requestUrl?: string}} [base]
 * @return {HititipiContext}
 */
export function initTestContext(base = {}) {
  return {
    requestTimestamp: Date.now(),
    requestId: 'random-id',
    requestIps: ['127.0.0.1'],
    requestMethod: base.requestMethod ?? 'GET',
    requestUrl: new URL(base.requestUrl ?? 'http://localhost:8080/foo?bar=42'),
    requestHeaders: new Headers(),
    responseHeaders: new Headers(),
  };
}
