export const ONE_YEAR = 365 * 24 * 60 * 60;

export function hsts (options = {}) {

  return async (context) => {

    const hstsHeader = [
      (options.maxAge != null) ? `max-age=${options.maxAge}` : null,
      options.includeSubDomains ? 'includeSubDomains' : null,
      options.preload ? 'preload' : null,
    ]
      .filter((a) => a != null)
      .join(';');

    if (hstsHeader !== '') {
      const responseHeaders = { ...context.responseHeaders, 'strict-transport-security': hstsHeader };
      return { ...context, responseHeaders };
    }
  };
}
