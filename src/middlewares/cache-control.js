export const ONE_YEAR = 365 * 24 * 60 * 60;

const BOOLEAN_DIRECTIVES = ['public', 'private', 'no-cache', 'no-store', 'must-revalidate', 'proxy-revalidate', 'immutable', 'no-transform'];
const VALUE_DIRECTIVES = ['max-age', 's-maxage', 'stale-while-revalidate', 'stale-if-error'];

export function cacheControl (options = {}) {

  return async (context) => {

    const cacheControlString = Object.entries(options)
      .map(([directive, value]) => {
        if (BOOLEAN_DIRECTIVES.includes(directive) && value === true) {
          return directive;
        }
        if (VALUE_DIRECTIVES.includes(directive) && value != null) {
          return `${directive}=${value}`;
        }
      })
      .filter((a) => a != null)
      .join(',');

    if (cacheControlString !== '') {
      const responseHeaders = { ...context.responseHeaders, 'cache-control': cacheControlString };
      return { ...context, responseHeaders };
    }
  };
}
