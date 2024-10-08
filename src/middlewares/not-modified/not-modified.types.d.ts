export interface NotModifiedOptions {
  // Indicates whether to use the ETag header for cache validation
  etag: boolean;
  // Indicates whether to use the Last-Modified header for cache validation
  lastModified: boolean;
}
