import fs from 'fs';
import isCompressible from 'compressible';
import mime from 'mime-types';
import rawGlob from 'glob';
import { createBrotliCompress, createGzip } from 'zlib';
import { pipeline as rawPipeline } from 'stream';
import { promisify } from 'util';

const pipeline = promisify(rawPipeline);
const glob = promisify(rawGlob);

export async function compressFiles (inputGlob) {

  console.log(`Starting compression on ${inputGlob}`);

  const files = await glob(inputGlob, { nodir: true });
  const filesToCompress = files.filter((filepath) => {
    const mimeType = mime.lookup(filepath);
    return isCompressible(mimeType);
  });

  console.log(`Found ${files.length} matching entries, only ${filesToCompress.length} files need to be compressed`);

  for (const f of filesToCompress) {

    const inputStream = fs.createReadStream(f);

    const gzipStream = createGzip();
    const gzipOutputStream = fs.createWriteStream(f + '.gz');
    pipeline(inputStream, gzipStream, gzipOutputStream)
      .then(() => console.log(`gzipping ${f} DONE!`))
      .catch((e) => console.error(e));

    const brotliStream = createBrotliCompress();
    const brotliOutputStream = fs.createWriteStream(f + '.br');
    pipeline(inputStream, brotliStream, brotliOutputStream)
      .then(() => console.log(`brotlifying ${f} DONE!`))
      .catch((e) => console.error(e));
  }
}
