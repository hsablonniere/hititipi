import isCompressible from 'compressible';
import zlib, { createBrotliCompress, createGzip } from 'zlib';
import { PassThrough } from 'stream';

export const CONTENT_ENCODING = {
  key: 'ce',
  defaultValue: '0',
  GZIP: 'gz',
  BROTLI: 'br',
};

export function getContentEncoding (options, mimeType) {
  const RAW = {
    headers: {},
    transform: new PassThrough(),
  };

  // Don't compress if mime type is not compressible
  if (!isCompressible(mimeType)) {
    return RAW;
  }

  switch (options.get(CONTENT_ENCODING.key)) {

    case CONTENT_ENCODING.GZIP:
      return {
        headers: { 'Content-Encoding': 'gzip' },
        transform: createGzip({
          // level: zlib.constants.Z_NO_COMPRESSION,
          // level: zlib.constants.Z_BEST_SPEED,
          // level: zlib.constants.Z_BEST_COMPRESSION,
          level: zlib.constants.Z_defaultValue_COMPRESSION,
          // strategy: zlib.constants.Z_FILTERED,
          // strategy: zlib.constants.Z_HUFFMAN_ONLY,
          // strategy: zlib.constants.Z_RLE,
          // strategy: zlib.constants.Z_FIXED,
          strategy: zlib.constants.Z_defaultValue_STRATEGY,
        }),
      };

    case CONTENT_ENCODING.BROTLI:
      return {
        headers: { 'Content-Encoding': 'br' },
        transform: createBrotliCompress({
          params: {
            // [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MIN_QUALITY,
            // [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
            // [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_DEFAULT_QUALITY,
            [zlib.constants.BROTLI_PARAM_QUALITY]: 5,
          },
        }),
      };

    default:
      return RAW;
  }
}
