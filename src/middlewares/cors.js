export const ONE_DAY = 24 * 60 * 60;

export function cors (options = {}) {

  return async (context) => {

    const responseHeaders = { ...context.responseHeaders };

    if (options.allowOrigin != null) {
      responseHeaders['access-control-allow-origin'] = options.allowOrigin;
    }
    if (options.allowCredentials) {
      responseHeaders['access-control-allow-credentials'] = 'true';
    }

    if (context.requestMethod === 'OPTIONS') {
      if (options.allowHeaders != null) {
        responseHeaders['access-control-allow-headers'] = options.allowHeaders.join(',');
      }
      if (options.allowMethods != null) {
        responseHeaders['access-control-allow-methods'] = options.allowMethods.join(',');
      }
      if (options.maxAge != null) {
        responseHeaders['access-control-max-age'] = options.maxAge;
      }
      return { ...context, responseStatus: 204, responseHeaders, responseBody: null };
    }
    else {
      if (options.exposeHeaders != null) {
        responseHeaders['access-control-expose-headers'] = options.exposeHeaders.join(',');
      }
    }

    return { ...context, responseHeaders };
  };
}
