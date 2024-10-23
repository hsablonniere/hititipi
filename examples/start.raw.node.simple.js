import http from 'node:http';
import { getRandomId } from '../src/hititipi.common.js';

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
      const body = JSON.stringify({
        requestId: getRandomId(),
        requestMethod: nodeRequest.method,
        requestUrl: nodeRequest.url,
      });
      responseHeaders['content-type'] = 'application/json';
      responseHeaders['content-length'] = Buffer.from(body).length;

      nodeResponse.writeHead(200, responseHeaders);
      nodeResponse.write(body);
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
