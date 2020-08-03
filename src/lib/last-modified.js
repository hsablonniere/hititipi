export const LAST_MODIFIED = {
  key: 'lm',
  defaultValue: '0',
  ENABLED: '1',
};

export function getLastModifiedHeaders (options, stat) {

  switch (options.get(LAST_MODIFIED.key)) {

    case LAST_MODIFIED.ENABLED:
      return { 'Last-Modified': stat.mtime.toUTCString() };

    default:
      return {};
  }
}

export function isNotModified (httpRequest, lastModifiedHeaders) {
  const ifModifiedSince = httpRequest.headers['if-modified-since'];
  const ifModifiedSinceTs = new Date(ifModifiedSince).getTime();
  const lastModifiedTs = new Date(lastModifiedHeaders['Last-Modified']).getTime();
  return (ifModifiedSince != null) && (ifModifiedSinceTs >= lastModifiedTs);
}
