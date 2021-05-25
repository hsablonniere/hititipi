"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xContentTypeOptions = xContentTypeOptions;

function xContentTypeOptions(options = {}) {
  return async context => {
    if (options.nosniff) {
      const responseHeaders = { ...context.responseHeaders,
        'x-content-type-options': 'nosniff'
      };
      return { ...context,
        responseHeaders
      };
    }
  };
}