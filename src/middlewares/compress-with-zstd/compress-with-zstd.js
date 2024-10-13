import { compress as compressZstd, init as initZstd } from '@bokuweb/zstd-wasm';
import { acceptsEncodings, isCompressible } from '../../lib/compression.js';
import { readableStreamToArrayBuffer, toArrayBuffer } from '../../lib/response-body.js';
import { updateResponseBody } from '../../lib/response.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./compress-with-zstd.types.d.ts').CompressWithZstdOptions} CompressWithZstdOptions
 */

const CONTENT_ENCODING = 'zstd';
const initZstdOnce = runOnce(initZstd);

/**
 * @param {CompressWithZstdOptions} options
 * @return {HititipiMiddleware}
 */
export function compressWithZstd(options) {
  return async (context) => {
    if (!isCompressible(context) || !acceptsEncodings(context, CONTENT_ENCODING)) {
      return;
    }

    context.responseHeaders.set('content-encoding', CONTENT_ENCODING);
    context.responseHeaders.set('vary', 'accept-encoding');

    await initZstdOnce();

    const rawData =
      context.responseBody instanceof ReadableStream
        ? await readableStreamToArrayBuffer(context.responseBody)
        : toArrayBuffer(context.responseBody);

    // TODO not sure why we need to go through a buffer
    const responseBody = compressZstdArrayBuffer(rawData, options.level);

    updateResponseBody(context, responseBody);

    if (context.responseEtag != null) {
      context.responseEtag.value += '.' + CONTENT_ENCODING;
      context.responseEtag.weak = true;
    }
  };
}

/**
 * @param {() => Promise<void>} callback
 * @return {() => Promise<void>}
 */
function runOnce(callback) {
  let initialized = false;
  return async () => {
    if (!initialized) {
      await callback();
      initialized = true;
    }
  };
}

/**
 * @param {ArrayBuffer} rawData
 * @param {number} level
 * @return {ArrayBuffer}
 */
function compressZstdArrayBuffer(rawData, level) {
  // @ts-ignore The types are wronte, this function expects a Buffer, not an ArrayBuffer
  return compressZstd(Buffer.from(rawData), level);
}
