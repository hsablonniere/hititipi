# serve-static-file middleware

The `serve-static-file` middleware TODO.

## Import

```js
import { serveStaticFile } from 'hititipi/middlewares/serve-static-file/serve-static-file.js';
```

## Examples

TODO

## Options

The options object can contain the following properties:

```ts
export interface ServeStaticFileOptions {
  // Specifies the root directory from which to serve static files
  root: string;
  // Specifies the URL base path to be used when serving static files
  basePath?: string;
}
```
