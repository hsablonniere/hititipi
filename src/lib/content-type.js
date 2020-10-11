import mime from 'mime-types';

export function getContentType (filepath) {
  const mimeType = mime.lookup(filepath);
  const contentType = mime.contentType(mimeType);
  // Small exception, see https://github.com/jshttp/mime-db/issues/140
  return (contentType === 'image/vnd.microsoft.icon')
    ? 'image/x-icon'
    : contentType;
}

export function isHtml (contentTypeHeader) {
  const extension = mime.extension(contentTypeHeader);
  return ['html', 'xhtml', 'xml'].includes(extension);
}

export function isScriptable (contentTypeHeader) {
  const extension = mime.extension(contentTypeHeader);
  return ['pdf', 'svg', 'js'].includes(extension);
}
