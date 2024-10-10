import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { cors } from './cors.js';

describe('middleware / cors', () => {
  describe('with GET', () => {
    it('no options', async () => {
      const context = initTestContext();
      await cors({})(context);
      assert.equal(context.responseHeaders.get('access-control-allow-origin'), null);
      assert.equal(context.responseHeaders.get('access-control-allow-credentials'), null);
      assert.equal(context.responseHeaders.get('access-control-allow-headers'), null);
      assert.equal(context.responseHeaders.get('access-control-allow-methods'), null);
      assert.equal(context.responseHeaders.get('access-control-max-age'), null);
      assert.equal(context.responseHeaders.get('access-control-expose-headers'), null);
      assert.equal(context.responseStatus, null);
    });

    it('allowOrigin:*', async () => {
      const context = initTestContext();
      await cors({ allowOrigin: '*' })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-origin'), '*');
      assert.equal(context.responseStatus, null);
    });

    it('allowOrigin:https://sub.example.com', async () => {
      const context = initTestContext();
      await cors({ allowOrigin: 'https://sub.example.com' })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-origin'), 'https://sub.example.com');
      assert.equal(context.responseStatus, null);
    });

    it('allowCredentials:true', async () => {
      const context = initTestContext();
      await cors({ allowCredentials: true })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-credentials'), 'true');
      assert.equal(context.responseStatus, null);
    });

    it('allowHeaders empty', async () => {
      const context = initTestContext();
      await cors({ allowHeaders: [] })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-headers'), null);
      assert.equal(context.responseStatus, null);
    });

    it('allowHeaders one', async () => {
      const context = initTestContext();
      await cors({ allowHeaders: ['x-foo'] })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-headers'), null);
      assert.equal(context.responseStatus, null);
    });

    it('allowHeaders many', async () => {
      const context = initTestContext();
      await cors({ allowHeaders: ['x-foo', 'x-bar'] })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-headers'), null);
      assert.equal(context.responseStatus, null);
    });

    it('allowMethods empty', async () => {
      const context = initTestContext();
      await cors({ allowMethods: [] })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-methods'), null);
      assert.equal(context.responseStatus, null);
    });

    it('allowMethods one', async () => {
      const context = initTestContext();
      await cors({ allowMethods: ['GET'] })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-methods'), null);
      assert.equal(context.responseStatus, null);
    });

    it('allowMethods many', async () => {
      const context = initTestContext();
      await cors({ allowMethods: ['GET', 'POST'] })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-methods'), null);
      assert.equal(context.responseStatus, null);
    });

    it('maxAge:100', async () => {
      const context = initTestContext();
      await cors({ maxAge: 100 })(context);
      assert.equal(context.responseHeaders.get('access-control-max-age'), null);
      assert.equal(context.responseStatus, null);
    });

    it('exposeHeaders empty', async () => {
      const context = initTestContext();
      await cors({ exposeHeaders: [] })(context);
      assert.equal(context.responseHeaders.get('access-control-expose-headers'), null);
      assert.equal(context.responseStatus, null);
    });

    it('exposeHeaders one', async () => {
      const context = initTestContext();
      await cors({ exposeHeaders: ['x-foo'] })(context);
      assert.equal(context.responseHeaders.get('access-control-expose-headers'), 'x-foo');
      assert.equal(context.responseStatus, null);
    });

    it('exposeHeaders many', async () => {
      const context = initTestContext();
      await cors({ exposeHeaders: ['x-foo', 'x-bar'] })(context);
      assert.equal(context.responseHeaders.get('access-control-expose-headers'), 'x-foo,x-bar');
      assert.equal(context.responseStatus, null);
    });

    it('multiple options', async () => {
      const context = initTestContext();
      await cors({
        allowOrigin: '*',
        allowMethods: ['GET', 'POST'],
        exposeHeaders: ['x-foo'],
      })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-origin'), '*');
      assert.equal(context.responseHeaders.get('access-control-allow-methods'), null);
      assert.equal(context.responseHeaders.get('access-control-expose-headers'), 'x-foo');
      assert.equal(context.responseStatus, null);
    });
  });

  describe('with OPTIONS', () => {
    it('no options', async () => {
      const context = initTestContext();
      await cors({})(context);
      assert.equal(context.responseHeaders.get('access-control-allow-origin'), null);
      assert.equal(context.responseHeaders.get('access-control-allow-credentials'), null);
      assert.equal(context.responseHeaders.get('access-control-allow-headers'), null);
      assert.equal(context.responseHeaders.get('access-control-allow-methods'), null);
      assert.equal(context.responseHeaders.get('access-control-max-age'), null);
      assert.equal(context.responseHeaders.get('access-control-expose-headers'), null);
      assert.equal(context.responseStatus, null);
    });

    it('allowOrigin:*', async () => {
      const context = initTestContext();
      context.requestMethod = 'OPTIONS';
      await cors({ allowOrigin: '*' })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-origin'), '*');
      assert.equal(context.responseStatus, 204);
    });

    it('allowOrigin:https://sub.example.com', async () => {
      const context = initTestContext();
      context.requestMethod = 'OPTIONS';
      await cors({ allowOrigin: 'https://sub.example.com' })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-origin'), 'https://sub.example.com');
      assert.equal(context.responseStatus, 204);
    });

    it('allowCredentials:true', async () => {
      const context = initTestContext();
      context.requestMethod = 'OPTIONS';
      await cors({ allowCredentials: true })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-credentials'), 'true');
      assert.equal(context.responseStatus, 204);
    });

    it('allowHeaders empty', async () => {
      const context = initTestContext();
      context.requestMethod = 'OPTIONS';
      await cors({ allowHeaders: [] })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-headers'), null);
      assert.equal(context.responseStatus, 204);
    });

    it('allowHeaders one', async () => {
      const context = initTestContext();
      context.requestMethod = 'OPTIONS';
      await cors({ allowHeaders: ['x-foo'] })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-headers'), 'x-foo');
      assert.equal(context.responseStatus, 204);
    });

    it('allowHeaders many', async () => {
      const context = initTestContext();
      context.requestMethod = 'OPTIONS';
      await cors({ allowHeaders: ['x-foo', 'x-bar'] })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-headers'), 'x-foo,x-bar');
      assert.equal(context.responseStatus, 204);
    });

    it('allowMethods empty', async () => {
      const context = initTestContext();
      context.requestMethod = 'OPTIONS';
      await cors({ allowMethods: [] })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-methods'), null);
      assert.equal(context.responseStatus, 204);
    });

    it('allowMethods one', async () => {
      const context = initTestContext();
      context.requestMethod = 'OPTIONS';
      await cors({ allowMethods: ['GET'] })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-methods'), 'GET');
      assert.equal(context.responseStatus, 204);
    });

    it('allowMethods many', async () => {
      const context = initTestContext();
      context.requestMethod = 'OPTIONS';
      await cors({ allowMethods: ['GET', 'POST'] })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-methods'), 'GET,POST');
      assert.equal(context.responseStatus, 204);
    });

    it('maxAge:100', async () => {
      const context = initTestContext();
      context.requestMethod = 'OPTIONS';
      await cors({ maxAge: 100 })(context);
      assert.equal(context.responseHeaders.get('access-control-max-age'), '100');
      assert.equal(context.responseStatus, 204);
    });

    it('exposeHeaders empty', async () => {
      const context = initTestContext();
      context.requestMethod = 'OPTIONS';
      await cors({ allowHeaders: [] })(context);
      assert.equal(context.responseHeaders.get('access-control-expose-headers'), null);
      assert.equal(context.responseStatus, 204);
    });

    it('exposeHeaders one', async () => {
      const context = initTestContext();
      context.requestMethod = 'OPTIONS';
      await cors({ allowHeaders: ['x-foo'] })(context);
      assert.equal(context.responseHeaders.get('access-control-expose-headers'), null);
      assert.equal(context.responseStatus, 204);
    });

    it('exposeHeaders many', async () => {
      const context = initTestContext();
      context.requestMethod = 'OPTIONS';
      await cors({ allowHeaders: ['x-foo', 'x-bar'] })(context);
      assert.equal(context.responseHeaders.get('access-control-expose-headers'), null);
      assert.equal(context.responseStatus, 204);
    });

    it('multiple options', async () => {
      const context = initTestContext();
      context.requestMethod = 'OPTIONS';
      await cors({
        allowOrigin: '*',
        allowMethods: ['GET', 'POST'],
        exposeHeaders: ['x-foo'],
      })(context);
      assert.equal(context.responseHeaders.get('access-control-allow-origin'), '*');
      assert.equal(context.responseHeaders.get('access-control-allow-methods'), 'GET,POST');
      assert.equal(context.responseHeaders.get('access-control-expose-headers'), null);
      assert.equal(context.responseStatus, 204);
    });
  });
});
