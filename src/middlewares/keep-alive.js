export function keepAlive (options = {}) {

  const { timeout, max } = options;

  return async (context) => {

    const responseHeaders = { ...context.responseHeaders };

    if (timeout != null || max != null) {
      const timeoutStr = (timeout != null) ? `timeout=${timeout}` : null;
      const maxStr = (max != null) ? `max=${max}` : null;
      const keepAliveString = [timeoutStr, maxStr]
        .filter((a) => a != null)
        .join(',');
      responseHeaders['keep-alive'] = keepAliveString;
      responseHeaders['connection'] = 'Keep-Alive';
    }
    else {
      responseHeaders['connection'] = 'close';
    }

    return { ...context, responseHeaders };
  };
}
