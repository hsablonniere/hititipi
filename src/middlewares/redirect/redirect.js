/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('../../types/hititipi.types.d.ts').UrlParts} UrlParts
 */

/**
 * @param {300|301|302|303|304|305|306|307|308} code
 * @param {UrlParts} urlParts
 * @return {HititipiMiddleware}
 */
export function redirect(code, urlParts) {
  return async (context) => {
    context.responseStatus = code;
    context.responseHeaders.set('location', cloneUrl(context.requestUrl, urlParts).toString());
    return context;
  };
}

/**
 * @param {URL} baseUrl
 * @param {UrlParts} urlParts
 * @return {URL}
 */
export function cloneUrl(baseUrl, urlParts) {
  if ('href' in urlParts) {
    return new URL(urlParts.href);
  }

  const url = new URL(baseUrl);

  if ('origin' in urlParts) {
    const originUrl = new URL(urlParts.origin);
    const { protocol, hostname, port } = originUrl;
    url.protocol = protocol;
    url.hostname = hostname;
    url.port = port;
  } else {
    if ('host' in urlParts) {
      url.host = urlParts.host;
    } else {
      if (urlParts.hostname != null) {
        url.hostname = urlParts.hostname;
      }
      if (urlParts.port != null) {
        url.port = urlParts.port;
      }
    }
    if (urlParts.protocol != null) {
      url.protocol = urlParts.protocol;
    }
  }

  if (urlParts.pathname != null) {
    url.pathname = urlParts.pathname;
  }
  if (urlParts.search != null) {
    url.search = urlParts.search;
  }
  if (urlParts.hash != null) {
    url.hash = urlParts.hash;
  }

  return url;
}
