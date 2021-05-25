"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logRequest = logRequest;

var _perf_hooks = require("perf_hooks");

function logRequest(applyMiddleware) {
  return async context => {
    const before = _perf_hooks.performance.now();

    const now = new Date().toISOString();
    const newContext = await applyMiddleware(context);

    const after = _perf_hooks.performance.now();

    const elapsed = (after - before).toFixed(2) + 'ms';
    console.log(now, newContext.requestMethod, newContext.requestUrl.pathname, newContext.requestUrl.search, newContext.responseStatus, elapsed);
    return newContext;
  };
}