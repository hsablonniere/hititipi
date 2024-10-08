import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { redirectWww } from './redirect-www.js';

describe('middleware / redirect-www', () => {
  it('redirect if domain matches', async () => {
    const context = initTestContext();
    context.requestUrl = new URL('http://example.com/foo?bar=42');
    const newContext = await redirectWww({ hostnames: ['example.com'] })(context);
    assert.equal(newContext.responseStatus, 301);
    assert.equal(newContext.responseHeaders.get('location'), 'http://www.example.com/foo?bar=42');
  });
  it('no redirect if domain does not match', async () => {
    const context = initTestContext();
    context.requestUrl = new URL('http://localhost:8080/foo?bar=42');
    const newContext = await redirectWww({ hostnames: ['example.com'] })(context);
    assert.equal(newContext.responseStatus, null);
    assert.equal(newContext.responseHeaders.get('location'), null);
  });
  it('no redirect if subdomain is present', async () => {
    const context = initTestContext();
    context.requestUrl = new URL('http://one.example.com/foo?bar=42');
    const newContext = await redirectWww({ hostnames: ['example.com'] })(context);
    assert.equal(newContext.responseStatus, null);
    assert.equal(newContext.responseHeaders.get('location'), null);
  });
});
