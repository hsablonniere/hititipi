import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { chainAll } from './chain-all.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 */

/** @type {(text: string) => HititipiMiddleware} */
const appendToResponseBody = (text) => {
  return async (context) => {
    context.responseBody = context.responseBody != null ? context.responseBody + '-' + text : text;
  };
};

/** @type {HititipiMiddleware} */
const errorMiddleware = async () => {
  throw new Error('the-middleware-error');
};

/** @type {HititipiMiddleware} */
const noop = async () => {};

describe('middleware / chain-all', () => {
  it('pass context from middleware to middleware', async () => {
    const applyMiddleware = chainAll([
      appendToResponseBody('one'),
      appendToResponseBody('two'),
      appendToResponseBody('three'),
    ]);
    const context = initTestContext();
    await applyMiddleware(context);
    assert.deepStrictEqual(context, {
      ...context,
      responseBody: 'one-two-three',
    });
  });

  it('skip when middlewares are false', async () => {
    const enable = false;
    const applyMiddleware = chainAll([
      appendToResponseBody('one'),
      // falsy will be skipped
      enable && appendToResponseBody('two'),
      appendToResponseBody('three'),
    ]);
    const context = initTestContext();
    await applyMiddleware(context);
    assert.deepStrictEqual(context, {
      ...context,
      responseBody: 'one-three',
    });
  });

  it('catch error in middlewares, stop chain and throw if onError is not defined', async () => {
    const postErrorMiddleware = mock.fn(noop);
    const middlewares = [errorMiddleware, postErrorMiddleware];
    const applyMiddleware = chainAll([...middlewares]);
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
    const applyMiddleware = chainAll(middlewares, (_, error) => {
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
    const applyMiddleware = chainAll(middlewares, async (context, error) => {
      context.responseBody = error.message;
    });
    const context = initTestContext();
    await applyMiddleware(context);
    assert.strictEqual(postErrorMiddleware.mock.callCount(), 0);
    assert.deepStrictEqual(context, {
      ...context,
      responseBody: 'the-middleware-error',
    });
  });
});
