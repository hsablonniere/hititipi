# referrer-policy middleware

The `referrer-policy` middleware TODO.

## Import

```js
import { referrerPolicy } from 'hititipi/middlewares/referrer-policy/referrer-policy.js';
```

## Examples

TODO

## Options

The options object can contain the following properties:

```ts
export interface ReferrerPolicyOptions {
  // Specifies the referrer policy to be used
  policy?:
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url';
}
```

## Links

- [Referrer-Policy header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)
- [Referrer Policy on W3C spec](https://www.w3.org/TR/referrer-policy/)
