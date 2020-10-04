import fs from 'fs/promises';
import { createReadStream } from 'fs';
import { getStrongEtagHash, getWeakEtag } from '../lib/etag.js';
import path from 'path';
import { Readable } from 'stream';

export function indexDirs (options = {}) {

  const absoluteRootPath = path.resolve(process.cwd(), options.root);

  return async (context) => {

    const pathname = context.requestUrl.pathname;
    const dirpath = path.join(absoluteRootPath, pathname);
    const stats = await getDirStats(dirpath);

    if (stats == null) {
      return;
    }

    const dirEntries = await fs.readdir(dirpath);
    const detailedDirEntries = await Promise.all(dirEntries.map(async (entry) => {
      const stats = await fs.stat(path.join(dirpath, entry));
      return {
        name: entry,
        fullpath: path.join(dirpath, entry),
        isDirectory: stats.isDirectory(),
        size: stats.size,
      };
    }));

    detailedDirEntries.sort((a, b) => {
      return (a.isDirectory === b.isDirectory)
        ? a.name.localeCompare(b.name)
        : String(b.isDirectory).localeCompare(String(a.isDirectory));
    });

    const responseStatus = 200;

    const renderedPathname = pathname
      .split('/')
      .map((part, i, all) => {
        return `<a href="${all.slice(0, i + 1).join('/')}/">${part}</a>`;
      })
      .join('/');

    const content = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>hititipi</title>
  <style>
    body {
      font-family: monospace;
    }  
  </style>
</head>
<body>
<h1><a href="/">📂</a> ${renderedPathname}</h1>
<ul>
${detailedDirEntries.map((entry) => `<li><a href="./${entry.name}${entry.isDirectory ? '/' : ''}">
${entry.isDirectory ? '📁' : '📄'}
${entry.name}
${entry.isDirectory ? '' : `(${entry.size})`}
</a></li>`).join('')}
</ul>

</body>
</html>
`.trim();

    const responseHeaders = {
      ...context.headers,
      'content-type': 'text/html',
    };
    const responseBody = Readable.from(content);
    const responseSize = content.length;
    const responseEtag = getStrongEtagHash(content);

    return { ...context, responseStatus, responseHeaders, responseBody, responseSize, responseEtag };
  };
}

async function getDirStats (dirpath) {
  try {
    const stats = await fs.stat(dirpath);
    return stats.isDirectory() ? stats : null;
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
