import { request as requestWithUndici } from 'undici';
import { readableToWebReadableStream } from '../../lib/node-streams.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('../../types/hititipi.types.d.ts').UrlParts} UrlParts
 */

/**
 * @param {string} targetOrigin
 * @return {HititipiMiddleware}
 */
export function proxy(targetOrigin) {
  return async (context) => {
    const targetUrl = `${targetOrigin}${context.requestPathname}${context.requestSearchParams.toString()}`;

    const hostHeader = context.requestHeaders.get('host');
    const requestHeaders = context.requestHeaders.getObject();
    delete requestHeaders['host'];

    const response = await requestWithUndici(targetUrl, {
      // @ts-ignore
      method: context.requestMethod,
      headers: requestHeaders,
    });

    if (hostHeader != null) {
      requestHeaders['host'] = hostHeader;
    }

    context.responseStatus = response.statusCode;
    // Not sure that there's a way undici can produce a response header with an undefined value so let's ignore it
    context.responseHeaders.reset(/** @type {Record<string, string|Array<string>>} */ (response.headers));

    if (response.body != null) {
      context.responseBody = readableToWebReadableStream(response.body);
    }
  };
}
