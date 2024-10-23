/**
 * @typedef {import('../types/hititipi.types.d.ts').HititipiContext} HititipiContext
 */

/**
 * @param {HititipiContext} context
 * @param {string | ArrayBuffer | ReadableStream} reponseBody
 * @param {number} [responseSize]
 */
export function updateResponseBody(context, reponseBody, responseSize) {
  context.responseBody = reponseBody;
  if (typeof context.responseBody === 'string') {
    context.responseHeaders.setNumber('content-length', Buffer.from(context.responseBody).length);
  } else if (context.responseBody instanceof ArrayBuffer) {
    context.responseHeaders.setNumber('content-length', context.responseBody.byteLength);
  } else if (responseSize != null) {
    context.responseHeaders.setNumber('content-length', responseSize);
  } else {
    context.responseHeaders.delete('content-length');
  }
}
