export type KeepAliveOptions = KeepAliveOptionsDisabled | KeepAliveOptionsEnabled;

export interface KeepAliveOptionsEnabled {
  enabled: true;
  timeout?: number;
  maxRequests?: number;
}

export interface KeepAliveOptionsDisabled {
  enabled: false;
}
