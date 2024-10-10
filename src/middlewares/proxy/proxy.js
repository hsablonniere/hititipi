import { request as requestWithUndici } from 'undici';
import { readableToWebReadableStream } from '../../lib/node-streams.js';
import { cloneUrl } from '../redirect/redirect.js'; /**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('../../types/hititipi.types.d.ts').UrlParts} UrlParts
 */

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('../../types/hititipi.types.d.ts').UrlParts} UrlParts
 */

/**
 * @param {UrlParts} urlParts
 * @return {HititipiMiddleware}
 */
export function proxy(urlParts) {
  return async (context) => {
    const targetUrl = cloneUrl(context.requestUrl, urlParts);

    const hostHeader = context.requestHeaders.get('host');
    context.requestHeaders.delete('host');

    const response = await requestWithUndici(targetUrl, {
      // @ts-ignore
      method: context.requestMethod,
      headers: context.requestHeaders,
    });

    if (hostHeader != null) {
      context.requestHeaders.set('host', hostHeader);
    }

    context.responseStatus = response.statusCode;
    Array.from(context.responseHeaders.keys()).forEach((name) => {
      context.responseHeaders.delete(name);
    });
    for (const name in response.headers) {
      const value = response.headers[name];
      if (typeof value === 'string') {
        context.responseHeaders.set(name, value);
      } else if (Array.isArray(value)) {
        for (const valueItem of value) {
          context.responseHeaders.append(name, valueItem);
        }
      }
    }
    if (response.body != null) {
      context.responseBody = readableToWebReadableStream(response.body);
    }
  };
}
