"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contentLength = contentLength;

function contentLength(options = {}) {
  return async context => {
    if (context.responseSize != null) {
      const responseHeaders = { ...context.responseHeaders,
        'content-length': context.responseSize
      };
      return { ...context,
        responseHeaders
      };
    }
  };
}