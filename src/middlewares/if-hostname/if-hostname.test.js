import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { ifHostname } from './if-hostname.js';

/**
 * @param {string} hostname
 * @return {HititipiContext}
 */
function initTestContextWithHost(hostname) {
  const context = initTestContext();
  context.requestUrl.hostname = hostname;
  return context;
}

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiContext} HititipiContext
 * @typedef {import('path-to-regexp').ParamData} ParamData
 */

describe('middleware / if-hostname', () => {
  const found = async (/** @type {HititipiContext} */ context) => {
    context.responseStatus = 200;
    return context;
  };

  it('example.com matches example.com', async () => {
    const context = initTestContextWithHost('example.com');
    const newContext = await ifHostname('example.com', found)(context);
    assert.equal(newContext.responseStatus, 200);
  });

  it('foo.example.com matches foo.example.com', async () => {
    const context = initTestContextWithHost('foo.example.com');
    const newContext = await ifHostname('foo.example.com', found)(context);
    assert.equal(newContext.responseStatus, 200);
  });

  it('bar.example.com does not match foo.example.com', async () => {
    const context = initTestContextWithHost('bar.example.com');
    const newContext = await ifHostname('foo.example.com', found)(context);
    assert.equal(newContext.responseStatus, null);
  });

  it('foo.example.com matches *.example.com', async () => {
    const context = initTestContextWithHost('foo.example.com');
    const newContext = await ifHostname('*.example.com', found)(context);
    assert.equal(newContext.responseStatus, 200);
  });

  it('bar.foo.example.com does not match *.example.com', async () => {
    const context = initTestContextWithHost('bar.foo.example.com');
    const newContext = await ifHostname('*.example.com', found)(context);
    assert.equal(newContext.responseStatus, null);
  });

  it('bar.foo.example.com matches **.example.com', async () => {
    const context = initTestContextWithHost('bar.foo.example.com');
    const newContext = await ifHostname('**.example.com', found)(context);
    assert.equal(newContext.responseStatus, 200);
  });

  it('bar.foo.example.com matches bar.*.example.com', async () => {
    const context = initTestContextWithHost('bar.foo.example.com');
    const newContext = await ifHostname('bar.*.example.com', found)(context);
    assert.equal(newContext.responseStatus, 200);
  });

  it('bar.foo.example.com matches *.foo.example.com', async () => {
    const context = initTestContextWithHost('bar.foo.example.com');
    const newContext = await ifHostname('*.foo.example.com', found)(context);
    assert.equal(newContext.responseStatus, 200);
  });
});
