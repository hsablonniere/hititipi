import zlib from 'node:zlib';
import { acceptsEncodings, isCompressible } from '../../lib/compression.js';
import { duplexToWebTransformStream } from '../../lib/node-streams.js';
import { toReadableStream } from '../../lib/response-body.js';
import { getContentLength, updateResponseBody } from '../../lib/response.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./compress-with-brotli.types.d.ts').CompressWithBrotliOptions} CompressWithBrotliOptions
 */

const CONTENT_ENCODING = 'br';

/**
 * @param {CompressWithBrotliOptions} options
 * @return {HititipiMiddleware}
 */
export function compressWithBrotli(options) {
  return async (context) => {
    if (!isCompressible(context) || !acceptsEncodings(context, CONTENT_ENCODING)) {
      return;
    }

    context.responseHeaders.set('content-encoding', CONTENT_ENCODING);
    context.responseHeaders.set('vary', 'accept-encoding');

    const responseSize = getContentLength(context);

    const responseBody = toReadableStream(context.responseBody).pipeThrough(
      duplexToWebTransformStream(
        zlib.createBrotliCompress({
          params: {
            [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
            [zlib.constants.BROTLI_PARAM_QUALITY]: options.level,
            [zlib.constants.BROTLI_PARAM_SIZE_HINT]: responseSize ?? false,
          },
        }),
      ),
    );

    updateResponseBody(context, responseBody);

    if (context.responseEtag != null) {
      context.responseEtag.value += '.' + CONTENT_ENCODING;
      context.responseEtag.weak = true;
    }
  };
}
