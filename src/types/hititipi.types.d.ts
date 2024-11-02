export type HititipiMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | string;

// If we could circular references in template literal types, it would be great but not for now
// https://github.com/microsoft/TypeScript/issues/44792
export type HeaderName = Lowercase<string>;

export interface RequestSearchParams {
  get(name: string): string | null;

  getAll(name: string): Array<string> | null;

  has(name: string): boolean;

  toString(): string;
}

export interface RequestHeaders {
  get(name: HeaderName): string | null;

  getNumber(name: HeaderName): number | null;

  getDate(name: HeaderName): Date | null;

  has(name: HeaderName): boolean;

  getObject(): Record<string, string | Array<string>>;
}

export interface ResponseHeaders extends RequestHeaders {
  getSetCookie(): Array<string>;

  set(name: HeaderName, value: string | null | undefined): void;

  setNumber(name: HeaderName, value: number | null | undefined): void;

  setDate(name: HeaderName, value: Date | null | undefined): void;

  appendSetCookie(value: string): void;

  delete(name: HeaderName): void;

  deleteMany(pattern: RegExp): void;

  deleteAllExcept(namesToKeep: Array<HeaderName>): void;

  reset(nodeHeaders: Record<string, string | Array<string> | undefined>);
}

export type HeadersAsObject = Record<string, string | Array<string> | undefined>;

export interface HititipiContext {
  readonly requestTimestamp: number;
  readonly requestId: string;
  readonly requestIps: Array<string>;
  readonly requestHttpVersion: 1 | 2 | number;
  readonly requestMethod: HititipiMethod;
  readonly requestProtocol: 'http' | 'https';
  readonly requestPathname: string;
  readonly requestSearchParams: RequestSearchParams;
  readonly requestHeaders: RequestHeaders;
  readonly requestBody: ReadableStream;
  responseStatus?: number;
  readonly responseHeaders: ResponseHeaders;
  responseBody?: string | ArrayBuffer | ReadableStream;
  responseModificationDate?: Date;
  responseEtag?: Etag;
  readonly writeEarlyHints: (hints: Record<string, string | string[]>) => Promise<void>;
}

export type HititipiContextWithResponse = WithRequired<HititipiContext, 'responseBody'>;

export type HititipiMiddleware = (context: HititipiContext) => Promise<void>;

export type Etag = WeakEtag | StrongEtag;

export interface WeakEtag {
  value: string;
  weak: true;
}

export interface StrongEtag {
  value: string;
  weak: false;
}

export type UrlParts = HrefPart | HrefSplitParts;

interface HrefPart {
  href: string;
}

type HrefSplitParts = (OriginPart | SplitOriginParts) & OtherParts;

interface OriginPart {
  origin: string;
}

type SplitOriginParts = ProtocolHostParts | ProtocolHostnamePortParts;

type ProtocolHostParts = {
  host: string;
};

type ProtocolHostnamePortParts = {
  hostname?: string;
  port?: string;
};

interface OtherParts {
  protocol?: string;
  pathname?: string;
  search?: string;
  hash?: string;
}

type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
