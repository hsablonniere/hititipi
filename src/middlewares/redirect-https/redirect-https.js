import { redirect } from '../redirect/redirect.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 */

/**
 * @return {HititipiMiddleware}
 */
export function redirectHttps() {
  return async (context) => {
    if (context.requestProtocol === 'http') {
      const url = `https://${context.requestHeaders.get('host')}${context.requestPathname}${context.requestSearchParams.toString()}`;
      return redirect(301, url)(context);
    }
  };
}
