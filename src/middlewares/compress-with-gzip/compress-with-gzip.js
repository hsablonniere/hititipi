import zlib from 'node:zlib';
import { acceptsEncodings, isCompressible } from '../../lib/compression.js';
import { duplexToWebTransformStream } from '../../lib/node-streams.js';
import { toReadableStream } from '../../lib/response-body.js';
import { updateResponseBody } from '../../lib/response.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./compress-with-gzip.types.d.ts').CompressWithGzipOptions} CompressWithGzipOptions
 */

const CONTENT_ENCODING = 'gzip';

/**
 * @param {CompressWithGzipOptions} options
 * @return {HititipiMiddleware}
 */
export function compressWithGzip(options) {
  return async (context) => {
    if (!isCompressible(context) || !acceptsEncodings(context, CONTENT_ENCODING)) {
      return;
    }

    context.responseHeaders.set('content-encoding', CONTENT_ENCODING);
    context.responseHeaders.set('vary', 'accept-encoding');

    const responseBody = toReadableStream(context.responseBody).pipeThrough(
      duplexToWebTransformStream(
        zlib.createGzip({
          level: options.level,
        }),
      ),
    );

    context.responseHeaders.delete('accept-ranges');
    updateResponseBody(context, responseBody);

    if (context.responseEtag != null) {
      context.responseEtag.value += '.' + CONTENT_ENCODING;
      context.responseEtag.weak = true;
    }
  };
}
