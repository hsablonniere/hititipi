import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { ifHostname } from './if-hostname.js';

/**
 * @param {string} hostname
 * @return {HititipiContext}
 */
function initTestContextWithHost(hostname) {
  const context = initTestContext({
    requestHeaders: {
      host: hostname,
    },
  });
  return context;
}

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiContext} HititipiContext
 * @typedef {import('path-to-regexp').ParamData} ParamData
 */

describe('middleware / if-hostname', () => {
  const found = async (/** @type {HititipiContext} */ context) => {
    context.responseStatus = 200;
  };

  it('example.com matches example.com', async () => {
    const context = initTestContextWithHost('example.com');
    await ifHostname('example.com', found)(context);
    assert.equal(context.responseStatus, 200);
  });

  it('foo.example.com matches foo.example.com', async () => {
    const context = initTestContextWithHost('foo.example.com');
    await ifHostname('foo.example.com', found)(context);
    assert.equal(context.responseStatus, 200);
  });

  it('bar.example.com does not match foo.example.com', async () => {
    const context = initTestContextWithHost('bar.example.com');
    await ifHostname('foo.example.com', found)(context);
    assert.equal(context.responseStatus, null);
  });

  it('foo.example.com matches *.example.com', async () => {
    const context = initTestContextWithHost('foo.example.com');
    await ifHostname('*.example.com', found)(context);
    assert.equal(context.responseStatus, 200);
  });

  it('bar.foo.example.com does not match *.example.com', async () => {
    const context = initTestContextWithHost('bar.foo.example.com');
    await ifHostname('*.example.com', found)(context);
    assert.equal(context.responseStatus, null);
  });

  it('bar.foo.example.com matches **.example.com', async () => {
    const context = initTestContextWithHost('bar.foo.example.com');
    await ifHostname('**.example.com', found)(context);
    assert.equal(context.responseStatus, 200);
  });

  it('bar.foo.example.com matches bar.*.example.com', async () => {
    const context = initTestContextWithHost('bar.foo.example.com');
    await ifHostname('bar.*.example.com', found)(context);
    assert.equal(context.responseStatus, 200);
  });

  it('bar.foo.example.com matches *.foo.example.com', async () => {
    const context = initTestContextWithHost('bar.foo.example.com');
    await ifHostname('*.foo.example.com', found)(context);
    assert.equal(context.responseStatus, 200);
  });
});
