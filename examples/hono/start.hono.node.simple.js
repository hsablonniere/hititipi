import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { getRandomId } from '../../src/hititipi.common.js';

const [PORT_STRING = '8080'] = process.argv.slice(2);
const PORT = Number(PORT_STRING);

const app = new Hono();

app.all('/*', (c) => {
  const fooHeader = c.req.header('foo');
  if (fooHeader != null) {
    c.res.headers.set('foo', fooHeader);
  }
  const barHeader = c.req.header('bar');
  if (barHeader != null) {
    c.res.headers.set('bar', barHeader);
  }
  return c.json({
    requestId: getRandomId(),
    requestMethod: c.req.method,
    requestUrl: c.req.url,
  });
});

console.log(`[Hono] is running on port ${PORT} ...`);

serve({
  fetch: app.fetch,
  port: PORT,
});
