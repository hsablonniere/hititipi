// TODO handle options
export function csp (options = {}) {

  return async (context) => {

    const cspHeader = [
      'default-src \'self\'',
      'script-src \'self\'',
      'style-src \'self\'',
      'img-src \'self\'',
      'font-src \'self\'',
      'connect-src \'self\'',
      'media-src \'self\'',
      'object-src \'none\'',
      'prefetch-src \'self\'',
      'child-src \'self\'',
      'frame-src \'self\'',
      'worker-src \'self\'',
      'frame-ancestors \'none\'',
      'form-action \'self\'',
      'upgrade-insecure-requests',
      'block-all-mixed-content',
      'disown-opener',
      'sandbox',
      'base-uri \'none\'',
      'manifest-src \'self\'',
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
