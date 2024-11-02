import { match as createMatchPath } from 'path-to-regexp';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMethod} HititipiMethod
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 */

/**
 * @template T
 * @typedef {T extends `${string}/:${infer Param}/${infer Rest}`
 *   ? Param | PathParams<Rest>
 *   : T extends `${string}/:${infer Param}`
 *     ? Param
 *     : never} PathParams
 */

/**
 * @template T
 * @typedef {{ [K in PathParams<T>]: string }} PathParamsObject
 */

/**
 * @template {string} T
 * @param {HititipiMethod} method
 * @param {T} path
 * @param {(params: PathParamsObject<T>) => HititipiMiddleware} withParams
 * @returns {HititipiMiddleware}
 */
export function route(method, path, withParams) {
  const matchPath = createMatchPath(path, { decode: decodeURIComponent });
  return async (context) => {
    if (matchesMethod(method, context.requestMethod)) {
      const pathMatches = matchPath(context.requestPathname);
      if (pathMatches !== false) {
        // @ts-ignore
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
