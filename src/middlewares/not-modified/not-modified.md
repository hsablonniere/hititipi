# not-modified middleware

The `not-modified` middleware TODO.

## Import

```js
import { notModified } from 'hititipi/middlewares/not-modified/not-modified.js';
```

## Examples

TODO

## Options

The options object can contain the following properties:

```ts
export interface NotModifiedOptions {
  // Indicates whether to return the `etag` response header for cache validation and to handle the `if-none-match` request header
  etag: boolean;
  // Indicates whether to return the `last-modified` response header for cache validation and to handle the `if-modifiedsince` request header
  lastModified: boolean;
}
```

## Links

- [304 Not Modified status on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304)
- [304 Not Modified status in RFC 9110](https://www.rfc-editor.org/rfc/rfc9110#status.304)
- [ETag header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
- [ETag header in RFC 9110](https://httpwg.org/specs/rfc9110.html#field.etag)
- [If-None-Match header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match)
- [If-None-Match header in RFC 9110](https://httpwg.org/specs/rfc9110.html#field.if-none-match)
- [Last-Modified header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified)
- [Last-Modified header in RFC 9110](https://httpwg.org/specs/rfc9110.html#field.last-modified)
- [If-Modified-Since header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since)
- [If-Modified-Since header in RFC 9110](https://httpwg.org/specs/rfc9110.html#field.if-modified-since)
