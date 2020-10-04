import http from 'http';
import { cacheControl } from '../src/middlewares/cache-control.js';
import { chainAll } from '../src/middlewares/chain-all.js';
import { chainUntilResponse } from '../src/middlewares/chain-until-response.js';
import { contentEncoding } from '../src/middlewares/content-encoding.js';
import { contentLength } from '../src/middlewares/content-length.js';
import { cors } from '../src/middlewares/cors.js';
import { getStrongEtagHash } from '../src/lib/etag.js';
import { hititipi } from '../src/hititipi.js';
import { logRequest } from '../src/middlewares/log-request.js';
import { notModified } from '../src/middlewares/not-modified.js';
import { Readable } from 'stream';
import { serverName } from '../src/middlewares/server-name.js';
import { socketId } from '../src/middlewares/socket-id.js';
import { staticFile } from '../src/middlewares/static-file.js';

function matchesPath (pathname, middleware) {
  return (context) => {
    if (context.requestUrl.pathname === pathname) {
      return middleware;
    }
  };
}

function isGet (middleware) {
  return (context) => {
    if (context.requestMethod === 'GET') {
      return middleware;
    }
  };
}

function isPut (middleware) {
  return (context) => {
    if (context.requestMethod === 'PUT') {
      return middleware;
    }
  };
}

function json (context, object) {
  const responseStatus = 200;
  const content = JSON.stringify(object);
  const responseBody = Readable.from(content);
  const responseSize = content.length;
  const responseEtag = getStrongEtagHash(content);
  const responseHeaders = {
    ...context.responseHeaders,
    'content-type': 'application/json',
  };
  return { ...context, responseStatus, responseHeaders, responseBody, responseSize, responseEtag };
}

function sendStatus (responseStatus) {
  return (context) => {
    return { ...context, responseStatus };
  };
}

http
  .createServer(
    hititipi(
      logRequest(
        chainAll([
          chainUntilResponse([
            matchesPath('/', staticFile({ root: 'public/api' })),
            matchesPath('/api/foobar', chainUntilResponse([
              cors({
                allowOrigin: '*',
                maxAge: 5,
                allowMethods: ['GET', 'PUT'],
                exposeHeaders: ['x-socket-id'],
                allowHeaders: ['x-foo'],
              }),
              isGet((context) => json(context, { foo: 'bar', baz: 42, head: context.requestHeaders['x-foo'] })),
              isPut(sendStatus(204)),
              sendStatus(412),
              cacheControl({ 'public': true, 'must-revalidate': true, 'max-age': 0 }),
            ])),
          ]),
          serverName({ serverName: 'hititipi-json' }),
          socketId(),
          contentEncoding({ gzip: true, brotli: true }),
          contentLength(),
          notModified({ etag: true, notModified: true }),
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
