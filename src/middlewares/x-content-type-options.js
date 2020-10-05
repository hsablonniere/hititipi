export function xContentTypeOptions (options = {}) {

  return async (context) => {

    if (options.nosniff) {
      const responseHeaders = { ...context.responseHeaders, 'x-content-type-options': 'nosniff' };
      return { ...context, responseHeaders };
    }
  };
}
