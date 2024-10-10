import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { redirectHttps } from './redirect-https.js';

describe('middleware / redirect-https', () => {
  it('redirect if http', async () => {
    const context = initTestContext({ requestUrl: 'http://example.com/foo?bar=42' });
    await redirectHttps()(context);
    assert.equal(context.responseStatus, 301);
    assert.equal(context.responseHeaders.get('location'), 'https://example.com/foo?bar=42');
  });
  it('no redirect if https', async () => {
    const context = initTestContext({ requestUrl: 'https://example.com/foo?bar=42' });
    await redirectHttps()(context);
    assert.equal(context.responseStatus, null);
    assert.equal(context.responseHeaders.get('location'), null);
  });
});
