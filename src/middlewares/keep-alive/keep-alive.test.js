import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { keepAlive } from './keep-alive.js';

describe('middleware / keep-alive', () => {
  it('enabled', async () => {
    const context = initTestContext();
    const newContext = await keepAlive({
      enabled: true,
    })(context);
    assert.equal(newContext.responseHeaders.get('connection'), 'keep-alive');
    assert.ok(newContext.responseHeaders.get('keep-alive') == null);
  });
  it('enabled with timeout', async () => {
    const context = initTestContext();
    const newContext = await keepAlive({
      enabled: true,
      timeout: 30,
    })(context);
    assert.equal(newContext.responseHeaders.get('connection'), 'keep-alive');
    assert.equal(newContext.responseHeaders.get('keep-alive'), 'timeout=30');
  });
  it('enabled with max requests', async () => {
    const context = initTestContext();
    const newContext = await keepAlive({
      enabled: true,
      maxRequests: 50,
    })(context);
    assert.equal(newContext.responseHeaders.get('connection'), 'keep-alive');
    assert.equal(newContext.responseHeaders.get('keep-alive'), 'max=50');
  });
  it('enabled with timeout and max requests', async () => {
    const context = initTestContext();
    const newContext = await keepAlive({
      enabled: true,
      timeout: 30,
      maxRequests: 50,
    })(context);
    assert.equal(newContext.responseHeaders.get('connection'), 'keep-alive');
    assert.equal(newContext.responseHeaders.get('keep-alive'), 'timeout=30,max=50');
  });
  it('disabled', async () => {
    const context = initTestContext();
    const newContext = await keepAlive({
      enabled: false,
    })(context);
    assert.equal(newContext.responseHeaders.get('connection'), 'close');
    assert.ok(newContext.responseHeaders.get('keep-alive') == null);
  });
});
