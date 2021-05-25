"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hsts = hsts;
exports.ONE_YEAR = void 0;
const ONE_YEAR = 365 * 24 * 60 * 60;
exports.ONE_YEAR = ONE_YEAR;

function hsts(options = {}) {
  return async context => {
    const hstsHeader = [options.maxAge != null ? `max-age=${options.maxAge}` : null, options.includeSubDomains ? 'includeSubDomains' : null, options.preload ? 'preload' : null].filter(a => a != null).join(';');

    if (hstsHeader !== '') {
      const responseHeaders = { ...context.responseHeaders,
        'strict-transport-security': hstsHeader
      };
      return { ...context,
        responseHeaders
      };
    }
  };
}