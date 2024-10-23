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

const BASE62_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

/**
 * @param {number} [size]
 * @return {string}
 */
export function getRandomId(size = 10) {
  const randomBytes = globalThis.crypto.getRandomValues(new Uint8Array(size));
  return Array.from(randomBytes)
    .map((byte) => {
      const randomIndex = byte % BASE62_CHARS.length;
      return BASE62_CHARS[randomIndex];
    })
    .join('');
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
 * @param {string} partialUrl
 * @param {RequestHeaders} headers
 * @return {URL}
 */
export function getRequestUrl(partialUrl, headers) {
  const protocol = headers.get('x-forwarded-proto') ?? headers.get('x-forwarded-protocol') ?? 'http';
  const hostname = /** @type {string} */ (headers.get('host'));
  if (partialUrl.startsWith('http://') || partialUrl.startsWith('https://')) {
    const url = new URL(partialUrl);
    url.protocol = protocol;
    return url;
  }
  return new URL(partialUrl, `${protocol}://${hostname}`);
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
