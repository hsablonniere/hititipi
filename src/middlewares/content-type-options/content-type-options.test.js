import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { contentTypeOptions } from './content-type-options.js';

describe('middleware / content-type-options', () => {
  it('no options', async () => {
    const context = initTestContext();
    const newContext = await contentTypeOptions({})(context);
    assert.equal(newContext.responseHeaders.get('x-content-type-options'), null);
  });

  it('noSniff', async () => {
    const context = initTestContext();
    const newContext = await contentTypeOptions({ noSniff: true })(context);
    assert.equal(newContext.responseHeaders.get('x-content-type-options'), 'nosniff');
  });
});
