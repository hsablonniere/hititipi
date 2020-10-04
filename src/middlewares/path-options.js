import { extractPathAndOptionsString, parseOptionsString } from '../lib/options.js';

export function pathOptions (options = {}) {
  return async (context) => {
    const { pathname, optionsString } = extractPathAndOptionsString(context.requestUrl.pathname);
    const requestUrl = new URL(context.requestUrl.toString());
    requestUrl.pathname = pathname;
    const pathOptions = parseOptionsString(optionsString);
    return { ...context, requestUrl, pathOptions };
  };
}
