"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xXssProtection = xXssProtection;

var _contentType = require("../lib/content-type.js");

function xXssProtection(options = {}) {
  return async context => {
    const contentTypeHeader = context.responseHeaders['content-type'];

    if (!(0, _contentType.isHtml)(contentTypeHeader)) {
      return;
    }

    const xXssProtectionHeader = [options.enabled ? '1' : '0', options.blockMode ? 'mode=block' : null, options.reportUri ? `report=${options.reportUri}` : null].filter(a => a != null).join(';');
    const responseHeaders = { ...context.responseHeaders,
      'x-xss-protection': xXssProtectionHeader
    };
    return { ...context,
      responseHeaders
    };
  };
}