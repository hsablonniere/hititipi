import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { chainUntilResponse } from './chain-until-response.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 */

/**
 * @param {Headers} headers
 * @param {string} headerName
 * @param {string} headerValue
 */
function appendHeader(headers, headerName, headerValue) {
  if (headers.get(headerName) == null) {
    headers.set(headerName, headerValue);
  } else {
    headers.set(headerName, headers.get(headerName) + '-' + headerValue);
  }
}

/** @type {(text: string) => HititipiMiddleware} */
const appendToResponseHeader = (text) => {
  return async (context) => {
    appendHeader(context.responseHeaders, 'x-text', text);
  };
};

/** @type {HititipiMiddleware} */
const errorMiddleware = async () => {
  throw new Error('the-middleware-error');
};

/** @type {HititipiMiddleware} */
const noop = async () => {};

describe('middleware / chain-until-response', () => {
  it('pass context from middleware to middleware', async () => {
    const applyMiddleware = chainUntilResponse([
      appendToResponseHeader('one'),
      appendToResponseHeader('two'),
      appendToResponseHeader('three'),
    ]);
    const context = initTestContext();
    await applyMiddleware(context);
    assert.strictEqual(context.responseHeaders.get('x-text'), 'one-two-three');
  });

  it('skip when middlewares are false', async () => {
    const enable = false;
    const applyMiddleware = chainUntilResponse([
      appendToResponseHeader('one'),
      // falsy will be skipped
      enable && appendToResponseHeader('two'),
      appendToResponseHeader('three'),
    ]);
    const context = initTestContext();
    await applyMiddleware(context);
    assert.strictEqual(context.responseHeaders.get('x-text'), 'one-three');
  });

  it('responseBody is not null, stop chain and return context', async () => {
    const applyMiddleware = chainUntilResponse([
      appendToResponseHeader('one'),
      async (context) => {
        appendHeader(context.responseHeaders, 'x-text', 'two');
        context.responseBody = 'response-body';
      },
      appendToResponseHeader('three'),
    ]);
    const context = initTestContext();
    await applyMiddleware(context);
    assert.deepStrictEqual(context, {
      ...context,
      responseBody: 'response-body',
    });
    assert.strictEqual(context.responseHeaders.get('x-text'), 'one-two');
  });

  it('responseStatus is 204, stop chain and return context', async () => {
    const applyMiddleware = chainUntilResponse([
      appendToResponseHeader('one'),
      async (context) => {
        appendHeader(context.responseHeaders, 'x-text', 'two');
        context.responseStatus = 204;
      },
      appendToResponseHeader('three'),
    ]);
    const context = initTestContext();
    await applyMiddleware(context);
    assert.deepStrictEqual(context, {
      ...context,
      responseStatus: 204,
    });
    assert.strictEqual(context.responseHeaders.get('x-text'), 'one-two');
  });

  it('responseStatus is 301, stop chain and return context', async () => {
    const applyMiddleware = chainUntilResponse([
      appendToResponseHeader('one'),
      async (context) => {
        appendHeader(context.responseHeaders, 'x-text', 'two');
        context.responseStatus = 301;
      },
      appendToResponseHeader('three'),
    ]);
    const context = initTestContext();
    await applyMiddleware(context);
    assert.deepStrictEqual(context, {
      ...context,
      responseStatus: 301,
    });
    assert.strictEqual(context.responseHeaders.get('x-text'), 'one-two');
  });

  it('responseStatus is 302, stop chain and return context', async () => {
    const applyMiddleware = chainUntilResponse([
      appendToResponseHeader('one'),
      async (context) => {
        appendHeader(context.responseHeaders, 'x-text', 'two');
        context.responseStatus = 302;
      },
      appendToResponseHeader('three'),
    ]);
    const context = initTestContext();
    await applyMiddleware(context);
    assert.deepStrictEqual(context, {
      ...context,
      responseStatus: 302,
    });
    assert.strictEqual(context.responseHeaders.get('x-text'), 'one-two');
  });

  it('responseStatus is 304, stop chain and return context', async () => {
    const applyMiddleware = chainUntilResponse([
      appendToResponseHeader('one'),
      async (context) => {
        appendHeader(context.responseHeaders, 'x-text', 'two');
        context.responseStatus = 304;
      },
      appendToResponseHeader('three'),
    ]);
    const context = initTestContext();
    await applyMiddleware(context);
    assert.deepStrictEqual(context, {
      ...context,
      responseStatus: 304,
    });
    assert.strictEqual(context.responseHeaders.get('x-text'), 'one-two');
  });

  it('catch error in middlewares, stop chain and throw if onError is not defined', async () => {
    const postErrorMiddleware = mock.fn(noop);
    const middlewares = [errorMiddleware, postErrorMiddleware];
    const applyMiddleware = chainUntilResponse([...middlewares]);
    await assert.rejects(
      async () => {
        await applyMiddleware(initTestContext());
      },
      {
        name: 'Error',
        message: 'the-middleware-error',
      },
    );
    assert.strictEqual(postErrorMiddleware.mock.callCount(), 0);
  });

  it('catch error in middlewares, stop chain, call onError if defined then catch error in onError', async () => {
    const postErrorMiddleware = mock.fn(noop);
    const middlewares = [errorMiddleware, postErrorMiddleware];
    const applyMiddleware = chainUntilResponse(middlewares, (_, error) => {
      throw new Error(error.message + '-through-onerror');
    });
    await assert.rejects(
      async () => {
        await applyMiddleware(initTestContext());
      },
      {
        name: 'Error',
        message: 'the-middleware-error-through-onerror',
      },
    );
    assert.strictEqual(postErrorMiddleware.mock.callCount(), 0);
  });

  it('catch error in middlewares, stop chain, call onError if defined and return context from onError', async () => {
    const postErrorMiddleware = mock.fn(noop);
    const middlewares = [errorMiddleware, postErrorMiddleware];
    const applyMiddleware = chainUntilResponse(middlewares, async (context, error) => {
      context.responseHeaders.set('x-error', error.message);
    });
    const context = initTestContext();
    await applyMiddleware(context);
    assert.strictEqual(postErrorMiddleware.mock.callCount(), 0);
    assert.strictEqual(context.responseHeaders.get('x-error'), 'the-middleware-error');
  });
});
