# transform-string middleware

The `transform-string` middleware applies the transformResponseBody function on the responseBody.

## Import

```js
import { transformString } from 'hititipi/middlewares/transform-string/transform-string.js';
```

## Examples

```js
transformString((responseBody) => {
  return responseBody.toUpperCase();
});
```
