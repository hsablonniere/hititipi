"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStrongEtagHash = getStrongEtagHash;
exports.getWeakEtag = getWeakEtag;
exports.transformEtag = transformEtag;

var _crypto = _interopRequireDefault(require("crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getStrongEtagHash(contentString) {
  const hash = _crypto.default.createHash('sha1').update(Buffer.from(contentString)).digest('base64');

  return `"${hash}"`;
}

function getWeakEtag(stats, suffix) {
  return `W/"${stats.mtime.getTime().toString(16)}-${stats.size.toString(16)}${suffix}"`;
}

function transformEtag(etag, suffix) {
  if (etag == null) {
    return etag;
  }

  return etag.replace(/^"/, 'W/"').replace(/"$/, suffix + '"');
}