// TODO handle options
export function csp (options = {}) {

  return async (context) => {

    const cspHeader = [
      'default-src \'self\'',
      'script-src \'self\'',
      'script-src-elem \'self\'',
      'script-src-attr \'self\'',
      'style-src \'self\'',
      'style-src-elem \'self\'',
      'style-src-attr \'self\'',
      'img-src \'self\'',
      'font-src \'self\'',
      'connect-src \'self\'',
      'media-src \'self\'',
      'object-src \'self\'',
      'prefetch-src \'self\'',
      'child-src \'self\'',
      'frame-src \'self\'',
      'worker-src \'self\'',
      'frame-ancestors \'self\'',
      'form-action \'self\'',
      'upgrade-insecure-requests',
      'block-all-mixed-content',
      'disown-opener',
      'sandbox',
      'base-uri \'self\'',
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
