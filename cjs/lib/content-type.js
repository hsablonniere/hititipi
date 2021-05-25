"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContentType = getContentType;
exports.isHtml = isHtml;
exports.isScriptable = isScriptable;

var _mimeTypes = _interopRequireDefault(require("mime-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getContentType(filepath) {
  const mimeType = _mimeTypes.default.lookup(filepath);

  const contentType = _mimeTypes.default.contentType(mimeType); // Small exception, see https://github.com/jshttp/mime-db/issues/140


  return contentType === 'image/vnd.microsoft.icon' ? 'image/x-icon' : contentType;
}

function isHtml(contentTypeHeader) {
  const extension = _mimeTypes.default.extension(contentTypeHeader);

  return ['html', 'xhtml', 'xml'].includes(extension);
}

function isScriptable(contentTypeHeader) {
  const extension = _mimeTypes.default.extension(contentTypeHeader);

  return ['pdf', 'svg', 'js'].includes(extension);
}