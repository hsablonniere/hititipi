/**
 * @typedef {import('../types/hititipi.types.d.ts').HititipiContext} HititipiContext
 */

/**
 * @param {HititipiContext} context
 * @return {number | undefined}
 */
export function getContentLength(context) {
  const contentLength = context.responseHeaders.get('content-length');
  if (contentLength != null) {
    return Number(contentLength);
  }
}

/**
 * @param {HititipiContext} context
 * @param {string | ArrayBuffer | ReadableStream} reponseBody
 * @param {number} [responseSize]
 */
export function updateResponseBody(context, reponseBody, responseSize) {
  context.responseBody = reponseBody;
  if (typeof context.responseBody === 'string') {
    context.responseHeaders.set('content-length', String(Buffer.from(context.responseBody).length));
  } else if (context.responseBody instanceof ArrayBuffer) {
    context.responseHeaders.set('content-length', String(context.responseBody.byteLength));
  } else if (responseSize != null) {
    context.responseHeaders.set('content-length', String(responseSize));
  } else {
    context.responseHeaders.delete('content-length');
  }
}
