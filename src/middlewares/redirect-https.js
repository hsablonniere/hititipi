export function redirectHttps (options = {}) {

  // TODO not for https
  return async (context) => {
    if (context.requestUrl.protocol === 'http:') {
      const redirectUrl = new URL(context.requestUrl);
      redirectUrl.protocol = 'https:';
      return {
        ...context, responseStatus: 301, responseHeaders: {
          ...context.responseHeaders,
          'location': redirectUrl.toString(),
        },
      };
    }
  };
}
