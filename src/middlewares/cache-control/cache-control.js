import { stringArray } from '../../lib/string-array.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./cache-control.types.d.ts').CacheControlOptions} CacheControlOptions
 */

/**
 * The `cache-control` middleware sets the `Cache-Control` HTTP header based on the provided options.
 *
 * @param {CacheControlOptions} options
 * @return {HititipiMiddleware}
 */
export function cacheControl(options) {
  const headerParts = stringArray();
  for (const [directive, value] of Object.entries(options)) {
    if (value === true) {
      headerParts.push(directive);
    }
    if (typeof value === 'string' || typeof value === 'number') {
      headerParts.push(`${directive}=${value}`);
    }
  }
  const header = headerParts.join(',');
  return async (context) => {
    if (header !== '') {
      context.responseHeaders.set('cache-control', header);
    }
    return context;
  };
}
