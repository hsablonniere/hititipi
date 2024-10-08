# frame-options middleware

The `frame-options` middleware TODO.

## Import

```js
import { frameOptions } from 'hititipi/middlewares/frame-options/frame-options.js';
```

## Examples

TODO

## Options

The options object can contain the following properties:

```ts
export interface FrameOptionsOptions {
  // Specifies the mode for the X-Frame-Options header.
  mode?: 'DENY' | 'SAMEORIGIN';
}
```

## Links

- [X-Frame-Options header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)
- [X-Frame-Options header in HTML standard](https://html.spec.whatwg.org/multipage/document-lifecycle.html#the-x-frame-options-header)
