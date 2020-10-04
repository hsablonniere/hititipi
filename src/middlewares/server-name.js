export function serverName (options = {}) {
  const { serverName = 'hititipi' } = options;
  return async (context) => {
    const responseHeaders = { ...context.responseHeaders, 'server': serverName };
    return { ...context, responseHeaders };
  };
}
