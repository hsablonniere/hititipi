export const ONE_YEAR = 60 * 60 * 24 * 365;

export const CACHE_CONTROL = {
  key: 'cc',
  defaultValue: '',
  values: {
    mr: 'must-revalidate',
    nc: 'no-cache',
    ns: 'no-store',
    nt: 'no-transform',
    pu: 'public',
    pv: 'private',
    pr: 'proxy-revalidate',
    maz: `max-age=0`,
    may: `max-age=${ONE_YEAR}`,
    smaz: `s-maxage=0`,
    smay: `s-maxage=${ONE_YEAR}`,
    i: 'immutable',
    swry: `stale-while-revalidate=${ONE_YEAR}`,
    siey: `stale-if-error=${ONE_YEAR}`,
  },
};

export function getCacheControlHeaders (options, mimeType) {

  // Don't cache HTML pages
  // TODO: can we do better than this?
  if (mimeType === 'text/html') {
    return {};
  }

  const params = (options.get(CACHE_CONTROL.key) || '')
    .split(',')
    .map((code) => CACHE_CONTROL.values[code])
    .filter((a) => a != null)
    .join(',');

  return (params != '')
    ? { 'Cache-Control': params }
    : {};
}
