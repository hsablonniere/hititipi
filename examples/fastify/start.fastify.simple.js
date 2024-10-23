import Fastify from 'fastify';

const [PORT_STRING = '8080'] = process.argv.slice(2);
const PORT = Number(PORT_STRING);

const fastify = Fastify();

fastify.get('/', async function handler(request, reply) {
  const fooHeader = request.headers['foo'];
  if (fooHeader != null) {
    reply.header('foo', fooHeader);
  }
  const barHeader = request.headers['bar'];
  if (barHeader != null) {
    reply.header('bar', barHeader);
  }
  return {
    message: 'Hello world!',
    requestMethod: request.method,
    requestUrl: request.url,
  };
});

try {
  await fastify.listen({ port: PORT });
  console.log(`[Fastify] Listening on port ${PORT} ...`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
