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
      return context;
    };
  };

  it('match method GET with GET', async () => {
    const context = initTestContext('/the-page');
    const newContext = await chainAll([route('GET', '/the-page', setPathParamsOnResponseHeader)])(context);
    assert.equal(newContext.responseHeaders.get('x-path-params'), '{}');
  });

  it('match method HEAD with GET', async () => {
    const context = initTestContext('/the-page');
    context.requestMethod = 'HEAD';
    const newContext = await chainAll([route('GET', '/the-page', setPathParamsOnResponseHeader)])(context);
    assert.equal(newContext.responseHeaders.get('x-path-params'), '{}');
  });

  it('match method POST with *', async () => {
    const context = initTestContext('/the-page');
    context.requestMethod = 'POST';
    const newContext = await chainAll([route('*', '/the-page', setPathParamsOnResponseHeader)])(context);
    assert.equal(newContext.responseHeaders.get('x-path-params'), '{}');
  });

  it('do not match method POST with PUT', async () => {
    const context = initTestContext('/the-page');
    context.requestMethod = 'POST';
    const newContext = await chainAll([route('PUT', '/the-page', setPathParamsOnResponseHeader)])(context);
    assert.equal(newContext.responseHeaders.get('x-path-params'), null);
  });

  it('match simple route', async () => {
    const context = initTestContext('/the-page');
    const newContext = await chainAll([route('GET', '/the-page', setPathParamsOnResponseHeader)])(context);
    assert.equal(newContext.responseHeaders.get('x-path-params'), '{}');
  });

  it('do not match simple route', async () => {
    const context = initTestContext('/another-page');
    const newContext = await chainAll([route('GET', '/the-page', setPathParamsOnResponseHeader)])(context);
    assert.equal(newContext.responseHeaders.get('x-path-params'), null);
  });

  it('match route with one param', async () => {
    const context = initTestContext('/books/42');
    const newContext = await chainAll([route('GET', '/books/:id', setPathParamsOnResponseHeader)])(context);
    assert.equal(newContext.responseHeaders.get('x-path-params'), '{"id":"42"}');
  });

  it('match route with two params', async () => {
    const context = initTestContext('/books/42/year/2024');
    const newContext = await chainAll([route('GET', '/books/:id/year/:year', setPathParamsOnResponseHeader)])(context);
    assert.equal(newContext.responseHeaders.get('x-path-params'), '{"id":"42","year":"2024"}');
  });

  it('match route with optional param', async () => {
    const context = initTestContext('/books/42');
    const newContext = await chainAll([route('GET', '/books{/:id}', setPathParamsOnResponseHeader)])(context);
    assert.equal(newContext.responseHeaders.get('x-path-params'), '{"id":"42"}');
  });

  it('match route without optional param', async () => {
    const context = initTestContext('/books');
    const newContext = await chainAll([route('GET', '/books{/:id}', setPathParamsOnResponseHeader)])(context);
    assert.equal(newContext.responseHeaders.get('x-path-params'), '{}');
  });

  it('match route with wildcare', async () => {
    const context = initTestContext('/api/books/42');
    const newContext = await chainAll([route('GET', '/api/*apiPath', setPathParamsOnResponseHeader)])(context);
    assert.equal(newContext.responseHeaders.get('x-path-params'), '{"apiPath":["books","42"]}');
  });
});
