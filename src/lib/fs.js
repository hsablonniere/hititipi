import path from 'path';
import fs, { promises as pfs } from 'fs';
import { pipeline as pipelineCb } from 'stream';
import { promisify } from 'util';
import mime from 'mime-types';
import { CONTENT_ENCODING } from './content-encoding.js';

const pipeline = promisify(pipelineCb);

export async function getDirInfo (dir) {
  let absolutePath;
  try {
    if (dir == null) {
      throw new Error();
    }
    absolutePath = path.isAbsolute(dir)
      ? dir
      : path.join(process.cwd(), dir);
    const stats = fs.statSync(absolutePath);
    if (!stats.isDirectory()) {
      throw new Error();
    }
    return { exists: true, path: absolutePath };
  }
  catch (e) {
    return { exists: false, path: absolutePath };
  }
}

export async function loadAllTemplates (absoluteTemplatesPath) {
  const filenameList = await pfs.readdir(absoluteTemplatesPath);
  return Promise.all(filenameList.map((filename) => loadTemplate(absoluteTemplatesPath, filename)));
}

async function loadTemplate (absoluteTemplatesDir, filename) {
  const templatePath = path.join(absoluteTemplatesDir, filename);
  const template = await import(templatePath);
  const stats = await pfs.stat(templatePath);
  return { ...template, stats };
}

async function getFileStat (filepath) {
  try {
    const stats = await pfs.stat(filepath);
    return stats.isFile() ? stats : null;
  }
  catch (e) {
    return null;
  }
}

export async function getFileInfo (absoluteBasePath, requestPath, options) {

  // Treat "/" as "/index.html"
  if (requestPath === '/') {
    return getFileInfo(absoluteBasePath, '/index.html', options);
  }

  const contentEncoding = options.get(CONTENT_ENCODING.key);
  const suffix = (contentEncoding === CONTENT_ENCODING.defaultValue) ? '' : '.' + contentEncoding;
  try {
    const filepath = path.join(absoluteBasePath, requestPath);
    const filepathCompressed = filepath + suffix;
    const stats = await getFileStat(filepath);
    const statsCompressed = await getFileStat(filepathCompressed);
    if (statsCompressed == null && stats == null) {
      throw new Error(`${filepath} is not a file`);
    }
    const mimeType = mime.lookup(filepath);
    const stream = statsCompressed != null
      ? await fs.createReadStream(filepathCompressed)
      : await fs.createReadStream(filepath);
    return { exists: true, stats, mimeType, stream, compressed: statsCompressed != null };
  }
  catch (e) {
    return { exists: false };
  }
}
