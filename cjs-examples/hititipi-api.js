"use strict";

var _http = _interopRequireDefault(require("http"));

var _cacheControl = require("../src/middlewares/cache-control.js");

var _chainAll = require("../src/middlewares/chain-all.js");

var _chainUntilResponse = require("../src/middlewares/chain-until-response.js");

var _contentEncoding = require("../src/middlewares/content-encoding.js");

var _contentLength = require("../src/middlewares/content-length.js");

var _cors = require("../src/middlewares/cors.js");

var _etag = require("../src/lib/etag.js");

var _hititipi = require("../src/hititipi.js");

var _logRequest = require("../src/middlewares/log-request.js");

var _notModified = require("../src/middlewares/not-modified.js");

var _stream = require("stream");

var _serverName = require("../src/middlewares/server-name.js");

var _socketId = require("../src/middlewares/socket-id.js");

var _staticFile = require("../src/middlewares/static-file.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function matchesPath(pathname, middleware) {
  return context => {
    if (context.requestUrl.pathname === pathname) {
      return middleware;
    }
  };
}

function isGet(middleware) {
  return context => {
    if (context.requestMethod === 'GET') {
      return middleware;
    }
  };
}

function isPut(middleware) {
  return context => {
    if (context.requestMethod === 'PUT') {
      return middleware;
    }
  };
}

function json(context, object) {
  const responseStatus = 200;
  const content = JSON.stringify(object);

  const responseBody = _stream.Readable.from(content);

  const responseSize = content.length;
  const responseEtag = (0, _etag.getStrongEtagHash)(content);
  const responseHeaders = { ...context.responseHeaders,
    'content-type': 'application/json'
  };
  return { ...context,
    responseStatus,
    responseHeaders,
    responseBody,
    responseSize,
    responseEtag
  };
}

function sendStatus(responseStatus) {
  return context => {
    return { ...context,
      responseStatus
    };
  };
}

_http.default.createServer((0, _hititipi.hititipi)((0, _logRequest.logRequest)((0, _chainAll.chainAll)([(0, _chainUntilResponse.chainUntilResponse)([matchesPath('/', (0, _staticFile.staticFile)({
  root: 'public/api'
})), matchesPath('/api/foobar', (0, _chainUntilResponse.chainUntilResponse)([(0, _cors.cors)({
  allowOrigin: '*',
  maxAge: 5,
  allowMethods: ['GET', 'PUT'],
  exposeHeaders: ['x-socket-id'],
  allowHeaders: ['x-foo']
}), isGet(context => json(context, {
  foo: 'bar',
  baz: 42,
  head: context.requestHeaders['x-foo']
})), isPut(sendStatus(204)), sendStatus(412), (0, _cacheControl.cacheControl)({
  'public': true,
  'must-revalidate': true,
  'max-age': 0
})]))]), (0, _serverName.serverName)({
  serverName: 'hititipi-json'
}), (0, _socketId.socketId)(), (0, _contentEncoding.contentEncoding)({
  gzip: true,
  brotli: true
}), (0, _contentLength.contentLength)(), (0, _notModified.notModified)({
  etag: true,
  notModified: true
}), context => {
  if (context.responseStatus == null) {
    return { ...context,
      responseStatus: 404
    };
  }
}])))).listen(8080);