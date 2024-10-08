/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiContext} HititipiContext
 */

/**
 * @param {Array<HititipiMiddleware|false>} middlewares
 * @param {(context: HititipiContext, error: any) => Promise<HititipiContext>} [onError]
 * @return {HititipiMiddleware}
 */
export function chainAll(middlewares, onError) {
  return async (context) => {
    let contextTmp = context;

    const chain = middlewares.filter((item) => item !== false);

    let applyMiddleware = chain.shift();

    try {
      while (applyMiddleware != null) {
        contextTmp = await applyMiddleware(contextTmp);
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
