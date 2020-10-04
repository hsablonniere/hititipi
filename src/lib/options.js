export function extractPathAndOptionsString (rawPathname) {

  if (!rawPathname.startsWith('/@')) {
    return { pathname: rawPathname, optionsString: '' };
  }

  const [all, optionsString = '', pathname = '/'] = rawPathname.match(/^\/(@.+?)(\/.*)?$/) || [];

  return { pathname, optionsString };
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
  return Array.from(options.entries())
    .filter(([key, value]) => value !== '' && value != null)
    .map(([key, value]) => `@${key}=${value}`)
    .join('');
}

export function optionsHasValue (options, key, value) {
  const optionValuesString = options.get(key) ?? '';
  const optionValues = optionValuesString.split(',');
  return optionValues.includes(value);
}
