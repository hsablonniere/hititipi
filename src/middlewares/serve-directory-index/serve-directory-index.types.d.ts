export interface ServeDirectoryIndexOptions {
  // Specifies the root directory from which to serve directory indexes
  root: string;
  // Specifies the base path to be used when serving directory indexes
  basePath?: string;
  // Indicates whether hidden files should be shown in the directory index
  showHidden?: boolean;
}

export interface DirectoryEntry {
  name: string;
  fullpath: string;
  isDirectory: boolean;
  size: number;
  modificationDate: Date;
  isHidden: boolean;
}
