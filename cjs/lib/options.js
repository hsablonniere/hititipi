"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractPathAndOptionsString = extractPathAndOptionsString;
exports.parseOptionsString = parseOptionsString;
exports.serializeOptions = serializeOptions;
exports.optionsHasValue = optionsHasValue;

function extractPathAndOptionsString(rawPathname) {
  if (!rawPathname.startsWith('/@')) {
    return {
      pathname: rawPathname,
      optionsString: ''
    };
  }

  const [all, optionsString = '', pathname = '/'] = rawPathname.match(/^\/(@.+?)(\/.*)?$/) || [];
  return {
    pathname,
    optionsString
  };
}

function parseOptionsString(optionsString) {
  if (optionsString == null) {
    return new Map();
  } // transform @key-one=val-one@key-two=val-two
  // into [ ['key-one','val-one'], ['key-two','val-two'] ]


  const keyValues = optionsString.split('@').slice(1).map(kv => kv.split('='));
  return new Map(keyValues);
}

function serializeOptions(options) {
  return Array.from(options.entries()).filter(([key, value]) => value !== '' && value != null).map(([key, value]) => `@${key}=${value}`).join('');
}

function optionsHasValue(options, key, value) {
  const optionValuesString = options.get(key) ?? '';
  const optionValues = optionValuesString.split(',');
  return optionValues.includes(value);
}