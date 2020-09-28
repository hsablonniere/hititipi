import assert from 'assert';
import http from 'http';
import sinon from 'sinon';
import supertest from 'supertest';
import { expectNullHeaders } from './lib/test-utils.js';
import { hititipi } from '../src/hititipi.js';
import { Readable } from 'stream';
import { streamToString } from './lib/stream-utils.js';

describe('hititipi', () => {

  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    return sandbox.stub(console, 'error');
    // .callsFake((error) => console.error.wrappedMethod(error)););
  });

  afterEach(() => sandbox.restore());

  it('provide context.socket.id', () => {

    const httpServer = http.createServer(hititipi((context) => {
      return {
        ...context,
        responseStatus: 200,
        responseBody: Readable.from('socket-id:' + context.socket.id),
      };
    }));

    return supertest(httpServer)
      .get('/')
      .expect(200, /^socket-id:[a-f0-9]{10}$/);
  });

  it('provide context.requestMethod', async () => {

    const httpServer = http.createServer(hititipi((context) => {
      return {
        ...context,
        responseStatus: 200,
        responseBody: Readable.from('method:' + context.requestMethod),
      };
    }));

    await supertest(httpServer)
      .get('/')
      .expect(200, 'method:GET');

    await supertest(httpServer)
      .put('/')
      .expect(200, 'method:PUT');

    await supertest(httpServer)
      .del('/')
      .expect(200, 'method:DELETE');
  });

  it('provide context.requestUrl', () => {

    const httpServer = http.createServer(hititipi((context) => {
      return {
        ...context,
        responseStatus: 200,
        responseHeaders: { 'content-type': 'application/json' },
        responseBody: Readable.from(JSON.stringify({
          hash: context.requestUrl.hash,
          host: context.requestUrl.host,
          hostname: context.requestUrl.hostname,
          href: context.requestUrl.href,
          origin: context.requestUrl.origin,
          password: context.requestUrl.password,
          pathname: context.requestUrl.pathname,
          port: context.requestUrl.port,
          protocol: context.requestUrl.protocol,
          search: context.requestUrl.search,
          searchParams: Array.from(context.requestUrl.searchParams.entries()),
          username: context.requestUrl.username,
        })),
      };
    }));
    httpServer.listen(0);

    const port = httpServer.address().port;

    return supertest(`http://localhost:${port}`)
      .get(`/the-path?one=111&two=222&foobar=foo&foobar=bar`)
      .then((res) => {
        assert.strictEqual(res.body.hash, '');
        assert.strictEqual(res.body.host, 'localhost:' + port);
        assert.strictEqual(res.body.hostname, 'localhost');
        assert.strictEqual(res.body.href, `http://localhost:${port}/the-path?one=111&two=222&foobar=foo&foobar=bar`);
        assert.strictEqual(res.body.origin, 'http://localhost:' + port);
        assert.strictEqual(res.body.pathname, '/the-path');
        assert.strictEqual(res.body.port, `${port}`);
        assert.strictEqual(res.body.protocol, 'http:');
        assert.strictEqual(res.body.search, '?one=111&two=222&foobar=foo&foobar=bar');
        assert.deepStrictEqual(res.body.searchParams, [
          ['one', '111'],
          ['two', '222'],
          ['foobar', 'foo'],
          ['foobar', 'bar'],
        ]);

        // Seems like supertest does not handle username:password@ in URLs properly
        assert.strictEqual(res.body.password, '');
        assert.strictEqual(res.body.username, '');
      });
  });

  it('provide context.requestHeaders', () => {

    const httpServer = http.createServer(hititipi((context) => {
      return {
        ...context,
        responseStatus: 200,
        responseHeaders: { 'content-type': 'application/json' },
        responseBody: Readable.from(JSON.stringify(context.requestHeaders)),
      };
    }));

    return supertest(httpServer)
      .get('/')
      .set('x-one', '111')
      .set('x-two', '222')
      .expect(200)
      .then((res) => {
        assert.strictEqual(res.body['x-one'], '111');
        assert.strictEqual(res.body['x-two'], '222');
      });
  });

  it('provide context.requestBody stream', () => {

    const httpServer = http.createServer(hititipi(async (context) => {
      const requestBodyString = await streamToString(context.requestBody);
      return { ...context, responseStatus: 200, responseBody: Readable.from(requestBodyString + ':pong') };
    }));

    return supertest(httpServer)
      .post('/')
      .send('ping')
      .expect(200, 'ping:pong');
  });

  it('use context.responseStatus to send head', () => {

    const httpServer = http.createServer(hititipi((context) => {
      return { ...context, responseStatus: 204 };
    }));

    return supertest(httpServer)
      .get('/')
      .expect(204);
  });

  it('use context.responseHeaders to send head', () => {

    const httpServer = http.createServer(hititipi((context) => {
      return { ...context, responseStatus: 204, responseHeaders: { 'x-one': '111', 'x-two': '222' } };
    }));

    return supertest(httpServer)
      .get('/')
      .expect('x-one', '111')
      .expect('x-two', '222');
  });

  it('filter out nullish context.responseHeaders', () => {

    const httpServer = http.createServer(hititipi((context) => {
      return { ...context, responseStatus: 204, responseHeaders: { 'x-undefined': undefined, 'x-null': null } };
    }));

    return supertest(httpServer)
      .get('/')
      .then(expectNullHeaders('x-undefined', 'x-null'));
  });

  it('use context.responseBody stream to send body', () => {

    const httpServer = http.createServer(hititipi((context) => {
      return { ...context, responseStatus: 200, responseBody: Readable.from('the-response-body') };
    }));

    return supertest(httpServer)
      .get('/')
      .expect(200, 'the-response-body');
  });

  it('use context.responseBody nullish to send empty body', () => {

    const httpServer = http.createServer(hititipi((context) => {
      return { ...context, responseStatus: 200 };
    }));

    return supertest(httpServer)
      .get('/')
      .expect(200, '');
  });

  it('return default HTTP 500 on error', () => {

    const httpServer = http.createServer(hititipi(
      (context) => {
        throw new Error('the-error');
      },
    ));

    return supertest(httpServer)
      .get('/')
      .expect(500)
      .then(() => {
        assert.strictEqual(console.error.callCount, 1);
        assert.strictEqual(console.error.firstCall.args[0].message, 'the-error');
      });
  });

  it('do not crash server on errors when streaming responseBody', async () => {

    const catchClientError = sandbox.spy();

    const httpServer = http.createServer(hititipi((context) => {
        if (context.requestUrl.pathname !== '/error') {
          return { ...context, responseStatus: 200 };
        }
        const responseBody = new Readable({
          read () {
            this.destroy(new Error());
          },
        });
        return { ...context, responseStatus: 200, responseBody };
      },
    ));

    await supertest(httpServer)
      .get('/error')
      .catch(catchClientError)
      .then(() => {
        assert.strictEqual(catchClientError.callCount, 1);
      });

    await supertest(httpServer)
      .get('/')
      .expect(200, '');
  });
});
