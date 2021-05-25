"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contentEncoding = contentEncoding;

var _compressible = _interopRequireDefault(require("compressible"));

var _zlib = _interopRequireWildcard(require("zlib"));

var _etag = require("../lib/etag.js");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO add test without etag
function contentEncoding(options = {}) {
  return async context => {
    if (context.responseBody == null || !(0, _compressible.default)(context.responseHeaders['content-type'])) {
      return;
    } // Very naïve way to do this #sorry


    const acceptedEncodings = (context.requestHeaders['accept-encoding'] || '').toLowerCase().split(',').map(encoding => encoding.trim());

    if (options.brotli && acceptedEncodings.includes('br')) {
      const responseHeaders = { ...context.responseHeaders,
        'content-encoding': 'br',
        'vary': 'accept-encoding'
      };

      if (context.brotliFile != null) {
        return { ...context,
          responseHeaders,
          ...context.brotliFile
        };
      } else {
        const responseTransformers = [...context.responseTransformers, (0, _zlib.createBrotliCompress)({
          params: {
            [_zlib.default.constants.BROTLI_PARAM_MODE]: _zlib.default.constants.BROTLI_MODE_TEXT,
            [_zlib.default.constants.BROTLI_PARAM_QUALITY]: 5,
            [_zlib.default.constants.BROTLI_PARAM_SIZE_HINT]: context.responseSize
          }
        })]; // Don't try to compute reponseSize post compression, can be done with another middleware

        const responseSize = null; // Don't try to compute new strong etag

        const responseEtag = (0, _etag.transformEtag)(context.responseEtag, '.br');
        return { ...context,
          responseHeaders,
          responseTransformers,
          responseSize,
          responseEtag
        };
      }
    }

    if (options.gzip && acceptedEncodings.includes('gzip')) {
      const responseHeaders = { ...context.responseHeaders,
        'content-encoding': 'gzip',
        'vary': 'accept-encoding'
      };

      if (context.gzipFile != null) {
        return { ...context,
          responseHeaders,
          ...context.gzipFile
        };
      } else {
        const responseTransformers = [...context.responseTransformers, (0, _zlib.createGzip)({
          level: 6
        })]; // Don't try to compute reponseSize post compression, can be done with another middleware

        const responseSize = null; // Don't try to compute new strong etag

        const responseEtag = (0, _etag.transformEtag)(context.responseEtag, '.gz');
        return { ...context,
          responseHeaders,
          responseTransformers,
          responseSize,
          responseEtag
        };
      }
    }
  };
}