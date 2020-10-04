export function xXssProtection (options = {}) {

  return async (context) => {

    const xXssProtectionHeader = [
      options.enabled ? '1' : '0',
      options.blockMode ? 'mode=block' : null,
      options.reportUri ? `report=${options.reportUri}` : null,
    ]
      .filter((a) => a != null)
      .join(';');

    const responseHeaders = { ...context.responseHeaders, 'x-xss-protection': xXssProtectionHeader };
    return { ...context, responseHeaders };
  };
}
