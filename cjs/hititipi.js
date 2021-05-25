"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hititipi = hititipi;

var _stream = require("stream");

var _util = require("util");

var _crypto = _interopRequireDefault(require("crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pipeline = (0, _util.promisify)(_stream.pipeline);
const EMPTY_BODY_STATUSES = [204, 205, 304];

function hititipi(applyMiddleware) {
  return async (nodeRequest, nodeResponse) => {
    const initContext = {
      socket: getSocketId(nodeRequest),
      requestMethod: nodeRequest.method,
      requestUrl: getUrl(nodeRequest),
      requestHeaders: nodeRequest.headers,
      requestBody: getRequestBody(nodeRequest),
      responseStatus: null,
      responseHeaders: {},
      responseBody: null,
      responseTransformers: []
    };

    try {
      const context = await applyMiddleware(initContext);
      nodeResponse.writeHead(context.responseStatus, cleanHeaders(context.responseHeaders));

      if (context.responseBody instanceof _stream.Stream && !EMPTY_BODY_STATUSES.includes(context.responseStatus)) {
        const pipelineItems = [context.responseBody, ...context.responseTransformers, nodeResponse];
        await pipeline(...pipelineItems).catch(err => {
          if (err.code === 'ERR_STREAM_PREMATURE_CLOSE') {// This happens if the request is aborted early by the client so we can ignore this
          } else {
            console.error(err);
          }
        });
      } else {
        nodeResponse.end();
      }
    } catch (error) {
      console.error(error);
      nodeResponse.writeHead(500);
      nodeResponse.end();
    }
  };
}

const getSocketId = (() => {
  const socketMap = new WeakMap();
  return nodeRequest => {
    if (socketMap.get(nodeRequest.socket) == null) {
      const buffer = Buffer.allocUnsafe(5);

      _crypto.default.randomFillSync(buffer);

      const id = buffer.toString('hex');
      socketMap.set(nodeRequest.socket, {
        id
      });
    }

    return socketMap.get(nodeRequest.socket);
  };
})();

function getUrl(nodeRequest) {
  const isHttpsFromNode = nodeRequest.client.encrypted;
  const isHttpsViaProxy = nodeRequest.headers['x-forwarded-proto'] === 'https';
  const protocolPrefix = isHttpsViaProxy || isHttpsFromNode ? 'https://' : 'http://';
  return new URL(nodeRequest.url, protocolPrefix + nodeRequest.headers.host);
} // "clone" nodeRequest stream without all its properties


function getRequestBody(nodeRequest) {
  const stream = new _stream.PassThrough();
  nodeRequest.pipe(stream);
  return stream;
}

function cleanHeaders(dirtyHeaders) {
  const headers = { ...dirtyHeaders
  };

  for (const name in headers) {
    if (headers[name] == null) {
      delete headers[name];
    }
  }

  return headers;
}