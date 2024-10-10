import { getSetCookieHeader } from '../../lib/cookie.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('../../lib/cookie.types.d.ts').CookieOptions} CookieOptions
 */

/**
 * @param {string} name
 * @param {string} value
 * @param {CookieOptions} [options]
 * @return {HititipiMiddleware}
 */
export function setCookie(name, value, options = {}) {
  return async (context) => {
    const setCookieHeader = getSetCookieHeader(name, value, options);
    context.responseHeaders.append('set-cookie', setCookieHeader);
  };
}
