# http-strict-transport-security middleware

The `http-strict-transport-security` middleware TODO.

## Import

```js
import { httpStrictTransportSecurity } from 'hititipi/middlewares/http-strict-transport-security/http-strict-transport-security.js';
```

## Examples

TODO

## Options

The options object can contain the following properties:

```ts
export interface HttpStrictTransportSecurityOptions {
  // Specifies the time, in seconds, that the browser should remember that a site is only to be accessed using HTTPS
  'max-age'?: string | number;
  // If true, this rule applies to all of the site's subdomains as well
  includeSubDomains?: boolean;
  // If true, the site will be included in browsers' preload lists
  preload?: boolean;
}
```

## Links

- [Strict-Transport-Security header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)
- [Strict-Transport-Security header in RFC 9110](https://httpwg.org/specs/rfc9110.html#field.strict-transport-security)
