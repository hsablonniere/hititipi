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
    if (options.hostnames.includes(context.requestUrl.hostname)) {
      return redirect(301, { hostname: `www.${context.requestUrl.hostname}` })(context);
    }
    return context;
  };
}
