import fs from 'fs/promises';
import mime from 'mime-types';
import path from 'path';
import { createReadStream } from 'fs';
import { getWeakEtag } from '../lib/etag.js';

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

  return async (context) => {

    if (context.requestMethod !== 'HEAD' && context.requestMethod !== 'GET') {
      return;
    }

    const pathname = context.requestUrl.pathname.endsWith('/')
      ? context.requestUrl.pathname + 'index.html'
      : context.requestUrl.pathname;

    const filepath = path.join(absoluteRootPath, pathname);
    const rawFile = await getFile(filepath);
    const gzipFile = await getFile(filepath, '.gz');
    const brotliFile = await getFile(filepath, '.br');

    if (rawFile == null) {
      return;
    }

    const responseStatus = 200;
    const responseHeaders = { ...context.responseHeaders, 'content-type': mime.lookup(filepath) };

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

async function getFile (filepath, suffix = '') {
  const stats = await getFileStats(filepath + suffix);
  if (stats == null) {
    return null;
  }
  return {
    responseBody: createReadStream(filepath + suffix),
    responseModificationDate: stats.mtime,
    responseSize: stats.size,
    responseEtag: getWeakEtag(stats, suffix),
  };
}
