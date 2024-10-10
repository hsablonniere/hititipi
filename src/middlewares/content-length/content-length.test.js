import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { contentLength } from './content-length.js';

describe('middleware / content-length', () => {
  it('no responseBody', async () => {
    const context = initTestContext();
    await contentLength()(context);
    assert.equal(context.responseHeaders.get('content-length'), null);
  });

  it('string responseBody', async () => {
    const context = initTestContext();
    context.responseSize = 5;
    await contentLength()(context);
    assert.equal(context.responseHeaders.get('content-length'), '5');
  });
});
