import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { requestId } from './request-id.js';

describe('middleware / request-id', () => {
  it('should add a x-request-id response header', async () => {
    const context = initTestContext();
    await requestId()(context);
    assert.strictEqual(context.responseHeaders.get('x-request-id'), 'random-id');
  });
});
