const http = require('http');
const { cacheControl } = require('../cjs/middlewares/cache-control.js');
const { chainAll } = require('../cjs/middlewares/chain-all.js');
const { contentEncoding } = require('../cjs/middlewares/content-encoding.js');
const { contentLength } = require('../cjs/middlewares/content-length.js');
const { hititipi } = require('../cjs/hititipi.js');
const { keepAlive } = require('../cjs/middlewares/keep-alive.js');
const { logRequest } = require('../cjs/middlewares/log-request.js');
const { notModified } = require('../cjs/middlewares/not-modified.js');
const { referrerPolicy } = require('../cjs/middlewares/referrer-policy.js');
const { serverName } = require('../cjs/middlewares/server-name.js');
const { socketId } = require('../cjs/middlewares/socket-id.js');
const { staticFile } = require('../cjs/middlewares/static-file.js');

function ifProduction (middleware) {
  return () => {
    if (process.env.NODE_ENV === 'production') {
      return middleware;
    }
  };
}

http
  .createServer(
    hititipi(
      logRequest(
        chainAll([
          serverName({ serverName: 'hititipi-static' }),
          socketId(),
          keepAlive({ max: 5, timeout: 100 }),
          referrerPolicy('same-origin'),
          staticFile({ root: 'public' }),
          (context) => {
            return context.responseHeaders['content-type'] === 'text/html'
              ? cacheControl({ 'public': true, 'must-revalidate': true, 'max-age': 0 })
              : cacheControl({ 'public': true, 'max-age': 10 });
          },
          contentEncoding({ gzip: true, brotli: true }),
          contentLength(),
          notModified({ etag: true, lastModified: true }),
          (context) => {
            if (context.responseStatus == null) {
              return { ...context, responseStatus: 404 };
            }
          },
        ]),
      ),
    ),
  )
  .listen(8080);
