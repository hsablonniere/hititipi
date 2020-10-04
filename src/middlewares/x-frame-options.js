const DIRECTIVES = [  'DENY',  'SAMEORIGIN',];

export function xFrameOptions (directive) {

  return async (context) => {

    if (DIRECTIVES.includes(directive)) {
      const responseHeaders = { ...context.responseHeaders, 'x-frame-options': directive };
      return { ...context, responseHeaders };
    }
  };
}
