import fs from 'fs/promises';
import path from 'path';
import parseRange from 'range-parser';
import { createReadStream } from 'fs';
import { getWeakEtag } from '../lib/etag.js';
import { getContentType } from '../lib/content-type.js';

// try to add context.responseStatus 200
// try to add context.responseHeaders['content-type']
// try to add context.responseBody
// try to add context.responseModificationDate
// try to add context.responseSize
// try to add context.responseEtag
// try to add context.gzipFile
// try to add context.brotliFile
export function staticFile (options = {}) {

  const absoluteRootPath = path.resolve(process.cwd(), options.root);
  const { enableRange } = options;

  return async (context) => {

    if (context.requestMethod !== 'HEAD' && context.requestMethod !== 'GET') {
      return;
    }

    const pathname = context.requestUrl.pathname.endsWith('/')
      ? context.requestUrl.pathname + 'index.html'
      : context.requestUrl.pathname;

    const rangeHeader = enableRange ? context.requestHeaders['range'] : null;

    const filepath = path.join(absoluteRootPath, pathname);
    const rawFile = await getFile(filepath, '', rangeHeader);
    const gzipFile = await getFile(filepath, '.gz');
    const brotliFile = await getFile(filepath, '.br');

    if (rawFile == null) {
      return;
    }

    const responseStatus = (rangeHeader != null) ? 206 : 200;
    const responseHeaders = { ...context.responseHeaders, 'content-type': getContentType(filepath) };
    if (enableRange) {
      responseHeaders['accept-ranges'] = 'bytes';
      if (rawFile.contentRange != null) {
        responseHeaders['content-range'] = rawFile.contentRange;
      }
    }

    return { ...context, responseStatus, responseHeaders, ...rawFile, gzipFile, brotliFile };
  };
}

async function getFileStats (filepath) {
  try {
    const stats = await fs.stat(filepath);
    return stats.isFile() ? stats : null;
  }
  catch (e) {
    return null;
  }
}

async function getFile (filepath, suffix, rangeHeader) {
  const stats = await getFileStats(filepath + suffix);
  if (stats == null) {
    return null;
  }

  // No support for multipart ranges yet
  const range = getFirstRange(stats.size, rangeHeader);
  const responseSize = (range != null)
    ? range.end - range.start + 1
    : stats.size;
  const contentRange = (range != null)
    ? `bytes ${range.start}-${range.end}/${stats.size}`
    : null;

  return {
    responseBody: createReadStream(filepath + suffix, range),
    responseModificationDate: stats.mtime,
    responseSize,
    responseEtag: getWeakEtag(stats, suffix),
    contentRange,
  };
}

function getFirstRange (size, rangeHeader) {
  if (rangeHeader != null) {
    const ranges = parseRange(size, rangeHeader);
    if (Array.isArray(ranges)) {
      return ranges[0];
    }
  }
}
