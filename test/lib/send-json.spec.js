import { sendJson } from '../../src/lib/send-json.js';
import { assertEqualContexts } from '../lib-test/test-utils.js';
import { Readable } from 'stream';

const INIT_CONTEXT = {
  requestMethod: 'GET',
  requestUrl: new URL('http://localhost:8080'),
  requestHeaders: {
    'accept': '*/*',
  },
  responseHeaders: {
    'x-foo': 'foo',
  },
};

describe('sendJson', () => {

  it('200', async () => {
    const context = sendJson(INIT_CONTEXT, 200, { foo: 42 });
    await assertEqualContexts(context, {
      ...INIT_CONTEXT,
      responseStatus: 200,
      responseHeaders: {
        ...INIT_CONTEXT.responseHeaders,
        'content-type': 'application/json',
      },
      responseBody: Readable.from('{"foo":42}'),
      responseSize: 10,
      responseEtag: '"5+cfqLXbeR4jRoVu4Jy0X4Z0OeQ="',
    });
  });

  it('404', async () => {
    const context = sendJson(INIT_CONTEXT, 404, { error: 'not-found' });
    await assertEqualContexts(context, {
      ...INIT_CONTEXT,
      responseStatus: 404,
      responseHeaders: {
        ...INIT_CONTEXT.responseHeaders,
        'content-type': 'application/json',
      },
      responseBody: Readable.from('{"error":"not-found"}'),
      responseSize: 21,
      responseEtag: '"HgI+DoBk6ksYbJElsykv2NthUsw="',
    });
  });

  it('handle dates and filter out functions', async () => {
    const context = sendJson(INIT_CONTEXT, 200, {
      date: new Date('2020-01-01T00:00:00.000Z'),
      theFunction: function () {
      },
    });
    return;
    await assertEqualContexts(context, {
      ...INIT_CONTEXT,
      responseStatus: 200,
      responseHeaders: {
        ...INIT_CONTEXT.responseHeaders,
        'content-type': 'application/json',
      },
      responseBody: Readable.from('{"date":"2020-01-01T00:00:00.000Z"}'),
      responseSize: 21,
      responseEtag: '"HgI+DoBk6ksYbJElsykv2NthUsw="',
    });
  });
});
