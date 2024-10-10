import { stringArray } from '../../lib/string-array.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./http-strict-transport-security.types.d.ts').HttpStrictTransportSecurityOptions} HttpStrictTransportSecurityOptions
 */

/**
 * @param {HttpStrictTransportSecurityOptions} options
 * @return {HititipiMiddleware}
 */
export function httpStrictTransportSecurity(options) {
  const headerParts = stringArray();
  for (const [directive, value] of Object.entries(options)) {
    if (value === true) {
      headerParts.push(directive);
    }
    if (typeof value === 'string' || typeof value === 'number') {
      headerParts.push(`${directive}=${value}`);
    }
  }
  const header = headerParts.join(';');
  return async (context) => {
    if (header !== '') {
      context.responseHeaders.set('strict-transport-security', header);
    }
  };
}
