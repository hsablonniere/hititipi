export interface PermissionsPolicyOptions {
  features?: {
    // Standardized Features https://github.com/w3c/webappsec-permissions-policy/blob/main/features.md#standardized-features
    accelerometer?: PermissionsPolicyAllowList;
    'ambient-light-sensor'?: PermissionsPolicyAllowList;
    'attribution-reporting'?: PermissionsPolicyAllowList;
    autoplay?: PermissionsPolicyAllowList;
    battery?: PermissionsPolicyAllowList;
    bluetooth?: PermissionsPolicyAllowList;
    camera?: PermissionsPolicyAllowList;
    'ch-ua'?: PermissionsPolicyAllowList;
    'ch-ua-arch'?: PermissionsPolicyAllowList;
    'ch-ua-bitness'?: PermissionsPolicyAllowList;
    'ch-ua-full-version'?: PermissionsPolicyAllowList;
    'ch-ua-full-version-list'?: PermissionsPolicyAllowList;
    'ch-ua-mobile'?: PermissionsPolicyAllowList;
    'ch-ua-model'?: PermissionsPolicyAllowList;
    'ch-ua-platform'?: PermissionsPolicyAllowList;
    'ch-ua-platform-version'?: PermissionsPolicyAllowList;
    'ch-ua-wow64'?: PermissionsPolicyAllowList;
    'compute-pressure'?: PermissionsPolicyAllowList;
    'cross-origin-isolated'?: PermissionsPolicyAllowList;
    'direct-sockets'?: PermissionsPolicyAllowList;
    'display-capture'?: PermissionsPolicyAllowList;
    'encrypted-media'?: PermissionsPolicyAllowList;
    'execution-while-not-rendered'?: PermissionsPolicyAllowList;
    'execution-while-out-of-viewport'?: PermissionsPolicyAllowList;
    fullscreen?: PermissionsPolicyAllowList;
    geolocation?: PermissionsPolicyAllowList;
    gyroscope?: PermissionsPolicyAllowList;
    hid?: PermissionsPolicyAllowList;
    'identity-credentials-get'?: PermissionsPolicyAllowList;
    'idle-detection'?: PermissionsPolicyAllowList;
    'keyboard-map'?: PermissionsPolicyAllowList;
    magnetometer?: PermissionsPolicyAllowList;
    microphone?: PermissionsPolicyAllowList;
    midi?: PermissionsPolicyAllowList;
    'navigation-override'?: PermissionsPolicyAllowList;
    payment?: PermissionsPolicyAllowList;
    'picture-in-picture'?: PermissionsPolicyAllowList;
    'publickey-credentials-get'?: PermissionsPolicyAllowList;
    'screen-wake-lock'?: PermissionsPolicyAllowList;
    serial?: PermissionsPolicyAllowList;
    'sync-xhr'?: PermissionsPolicyAllowList;
    usb?: PermissionsPolicyAllowList;
    'web-share'?: PermissionsPolicyAllowList;
    'window-management'?: PermissionsPolicyAllowList;
    'xr-spatial-tracking'?: PermissionsPolicyAllowList;
    // Proposed Features https://github.com/w3c/webappsec-permissions-policy/blob/main/features.md#proposed-features
    'clipboard-read'?: PermissionsPolicyAllowList;
    'clipboard-write'?: PermissionsPolicyAllowList;
    gamepad?: PermissionsPolicyAllowList;
    'shared-autofill'?: PermissionsPolicyAllowList;
    'speaker-selection'?: PermissionsPolicyAllowList;
    // Experimental Features https://github.com/w3c/webappsec-permissions-policy/blob/main/features.md#experimental-features
    'all-screens-capture'?: PermissionsPolicyAllowList;
    'browsing-topics'?: PermissionsPolicyAllowList;
    'captured-surface-control'?: PermissionsPolicyAllowList;
    'conversion-measurement '?: PermissionsPolicyAllowList;
    'digital-credentials-get'?: PermissionsPolicyAllowList;
    'focus-without-user-activation'?: PermissionsPolicyAllowList;
    'join-ad-interest-group'?: PermissionsPolicyAllowList;
    'local-fonts'?: PermissionsPolicyAllowList;
    'run-ad-auction'?: PermissionsPolicyAllowList;
    'smart-card'?: PermissionsPolicyAllowList;
    'sync-script'?: PermissionsPolicyAllowList;
    'trust-token-redemption'?: PermissionsPolicyAllowList;
    unload?: PermissionsPolicyAllowList;
    'vertical-scroll'?: PermissionsPolicyAllowList;
  };
}

// https://www.w3.org/TR/permissions-policy/#structured-header-serialization
type PermissionsPolicyAllowList = '*' | Array<PermissionsPolicySource>;

type PermissionsPolicySource = 'self' | 'src' | PermissionsPolicySourceHost;

type PermissionsPolicySourceHost = string;
