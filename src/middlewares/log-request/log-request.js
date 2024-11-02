/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./log-request.types.d.ts').LogRequestOptions} LogRequestOptions
 */

/**
 * @param {LogRequestOptions} options
 * @return {HititipiMiddleware}
 */
export function logRequest(options) {
  return async (context) => {
    const params = [
      options.hideTimestamps ? null : new Date(context.requestTimestamp).toISOString(),
      `[${context.requestId}]`,
      context.requestMethod,
      context.requestPathname,
      context.requestSearchParams.toString(),
      context.responseStatus ?? 501,
      `${Date.now() - context.requestTimestamp}ms`,
    ].filter((a) => a != null);
    options.logFunction(...params);
  };
}
