"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redirectNormalizedPath = redirectNormalizedPath;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function redirectNormalizedPath(options = {}) {
  return async context => {
    const normalizedPath = _path.default.normalize(context.requestUrl.pathname);

    if (context.requestUrl.pathname !== normalizedPath) {
      const redirectUrl = new URL(context.requestUrl);
      redirectUrl.pathname = normalizedPath;
      return { ...context,
        responseStatus: 301,
        responseHeaders: { ...context.responseHeaders,
          'location': redirectUrl.toString()
        }
      };
    }
  };
}