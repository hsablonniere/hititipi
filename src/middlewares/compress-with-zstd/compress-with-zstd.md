# compress-with-zstd middleware

The `compress-with-zstd` middleware TODO.

## Import

```js
import { compressWithZstd } from 'hititipi/middlewares/compress-with-zstd/compress-with-zstd.js';
```

## Examples

TODO

## Options

The options object can contain the following properties:

```ts
export interface CompressWithZstdOptions {
  // Specifies the Zstandard compression level to be used
  level:
    | -7
    | -6
    | -5
    | -4
    | -3
    | -2
    | -1
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22;
}
```

## Links

- [Zstandard compression](https://developer.mozilla.org/en-US/docs/Glossary/Zstandard_compression)
- [Content-Encoding header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)
- [Content-Encoding header in RFC 9110](https://httpwg.org/specs/rfc9110.html#field.content-encoding)
- [Accept-Encoding header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)
- [Accept-Encoding header in RFC 9110](https://httpwg.org/specs/rfc9110.html#field.accept-encoding)
- [Vary header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
- [Vary header in RFC 9110](https://httpwg.org/specs/rfc9110.html#field.vary)
