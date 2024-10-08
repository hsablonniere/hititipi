# set-cookie middleware

The `set-cookie` middleware TODO.

## Import

```js
import { setCookie } from 'hititipi/middlewares/set-cookie/set-cookie.js';
```

## Examples

TODO

## Options

The options object can contain the following properties:

```ts
interface SetCookieOptions {
  // Specifies the `Domain` attribute of the cookie
  domain?: string;
  // A function to encode the cookie value (defaults to `encodeURIComponent`)
  encode?: (value: string) => string;
  // Specifies the expiration date of the cookie
  expires?: Date;
  // Adds the `HttpOnly` attribute to the cookie
  httpOnly?: boolean;
  // Specifies the maximum age of the cookie in seconds
  maxAge?: number;
  // Specifies the `Path` attribute of the cookie
  path?: string;
  // Specifies the `Priority` attribute of the cookie
  priority?: 'low' | 'medium' | 'high';
  // Specifies the `SameSite` attribute of the cookie
  sameSite?: true | false | 'lax' | 'strict' | 'none';
  // Adds the `Secure` attribute to the cookie
  secure?: boolean;
  // Adds the `Partitioned` attribute to the cookie
  partitioned?: boolean;
  // Specifies the prefix to be used for the cookie name
  usePrefix?: 'host' | 'secure' | undefined;
}
```

## Links

- [Set-Cookie header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
- [Set-Cookie header in RFC 9110](https://httpwg.org/specs/rfc9110.html#field.set-cookie)
