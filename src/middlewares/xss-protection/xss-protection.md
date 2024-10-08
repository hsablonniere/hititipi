# xss-protection middleware

The `xss-protection` middleware TODO.

## Import

```js
import { xssProtection } from 'hititipi/middlewares/xss-protection/xss-protection.js';
```

## Examples

TODO

## Options

The options object can contain the following properties:

```ts
export interface XssProtectionOptions {
  // Specifies how to configure the `X-XSS-Protection` response header
  mode?: 'filter' | 'block';
}
```

## Links

- [X-XSS-Protection header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection)
