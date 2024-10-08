import isCompressibleRaw from 'compressible';

/**
 * @typedef {import('../types/hititipi.types.d.ts').HititipiContext} HititipiContext
 * @typedef {import('../types/hititipi.types.d.ts').HititipiContextWithResponse} HititipiContextWithResponse
 */

/**
 * @param {HititipiContext} context
 * @param {string} encoding
 * @return {context is HititipiContextWithResponse}
 */
export function acceptsEncodings(context, encoding) {
  const acceptEncodingHeader = context.requestHeaders.get('accept-encoding');
  if (acceptEncodingHeader != null) {
    const acceptedEncodings = acceptEncodingHeader
      .toLowerCase()
      .split(',')
      .map((encoding) => encoding.trim());
    if (acceptedEncodings.includes(encoding)) {
      return true;
    }
  }
  return false;
}

/**
 * @param {HititipiContext} context
 * @return {context is HititipiContextWithResponse}
 */
export function isCompressible(context) {
  const contentEncoding = context.responseHeaders.get('content-encoding');
  const cacheControl = context.responseHeaders.get('cache-control') ?? '';
  const contentType = context.responseHeaders.get('content-type') ?? '';
  if (
    contentEncoding == null &&
    !cacheControl.includes('no-transform') &&
    isCompressibleRaw(contentType) &&
    context.responseStatus != null &&
    context.responseBody != null
  ) {
    return true;
  }
  return false;
}
