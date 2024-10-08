# content-type-options middleware

The `content-type-options` middleware TODO.

## Import

```js
import { contentTypeOptions } from 'hititipi/middlewares/content-type-options/content-type-options.js';
```

## Examples

TODO

## Options

The options object can contain the following properties:

```ts
export interface ContentTypeOptionsOptions {
  // Indicates whether to set the X-Content-Type-Options header to 'nosniff'
  noSniff?: boolean;
}
```

## Links

- [X-Content-Type-Options header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options)
- [X-Content-Type-Options header in fetch standard](https://fetch.spec.whatwg.org/#x-content-type-options-header)
