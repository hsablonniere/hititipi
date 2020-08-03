import etag from 'etag';

export const ETAG = {
  key: 'et',
  defaultValue: '0',
  ENABLED: '1',
};

export function getEtagHeaders (options, stats) {

  switch (options.get(ETAG.key)) {

    case ETAG.ENABLED:
      return { 'ETag': etag(stats, { weak: true }) };

    default:
      return {};
  }
}
