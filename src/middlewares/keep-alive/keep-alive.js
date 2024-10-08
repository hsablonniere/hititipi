/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./keep-alive.types.d.ts').KeepAliveOptions} KeepAliveOptions
 */

/**
 * @param {KeepAliveOptions} options
 * @return {HititipiMiddleware}
 */
export function keepAlive(options) {
  return async (context) => {
    if (options.enabled) {
      context.responseHeaders.set('connection', 'keep-alive');
      if (options.timeout != null && options.maxRequests != null) {
        context.responseHeaders.set('keep-alive', `timeout=${options.timeout},max=${options.maxRequests}`);
      } else if (options.timeout != null) {
        context.responseHeaders.set('keep-alive', `timeout=${options.timeout}`);
      } else if (options.maxRequests != null) {
        context.responseHeaders.set('keep-alive', `max=${options.maxRequests}`);
      }
    } else {
      context.responseHeaders.set('connection', 'close');
    }

    return context;
  };
}
