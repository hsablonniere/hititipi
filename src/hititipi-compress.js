import fs from 'fs';
import rawGlob from 'glob';
import { createBrotliCompress, createGzip } from 'zlib';
import { pipeline as rawPipeline } from 'stream';
import { promisify } from 'util';
import mime from 'mime-types';
import isCompressible from 'compressible';

const pipeline = promisify(rawPipeline);
const glob = promisify(rawGlob);

const [INPUT_GLOB] = process.argv.slice(2);

async function run () {

  if (INPUT_GLOB == null) {
    throw new Error('hititipi-compress needs the glob of files to compress as the first arg');
  }

  console.log(`Starting compression on ${INPUT_GLOB}`);

  const files = await glob(INPUT_GLOB);
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
      .then(() => console.log(`gzipping ${f} DONE!`));

    const brotliStream = createBrotliCompress();
    const brotliOutputStream = fs.createWriteStream(f + '.br');
    pipeline(inputStream, brotliStream, brotliOutputStream)
      .then(() => console.log(`brotlifying ${f} DONE!`));
  }
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
