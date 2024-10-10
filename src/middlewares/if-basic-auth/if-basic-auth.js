import { getBasicAuth } from '../../lib/authorization.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 */

/**
 * @param {string} expectedUser
 * @param {string} expectedPassword
 * @param {HititipiMiddleware} middleware
 * @return {HititipiMiddleware}
 */
export function ifBasicAuth(expectedUser, expectedPassword, middleware) {
  return async (context) => {
    const { user, password } = getBasicAuth(context.requestHeaders);

    if (user === expectedUser && password === expectedPassword) {
      return middleware(context);
    }

    context.responseStatus = 401;
    context.responseHeaders.set('www-authenticate', 'Basic realm=foo, charset="UTF-8"');
    context.responseBody = '';
  };
}
