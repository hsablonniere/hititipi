import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { frameOptions } from './frame-options.js';

describe('middleware / frame-options', () => {
  it('no options', async () => {
    const context = initTestContext();
    await frameOptions({})(context);
    assert.equal(context.responseHeaders.get('x-frame-options'), null);
  });

  it('mode:DENY', async () => {
    const context = initTestContext();
    await frameOptions({ mode: 'DENY' })(context);
    assert.equal(context.responseHeaders.get('x-frame-options'), 'DENY');
  });

  it('mode:SAMEORIGIN', async () => {
    const context = initTestContext();
    await frameOptions({ mode: 'SAMEORIGIN' })(context);
    assert.equal(context.responseHeaders.get('x-frame-options'), 'SAMEORIGIN');
  });
});
