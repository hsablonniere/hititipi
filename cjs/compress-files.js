"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compressFiles = compressFiles;
exports.compress = compress;

var _fs = _interopRequireDefault(require("fs"));

var _compressible = _interopRequireDefault(require("compressible"));

var _mimeTypes = _interopRequireDefault(require("mime-types"));

var _promises = _interopRequireDefault(require("fs/promises"));

var _glob = _interopRequireDefault(require("glob"));

var _zlib = _interopRequireDefault(require("zlib"));

var _nodeZopfli = _interopRequireDefault(require("node-zopfli"));

var _stream = require("stream");

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pipeline = (0, _util.promisify)(_stream.pipeline);
const glob = (0, _util.promisify)(_glob.default);

async function compressFiles(inputGlob, options = {}) {
  const {
    zopfliThreshold,
    concurrency
  } = options;
  const files = await glob(inputGlob, {
    nodir: true
  });
  const filesToCompress = files.filter(filepath => {
    const mimeType = _mimeTypes.default.lookup(filepath);

    return (0, _compressible.default)(mimeType);
  });
  console.log(`Found ${files.length} matching entries, only ${filesToCompress.length} files need to be compressed`);
  const pendingPromises = new Set();
  let count = 1;

  for (const filepath of filesToCompress) {
    const pending = compress(filepath, zopfliThreshold).then(algos => {
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

function getShortFilename(filename, length = 80) {
  const separator = '..';
  const half = (length - separator.length) / 2;

  if (filename.length <= length) {
    return filename.padEnd(length, ' ');
  }

  return filename.substr(0, half) + separator + filename.substr(filename.length - half, half);
}

async function compress(filepath, zopfliThreshold) {
  const fileStats = await _promises.default.stat(filepath);

  const inputStream = _fs.default.createReadStream(filepath);

  const useZopfli = fileStats.size > zopfliThreshold;
  const gzipStream = useZopfli ? _nodeZopfli.default.createGzip() : _zlib.default.createGzip();

  const gzipOutputStream = _fs.default.createWriteStream(filepath + '.gz');

  const gzipPromise = pipeline(inputStream, gzipStream, gzipOutputStream).catch(e => console.error(e));

  const brotliStream = _zlib.default.createBrotliCompress();

  const brotliOutputStream = _fs.default.createWriteStream(filepath + '.br');

  const brotliPromise = pipeline(inputStream, brotliStream, brotliOutputStream).catch(e => console.error(e));
  await Promise.all([gzipPromise, brotliPromise]);
  return useZopfli ? 'BROTLI + ZOPFLI' : 'BROTLI + ZLIB  ';
}