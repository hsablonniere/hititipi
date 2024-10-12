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

export type HeadersAsObject = Record<string, string | Array<string> | undefined>;

export interface HititipiContext {
  readonly requestTimestamp: number;
  readonly requestId: string;
  readonly requestIps: Array<string>;
  readonly requestHttpVersion: 1 | 2 | number;
  readonly requestMethod: HititipiMethod;
  readonly requestUrl: URL;
  readonly requestHeaders: Headers;
  readonly requestBody: ReadableStream;
  responseStatus?: number;
  readonly responseHeaders: Headers;
  responseBody?: string | ArrayBuffer | ReadableStream;
  responseSize?: number;
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
