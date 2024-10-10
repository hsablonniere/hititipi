import { toObjectHeaders } from '../src/hititipi.common.js';
import { ONE_DAY_S, ONE_YEAR_S } from '../src/lib/durations.js';
import { cacheControl } from '../src/middlewares/cache-control/cache-control.js';
import { chainAll } from '../src/middlewares/chain-all/chain-all.js';
import { chainUntilResponse } from '../src/middlewares/chain-until-response/chain-until-response.js';
import { compressWithBrotli } from '../src/middlewares/compress-with-brotli/compress-with-brotli.js';
import { compressWithDeflate } from '../src/middlewares/compress-with-deflate/compress-with-deflate.js';
import { compressWithGzip } from '../src/middlewares/compress-with-gzip/compress-with-gzip.js';
import { compressWithZstd } from '../src/middlewares/compress-with-zstd/compress-with-zstd.js';
import { contentLength } from '../src/middlewares/content-length/content-length.js';
import { contentSecurityPolicy } from '../src/middlewares/content-security-policy/content-security-policy.js';
import { contentTypeOptions } from '../src/middlewares/content-type-options/content-type-options.js';
import { cors } from '../src/middlewares/cors/cors.js';
import { frameOptions } from '../src/middlewares/frame-options/frame-options.js';
import { httpStrictTransportSecurity } from '../src/middlewares/http-strict-transport-security/http-strict-transport-security.js';
import { ifBasicAuth } from '../src/middlewares/if-basic-auth/if-basic-auth.js';
import { ifHostname } from '../src/middlewares/if-hostname/if-hostname.js';
import { keepAlive } from '../src/middlewares/keep-alive/keep-alive.js';
import { logRequest } from '../src/middlewares/log-request/log-request.js';
import { notFound } from '../src/middlewares/not-found/not-found.js';
import { notModified } from '../src/middlewares/not-modified/not-modified.js';
import { permissionsPolicy } from '../src/middlewares/permissions-policy/permissions-policy.js';
import { proxy } from '../src/middlewares/proxy/proxy.js';
import { redirect } from '../src/middlewares/redirect/redirect.js';
import { referrerPolicy } from '../src/middlewares/referrer-policy/referrer-policy.js';
import { requestId } from '../src/middlewares/request-id/request-id.js';
import { route } from '../src/middlewares/route/route.js';
import { sendFile } from '../src/middlewares/send-file/send-file.js';
import { sendJson } from '../src/middlewares/send-json/send-json.js';
import { serveDirectoryIndex } from '../src/middlewares/serve-directory-index/serve-directory-index.js';
import { serveStaticFile } from '../src/middlewares/serve-static-file/serve-static-file.js';
import { setCookie } from '../src/middlewares/set-cookie/set-cookie.js';
import { xssProtection } from '../src/middlewares/xss-protection/xss-protection.js';

/**
 * @typedef {import('../src/types/hititipi.types.d.ts').HititipiContext} HititipiContext
 * @typedef {import('../src/types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 */

/**
 * @param {HititipiContext} context
 */
function dumpInResponseMiddleware(context) {
  return sendJson(200, {
    requestId: context.requestId,
    requestMethod: context.requestMethod,
    requestUrl: context.requestUrl,
    requestHeaders: toObjectHeaders(context.requestHeaders),
  })(context);
}

const notFoundMiddleware = notFound();

export const mainMiddleware = chainAll([
  cors({
    allowOrigin: '*',
    maxAge: ONE_DAY_S,
    allowMethods: ['GET', 'POST'],
    exposeHeaders: ['server'],
    allowHeaders: ['x-foo'],
  }),
  setCookie('visit-24h', 'true', { maxAge: ONE_DAY_S, httpOnly: true, secure: true }),
  requestId(),
  cacheControl({ 'max-age': 10 }),
  httpStrictTransportSecurity({ 'max-age': ONE_YEAR_S, includeSubDomains: true }),
  contentSecurityPolicy({
    directives: {
      'default-src': 'none',
      'script-src': ['self', 'unsafe-inline'],
      'style-src': ['self', 'unsafe-inline'],
      'media-src': ['self'],
      'img-src': ['self', 'images.example.com'],
    },
  }),
  permissionsPolicy({
    features: {
      accelerometer: [],
      midi: ['self'],
      usb: ['http://example.com'],
      camera: ['self', 'http://example.com'],
    },
  }),
  referrerPolicy({ policy: 'no-referrer' }),
  xssProtection({ mode: 'block' }),
  frameOptions({ mode: 'DENY' }),
  contentTypeOptions({ noSniff: true }),
  chainUntilResponse([
    ifHostname('github.localhost', proxy({ origin: 'https://github.com' })),
    ifHostname('foo.localhost', async (context) => {
      return sendJson(200, { msg: `Hello from ${context.requestUrl.hostname}` })(context);
    }),
    ifHostname('bar.localhost', async (context) => {
      return sendJson(200, { msg: `Hello from ${context.requestUrl.hostname}` })(context);
    }),
    route('GET', '/test', () => sendFile('./public/test/index.html')),
    route('GET', '/secret', () => {
      return ifBasicAuth('admin', 'admin', sendJson(200, { secret: 'Hello Admin' }));
    }),
    route('GET', '/products/:id', ({ id }) => async (context) => {
      context.responseStatus = 204;
      context.responseHeaders.set('x-id', /** @type {string} */ (id));
    }),
    route('GET', '/books/:title', ({ title }) => async (context) => {
      context.responseStatus = 204;
      context.responseHeaders.set('x-title', /** @type {string} */ (title));
    }),
    route('GET', '/go-home', () => redirect(302, { pathname: '/', search: '', hash: '' })),
    route('GET', '/not-found', () => notFoundMiddleware),
    serveStaticFile({ root: '.' }),
    serveDirectoryIndex({ root: '.' }),
    async (context) => {
      if (context.requestMethod !== 'HEAD' && context.requestMethod !== 'OPTIONS') {
        return dumpInResponseMiddleware(context);
      }
      return notFoundMiddleware(context);
    },
  ]),
  keepAlive({ enabled: true, timeout: 30, maxRequests: 100 }),
  compressWithBrotli({ level: 5 }),
  compressWithZstd({ level: 5 }),
  compressWithGzip({ level: 6 }),
  compressWithDeflate({ level: 6 }),
  contentLength(),
  notModified({ etag: true, lastModified: false }),
  logRequest({
    logFunction: console.log,
    hideTimestamps: true,
  }),
]);
