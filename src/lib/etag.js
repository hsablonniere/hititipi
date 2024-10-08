/**
 * @typedef {import('../types/hititipi.types.js').Etag} Etag
 * @typedef {import('../types/hititipi.types.js').StrongEtag} StrongEtag
 * @typedef {import('../types/hititipi.types.js').WeakEtag} WeakEtag
 */

/**
 * @param {string|null} content
 * @return {Promise<StrongEtag|undefined>}
 */
export async function getStrongEtagHash(content) {
  if (content == null) {
    return;
  }
  const value = await hashWithSha1ToBase64(content);
  return {
    value,
    weak: false,
  };
}

/**
 * @param {Date} modificationDate
 * @param {number} responseSize
 * @return {WeakEtag}
 */
export function getWeakEtag(modificationDate, responseSize) {
  return {
    value: `${modificationDate.getTime().toString(16)}-${responseSize.toString(16)}`,
    weak: true,
  };
}

/**
 * @param {string} content
 * @return {Promise<string>}
 */
async function hashWithSha1ToBase64(content) {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await globalThis.crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashString = String.fromCharCode(...hashArray);
  const base64Hash = globalThis.btoa(hashString);
  return base64Hash;
}

/**
 * @param {Etag|undefined} etag
 * @return {string|undefined}
 */
export function etagToString(etag) {
  if (etag == null) {
    return;
  }
  return etag.weak ? `W/"${etag.value}"` : `"${etag.value}"`;
}
