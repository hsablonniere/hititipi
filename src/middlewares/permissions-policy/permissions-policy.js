import { stringArray } from '../../lib/string-array.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./permissions-policy.types.d.ts').PermissionsPolicyOptions} PermissionsPolicyOptions
 */

/**
 * @param {PermissionsPolicyOptions} options
 * @return {HititipiMiddleware}
 */
export function permissionsPolicy(options) {
  const headerParts = stringArray();
  if (options.features != null) {
    for (const [directive, rawValues] of Object.entries(options.features)) {
      if (rawValues === '*') {
        headerParts.push(`${directive}=*`);
      } else if (Array.isArray(rawValues)) {
        const values = rawValues.map((value) => quoteIfNecessary(value)).join(' ');
        headerParts.push(`${directive}=(${values})`);
      }
    }
  }
  const header = headerParts.join(',');
  return async (context) => {
    if (header !== '') {
      context.responseHeaders.set('permissions-policy', header);
    }
    return context;
  };
}

const PERMISSIONS_POLICY_KEYWORDS = ['self', 'src'];

/**
 * @param {string} value
 * @return {string}
 */
function quoteIfNecessary(value) {
  if (PERMISSIONS_POLICY_KEYWORDS.includes(value)) {
    return value;
  }
  // NOTE: Note sure if and how schemes (ex: http:) must be quoted or not
  return `"${value}"`;
}
