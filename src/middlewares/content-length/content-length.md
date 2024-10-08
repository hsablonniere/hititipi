# content-length middleware

The `content-length` middleware sets the `Content-Length` response header based on the context `responseSize`.

## Import

```js
import { contentLength } from 'hititipi/middlewares/content-length/content-length.js';
```

## Examples

### Basic usage

```js
contentLength();
```

In this example, if the context `responseSize` is defined and is a number, the `Content-Length` response header will be set accordingly.

## Links

- [Content-Length header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length)
- [Content-Length header in RFC 9110](https://httpwg.org/specs/rfc9110.html#field.content-length)
