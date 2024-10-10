import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { referrerPolicy } from './referrer-policy.js';

describe('middleware / referrer-policy', () => {
  it('no policy', async () => {
    const context = initTestContext();
    await referrerPolicy({})(context);
    assert.equal(context.responseHeaders.get('referrer-policy'), null);
  });

  it('policy:no-referrer', async () => {
    const context = initTestContext();
    await referrerPolicy({ policy: 'no-referrer' })(context);
    assert.equal(context.responseHeaders.get('referrer-policy'), 'no-referrer');
  });

  it('policy:no-referrer-when-downgrade', async () => {
    const context = initTestContext();
    await referrerPolicy({ policy: 'no-referrer-when-downgrade' })(context);
    assert.equal(context.responseHeaders.get('referrer-policy'), 'no-referrer-when-downgrade');
  });

  it('policy:origin', async () => {
    const context = initTestContext();
    await referrerPolicy({ policy: 'origin' })(context);
    assert.equal(context.responseHeaders.get('referrer-policy'), 'origin');
  });

  it('policy:origin-when-cross-origin', async () => {
    const context = initTestContext();
    await referrerPolicy({ policy: 'origin-when-cross-origin' })(context);
    assert.equal(context.responseHeaders.get('referrer-policy'), 'origin-when-cross-origin');
  });

  it('policy:same-origin', async () => {
    const context = initTestContext();
    await referrerPolicy({ policy: 'same-origin' })(context);
    assert.equal(context.responseHeaders.get('referrer-policy'), 'same-origin');
  });

  it('policy:strict-origin', async () => {
    const context = initTestContext();
    await referrerPolicy({ policy: 'strict-origin' })(context);
    assert.equal(context.responseHeaders.get('referrer-policy'), 'strict-origin');
  });

  it('policy:strict-origin-when-cross-origin', async () => {
    const context = initTestContext();
    await referrerPolicy({ policy: 'strict-origin-when-cross-origin' })(context);
    assert.equal(context.responseHeaders.get('referrer-policy'), 'strict-origin-when-cross-origin');
  });

  it('policy:unsafe-url', async () => {
    const context = initTestContext();
    await referrerPolicy({ policy: 'unsafe-url' })(context);
    assert.equal(context.responseHeaders.get('referrer-policy'), 'unsafe-url');
  });
});
