export function chainAll (middlewareChain, onError) {

  return async (context) => {

    let contextTmp = context;
    const chain = [...middlewareChain];
    let applyMiddleware = chain.shift();

    try {
      while (applyMiddleware != null) {
        const result = await applyMiddleware(contextTmp);
        if (typeof result === 'function') {
          applyMiddleware = result;
        }
        else {
          if (result != null) {
            contextTmp = result;
          }
          applyMiddleware = chain.shift();
        }
      }
    }
    catch (err) {
      if (onError == null) {
        throw err;
      }
      contextTmp = (await onError(contextTmp, err)) || contextTmp;
    }

    return contextTmp;
  };
}
