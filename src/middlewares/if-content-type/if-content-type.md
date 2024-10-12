# if-content-type middleware

The `if-content-type` middleware executes a middleware only if the content type of the response is the same as the one provided.

## Import

```js
import { ifContentType } from 'hititipi/middlewares/if-content-type/if-content-type.js';
```

## Examples

```js
ifContentType(HTML, async (context) => {
  context.responseHeaders.set('cache-control', 'max-age=180');
});
```
