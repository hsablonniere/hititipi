import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { chainAll } from '../chain-all/chain-all.js';
import { route } from './route.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiContext} HititipiContext
 * @typedef {import('path-to-regexp').ParamData} ParamData
 */

describe('middleware / route', () => {
  const setPathParamsOnResponseHeader = (/** @type {ParamData} */ params) => {
    return async (/** @type {HititipiContext} */ context) => {
      context.responseHeaders.set('x-path-params', JSON.stringify(params));
    };
  };

  it('match method GET with GET', async () => {
    const context = initTestContext({ requestUrl: '/the-page' });
    await chainAll([route('GET', '/the-page', setPathParamsOnResponseHeader)])(context);
    assert.equal(context.responseHeaders.get('x-path-params'), '{}');
  });

  it('match method HEAD with GET', async () => {
    const context = initTestContext({ requestMethod: 'HEAD', requestUrl: '/the-page' });
    await chainAll([route('GET', '/the-page', setPathParamsOnResponseHeader)])(context);
    assert.equal(context.responseHeaders.get('x-path-params'), '{}');
  });

  it('match method POST with *', async () => {
    const context = initTestContext({ requestMethod: 'POST', requestUrl: '/the-page' });
    await chainAll([route('*', '/the-page', setPathParamsOnResponseHeader)])(context);
    assert.equal(context.responseHeaders.get('x-path-params'), '{}');
  });

  it('do not match method POST with PUT', async () => {
    const context = initTestContext({ requestMethod: 'POST', requestUrl: '/the-page' });
    await chainAll([route('PUT', '/the-page', setPathParamsOnResponseHeader)])(context);
    assert.equal(context.responseHeaders.get('x-path-params'), null);
  });

  it('match simple route', async () => {
    const context = initTestContext({ requestUrl: '/the-page' });
    await chainAll([route('GET', '/the-page', setPathParamsOnResponseHeader)])(context);
    assert.equal(context.responseHeaders.get('x-path-params'), '{}');
  });

  it('do not match simple route', async () => {
    const context = initTestContext({ requestUrl: '/another-page' });
    await chainAll([route('GET', '/the-page', setPathParamsOnResponseHeader)])(context);
    assert.equal(context.responseHeaders.get('x-path-params'), null);
  });

  it('match route with one param', async () => {
    const context = initTestContext({ requestUrl: '/books/42' });
    await chainAll([route('GET', '/books/:id', setPathParamsOnResponseHeader)])(context);
    assert.equal(context.responseHeaders.get('x-path-params'), '{"id":"42"}');
  });

  it('match route with two params', async () => {
    const context = initTestContext({ requestUrl: '/books/42/year/2024' });
    await chainAll([route('GET', '/books/:id/year/:year', setPathParamsOnResponseHeader)])(context);
    assert.equal(context.responseHeaders.get('x-path-params'), '{"id":"42","year":"2024"}');
  });

  it('match route with optional param', async () => {
    const context = initTestContext({ requestUrl: '/books/42' });
    await chainAll([route('GET', '/books{/:id}', setPathParamsOnResponseHeader)])(context);
    assert.equal(context.responseHeaders.get('x-path-params'), '{"id":"42"}');
  });

  it('match route without optional param', async () => {
    const context = initTestContext({ requestUrl: '/books' });
    await chainAll([route('GET', '/books{/:id}', setPathParamsOnResponseHeader)])(context);
    assert.equal(context.responseHeaders.get('x-path-params'), '{}');
  });

  it('match route with wildcare', async () => {
    const context = initTestContext({ requestUrl: '/api/books/42' });
    await chainAll([route('GET', '/api/*apiPath', setPathParamsOnResponseHeader)])(context);
    assert.equal(context.responseHeaders.get('x-path-params'), '{"apiPath":["books","42"]}');
  });
});
