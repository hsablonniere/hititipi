import crypto from 'crypto';

export function getStrongEtagHash (contentString) {
  const hash = crypto
    .createHash('sha1')
    .update(Buffer.from(contentString))
    .digest('base64');
  return `"${hash}"`;
}

export function getWeakEtag (stats, suffix) {
  return `W/"${stats.mtime.getTime().toString(16)}-${stats.size.toString(16)}${suffix}"`;
}

export function transformEtag (etag, suffix) {
  if (etag == null) {
    return etag;
  }
  return etag
    .replace(/^"/, 'W/"')
    .replace(/"$/, suffix + '"');
}
