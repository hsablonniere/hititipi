/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./frame-options.types.d.ts').FrameOptionsOptions} FrameOptionsOptions
 */

/**
 * @param {FrameOptionsOptions} options
 * @return {HititipiMiddleware}
 */
export function frameOptions(options) {
  return async (context) => {
    if (options.mode === 'DENY') {
      context.responseHeaders.set('x-frame-options', 'DENY');
    } else if (options.mode === 'SAMEORIGIN') {
      context.responseHeaders.set('x-frame-options', 'SAMEORIGIN');
    }
    return context;
  };
}
