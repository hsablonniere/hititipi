/**
 * @typedef {import('./types/hititipi.types.d.ts').HeadersAsObject} HeadersAsObject
 * @typedef {import('./types/hititipi.types.d.ts').HititipiContext} HititipiContext
 * @typedef {import('./types/hititipi.types.d.ts').RequestHeaders} RequestHeaders
 * @typedef {import('./types/hititipi.types.d.ts').ResponseHeaders} ResponseHeaders
 * @typedef {import('./types/hititipi.types.d.ts').HititipiContextWithResponse} HititipiContextWithResponse
 */

/**
 * @param {HeadersAsObject} objectHeaders
 * @return {Headers}
 */
export function toStandardHeaders(objectHeaders) {
  const headersInit = /** @type {HeadersInit} */ (objectHeaders);
  return new Headers(headersInit);
}

/**
 * @param {Headers} headers
 * @return {HeadersAsObject}
 */
export function toObjectHeaders(headers) {
  return Object.fromEntries(headers.entries());
}

/**
 * @param {string|null|undefined} rawRemoteAddress
 * @param {RequestHeaders} headers
 * @return {Array<string>}
 */
export function getRequestIps(rawRemoteAddress, headers) {
  const xForwaredForHeader = headers.get('x-forwarded-for');
  if (typeof xForwaredForHeader === 'string') {
    return xForwaredForHeader.split(',').map((address) => address.trim());
  }

  if (rawRemoteAddress != null) {
    // Remove leading ::ffff: IPv4 subnet prefix
    return [rawRemoteAddress.replace(/^::ffff:/, '')];
  }

  return [];
}

/**
 * @param {RequestHeaders} headers
 * @param {boolean} encrypted
 * @return {'http'|'https'}
 */
export function getProtocol(headers, encrypted) {
  if (headers.get('x-forwarded-proto') === 'https' || headers.get('x-forwarded-protocol') === 'https' || encrypted) {
    return 'https';
  }
  return 'http';
}

const EMPTY_BODY_STATUSES = [204, 205, 304];

/**
 * @param {HititipiContext} context
 * @return {context is HititipiContextWithResponse}
 */
export function hasResponseBody(context) {
  if (
    context.responseBody != null &&
    context.responseStatus != null &&
    !EMPTY_BODY_STATUSES.includes(context.responseStatus)
  ) {
    return true;
  }
  return false;
}
