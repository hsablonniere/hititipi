"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.staticFile = staticFile;

var _promises = _interopRequireDefault(require("fs/promises"));

var _path = _interopRequireDefault(require("path"));

var _rangeParser = _interopRequireDefault(require("range-parser"));

var _fs = require("fs");

var _etag = require("../lib/etag.js");

var _contentType = require("../lib/content-type.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// try to add context.responseStatus 200
// try to add context.responseHeaders['content-type']
// try to add context.responseBody
// try to add context.responseModificationDate
// try to add context.responseSize
// try to add context.responseEtag
// try to add context.gzipFile
// try to add context.brotliFile
function staticFile(options = {}) {
  const absoluteRootPath = _path.default.resolve(process.cwd(), options.root);

  const {
    enableRange
  } = options;
  return async context => {
    if (context.requestMethod !== 'HEAD' && context.requestMethod !== 'GET') {
      return;
    }

    const pathname = context.requestUrl.pathname.endsWith('/') ? context.requestUrl.pathname + 'index.html' : context.requestUrl.pathname;
    const rangeHeader = enableRange ? context.requestHeaders['range'] : null;

    const filepath = _path.default.join(absoluteRootPath, pathname);

    const rawFile = await getFile(filepath, '', rangeHeader);
    const gzipFile = await getFile(filepath, '.gz');
    const brotliFile = await getFile(filepath, '.br');
    autoCloseStreams(rawFile, gzipFile, brotliFile);

    if (rawFile == null) {
      return;
    }

    const responseStatus = rangeHeader != null ? 206 : 200;
    const responseHeaders = { ...context.responseHeaders,
      'content-type': (0, _contentType.getContentType)(filepath)
    };

    if (enableRange) {
      responseHeaders['accept-ranges'] = 'bytes';

      if (rawFile.contentRange != null) {
        responseHeaders['content-range'] = rawFile.contentRange;
      }
    }

    return { ...context,
      responseStatus,
      responseHeaders,
      ...rawFile,
      gzipFile,
      brotliFile
    };
  };
}

async function getFileStats(filepath) {
  try {
    const stats = await _promises.default.stat(filepath);
    return stats.isFile() ? stats : null;
  } catch (e) {
    return null;
  }
}

async function getFile(filepath, suffix, rangeHeader) {
  const stats = await getFileStats(filepath + suffix);

  if (stats == null) {
    return null;
  } // No support for multipart ranges yet


  const range = getFirstRange(stats.size, rangeHeader);
  const responseSize = range != null ? range.end - range.start + 1 : stats.size;
  const contentRange = range != null ? `bytes ${range.start}-${range.end}/${stats.size}` : null;
  return {
    responseBody: (0, _fs.createReadStream)(filepath + suffix, range),
    responseModificationDate: stats.mtime,
    responseSize,
    responseEtag: (0, _etag.getWeakEtag)(stats, suffix),
    contentRange
  };
}

function autoCloseStreams(...files) {
  const allStreams = files.filter(file => file != null).map(file => file.responseBody);
  allStreams.forEach(stream => {
    stream.on('close', () => {
      allStreams.forEach(s => s.close());
    });
  });
}

function getFirstRange(size, rangeHeader) {
  if (rangeHeader != null) {
    const ranges = (0, _rangeParser.default)(size, rangeHeader);

    if (Array.isArray(ranges)) {
      return ranges[0];
    }
  }
}