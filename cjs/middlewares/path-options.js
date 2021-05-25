"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pathOptions = pathOptions;

var _options = require("../lib/options.js");

function pathOptions(options = {}) {
  return async context => {
    const {
      pathname,
      optionsString
    } = (0, _options.extractPathAndOptionsString)(context.requestUrl.pathname);
    const requestUrl = new URL(context.requestUrl.toString());
    requestUrl.pathname = pathname;
    const pathOptions = (0, _options.parseOptionsString)(optionsString);
    return { ...context,
      requestUrl,
      pathOptions
    };
  };
}