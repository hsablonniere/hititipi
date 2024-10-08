# compress-with-gzip middleware

The `compress-with-gzip` middleware TODO.

## Import

```js
import { compressWithGzip } from 'hititipi/middlewares/compress-with-gzip/compress-with-gzip.js';
```

## Examples

TODO

## Options

The options object can contain the following properties:

```ts
export interface CompressWithGzipOptions {
  // Specifies the Gzip compression level to be used
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}
```

## Links

- [Gzip compression](https://developer.mozilla.org/en-US/docs/Glossary/gzip_compression)
- [Content-Encoding header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)
- [Content-Encoding header in RFC 9110](https://httpwg.org/specs/rfc9110.html#field.content-encoding)
- [Accept-Encoding header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)
- [Accept-Encoding header in RFC 9110](https://httpwg.org/specs/rfc9110.html#field.accept-encoding)
- [Vary header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
- [Vary header in RFC 9110](https://httpwg.org/specs/rfc9110.html#field.vary)
