import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { ifContentType } from './if-content-type.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiContext} HititipiContext
 */

describe('middleware / if-content-type', () => {
  const found = async (/** @type {HititipiContext} */ context) => {
    context.responseStatus = 200;
  };

  it('should execute middleware if content-type matches exactly', async () => {
    const context = initTestContext();
    context.responseHeaders.set('content-type', 'application/javascript');
    await ifContentType('application/javascript', found)(context);
    assert.strictEqual(context.responseStatus, 200);
  });

  it('should execute middleware if content-type matches beginning', async () => {
    const context = initTestContext();
    context.responseHeaders.set('content-type', 'application/javascript; charset=utf-8');
    await ifContentType('application/javascript', found)(context);
    assert.strictEqual(context.responseStatus, 200);
  });

  it('should not execute middleware if content-type does not match', async () => {
    const context = initTestContext();
    context.responseHeaders.set('content-type', 'text/html');
    await ifContentType('application/javascript', found)(context);
    assert.strictEqual(context.responseStatus, undefined);
  });
});
