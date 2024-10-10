/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./referrer-policy.types.d.ts').ReferrerPolicyOptions} ReferrerPolicyOptions
 */

const REFERRER_POLICIES = [
  'no-referrer',
  'no-referrer-when-downgrade',
  'origin',
  'origin-when-cross-origin',
  'same-origin',
  'strict-origin',
  'strict-origin-when-cross-origin',
  'unsafe-url',
];

/**
 * @param {ReferrerPolicyOptions} options
 * @return {HititipiMiddleware}
 */
export function referrerPolicy(options) {
  const header = options.policy != null && REFERRER_POLICIES.includes(options.policy) ? options.policy : null;
  return async (context) => {
    if (header != null) {
      context.responseHeaders.set('referrer-policy', header);
    }
  };
}
