import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { cacheControl } from './cache-control.js';

describe('middleware / cache-control', () => {
  it('no options', async () => {
    const context = initTestContext();
    const newContext = await cacheControl({})(context);
    assert.equal(newContext.responseHeaders.get('cache-control'), null);
  });

  it('public', async () => {
    const context = initTestContext();
    const newContext = await cacheControl({ public: true })(context);
    assert.equal(newContext.responseHeaders.get('cache-control'), 'public');
  });

  it('private', async () => {
    const context = initTestContext();
    const newContext = await cacheControl({ private: true })(context);
    assert.equal(newContext.responseHeaders.get('cache-control'), 'private');
  });

  it('noCache', async () => {
    const context = initTestContext();
    const newContext = await cacheControl({ 'no-cache': true })(context);
    assert.equal(newContext.responseHeaders.get('cache-control'), 'no-cache');
  });

  it('noStore', async () => {
    const context = initTestContext();
    const newContext = await cacheControl({ 'no-store': true })(context);
    assert.equal(newContext.responseHeaders.get('cache-control'), 'no-store');
  });

  it('mustRevalidate', async () => {
    const context = initTestContext();
    const newContext = await cacheControl({ 'must-revalidate': true })(context);
    assert.equal(newContext.responseHeaders.get('cache-control'), 'must-revalidate');
  });

  it('proxyRevalidate', async () => {
    const context = initTestContext();
    const newContext = await cacheControl({ 'proxy-revalidate': true })(context);
    assert.equal(newContext.responseHeaders.get('cache-control'), 'proxy-revalidate');
  });

  it('immutable', async () => {
    const context = initTestContext();
    const newContext = await cacheControl({ immutable: true })(context);
    assert.equal(newContext.responseHeaders.get('cache-control'), 'immutable');
  });

  it('noTransform', async () => {
    const context = initTestContext();
    const newContext = await cacheControl({ 'no-transform': true })(context);
    assert.equal(newContext.responseHeaders.get('cache-control'), 'no-transform');
  });

  it('maxAge', async () => {
    const context = initTestContext();
    const newContext = await cacheControl({ 'max-age': 100 })(context);
    assert.equal(newContext.responseHeaders.get('cache-control'), 'max-age=100');
  });

  it('sMaxage', async () => {
    const context = initTestContext();
    const newContext = await cacheControl({ 's-maxage': 100 })(context);
    assert.equal(newContext.responseHeaders.get('cache-control'), 's-maxage=100');
  });

  it('staleWhileRevalidate', async () => {
    const context = initTestContext();
    const newContext = await cacheControl({ 'stale-while-revalidate': 100 })(context);
    assert.equal(newContext.responseHeaders.get('cache-control'), 'stale-while-revalidate=100');
  });

  it('staleIfError', async () => {
    const context = initTestContext();
    const newContext = await cacheControl({ 'stale-if-error': 100 })(context);
    assert.equal(newContext.responseHeaders.get('cache-control'), 'stale-if-error=100');
  });

  it('multiple options', async () => {
    const context = initTestContext();
    const newContext = await cacheControl({ private: true, 'no-transform': true, 'max-age': 100 })(context);
    assert.equal(newContext.responseHeaders.get('cache-control'), 'private,no-transform,max-age=100');
  });
});
