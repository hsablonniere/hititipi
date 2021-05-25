"use strict";

var _http = _interopRequireDefault(require("http"));

var _cacheControl = require("../src/middlewares/cache-control.js");

var _chainAll = require("../src/middlewares/chain-all.js");

var _contentEncoding = require("../src/middlewares/content-encoding.js");

var _contentLength = require("../src/middlewares/content-length.js");

var _hititipi = require("../src/hititipi.js");

var _keepAlive = require("../src/middlewares/keep-alive.js");

var _logRequest = require("../src/middlewares/log-request.js");

var _notModified = require("../src/middlewares/not-modified.js");

var _optionsDashboard = require("../src/middlewares/options-dashboard.js");

var _pathOptions = require("../src/middlewares/path-options.js");

var _serverName = require("../src/middlewares/server-name.js");

var _socketId = require("../src/middlewares/socket-id.js");

var _staticFile = require("../src/middlewares/static-file.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_http.default.createServer((0, _hititipi.hititipi)((0, _logRequest.logRequest)((0, _chainAll.chainAll)([(0, _pathOptions.pathOptions)(), (0, _optionsDashboard.optionsDashboard)(), (0, _serverName.serverName)({
  serverName: 'hititipi-dynamic'
}), (0, _socketId.socketId)(), context => (0, _keepAlive.keepAlive)({
  max: context.pathOptions.get('kam'),
  timeout: context.pathOptions.get('kat')
}), (0, _staticFile.staticFile)({
  root: 'public'
}), context => {
  const cc = (context.pathOptions.get('cc') || '').split(',');
  return (0, _cacheControl.cacheControl)({
    'public': cc.includes('pu'),
    'private': cc.includes('pv'),
    'no-cache': cc.includes('nc'),
    'no-store': cc.includes('ns'),
    'must-revalidate': cc.includes('mr'),
    'proxy-revalidate': cc.includes('pr'),
    'immutable': cc.includes('i'),
    'no-transform': cc.includes('nt'),
    'max-age': cc.includes('may') ? _cacheControl.ONE_YEAR : cc.includes('maz') ? 0 : null,
    's-maxage': cc.includes('smay') ? _cacheControl.ONE_YEAR : cc.includes('smaz') ? 0 : null,
    'stale-while-revalidate': cc.includes('swry') ? _cacheControl.ONE_YEAR : null,
    'stale-if-error': cc.includes('siey') ? _cacheControl.ONE_YEAR : null
  });
}, context => (0, _contentEncoding.contentEncoding)({
  gzip: context.pathOptions.get('ce') === 'gz',
  brotli: context.pathOptions.get('ce') === 'br'
}), context => context.pathOptions.get('cl') === '1' ? _contentLength.contentLength : null, context => (0, _notModified.notModified)({
  etag: context.pathOptions.get('et') === '1',
  lastModified: context.pathOptions.get('lm') === '1'
})])))).listen(8080);