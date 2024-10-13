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

    const responseBody = readableToWebReadableStream(createReadStream(absoluteFilepath));
    updateResponseBody(context, responseBody, stats.size);
    context.responseModificationDate = stats.mtime;
    context.responseEtag = getWeakEtag(stats.mtime, stats.size);
  };
}
