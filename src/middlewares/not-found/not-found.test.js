import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { notFound } from './not-found.js';

describe('middleware / not-found', () => {
  it('no options', async () => {
    const context = initTestContext();
    const newContext = await notFound()(context);
    assert.equal(newContext.responseStatus, 404);
    assert.equal(newContext.responseBody, '');
  });
});
