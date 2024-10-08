export interface HttpStrictTransportSecurityOptions {
  // Specifies the time, in seconds, that the browser should remember that a site is only to be accessed using HTTPS
  'max-age'?: string | number;
  // If true, this rule applies to all of the site's subdomains as well
  includeSubDomains?: boolean;
  // If true, the site will be included in browsers' preload lists
  preload?: boolean;
}
