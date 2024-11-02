import { redirect } from '../redirect/redirect.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./redirect-www.types.d.ts').RedirectWwwOptions} RediectWwwOptions
 */

/**
 * @param {RediectWwwOptions} options
 * @return {HititipiMiddleware}
 */
export function redirectWww(options) {
  return async (context) => {
    const hostname = context.requestHeaders.get('host');
    if (hostname != null && options.hostnames.includes(hostname)) {
      const url = `${context.requestProtocol}://www.${hostname}${context.requestPathname}${context.requestSearchParams.toString()}`;
      return redirect(301, url)(context);
    }
  };
}
