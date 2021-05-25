"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexDirs = indexDirs;

var _promises = _interopRequireDefault(require("fs/promises"));

var _fs = require("fs");

var _etag = require("../lib/etag.js");

var _path = _interopRequireDefault(require("path"));

var _stream = require("stream");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function indexDirs(options = {}) {
  const absoluteRootPath = _path.default.resolve(process.cwd(), options.root);

  return async context => {
    const pathname = context.requestUrl.pathname;

    const dirpath = _path.default.join(absoluteRootPath, pathname);

    const stats = await getDirStats(dirpath);

    if (stats == null) {
      return;
    }

    const dirEntries = await _promises.default.readdir(dirpath);
    const detailedDirEntries = await Promise.all(dirEntries.map(async entry => {
      const stats = await _promises.default.stat(_path.default.join(dirpath, entry));
      return {
        name: entry,
        fullpath: _path.default.join(dirpath, entry),
        isDirectory: stats.isDirectory(),
        size: stats.size
      };
    }));
    detailedDirEntries.sort((a, b) => {
      return a.isDirectory === b.isDirectory ? a.name.localeCompare(b.name) : String(b.isDirectory).localeCompare(String(a.isDirectory));
    });
    const responseStatus = 200;
    const renderedPathname = pathname.split('/').map((part, i, all) => {
      return `<a href="${all.slice(0, i + 1).join('/')}/">${part}</a>`;
    }).join('/');
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
${detailedDirEntries.map(entry => `<li><a href="./${entry.name}${entry.isDirectory ? '/' : ''}">
${entry.isDirectory ? '📁' : '📄'}
${entry.name}
${entry.isDirectory ? '' : `(${entry.size})`}
</a></li>`).join('')}
</ul>

</body>
</html>
`.trim();
    const responseHeaders = { ...context.headers,
      'content-type': 'text/html'
    };

    const responseBody = _stream.Readable.from(content);

    const responseSize = content.length;
    const responseEtag = (0, _etag.getStrongEtagHash)(content);
    return { ...context,
      responseStatus,
      responseHeaders,
      responseBody,
      responseSize,
      responseEtag
    };
  };
}

async function getDirStats(dirpath) {
  try {
    const stats = await _promises.default.stat(dirpath);
    return stats.isDirectory() ? stats : null;
  } catch (e) {
    return null;
  }
}

async function getFile(filepath, suffix = '') {
  const stats = await getFileStats(filepath + suffix);

  if (stats == null) {
    return null;
  }

  return {
    responseBody: (0, _fs.createReadStream)(filepath + suffix),
    responseModificationDate: stats.mtime,
    responseSize: stats.size,
    responseEtag: (0, _etag.getWeakEtag)(stats, suffix)
  };
}