#!/usr/bin/env node

import { compressFiles } from '../src/compress-files.js';
import { pipeline as rawPipeline } from 'stream';
import { promisify } from 'util';

const pipeline = promisify(rawPipeline);

async function run () {

  // With a sample of 1500+ HTML/CSS/JS files,
  // most of the files where the zlib/zopfli diff was under 500 bytes where smaller than 50000/70000 bytes.
  // A threshold of 60000 bytes for zopfli seems like a good default.

  // Seems to be a good value :p
  const concurrency = 8;

  const [inputGlob, zopfliThreshold = 60000] = process.argv.slice(2);
  if (inputGlob == null) {
    throw new Error('hititipi-compress needs the glob of files to compress as the first arg');
  }

  console.log(`Starting compression on ${inputGlob}`);
  console.time('Task finished');
  await compressFiles(inputGlob, { zopfliThreshold, concurrency });
  console.timeEnd('Task finished');
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
