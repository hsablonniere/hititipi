#!/usr/bin/env node

import rawGlob from 'glob';
import { compressFiles } from '../src/compress-files.js';
import { pipeline as rawPipeline } from 'stream';
import { promisify } from 'util';

const pipeline = promisify(rawPipeline);
const glob = promisify(rawGlob);

const [INPUT_GLOB] = process.argv.slice(2);

async function run () {
  if (INPUT_GLOB == null) {
    throw new Error('hititipi-compress needs the glob of files to compress as the first arg');
  }
  await compressFiles(INPUT_GLOB);
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
