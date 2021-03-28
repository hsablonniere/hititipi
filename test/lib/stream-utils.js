import { PassThrough } from 'stream';

export async function streamToString (stream) {
  const buffer = await streamToBuffer(stream);
  return buffer.toString();
}

export function cloneStream (inputStream) {
  const stream = new PassThrough();
  inputStream.pipe(stream);
  return stream;
}

export function streamToBuffer (stream) {
  return new Promise((resolve, reject) => {
    if (stream == null) {
      return null;
    }
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', (error) => reject(error));
  });
}
