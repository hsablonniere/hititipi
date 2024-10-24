import { etagToString } from '../../lib/etag.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiContext} HititipiContext
 * @typedef {import('../../types/hititipi.types.d.ts').HeaderName} HeaderName
 * @typedef {import('./not-modified.types.d.ts').NotModifiedOptions} NotModifiedOptions
 */

/**
 * @param {NotModifiedOptions} options
 * @return {HititipiMiddleware}
 */
export function notModified(options) {
  return async (context) => {
    if ((context.requestMethod !== 'HEAD' && context.requestMethod !== 'GET') || context.responseStatus !== 200) {
      return;
    }

    const responseEtag = etagToString(context.responseEtag);
    if (options.etag && responseEtag != null) {
      context.responseHeaders.set('etag', responseEtag);
    }

    if (options.lastModified && context.responseModificationDate != null) {
      context.responseHeaders.setDate('last-modified', context.responseModificationDate);
    }

    if (options.etag) {
      const ifNoneMatch = context.requestHeaders.get('if-none-match');
      if (ifNoneMatch != null) {
        const etagMatches = ifNoneMatch
          .split(',')
          .map((etag) => etag.trim())
          .some((etag) => etag === responseEtag);
        if (etagMatches) {
          return notModifiedResponse(context);
        }
      }
    }

    if (options.lastModified && context.responseModificationDate != null) {
      const ifModifiedSince = context.requestHeaders.getDate('if-modified-since');
      if (ifModifiedSince != null && isBeforeRelax(context.responseModificationDate, ifModifiedSince)) {
        return notModifiedResponse(context);
      }
    }
  };
}

/** @type {Array<HeaderName>} */
const IMPORTANT_NOT_MODIFIED_HEADERS = [
  // https://www.rfc-editor.org/rfc/rfc9110#status.304
  'cache-control',
  'content-location',
  'date',
  'etag',
  'expires',
  'vary',
];

/** @type {Array<HeaderName>} */
const IMPORTANT_NOT_MODIFIED_HEADERS_WITH_LAST_MODIFIED = [...IMPORTANT_NOT_MODIFIED_HEADERS, 'last-modified'];

/**
 * @param {HititipiContext} context
 */
function notModifiedResponse(context) {
  context.responseStatus = 304;
  const hasEtag = context.responseHeaders.has('etag');
  if (hasEtag) {
    context.responseHeaders.deleteAllExcept(IMPORTANT_NOT_MODIFIED_HEADERS);
  } else {
    context.responseHeaders.deleteAllExcept(IMPORTANT_NOT_MODIFIED_HEADERS_WITH_LAST_MODIFIED);
  }
}

/**
 * @param {Date} date
 * @param {Date} referenceDate
 * @return {boolean}
 */
function isBeforeRelax(date, referenceDate) {
  const timestamp = Math.floor(date.getTime() / 1000);
  const referenceTimestamp = Math.floor(referenceDate.getTime() / 1000);
  return timestamp <= referenceTimestamp;
}
