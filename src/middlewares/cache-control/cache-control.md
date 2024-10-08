# cache-control middleware

The `cache-control` middleware sets the `Cache-Control` response header based on the provided options.

## Import

```js
import { cacheControl } from 'hititipi/middlewares/cache-control/cache-control.js';
```

## Examples

### HTML page

```js
cacheControl({
  'max-age': 180,
});
```

In this example, the `Cache-Control` response header will be set to:

```
cache-control: max-age=180
```

### JS static asset

```js
cacheControl({
  'max-age': 31536000,
  immutable: true,
});
```

In this example, the `Cache-Control` response header will be set to:

```
cache-control: max-age=31536000,immutable
```

## Options

The options object can contain the following properties:

```ts
export interface CacheControlOptions {
  // Indicates that the response may be cached by any cache
  public?: boolean;
  // Indicates that the response is intended for a single user and must not be stored by shared caches
  private?: boolean;
  // Forces caches to submit the request to the origin server for validation before releasing a cached copy
  'no-cache'?: boolean;
  // The cache should not store anything about the client request or server response
  'no-store'?: boolean;
  // Indicates that once a resource becomes stale, caches must not use the response without successfully validating
  'must-revalidate'?: boolean;
  // Similar to `must-revalidate`, but only for shared caches (e.g., proxies)
  'proxy-revalidate'?: boolean;
  // Indicates that the response body will not change over time
  immutable?: boolean;
  // Indicates that the response should not be transformed
  'no-transform'?: boolean;
  // Specifies the maximum amount of time a resource is considered fresh
  'max-age'?: string | number;
  // Specifies the maximum amount of time a resource is considered fresh for shared caches
  's-maxage'?: string | number;
  // Specifies the time during which the cache can serve the stale response while revalidating it in the background
  'stale-while-revalidate'?: string | number;
  // Specifies the time the cache can use the stale response if an error occurs while revalidating
  'stale-if-error'?: string | number;
}
```

## Links

- [Cache-Control header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [Cache-Control header in RFC 9111](https://httpwg.org/specs/rfc9111.html#field.cache-control)
- [The Immutable Cache-Control Extension in RFC 8246](https://httpwg.org/specs/rfc8246.html#the-immutable-cache-control-extension)
