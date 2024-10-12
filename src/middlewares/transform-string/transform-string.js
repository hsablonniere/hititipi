import { getStrongEtagHash } from '../../lib/etag.js';
import { toString } from '../../lib/response-body.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 */

/**
 * @param {(string: string) => Promise<string>} transformResponseBody
 * @return {HititipiMiddleware}
 */
export function transformString(transformResponseBody) {
  return async (context) => {
    if (context.responseBody != null) {
      const responseBodyText = await toString(context.responseBody);
      context.responseBody = await transformResponseBody(responseBodyText);
      context.responseSize = Buffer.from(responseBodyText).length;
      context.responseEtag = await getStrongEtagHash(responseBodyText);
    }
  };
}
