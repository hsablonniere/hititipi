# serve-directory-index middleware

The `serve-directory-index` middleware TODO.

## Import

```js
import { serveDirectoryIndex } from 'hititipi/middlewares/serve-directory-index/serve-directory-index.js';
```

## Examples

TODO

## Options

The options object can contain the following properties:

```ts
export interface ServeDirectoryIndexOptions {
  // Specifies the root directory from which to serve directory indexes
  root: string;
  // Specifies the URL base path to be used when serving directory indexes
  basePath?: string;
  // Indicates whether hidden files should be shown in the directory index
  showHidden?: boolean;
}

export interface DirectoryEntry {
  name: string;
  fullpath: string;
  isDirectory: boolean;
  size: number;
  modificationDate: Date;
  isHidden: boolean;
}
```
