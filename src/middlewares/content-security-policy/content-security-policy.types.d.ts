export interface ContentSecurityPolicyOptions {
  // Specifies the directives for the Content Security Policy
  directives?: CspDirectives;
  // Specifies the directives for the Content Security Policy in report-only mode
  reportOnlyDirectives?: CspDirectives;
}

export type CspDirectives = {
  // Fetch directives https://www.w3.org/TR/CSP/#directives-fetch
  'child-src'?: CspSourceListGeneric;
  'connect-src'?: CspSourceListGeneric;
  'default-src'?: CspSourceListGeneric;
  'fenced-frame-src'?: CspSourceListGeneric;
  'font-src'?: CspSourceListGeneric;
  'frame-src'?: CspSourceListGeneric;
  'img-src'?: CspSourceListGeneric;
  'manifest-src'?: CspSourceListGeneric;
  'media-src'?: CspSourceListGeneric;
  'object-src'?: CspSourceListGeneric;
  'script-src'?: CspSourceListGeneric;
  'script-src-elem'?: CspSourceListGeneric;
  'script-src-attr'?: CspSourceListGeneric;
  'style-src'?: CspSourceListGeneric;
  'style-src-elem'?: CspSourceListGeneric;
  'style-src-attr'?: CspSourceListGeneric;

  // Other directives https://www.w3.org/TR/CSP/#directives-other
  webrtc?: 'allow' | 'block';
  'worker-src'?: CspSourceListGeneric;

  // Document directives https://www.w3.org/TR/CSP/#directives-document
  'base-uri'?: CspSourceListGeneric;
  sandbox?: true | Array<CspSandboxValue>;

  // Navigation directives https://www.w3.org/TR/CSP/#directives-navigation
  'form-action'?: CspSourceListGeneric;
  'frame-ancestors'?: CspSourceListGeneric;

  // Reporting Directives https://www.w3.org/TR/CSP/#directives-reporting
  // deprecated
  // 'report-uri'?: Array<string>;
  'report-to'?: string;

  // Directives Defined in Other Documents https://www.w3.org/TR/CSP/#directives-elsewhere
  // https://www.w3.org/TR/mixed-content/
  // 'block-all-mixed-content'?: CspSourceListGeneric; // deprecated
  // https://www.w3.org/TR/upgrade-insecure-requests/
  'upgrade-insecure-requests'?: boolean;

  // Trusted type directives https://www.w3.org/TR/trusted-types/#integration-with-content-security-policy
  // Experimental
  'require-trusted-types-for'?: 'script';
  'trusted-types'?: CspTrustedType;
};

type CspSourceListGeneric = 'none' | Array<CspSourceExpression>;

type CspSourceListAncestors = 'none' | Array<CspSourceExpression>;

type CspSourceExpression = CspSourceScheme | CspSourceHost | CspSourceKeyword;

type CspSourceKeyword =
  | 'self'
  | 'strict-dynamic'
  | 'report-sample'
  | 'inline-speculation-rules'
  | 'unsafe-inline'
  | 'unsafe-eval'
  | 'unsafe-hashes'
  | 'wasm-unsafe-eval';

type CspSourceScheme = `${string}:`;

type CspSourceHost = string;

type CspSourceNonce = `nonce-${string}`;

type CspSourceHash = `${'sha256' | 'sha384' | 'sha512'}-${string}`;

type CspSandboxValue =
  | 'allow-downloads'
  | 'allow-forms'
  | 'allow-modals'
  | 'allow-orientation-lock'
  | 'allow-pointer-lock'
  | 'allow-popups'
  | 'allow-popups-to-escape-sandbox'
  | 'allow-presentation'
  | 'allow-same-origin'
  | 'allow-scripts'
  | 'allow-storage-access-by-user-activation'
  | 'allow-top-navigation'
  | 'allow-top-navigation-by-user-activation'
  | 'allow-top-navigation-to-custom-protocols';

type CspTrustedType = 'none' | Array<CspTrustedTypeExpression>;

type CspTrustedTypeExpression = CspTrustedTypePolicyName | CspTrustedTypeKeyword | CspTrustedTypeWildcard;

type CspTrustedTypePolicyName = string;

type CspTrustedTypeKeyword = 'allow-duplicates';

type CspTrustedTypeWildcard = '*';
