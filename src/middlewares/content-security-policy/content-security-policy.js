import { stringArray } from '../../lib/string-array.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./content-security-policy.types.d.ts').ContentSecurityPolicyOptions} ContentSecurityPolicyOptions
 * @typedef {import('./content-security-policy.types.d.ts').CspDirectives} CspDirectives
 */

/**
 * @param {ContentSecurityPolicyOptions} options
 * @return {HititipiMiddleware}
 */
export function contentSecurityPolicy(options) {
  const header = extractCspHeader(options.directives);
  const reportOnlyheader = extractCspHeader(options.reportOnlyDirectives);
  return async (context) => {
    if (header !== '') {
      context.responseHeaders.set('content-security-policy', header);
    }
    if (reportOnlyheader !== '') {
      context.responseHeaders.set('content-security-policy-report-only', reportOnlyheader);
    }
    return context;
  };
}

/**
 * @param {CspDirectives|undefined} directives
 * @return {string}
 */
function extractCspHeader(directives) {
  if (directives == null) {
    return '';
  }
  const headerParts = stringArray();
  for (const [directive, rawValues] of Object.entries(directives)) {
    if (rawValues === true) {
      headerParts.push(directive);
    } else if (typeof rawValues === 'string') {
      const value = quoteIfNecessary(rawValues);
      headerParts.push(`${directive} ${value}`);
    } else if (Array.isArray(rawValues) && rawValues.length > 0) {
      const values = rawValues.map((v) => quoteIfNecessary(v)).join(' ');
      headerParts.push(`${directive} ${values}`);
    }
  }
  return headerParts.join(';');
}

const CSP_KEYWORDS = [
  // none
  'none',
  // CspSourceKeyword
  'self',
  'strict-dynamic',
  'report-sample',
  'inline-speculation-rules',
  'unsafe-inline',
  'unsafe-eval',
  'unsafe-hashes',
  'wasm-unsafe-eval',
  // webrtc
  'allow',
  'block',
  // CspSandboxValue
  'allow-downloads',
  'allow-forms',
  'allow-modals',
  'allow-orientation-lock',
  'allow-pointer-lock',
  'allow-popups',
  'allow-popups-to-escape-sandbox',
  'allow-presentation',
  'allow-same-origin',
  'allow-scripts',
  'allow-storage-access-by-user-activation',
  'allow-top-navigation',
  'allow-top-navigation-by-user-activation',
  'allow-top-navigation-to-custom-protocols',
  // CspTrustedTypeKeyword
  'allow-duplicates',
];

const CSP_HASH_REGEX = /^sha(256|384|512)-/;

const CSP_NONCE_REGEX = /^nonce-/;

/**
 * @param {string} value
 * @return {string}
 */
function quoteIfNecessary(value) {
  if (CSP_KEYWORDS.includes(value)) {
    return `'${value}'`;
  }
  if (value.match(CSP_HASH_REGEX) != null) {
    return `'${value}'`;
  }
  if (value.match(CSP_NONCE_REGEX) != null) {
    return `'${value}'`;
  }
  return value;
}
