import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { redirectHttps } from './redirect-https.js';

describe('middleware / redirect-https', () => {
  it('redirect if http', async () => {
    const context = initTestContext();
    context.requestUrl = new URL('http://example.com/foo?bar=42');
    const newContext = await redirectHttps()(context);
    assert.equal(newContext.responseStatus, 301);
    assert.equal(newContext.responseHeaders.get('location'), 'https://example.com/foo?bar=42');
  });
  it('no redirect if https', async () => {
    const context = initTestContext();
    context.requestUrl = new URL('https://example.com/foo?bar=42');
    const newContext = await redirectHttps()(context);
    assert.equal(newContext.responseStatus, null);
    assert.equal(newContext.responseHeaders.get('location'), null);
  });
});
