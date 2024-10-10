/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiContext} HititipiContext
 */

/**
 * @param {Array<HititipiMiddleware|false>} middlewares
 * @param {(context: HititipiContext, error: any) => Promise<void>} [onError]
 * @return {HititipiMiddleware}
 */
export function chainAll(middlewares, onError) {
  return async (context) => {
    const chain = middlewares.filter((item) => item !== false);

    let applyMiddleware = chain.shift();

    try {
      while (applyMiddleware != null) {
        await applyMiddleware(context);
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
