import { parse, serialize } from 'cookie-es';

/**
 * @typedef {import('./cookie.types.d.ts').CookieOptions} CookieOptions
 * @typedef {import('./cookie.types.d.ts').CookieNamePrefix} CookieNamePrefix
 */

/**
 * @param {string} name
 * @param {string} value
 * @param {CookieOptions} cookieOptions
 */
export function getSetCookieHeader(name, value, cookieOptions) {
  const prefixedName = getPrefixedName(name, cookieOptions.usePrefix);
  const setCookieHeader = serialize(prefixedName, value, cookieOptions);
  return setCookieHeader;
}

/**
 * @param {Headers} headers
 * @param {string} name
 * @param {CookieNamePrefix} [usePrefix]
 * @return {string|null}
 */
export function getCookieValue(headers, name, usePrefix) {
  const cookieHeader = headers.get('cookie');
  if (cookieHeader == null) {
    return null;
  }
  const cookieList = parse(cookieHeader);
  const prefixedName = getPrefixedName(name, usePrefix);
  return cookieList[prefixedName] ?? null;
}

/**
 *
 * @param {string} name
 * @param {CookieNamePrefix} usePrefix
 * @return {string}
 */
function getPrefixedName(name, usePrefix) {
  if (usePrefix === 'host') {
    return `__Host-${name}`;
  }
  if (usePrefix === 'secure') {
    return `__Secure-${name}`;
  }
  return name;
}
