// https://tools.ietf.org/html/rfc2616
// https://tools.ietf.org/html/rfc7232
// https://tools.ietf.org/html/rfc7234

export function notModified (options = {}) {

  return async (context) => {

    const isHeadGet = (context.requestMethod === 'HEAD' || context.requestMethod === 'GET');
    const is200 = (context.responseStatus === 200);

    let responseStatus = context.responseStatus;
    let responseBody = context.responseBody;
    const responseHeaders = { ...context.responseHeaders };

    const shouldSetEtag = options.etag && (context.responseEtag != null) && isHeadGet && is200;
    const isEtagNotModified = shouldSetEtag && checkEtagNotModified(context);
    if (shouldSetEtag) {
      responseHeaders['etag'] = context.responseEtag;
    }

    const shouldSetLastModified = options.lastModified && (context.responseModificationDate != null) && isHeadGet && is200;
    const isLastModifiedRecentEnough = shouldSetLastModified && checkLastModifiedNotModified(context);
    if (shouldSetLastModified) {
      responseHeaders['last-modified'] = context.responseModificationDate.toGMTString();
    }

    const isNotModified = (isEtagNotModified && isLastModifiedRecentEnough)
      || (isEtagNotModified && !shouldSetLastModified)
      || (!shouldSetEtag && isLastModifiedRecentEnough);

    if (isNotModified) {
      responseStatus = 304;
      delete responseHeaders['content-type'];
      delete responseHeaders['content-length'];
      delete responseHeaders['content-encoding'];
      // TODO test this and check this is accurate
      delete responseHeaders['access-control-allow-origin'];
      delete responseHeaders['access-control-allow-methods'];
      // TODO test this
      if (responseHeaders['vary'] === 'accept-encoding') {
        delete responseHeaders['vary'];
      }
      if (shouldSetEtag && isEtagNotModified) {
        delete responseHeaders['last-modified'];
      }
    }

    return { ...context, responseStatus, responseHeaders };
  };
}

function checkEtagNotModified (context) {
  const etag = context.responseEtag;
  const ifNoneMatch = context.requestHeaders['if-none-match'];
  return (ifNoneMatch != null) && (ifNoneMatch === etag);
}

function checkLastModifiedNotModified (context) {
  const lastModified = context.responseModificationDate.toGMTString();
  const lastModifiedTs = new Date(lastModified).getTime();
  const ifModifiedSince = context.requestHeaders['if-modified-since'];
  const ifModifiedSinceTs = new Date(ifModifiedSince).getTime();
  return (ifModifiedSince != null) && (ifModifiedSinceTs >= lastModifiedTs);
}
