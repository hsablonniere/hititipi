import { Readable } from 'stream';
import { getStrongEtagHash } from './etag.js';

export function sendJson (context, status, object) {
  const responseStatus = status;
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
