import http from 'node:http';

const [PORT_STRING = '8080'] = process.argv.slice(2);
const PORT = Number(PORT_STRING);

http
  .createServer(async (nodeRequest, nodeResponse) => {
    try {
      const responseHeaders = Object.create(null);
      const fooHeader = nodeRequest.headers['foo'];
      if (fooHeader != null) {
        responseHeaders['foo'] = fooHeader;
      }
      const barHeader = nodeRequest.headers['bar'];
      if (barHeader != null) {
        responseHeaders['bar'] = barHeader;
      }
      const bodyString = JSON.stringify({
        message: 'Hello world!',
        requestMethod: nodeRequest.method,
        requestUrl: nodeRequest.url,
      });
      const bodyBuffer = Buffer.from(bodyString);
      responseHeaders['content-type'] = 'application/json';
      responseHeaders['content-length'] = bodyBuffer.length;

      nodeResponse.writeHead(200, responseHeaders);
      nodeResponse.write(bodyBuffer);
      nodeResponse.end();
    } catch (error) {
      console.error(error);
      if (!nodeResponse.headersSent) {
        nodeResponse.writeHead(500);
      }
      nodeResponse.end();
    }
  })
  .listen(PORT);

console.log(`[Node.js] Listening on port ${PORT} ...`);
