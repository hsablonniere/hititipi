import http from 'node:http';
import { hititipi } from '../src/hititipi.node.js';
import { sendJson } from '../src/middlewares/send-json/send-json.js';

const [PORT_STRING = '8080'] = process.argv.slice(2);
const PORT = Number(PORT_STRING);

http
  .createServer(
    hititipi(async (context) => {
      context.responseHeaders.set('foo', context.requestHeaders.get('foo'));
      context.responseHeaders.set('bar', context.requestHeaders.get('bar'));
      return sendJson(200, {
        message: 'Hello world!',
        requestMethod: context.requestMethod,
        requestUrl: context.requestUrl,
      })(context);
    }),
  )
  .listen(PORT);

console.log(`[Node.js] Listening on port ${PORT} ...`);
