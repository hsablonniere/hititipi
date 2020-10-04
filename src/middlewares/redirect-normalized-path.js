import path from 'path';

export function redirectNormalizedPath (options = {}) {

  return async (context) => {
    const normalizedPath = path.normalize(context.requestUrl.pathname);
    if (context.requestUrl.pathname !== normalizedPath) {
      const redirectUrl = new URL(context.requestUrl);
      redirectUrl.pathname = normalizedPath;
      return {
        ...context, responseStatus: 301, responseHeaders: {
          ...context.responseHeaders,
          'location': redirectUrl.toString(),
        },
      };
    }
  };
}
