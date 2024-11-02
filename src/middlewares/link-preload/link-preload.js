/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./link-preload.types.d.ts').LinkPreloadOptions} LinkPreloadOptions
 * @typedef {import('./link-preload.types.d.ts').PreloadResourceConfig} PreloadResourceConfig
 */

/**
 * @param {LinkPreloadOptions} options
 * @return {HititipiMiddleware}
 */
export function linkPreload(options) {
  /** @type {Record<string, Array<string>>} */
  const linkHeaderPartsByResource = {};
  Object.entries(options.manifest.resources).forEach(([resourcePath, resourceConfigs]) => {
    linkHeaderPartsByResource[resourcePath] = resourceConfigs.map((config) => getLinkHeader(config));
  });

  return async (context) => {
    const pathname = context.requestPathname.endsWith('/')
      ? context.requestPathname + 'index.html'
      : context.requestPathname;
    const linkHeaderParts = linkHeaderPartsByResource[pathname];
    if (linkHeaderParts == null) {
      return;
    }
    if (options.earlyHints === 'always' || (options.earlyHints === 'http2-only' && context.requestHttpVersion === 2)) {
      context.writeEarlyHints({ link: linkHeaderParts }).then(() => null);
    }
    context.responseHeaders.set('link', linkHeaderParts.join(', '));
  };
}

/**
 * @param {PreloadResourceConfig} config
 * @return {string}
 */
function getLinkHeader(config) {
  const attributes = Object.entries(config)
    .filter(([name]) => name !== 'href' && name !== 'rel')
    .map(([name, value]) => {
      return `${name}=${value}`;
    })
    .join('; ');
  const rel = config.rel ?? 'preload';
  return `<${config.href}>; rel=${rel}; ${attributes}`;
}
