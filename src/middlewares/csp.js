import { isHtml, isScriptable } from '../lib/content-type.js';

// TODO handle options
export function csp (options = {}) {

  return async (context) => {

    const contentTypeHeader = context.responseHeaders['content-type'];
    if (!isHtml(contentTypeHeader) && !isScriptable(contentTypeHeader)) {
      return;
    }

    const cspHeader = [
      `default-src 'none'`,
      `style-src 'self' 'unsafe-inline'`,
      `img-src 'self'`,
      `media-src 'self'`,
      `frame-ancestors 'none'`,
      `base-uri 'none'`,
      'upgrade-insecure-requests',
      'block-all-mixed-content',
      // Not sure about those vv
      'disown-opener',
      'plugin-types',
    ]
      .filter((a) => a != null)
      .join(';');

    if (cspHeader !== '') {
      const responseHeaders = { ...context.responseHeaders, 'content-security-policy': cspHeader };
      return { ...context, responseHeaders };
    }
  };
}
