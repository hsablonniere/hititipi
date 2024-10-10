import { request as requestWithUndici } from 'undici';
import { toStandardHeaders } from '../../hititipi.common.js';
import { readableToWebReadableStream } from '../../lib/node-streams.js';
import { cloneUrl } from '../redirect/redirect.js';

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
    context.responseHeaders = toStandardHeaders(response.headers);
    if (response.body != null) {
      context.responseBody = readableToWebReadableStream(response.body);
    }
  };
}
