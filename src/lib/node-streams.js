import { Duplex, Readable } from 'node:stream';

/**
 * @param {Readable} readable
 * @return {ReadableStream}
 */
export function readableToWebReadableStream(readable) {
  // @ts-ignore
  return Readable.toWeb(readable);
}

/**
 * @param {Duplex} duplex
 * @return {TransformStream}
 */
export function duplexToWebTransformStream(duplex) {
  // @ts-ignore
  return Duplex.toWeb(duplex);
}
