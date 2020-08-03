import { getCacheControlHeaders } from './cache-control.js';
import { getContentEncoding } from './content-encoding.js';
import { getEtagHeaders } from './etag.js';
import { getLastModifiedHeaders, isNotModified } from './last-modified.js';
import { pipeline as pipelineCb } from 'stream';
import { promisify } from 'util';
import mime from 'mime-types';
import { getKeepAliveHeaders } from './keep-alive.js';
import { getServerHeaders } from './server-headers.js';
import { getCorsHeaders } from './cors.js';

// Specific to rollup output
mime.types['js_commonjs-proxy'] = mime.types['js'];
mime.types['json_commonjs-proxy'] = mime.types['js'];

const pipeline = promisify(pipelineCb);

export function replaceUrl (request) {
  const protocolPrefix = (request.headers['x-forwarded-proto'] === 'https')
    ? 'https://'
    : 'http://';
  request.url = new URL(request.url, protocolPrefix + request.headers.host);
}

export function serveFile (httpRequest, httpResponse, file, options) {

  const etagHeaders = getEtagHeaders(options, file.stats);
  const lastModifiedHeaders = getLastModifiedHeaders(options, file.stats);

  const ifNoneMatch = httpRequest.headers['if-none-match'];
  if (ifNoneMatch != null) {
    if (ifNoneMatch === etagHeaders.ETag) {
      return serve304(httpResponse);
    }
  }
  else {
    if (isNotModified(httpRequest, lastModifiedHeaders)) {
      return serve304(httpResponse);
    }
  }

  const keepAliveHeaders = getKeepAliveHeaders(options);
  const contentEncoding = getContentEncoding(options, file.mimeType);
  const cacheControlHeaders = getCacheControlHeaders(options, file.mimeType);
  const corsHeaders = getCorsHeaders(options);
  const serverHeaders = getServerHeaders(options, httpRequest);

  httpResponse.writeHead(200, {
    'Content-Type': mime.contentType(file.mimeType),
    ...contentEncoding.headers,
    ...cacheControlHeaders,
    ...etagHeaders,
    ...lastModifiedHeaders,
    ...keepAliveHeaders,
    ...corsHeaders,
    ...serverHeaders,
  });

  if (httpRequest.methode === 'HEAD') {
    return httpResponse.end();
  }

  if (file.compressed) {
    return pipeline(file.stream, httpResponse);
  }
  else {
    return pipeline(file.stream, contentEncoding.transform, httpResponse);
  }
}

export function serve301 (httpResponse, location) {
  httpResponse.writeHead(301, {
    'Location': location,
  });
  httpResponse.end();
}

export function serve302 (httpResponse, location) {
  httpResponse.writeHead(302, {
    'Location': location,
  });
  httpResponse.end();
}

function serve304 (httpResponse) {
  httpResponse.writeHead(304);
  httpResponse.end();
}

export function serve404 (httpResponse) {
  httpResponse.writeHead(404, {
    'Content-Type': 'text/plain',
  });
  httpResponse.write('Not Found');
  httpResponse.end();
}

export function serve405 (httpResponse) {
  httpResponse.writeHead(405, { 'Content-Length': '0' });
  httpResponse.end();
}

export function catchErrors (requestHandler) {
  return (httpRequest, httpResponse) => {
    requestHandler(httpRequest, httpResponse).catch((e) => {
      console.error(e);
      serve500(httpResponse);
    });
  };
}

export function serve500 (httpResponse) {
  httpResponse.writeHead(500, {
    'Content-Type': 'text/plain',
  });
  httpResponse.write('Internal Server Error');
  httpResponse.end();
}
