/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./cors.types.d.ts').CorsOptions} CorsOptions
 */

/**
 * @param {CorsOptions} options
 * @return {HititipiMiddleware}
 */
export function cors(options) {
  const allowHeaders = options.allowHeaders?.join(',') ?? '';
  const allowMethods = options.allowMethods?.join(',') ?? '';
  const maxAge = typeof options.maxAge === 'number' ? String(options.maxAge) : options.maxAge;
  const exposeHeaders = options.exposeHeaders?.join(',') ?? '';
  return async (context) => {
    if (options.allowOrigin != null) {
      context.responseHeaders.set('access-control-allow-origin', options.allowOrigin);
    }
    if (options.allowCredentials) {
      context.responseHeaders.set('access-control-allow-credentials', 'true');
    }

    if (context.requestMethod === 'OPTIONS') {
      if (allowHeaders !== '') {
        context.responseHeaders.set('access-control-allow-headers', allowHeaders);
      }
      if (allowMethods !== '') {
        context.responseHeaders.set('access-control-allow-methods', allowMethods);
      }
      if (maxAge != null) {
        context.responseHeaders.set('access-control-max-age', maxAge);
      }
      context.responseStatus = 204;
    } else {
      if (exposeHeaders !== '') {
        context.responseHeaders.set('access-control-expose-headers', exposeHeaders);
      }
    }

    return context;
  };
}
