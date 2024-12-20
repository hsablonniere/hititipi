import { joinPaths, resolveAbsolutePath } from '../../lib/node-fs.js';
import { sendFile } from '../send-file/send-file.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./serve-static-file.types.d.ts').ServeStaticFileOptions} ServeStaticFileOptions
 */

/**
 * @param {ServeStaticFileOptions} options
 * @return {HititipiMiddleware}
 */
export function serveStaticFile(options) {
  const absoluteRootPath = resolveAbsolutePath(options.root);

  return async (context) => {
    if (context.requestMethod !== 'HEAD' && context.requestMethod !== 'GET') {
      return;
    }
    const rebasedPathname =
      options.basePath != null && context.requestPathname.startsWith(options.basePath)
        ? context.requestPathname.replace(options.basePath, '')
        : context.requestPathname;

    const pathname = rebasedPathname.endsWith('/') ? rebasedPathname + 'index.html' : rebasedPathname;
    const absoluteFilepath = joinPaths(absoluteRootPath, pathname);

    return sendFile(absoluteFilepath)(context);
  };
}
