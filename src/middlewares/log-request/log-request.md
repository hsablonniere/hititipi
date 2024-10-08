# log-request middleware

The `log-request` middleware TODO.

## Import

```js
import { logRequest } from 'hititipi/middlewares/log-request/log-request.js';
```

## Examples

TODO

## Options

The options object can contain the following properties:

```ts
export interface LogRequestOptions {
  // Indicates whether to hide timestamps in the logs
  hideTimestamps: boolean;
  // Function to be used for logging
  logFunction: (...args: any[]) => void;
}
```
