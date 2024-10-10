import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { xssProtection } from './xss-protection.js';

describe('middleware / xss-protection', () => {
  it('no options', async () => {
    const context = initTestContext();
    await xssProtection({})(context);
    assert.equal(context.responseHeaders.get('x-xss-protection'), null);
  });

  it('mode:filter', async () => {
    const context = initTestContext();
    await xssProtection({ mode: 'filter' })(context);
    assert.equal(context.responseHeaders.get('x-xss-protection'), '1');
  });

  it('mode:block', async () => {
    const context = initTestContext();
    await xssProtection({ mode: 'block' })(context);
    assert.equal(context.responseHeaders.get('x-xss-protection'), '1;mode=block');
  });
});
