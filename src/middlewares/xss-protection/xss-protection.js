/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./xss-protection.types.d.ts').XssProtectionOptions} XssProtectionOptions
 */

/**
 * @param {XssProtectionOptions} options
 * @return {HititipiMiddleware}
 */
export function xssProtection(options) {
  return async (context) => {
    if (options.mode === 'filter') {
      context.responseHeaders.set('x-xss-protection', '1');
    } else if (options.mode === 'block') {
      context.responseHeaders.set('x-xss-protection', '1;mode=block');
    }
    return context;
  };
}
