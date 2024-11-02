/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 */

/**
 * @param {string} pattern
 * @param {HititipiMiddleware} middleware
 * @return {HititipiMiddleware}
 */
export function ifHostname(pattern, middleware) {
  const hostnameRegexString = pattern
    .split('.')
    .map((part) => {
      if (part === '*') {
        return '[^.]+';
      }
      if (part === '**') {
        return '.+';
      }
      return part;
    })
    .join('\\.');
  const hostnameRegex = new RegExp('^' + hostnameRegexString + '$');

  return async (context) => {
    if (context.requestHeaders.get('host')?.match(hostnameRegex)) {
      return middleware(context);
    }
  };
}
