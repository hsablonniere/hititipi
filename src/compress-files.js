import fs from 'fs';
import isCompressible from 'compressible';
import mime from 'mime-types';
import pfs from 'fs/promises';
import rawGlob from 'glob';
import zlib from 'zlib';
import zopfli from 'node-zopfli';
import { pipeline as rawPipeline } from 'stream';
import { promisify } from 'util';

const pipeline = promisify(rawPipeline);
const glob = promisify(rawGlob);

export async function compressFiles (inputGlob, options = {}) {

  const { zopfliThreshold, concurrency } = options;

  const files = await glob(inputGlob, { nodir: true });
  const filesToCompress = files.filter((filepath) => {
    const mimeType = mime.lookup(filepath);
    return isCompressible(mimeType);
  });

  console.log(`Found ${files.length} matching entries, only ${filesToCompress.length} files need to be compressed`);

  const pendingPromises = new Set();
  let count = 1;

  for (const filepath of filesToCompress) {
    const pending = compress(filepath, zopfliThreshold).then((algos) => {
      const formattedCount = String(count).padStart(String(filesToCompress.length).length, ' ');
      console.log(`${formattedCount}/${filesToCompress.length}  ${algos}  ${getShortFilename(filepath)}`);
      count += 1;
      return pendingPromises.delete(pending);
    });
    pendingPromises.add(pending);
    if (pendingPromises.size >= concurrency) {
      await Promise.race(Array.from(pendingPromises));
    }
  }

  await Promise.all(Array.from(pendingPromises));
}

function getShortFilename (filename, length = 80) {
  const separator = '..';
  const half = (length - separator.length) / 2;
  if (filename.length <= length) {
    return filename.padEnd(length, ' ');
  }
  return filename.substr(0, half) + separator + filename.substr(filename.length - half, half);
}

export async function compress (filepath, zopfliThreshold) {

  const fileStats = await pfs.stat(filepath);
  const inputStream = fs.createReadStream(filepath);

  const useZopfli = fileStats.size > zopfliThreshold;

  const gzipStream = useZopfli ? zopfli.createGzip() : zlib.createGzip();
  const gzipOutputStream = fs.createWriteStream(filepath + '.gz');
  const gzipPromise = pipeline(inputStream, gzipStream, gzipOutputStream)
    .catch((e) => console.error(e));

  const brotliStream = zlib.createBrotliCompress();
  const brotliOutputStream = fs.createWriteStream(filepath + '.br');
  const brotliPromise = pipeline(inputStream, brotliStream, brotliOutputStream)
    .catch((e) => console.error(e));

  await Promise.all([gzipPromise, brotliPromise]);

  return useZopfli
    ? 'BROTLI + ZOPFLI'
    : 'BROTLI + ZLIB  ';
}
