import assert from 'assert';
import sinon from 'sinon';
import { chainAll } from '../../src/middlewares/chain-all.js';

describe('chain-all middleware', () => {

  const sandbox = sinon.createSandbox();

  beforeEach(() => sandbox.stub(console, 'error'));

  afterEach(() => sandbox.restore());

  it('call all middlewares in order', async () => {

    const middlewareOne = sandbox.fake((ctx) => ctx);
    const middlewareTwo = sandbox.fake((ctx) => ctx);
    const middlewareThree = sandbox.fake((ctx) => ctx);

    const applyMiddleware = chainAll([middlewareOne, middlewareTwo, middlewareThree]);
    await applyMiddleware();

    sinon.assert.callOrder(middlewareOne, middlewareTwo, middlewareThree);
  });

  it('pass context from middleware to middleware', async () => {

    const applyMiddleware = chainAll([
      (context) => {
        return { ...context, test: context.init };
      },
      (context) => {
        return { ...context, test: context.test + 1 };
      },
      (context) => {
        return { ...context, test: context.test + 1 };
      },
    ]);
    const context = await applyMiddleware({ init: 40 });

    assert.deepStrictEqual(context, { init: 40, test: 42 });
  });

  it('accept async middlewares', async () => {

    const applyMiddleware = chainAll([
      async (context) => {
        return { ...context, test: context.init };
      },
      async (context) => {
        return { ...context, test: context.test + 1 };
      },
      async (context) => {
        return { ...context, test: context.test + 1 };
      },
    ]);
    const context = await applyMiddleware({ init: 40 });

    assert.deepStrictEqual(context, { init: 40, test: 42 });
  });

  it('reuse previous context when middleware returns null', async () => {

    const middlewareOne = sandbox.fake((ctx) => null);
    const middlewareTwo = sandbox.fake((ctx) => null);

    const applyMiddleware = chainAll([middlewareOne, middlewareTwo]);
    const context = await applyMiddleware({ init: 40 });

    assert.deepStrictEqual(context, { init: 40 });
  });

  it('apply function when middlewares returns function', async () => {

    const middlewareCalls = [];

    const applyMiddleware = chainAll([
      (context) => {
        middlewareCalls[0] = '0';
        return { ...context, test: context.init };
      },
      () => {
        middlewareCalls[1] = '1';
        return () => {
          middlewareCalls[2] = '2';
          return (context) => {
            middlewareCalls[3] = '3';
            return { ...context, test: context.test + 1 };
          };
        };
      },
      (context) => {
        middlewareCalls[4] = '4';
        return { ...context, test: context.test + 1 };
      },
    ]);
    const context = await applyMiddleware({ init: 40 });

    assert.deepStrictEqual(context, { init: 40, test: 42 });
    assert.deepStrictEqual(middlewareCalls, ['0', '1', '2', '3', '4']);
  });

  it('catch error in middlewares, stop chain and throw if onError is not defined', async () => {

    const postErrorMiddleware = sandbox.spy();

    const applyMiddleware = chainAll(
      [
        (context) => {
          throw new Error('the-middleware-error');
        },
        postErrorMiddleware,
      ],
    );

    await assert.rejects(
      async () => {
        const context = await applyMiddleware({ foo: 'bar' });
      },
      {
        name: 'Error',
        message: 'the-middleware-error',
      },
    );

    assert.strictEqual(postErrorMiddleware.callCount, 0);
  });

  it('catch error in middlewares, stop chain, call onError if defined then catch error in onError', async () => {

    const postErrorMiddleware = sandbox.spy();

    const applyMiddleware = chainAll(
      [
        (context) => {
          throw new Error('the-middleware-error');
        },
      ],
      (context, error) => {
        throw new Error('the-onerror-error');
      },
    );

    await assert.rejects(
      async () => {
        const context = await applyMiddleware({ foo: 'bar' });
      },
      {
        name: 'Error',
        message: 'the-onerror-error',
      },
    );

    assert.strictEqual(postErrorMiddleware.callCount, 0);
  });

  it('catch error in middlewares, stop chain, call onError if defined and return context from onError', async () => {

    const postErrorMiddleware = sandbox.spy();
    const onError = sandbox.fake((context, error) => {
      return { fromError: true };
    });

    const applyMiddleware = chainAll(
      [
        (context) => {
          throw new Error('the-middleware-error');
        },
      ],
      onError,
    );

    const context = await applyMiddleware({ foo: 'bar' });

    assert.strictEqual(postErrorMiddleware.callCount, 0);
    assert.deepStrictEqual(onError.firstCall.args[0], { foo: 'bar' });
    assert.strictEqual(onError.firstCall.args[1] instanceof Error, true);
    assert.strictEqual(onError.firstCall.args[1].message, 'the-middleware-error');
    assert.deepStrictEqual(context, { fromError: true });
  });
});
