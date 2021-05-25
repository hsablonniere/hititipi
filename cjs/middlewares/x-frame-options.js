"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xFrameOptions = xFrameOptions;
const DIRECTIVES = ['DENY', 'SAMEORIGIN'];

function xFrameOptions(directive) {
  return async context => {
    if (DIRECTIVES.includes(directive)) {
      const responseHeaders = { ...context.responseHeaders,
        'x-frame-options': directive
      };
      return { ...context,
        responseHeaders
      };
    }
  };
}