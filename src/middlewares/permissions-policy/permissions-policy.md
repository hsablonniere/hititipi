# permissions-policy middleware

The `permissions-policy` middleware TODO.

## Import

```js
import { permissionsPolicy } from 'hititipi/middlewares/permissions-policy/permissions-policy.js';
```

## Examples

TODO

## Options

The options object can contain the following properties:

```ts
export interface PermissionsPolicyOptions {
  features?: {
    // ...
  };
}
```

For more details, please refer to the different features:

- [Standardized Features](https://github.com/w3c/webappsec-permissions-policy/blob/main/features.md#standardized-features)
- [Proposed Features](https://github.com/w3c/webappsec-permissions-policy/blob/main/features.md#proposed-features)
- [Experimental Features](https://github.com/w3c/webappsec-permissions-policy/blob/main/features.md#experimental-features)

## Links

- [Permissions-Policy header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy)
- [Permissions Policy on W3C spec](https://www.w3.org/TR/permissions-policy/)
