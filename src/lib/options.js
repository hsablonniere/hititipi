import { CONTENT_ENCODING } from './content-encoding.js';
import { CACHE_CONTROL } from './cache-control.js';
import { ETAG } from './etag.js';
import { LAST_MODIFIED } from './last-modified.js';
import { KEEP_ALIVE } from './keep-alive.js';
import { ACCESS_CONTROL_ALLOW_ORIGIN, ACCESS_CONTROL_MAX_AGE } from './cors.js';

export function extractPathAndOptionsString (pathname) {

  if (!pathname.startsWith('/@')) {
    return { requestPath: pathname, optionsString: '' };
  }

  const [all, optionsString = '', requestPath = '/'] = pathname.match(/^\/(@.+?)(\/.*)?$/) || [];

  return { requestPath, optionsString };
}

export function parseOptionsString (optionsString) {

  if (optionsString == null) {
    return new Map();
  }

  // transform @key-one=val-one@key-two=val-two
  // into [ ['key-one','val-one'], ['key-two','val-two'] ]
  const keyValues = optionsString.split('@')
    .slice(1)
    .map((kv) => kv.split('='));

  return new Map(keyValues);
}

export function serializeOptions (options) {
  const optionsString = [CONTENT_ENCODING, CACHE_CONTROL, ETAG, LAST_MODIFIED, ACCESS_CONTROL_ALLOW_ORIGIN, ACCESS_CONTROL_MAX_AGE, KEEP_ALIVE]
    .map(({ key, defaultValue }) => {
      return { key, defaultValue, value: options.get(key) };
    })
    .filter(({ value }) => value != null)
    .filter(({ key, defaultValue, value }) => value !== defaultValue)
    .map(({ key, value }) => `@${key}=${value}`)
    .join('');
  return optionsString;
}

export function optionsHasValue (options, { key, defaultValue }, value) {
  const optionValuesString = options.get(key) ?? '';
  const optionValues = optionValuesString.split(',');
  return optionValues.includes(value) || value === defaultValue;
}
