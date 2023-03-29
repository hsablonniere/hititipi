import { match as createMatchPath } from 'path-to-regexp';

/**
 * If the request matches the method and the path pattern, the callback is executed
 * @param {"*"|"HEAD"|"GET"|"PUT"|"POST"|"DELETE"|"OPTIONS"|"PATCH"} method
 * @param {string} path
 * @param {function} callback
 */
export function route (method, path, callback) {
  const matchPath = createMatchPath(path, { decode: decodeURIComponent });
  return (context) => {

    if (!matchesMethod(method, context.requestMethod)) {
      return;
    }

    const matches = matchPath(context.requestUrl.pathname);
    if (matches) {
      return callback({
        ...context,
        requestPathParams: matches.params,
      });
    }

  };
}

function matchesMethod (method, requestMethod) {
  if (method === '*') {
    return true;
  }
  if (method === 'GET') {
    return requestMethod === 'GET' || requestMethod === 'HEAD';
  }
  return method === requestMethod;
}
