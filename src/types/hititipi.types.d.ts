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
  requestTimestamp: number;
  requestId: string;
  requestIps: Array<string>;
  requestMethod: HititipiMethod;
  requestUrl: URL;
  requestHeaders: Headers;
  responseStatus?: number;
  responseHeaders: Headers;
  responseBody?: string | ArrayBuffer | ReadableStream;
  responseSize?: number;
  responseModificationDate?: Date;
  responseEtag?: Etag;
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
