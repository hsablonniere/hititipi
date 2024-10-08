import { HititipiMethod } from '../../types/hititipi.types.d.ts';

export interface CorsOptions {
  // Indicates whether the response can be shared with requesting code from the given origin
  allowOrigin?: string;
  // Tells browsers whether the server allows cross-origin HTTP requests to include credentials
  allowCredentials?: boolean;
  // Indicates which HTTP headers can be used during the actual request
  allowHeaders?: Array<string>;
  // Specifies one or more methods allowed when accessing a resource
  allowMethods?: Array<HititipiMethod>;
  // Indicates how long the results of a preflight request can be cached in seconds
  maxAge?: number;
  // Indicates which response headers should be made available to scripts running in the browser, in response to a cross-origin request
  exposeHeaders?: Array<string>;
}
