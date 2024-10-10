import { match as createMatchPath } from 'path-to-regexp';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMethod} HititipiMethod
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('path-to-regexp').Path} Path
 * @typedef {import('path-to-regexp').ParamData} ParamData
 */

/**
 * @param {HititipiMethod|'*'} method
 * @param {Path} path
 * @param {(params: ParamData) => HititipiMiddleware} withParams
 * @return {HititipiMiddleware}
 */
export function route(method, path, withParams) {
  const matchPath = createMatchPath(path, { decode: decodeURIComponent });
  return async (context) => {
    if (matchesMethod(method, context.requestMethod)) {
      const pathMatches = matchPath(context.requestUrl.pathname);
      if (pathMatches !== false) {
        return withParams(pathMatches.params)(context);
      }
    }
  };
}

/**
 * @param {HititipiMethod|'*'} method
 * @param {HititipiMethod} requestMethod
 * @return {boolean}
 */
function matchesMethod(method, requestMethod) {
  if (method === '*') {
    return true;
  }
  if (method === 'GET') {
    return requestMethod === 'GET' || requestMethod === 'HEAD';
  }
  return method === requestMethod;
}
