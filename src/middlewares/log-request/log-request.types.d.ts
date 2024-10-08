export interface LogRequestOptions {
  // Indicates whether to hide timestamps in the logs
  hideTimestamps: boolean;
  // Function to be used for logging
  logFunction: (...args: any[]) => void;
}
