import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { contentTypeOptions } from './content-type-options.js';

describe('middleware / content-type-options', () => {
  it('no options', async () => {
    const context = initTestContext();
    await contentTypeOptions({})(context);
    assert.equal(context.responseHeaders.get('x-content-type-options'), null);
  });

  it('noSniff', async () => {
    const context = initTestContext();
    await contentTypeOptions({ noSniff: true })(context);
    assert.equal(context.responseHeaders.get('x-content-type-options'), 'nosniff');
  });
});
