/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./content-type-options.types.d.ts').ContentTypeOptionsOptions} ContentTypeOptionsOptions
 */

/**
 * @param {ContentTypeOptionsOptions} options
 * @return {HititipiMiddleware}
 */
export function contentTypeOptions(options) {
  return async (context) => {
    if (options.noSniff) {
      context.responseHeaders.set('x-content-type-options', 'nosniff');
    }
    return context;
  };
}
