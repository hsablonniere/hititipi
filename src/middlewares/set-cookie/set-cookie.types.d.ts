import { CookieSerializeOptions } from 'cookie-es';

export interface SetCookieOptions extends CookieSerializeOptions {
  usePrefix?: CookieNamePrefix;
}

export type CookieNamePrefix = 'host' | 'secure' | undefined;
