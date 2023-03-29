import { notFound } from '../../src/middlewares/not-found.js';
import assert from 'assert';

const INIT_CONTEXT = {
  requestMethod: 'GET',
  requestUrl: new URL('http://localhost:8080'),
  requestHeaders: {
    'accept': '*/*',
  },
};

describe('not-found middleware', () => {

  it('no responseStatus yet', () => {
    const context = notFound()({
      ...INIT_CONTEXT,
    });
    assert.deepStrictEqual(context, {
      ...INIT_CONTEXT,
      responseStatus: 404,
    });
  });

  it('responseStatus already set', () => {
    const context = notFound()({
      ...INIT_CONTEXT,
      responseStatus: 201,
    });
    assert.equal(context, null);
  });
});
