import { redirect } from '../redirect/redirect.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 */

/**
 * @return {HititipiMiddleware}
 */
export function redirectHttps() {
  return async (context) => {
    if (context.requestUrl.protocol === 'http:') {
      return redirect(301, { protocol: 'https:' })(context);
    }
  };
}
