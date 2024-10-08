import { CookieSerializeOptions } from 'cookie-es';

export interface CookieOptions extends CookieSerializeOptions {
  usePrefix?: CookieNamePrefix;
}

export type CookieNamePrefix = 'host' | 'secure' | undefined;
