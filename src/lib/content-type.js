import mime from 'mime-types';

/**
 * @param {string} filepath
 * @return {string}
 */
export function getContentType(filepath) {
  const mimeType = mime.lookup(filepath);
  if (mimeType === false) {
    return 'application/octet-stream';
  }
  const contentType = mime.contentType(mimeType);
  if (contentType === false) {
    return 'application/octet-stream';
  }
  // Small exception, see https://github.com/jshttp/mime-db/issues/140
  if (contentType === 'image/vnd.microsoft.icon') {
    return 'image/x-icon';
  }
  return contentType;
}

/**
 * @param {Headers} headers
 * @return {boolean}
 */
export function isHtml(headers) {
  return isExtention(headers, ['html', 'xhtml', 'xml']);
}

/**
 * @param {Headers} headers
 * @return {boolean}
 */
export function isScriptable(headers) {
  return isExtention(headers, ['pdf', 'svg', 'js']);
}

/**
 * @param {Headers} headers
 * @param {string[]} extensions
 * @return {boolean}
 */
function isExtention(headers, extensions) {
  const contentTypeHeader = headers.get('content-type');
  if (contentTypeHeader == null) {
    return false;
  }
  const extension = mime.extension(contentTypeHeader);
  if (extension === false) {
    return false;
  }
  return extensions.includes(extension);
}
