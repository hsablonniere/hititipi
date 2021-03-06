import { performance } from 'perf_hooks';

export function logRequest (applyMiddleware) {
  return async (context) => {
    const before = performance.now();
    const now = new Date().toISOString();
    const newContext = await applyMiddleware(context);
    const after = performance.now();
    const elapsed = (after - before).toFixed(2) + 'ms';
    console.log(now, newContext.requestMethod, newContext.requestUrl.pathname, newContext.requestUrl.search, newContext.responseStatus, elapsed);
    return newContext;
  };
}
