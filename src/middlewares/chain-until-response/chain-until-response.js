/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiContext} HititipiContext
 */

/**
 * @param {Array<HititipiMiddleware|false>} middlewares
 * @param {(context: HititipiContext, error: any) => Promise<void>} [onError]
 * @return {HititipiMiddleware}
 */
export function chainUntilResponse(middlewares, onError) {
  return async (context) => {
    const chain = middlewares.filter((item) => item !== false);

    let applyMiddleware = chain.shift();

    try {
      while (applyMiddleware != null) {
        await applyMiddleware(context);
        if (context.responseBody != null || isEmptyStatusCode(context.responseStatus)) {
          return;
        }
        applyMiddleware = chain.shift();
      }
    } catch (error) {
      if (onError == null) {
        throw error;
      }
      await onError(context, error);
    }
  };
}

/**
 * @param {number|undefined} statusCode
 * @return {boolean}
 */
function isEmptyStatusCode(statusCode) {
  return statusCode === 204 || statusCode === 301 || statusCode === 302 || statusCode === 304;
}
