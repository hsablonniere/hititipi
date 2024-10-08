# compress-with-brotli middleware

The `compress-with-brotli` middleware TODO.

## Import

```js
import { compressWithBrotli } from 'hititipi/middlewares/compress-with-brotli/compress-with-brotli.js';
```

## Examples

TODO

## Options

The options object can contain the following properties:

```ts
export interface CompressWithBrotliOptions {
  // Specifies the Brotli compression level to be used
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
}
```

## Links

- [Brotli compression](https://developer.mozilla.org/en-US/docs/Glossary/Brotli_compression)
- [Content-Encoding header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)
- [Content-Encoding header in RFC 9110](https://httpwg.org/specs/rfc9110.html#field.content-encoding)
- [Accept-Encoding header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)
- [Accept-Encoding header in RFC 9110](https://httpwg.org/specs/rfc9110.html#field.accept-encoding)
- [Vary header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
- [Vary header in RFC 9110](https://httpwg.org/specs/rfc9110.html#field.vary)
