import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { toReadableStream } from '../../lib/response-body.js';
import { transformString } from './transform-string.js';

/**
 * @param {string} string
 * @return {Promise<string>}
 */
async function toUpperCase(string) {
  return string.toUpperCase();
}

describe('middleware / transform-string', () => {
  it('do not transform empty responseBody', async () => {
    const context = initTestContext();
    await transformString(toUpperCase)(context);
    assert.equal(context.responseBody, undefined);
  });

  it('transform string responseBody', async () => {
    const context = initTestContext();
    context.responseBody = 'Hello, world!';
    await transformString(toUpperCase)(context);
    assert.equal(context.responseBody, 'HELLO, WORLD!');
  });

  it('transform ArrayBuffer responseBody', async () => {
    const context = initTestContext();
    context.responseBody = new TextEncoder().encode('Hello, world!').buffer;
    await transformString(toUpperCase)(context);
    assert.equal(context.responseBody, 'HELLO, WORLD!');
  });

  it('transform ReadableString responseBody', async () => {
    const context = initTestContext();
    context.responseBody = toReadableStream('Hello, world!');
    await transformString(toUpperCase)(context);
    assert.equal(context.responseBody, 'HELLO, WORLD!');
  });
});
