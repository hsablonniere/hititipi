import { createReadStream } from 'node:fs';
import { acceptsEncodings } from '../../lib/compression.js';
import { getContentType } from '../../lib/content-type.js';
import { getWeakEtag } from '../../lib/etag.js';
import { getStats, resolveAbsolutePath } from '../../lib/node-fs.js';
import { readableToWebReadableStream } from '../../lib/node-streams.js';
import { updateResponseBody } from '../../lib/response.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 */

const ENCODINGS = {
  br: '.br',
  zstd: '.zst',
  gzip: '.gz',
};

/**
 * @param {string} filepath
 * @return {HititipiMiddleware}
 */
export function sendFile(filepath) {
  const absoluteFilepath = resolveAbsolutePath(filepath);
  return async (context) => {
    const stats = getStats(absoluteFilepath);
    if (stats == null || !stats.isFile()) {
      return;
    }

    context.responseStatus = 200;
    context.responseHeaders.set('content-type', getContentType(absoluteFilepath));

    for (const [encoding, extension] of Object.entries(ENCODINGS)) {
      const compressedStats = getStats(absoluteFilepath + extension);
      if (acceptsEncodings(context, encoding) && compressedStats?.isFile()) {
        context.responseHeaders.set('content-encoding', encoding);
        context.responseHeaders.set('vary', 'accept-encoding');
        const responseBody = readableToWebReadableStream(createReadStream(absoluteFilepath + extension));
        updateResponseBody(context, responseBody, compressedStats.size);
        context.responseModificationDate = compressedStats.mtime;
        context.responseEtag = getWeakEtag(compressedStats.mtime, compressedStats.size);
        return;
      }
    }

    const rangeHeader = context.requestHeaders.get('range');

    // Full response
    if (rangeHeader == null) {
      context.responseHeaders.set('accept-ranges', 'bytes');
      const responseBody = readableToWebReadableStream(createReadStream(absoluteFilepath));
      updateResponseBody(context, responseBody, stats.size);
    }
    // Partial response
    else {
      const { start, end, chunkSize } = parseRange(rangeHeader, stats.size);
      context.responseStatus = 206;
      context.responseHeaders.set('content-range', `bytes ${start}-${end}/${stats.size}`);
      const responseBody = readableToWebReadableStream(createReadStream(absoluteFilepath, { start, end }));
      updateResponseBody(context, responseBody, chunkSize);
    }

    context.responseEtag = getWeakEtag(stats.mtime, stats.size);
    context.responseModificationDate = stats.mtime;
  };
}

/**
 * @param {string} rangeHeader
 * @param {number} size
 * @return {{start: number, end: number, chunkSize: number}}
 */
function parseRange(rangeHeader, size) {
  const [startString, endString] = rangeHeader.replace(/bytes=/, '').split('-', 2);
  const start = Number(startString);
  const end = endString !== '' ? Math.min(Number(endString), size - 1) : size - 1;
  const chunkSize = end - start + 1;
  return { start, end, chunkSize };
}
