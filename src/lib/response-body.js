import { arrayBuffer } from 'node:stream/consumers';

/**
 * @param {ReadableStream} readableStream
 * @return {Promise<ArrayBuffer>}
 */
export function readableStreamToArrayBuffer(readableStream) {
  return arrayBuffer(readableStream);
}

/**
 * @param {string | ArrayBuffer} responseBody
 * @return {ArrayBuffer}
 */
export function toArrayBuffer(responseBody) {
  if (responseBody instanceof ArrayBuffer) {
    return responseBody;
  }

  const encoder = new TextEncoder();
  // @ts-ignore
  return encoder.encode(responseBody);
}

/**
 * @param {string | ArrayBuffer | ReadableStream} responseBody
 * @return {ReadableStream}
 */
export function toReadableStream(responseBody) {
  if (responseBody instanceof ReadableStream) {
    return responseBody;
  }

  const arrayBuffer = toArrayBuffer(responseBody);

  return new ReadableStream({
    start(controller) {
      controller.enqueue(arrayBuffer);
      controller.close();
    },
  });
}
