export interface LinkPreloadOptions {
  earlyHints: 'never' | 'http2-only' | 'always';
  manifest: PreloadManifest;
}

// https://github.com/http-preload/manifest/blob/master/preload-v1.md
interface PreloadManifest {
  manifestVersion: 1;
  // No support for conditions
  resources: {
    [k: string]: Array<PreloadResourceConfig>;
  };
}

export interface PreloadResourceConfig {
  rel?: 'preload' | 'modulepreload' | 'dns-prefetch' | 'prefetch' | 'preconnect' | 'prerender';
  href: string;
  hreflang?: string;
  as?:
    | 'audio'
    | 'document'
    | 'embed'
    | 'fetch'
    | 'font'
    | 'image'
    | 'object'
    | 'script'
    | 'style'
    | 'track'
    | 'video'
    | 'worker';
  crossorigin?: 'anonymous' | 'use-credentials';
  fetchpriority?: 'high' | 'low' | 'auto';
  type?: string;
  media?: string;
  referrerpolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'unsafe-url';
  integrity?: string;

  [k: string]: string;
}
