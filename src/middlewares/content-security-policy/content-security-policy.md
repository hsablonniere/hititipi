# content-security-policy middleware

The `content-security-policy` middleware TODO.

## Import

```js
import { contentSecurityPolicy } from 'hititipi/middlewares/content-security-policy/content-security-policy.js';
```

## Examples

TODO

## Options

The options object can contain the following properties:

```ts
export interface ContentSecurityPolicyOptions {
  // Specifies the directives and their configuration for the Content Security Policy
  directives?: CspDirectives;
  // Specifies the directives and their configuration for the Content Security Policy (in report-only mode)
  reportOnlyDirectives?: CspDirectives;
}
```

For more details, please refer to the different directives:

- [Fetch directives](https://www.w3.org/TR/CSP/#directives-fetch)
- [Other directives](https://www.w3.org/TR/CSP/#directives-other)
- [Document directives](https://www.w3.org/TR/CSP/#directives-document)
- [Navigation directives](https://www.w3.org/TR/CSP/#directives-navigation)
- [Reporting Directives](https://www.w3.org/TR/CSP/#directives-reporting)
- [Directives Defined in Other Documents](https://www.w3.org/TR/CSP/#directives-elsewhere)
  - [Mixed Content](https://www.w3.org/TR/mixed-content/)
  - [Upgrade Insecure Requests](https://www.w3.org/TR/upgrade-insecure-requests/)
- [Trusted type directives](https://www.w3.org/TR/trusted-types/#integration-with-content-security-policy)

## Links

- [Content Security Policy (CSP) on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Content Security Policy Level 3 on W3C spec](https://www.w3.org/TR/CSP3/)
