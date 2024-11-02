import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { redirectWww } from './redirect-www.js';

describe('middleware / redirect-www', () => {
  it('redirect if domain matches', async () => {
    const context = initTestContext({
      requestUrl: '/foo?bar=42',
      requestHeaders: { host: 'example.com' },
    });
    await redirectWww({ hostnames: ['example.com'] })(context);
    assert.equal(context.responseStatus, 301);
    assert.equal(context.responseHeaders.get('location'), 'http://www.example.com/foo?bar=42');
  });
  it('no redirect if domain does not match', async () => {
    const context = initTestContext({
      requestUrl: '/foo?bar=42',
      requestHeaders: { host: 'localhost:8080' },
    });
    await redirectWww({ hostnames: ['example.com'] })(context);
    assert.equal(context.responseStatus, null);
    assert.equal(context.responseHeaders.get('location'), null);
  });
  it('no redirect if subdomain is present', async () => {
    const context = initTestContext({
      requestUrl: '/foo?bar=42',
      requestHeaders: { host: 'one.example.com' },
    });
    await redirectWww({ hostnames: ['example.com'] })(context);
    assert.equal(context.responseStatus, null);
    assert.equal(context.responseHeaders.get('location'), null);
  });
});
