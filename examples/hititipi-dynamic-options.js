import http from 'http';
import { cacheControl, ONE_YEAR } from '../src/middlewares/cache-control.js';
import { chainAll } from '../src/middlewares/chain-all.js';
import { contentEncoding } from '../src/middlewares/content-encoding.js';
import { contentLength } from '../src/middlewares/content-length.js';
import { hititipi } from '../src/hititipi.js';
import { keepAlive } from '../src/middlewares/keep-alive.js';
import { logRequest } from '../src/middlewares/log-request.js';
import { notModified } from '../src/middlewares/not-modified.js';
import { optionsDashboard } from '../src/middlewares/options-dashboard.js';
import { pathOptions } from '../src/middlewares/path-options.js';
import { serverName } from '../src/middlewares/server-name.js';
import { socketId } from '../src/middlewares/socket-id.js';
import { staticFile } from '../src/middlewares/static-file.js';

http
  .createServer(
    hititipi(
      logRequest(
        chainAll([
          pathOptions(),
          optionsDashboard(),
          serverName({ serverName: 'hititipi-dynamic' }),
          socketId(),
          (context) => keepAlive({
            max: context.pathOptions.get('kam'),
            timeout: context.pathOptions.get('kat'),
          }),
          staticFile({ root: 'public' }),
          (context) => {
            const cc = (context.pathOptions.get('cc') || '').split(',');
            return cacheControl({
              'public': cc.includes('pu'),
              'private': cc.includes('pv'),
              'no-cache': cc.includes('nc'),
              'no-store': cc.includes('ns'),
              'must-revalidate': cc.includes('mr'),
              'proxy-revalidate': cc.includes('pr'),
              'immutable': cc.includes('i'),
              'no-transform': cc.includes('nt'),
              'max-age': cc.includes('may') ? ONE_YEAR : cc.includes('maz') ? 0 : null,
              's-maxage': cc.includes('smay') ? ONE_YEAR : cc.includes('smaz') ? 0 : null,
              'stale-while-revalidate': cc.includes('swry') ? ONE_YEAR : null,
              'stale-if-error': cc.includes('siey') ? ONE_YEAR : null,
            });
          },
          (context) => contentEncoding({
            gzip: context.pathOptions.get('ce') === 'gz',
            brotli: context.pathOptions.get('ce') === 'br',
          }),
          (context) => context.pathOptions.get('cl') === '1' ? contentLength : null,
          (context) => notModified({
            etag: context.pathOptions.get('et') === '1',
            lastModified: context.pathOptions.get('lm') === '1',
          }),
        ]),
      ),
    ),
  )
  .listen(8080);
