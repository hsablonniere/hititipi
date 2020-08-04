#!/usr/bin/env node

import { startServer } from '../src/http-server.js';
import { getDirInfo } from '../src/lib/fs.js';

const { PORT = 8080, HITITIPI_OPTIONS } = process.env;
const [STATIC_ROOT_DIR = '.', TEMPLATE_ROOT_DIR] = process.argv.slice(2);

async function run () {

  const staticRoot = await getDirInfo(STATIC_ROOT_DIR);
  if (!staticRoot.exists) {
    throw new Error(`HTTP 1.1 server cannot be started, configured static root ${staticRoot.path} does not exist!`);
  }

  const templateRoot = await getDirInfo(TEMPLATE_ROOT_DIR);

  await startServer({ PORT, HITITIPI_OPTIONS, staticRoot, templateRoot });

  console.log(`HTTP 1.1 server started on port ${PORT}`);
  if (HITITIPI_OPTIONS != null) {
    console.log(`  using fixed options ${HITITIPI_OPTIONS}`);
  }
  console.log(`  serving static files from ${staticRoot.path}`);
  if (TEMPLATE_ROOT_DIR != null && templateRoot.exists) {
    console.log(`  serving template files from ${templateRoot.path}`);
  }
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
