import http from 'http';
import { cacheControl } from '../src/middlewares/cache-control.js';
import { chainAll } from '../src/middlewares/chain-all.js';
import { chainUntilResponse } from '../src/middlewares/chain-until-response.js';
import { contentEncoding } from '../src/middlewares/content-encoding.js';
import { contentLength } from '../src/middlewares/content-length.js';
import { hititipi } from '../src/hititipi.js';
import { keepAlive } from '../src/middlewares/keep-alive.js';
import { logRequest } from '../src/middlewares/log-request.js';
import { notModified } from '../src/middlewares/not-modified.js';
import { redirectHttps } from '../src/middlewares/redirect-https.js';
import { redirectNormalizedPath } from '../src/middlewares/redirect-normalized-path.js';
import { referrerPolicy } from '../src/middlewares/referrer-policy.js';
import { serverName } from '../src/middlewares/server-name.js';
import { socketId } from '../src/middlewares/socket-id.js';
import { staticFile } from '../src/middlewares/static-file.js';
import { xFrameOptions } from '../src/middlewares/x-frame-options.js';
import { csp } from '../src/middlewares/csp.js';

http
  .createServer(
    hititipi(
      logRequest(
        chainAll([
          serverName({ serverName: 'hititipi-static' }),
          socketId(),
          keepAlive({ max: 5, timeout: 100 }),
          referrerPolicy('same-origin'),
          xFrameOptions('SAMEORIGIN'),
          csp(),
          chainUntilResponse([
            redirectHttps(),
            redirectNormalizedPath(),
            staticFile({ root: 'public' }),
          ]),
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
