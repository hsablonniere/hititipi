/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiContext} HititipiContext
 */

/**
 * @param {Array<HititipiMiddleware|false>} middlewares
 * @param {(context: HititipiContext, error: any) => Promise<HititipiContext>} [onError]
 * @return {HititipiMiddleware}
 */
export function chainUntilResponse(middlewares, onError) {
  return async (context) => {
    let contextTmp = context;

    const chain = middlewares.filter((item) => item !== false);

    let applyMiddleware = chain.shift();

    try {
      while (applyMiddleware != null) {
        contextTmp = await applyMiddleware(contextTmp);
        if (contextTmp.responseBody != null || isEmptyStatusCode(contextTmp.responseStatus)) {
          return contextTmp;
        }
        applyMiddleware = chain.shift();
      }
    } catch (error) {
      if (onError == null) {
        throw error;
      }
      contextTmp = await onError(contextTmp, error);
    }

    return contextTmp;
  };
}

/**
 * @param {number|undefined} statusCode
 * @return {boolean}
 */
function isEmptyStatusCode(statusCode) {
  return statusCode === 204 || statusCode === 301 || statusCode === 302 || statusCode === 304;
}
