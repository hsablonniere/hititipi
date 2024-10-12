# link-preload middleware

The `link-preload` middleware TODO.

## Import

```js
import { linkPreload } from 'hititipi/middlewares/link-preload/link-preload.js';
```

## Examples

TODO

## Options

The options object can contain the following properties:

```ts
export interface LinkPreloadOptions {
  earlyHints: 'never' | 'http2-only' | 'always';
  manifest: PreloadManifest;
}
```

The preload manifest follows this project: https://github.com/http-preload/manifest/blob/master/preload-v1.md

## Links

- [Link header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link)
- [Link header in RFC 8288](https://httpwg.org/specs/rfc8288.html#header)
- [Early hints on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103)
- [Early hints on RFC 8297](https://httpwg.org/specs/rfc8297.html#early-hints)
- [Early hints in HTML standard](https://html.spec.whatwg.org/multipage/semantics.html#early-hints)
