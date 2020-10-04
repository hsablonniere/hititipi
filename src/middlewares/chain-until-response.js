export function chainUntilResponse (middlewareChain = []) {

  return async (context) => {

    let contextTmp = context;
    const chain = [...middlewareChain];
    let applyMiddleware = chain.shift();

    while (applyMiddleware != null) {
      const result = await applyMiddleware(contextTmp);
      if (typeof result === 'function') {
        applyMiddleware = result;
      }
      else {
        if (result != null) {
          contextTmp = result;
          if (contextTmp.responseBody != null || contextTmp.responseStatus === 204 || contextTmp.responseStatus === 301 || contextTmp.responseStatus === 302 || contextTmp.responseStatus === 304) {
            return contextTmp;
          }
        }
        applyMiddleware = chain.shift();
      }
    }
    return contextTmp;
  };
}
