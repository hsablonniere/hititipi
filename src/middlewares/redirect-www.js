export function redirectWww (options = {}) {

  // TODO improve this to skip other subdomains
  // TODO ignore localhost maybe
  // TODO ignore ip maybe
  return async (context) => {
    if (!context.requestUrl.hostname.startsWith('www.')) {
      const redirectUrl = new URL(context.requestUrl);
      redirectUrl.hostname = 'www.' + context.requestUrl.hostname;
      return {
        ...context, responseStatus: 301, responseHeaders: {
          ...context.responseHeaders,
          'location': redirectUrl.toString(),
        },
      };
    }
  };
}
