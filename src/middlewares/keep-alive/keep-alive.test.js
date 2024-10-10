import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { keepAlive } from './keep-alive.js';

describe('middleware / keep-alive', () => {
  describe('HTTP 1.1', () => {
    it('enabled', async () => {
      const context = initTestContext({ requestHttpVersion: 1 });
      await keepAlive({
        enabled: true,
      })(context);
      assert.equal(context.responseHeaders.get('connection'), 'keep-alive');
      assert.ok(context.responseHeaders.get('keep-alive') == null);
    });
    it('enabled with timeout', async () => {
      const context = initTestContext({ requestHttpVersion: 1 });
      await keepAlive({
        enabled: true,
        timeout: 30,
      })(context);
      assert.equal(context.responseHeaders.get('connection'), 'keep-alive');
      assert.equal(context.responseHeaders.get('keep-alive'), 'timeout=30');
    });
    it('enabled with max requests', async () => {
      const context = initTestContext({ requestHttpVersion: 1 });
      await keepAlive({
        enabled: true,
        maxRequests: 50,
      })(context);
      assert.equal(context.responseHeaders.get('connection'), 'keep-alive');
      assert.equal(context.responseHeaders.get('keep-alive'), 'max=50');
    });
    it('enabled with timeout and max requests', async () => {
      const context = initTestContext({ requestHttpVersion: 1 });
      await keepAlive({
        enabled: true,
        timeout: 30,
        maxRequests: 50,
      })(context);
      assert.equal(context.responseHeaders.get('connection'), 'keep-alive');
      assert.equal(context.responseHeaders.get('keep-alive'), 'timeout=30,max=50');
    });
    it('disabled', async () => {
      const context = initTestContext({ requestHttpVersion: 1 });
      await keepAlive({
        enabled: false,
      })(context);
      assert.equal(context.responseHeaders.get('connection'), 'close');
      assert.ok(context.responseHeaders.get('keep-alive') == null);
    });
  });

  describe('HTTP/2', () => {
    it('enabled', async () => {
      const context = initTestContext({ requestHttpVersion: 2 });
      await keepAlive({
        enabled: true,
      })(context);
      assert.ok(context.responseHeaders.get('connection') == null);
      assert.ok(context.responseHeaders.get('keep-alive') == null);
    });
    it('enabled with timeout', async () => {
      const context = initTestContext({ requestHttpVersion: 2 });
      await keepAlive({
        enabled: true,
        timeout: 30,
      })(context);
      assert.ok(context.responseHeaders.get('connection') == null);
      assert.ok(context.responseHeaders.get('keep-alive') == null);
    });
    it('enabled with max requests', async () => {
      const context = initTestContext({ requestHttpVersion: 2 });
      await keepAlive({
        enabled: true,
        maxRequests: 50,
      })(context);
      assert.ok(context.responseHeaders.get('connection') == null);
      assert.ok(context.responseHeaders.get('keep-alive') == null);
    });
    it('enabled with timeout and max requests', async () => {
      const context = initTestContext({ requestHttpVersion: 2 });
      await keepAlive({
        enabled: true,
        timeout: 30,
        maxRequests: 50,
      })(context);
      assert.ok(context.responseHeaders.get('connection') == null);
      assert.ok(context.responseHeaders.get('keep-alive') == null);
    });
    it('disabled', async () => {
      const context = initTestContext({ requestHttpVersion: 2 });
      await keepAlive({
        enabled: false,
      })(context);
      assert.ok(context.responseHeaders.get('connection') == null);
      assert.ok(context.responseHeaders.get('keep-alive') == null);
    });
  });
});
