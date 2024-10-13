import { getStrongEtagHash } from '../../lib/etag.js';
import { toString } from '../../lib/response-body.js';
import { updateResponseBody } from '../../lib/response.js';

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
      const responseBody = await transformResponseBody(responseBodyText);
      updateResponseBody(context, responseBody);
      context.responseEtag = await getStrongEtagHash(responseBodyText);
    }
  };
}
