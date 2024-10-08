import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { httpStrictTransportSecurity } from './http-strict-transport-security.js';

describe('middleware / http-strict-transport-security', () => {
  it('no options', async () => {
    const context = initTestContext();
    const newContext = await httpStrictTransportSecurity({})(context);
    assert.equal(newContext.responseHeaders.get('strict-transport-security'), null);
  });
  it('maxAge:100', async () => {
    const context = initTestContext();
    const newContext = await httpStrictTransportSecurity({ 'max-age': 100 })(context);
    assert.equal(newContext.responseHeaders.get('strict-transport-security'), 'max-age=100');
  });

  it('includeSubDomains:true', async () => {
    const context = initTestContext();
    const newContext = await httpStrictTransportSecurity({ includeSubDomains: true })(context);
    assert.equal(newContext.responseHeaders.get('strict-transport-security'), 'includeSubDomains');
  });

  it('preload:true', async () => {
    const context = initTestContext();
    const newContext = await httpStrictTransportSecurity({ preload: true })(context);
    assert.equal(newContext.responseHeaders.get('strict-transport-security'), 'preload');
  });

  it('multiple options', async () => {
    const context = initTestContext();
    const newContext = await httpStrictTransportSecurity({ 'max-age': 100, includeSubDomains: true, preload: true })(
      context,
    );
    assert.equal(newContext.responseHeaders.get('strict-transport-security'), 'max-age=100;includeSubDomains;preload');
  });
});
