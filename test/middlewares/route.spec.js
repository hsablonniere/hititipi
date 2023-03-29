import sinon from 'sinon';
import { route } from '../../src/middlewares/route.js';
import assert from 'assert';
import { ALL_METHODS } from '../lib-test/test-utils.js';

function fakeContext (method, path) {
  return {
    requestMethod: method,
    requestUrl: new URL(path, 'http://localhost:8080'),
  };
}

describe('route middleware', () => {

  const sandbox = sinon.createSandbox();

  afterEach(() => sandbox.restore());

  function createRouteTester (method, path) {
    const fakeMiddleware = sandbox.fake((ctx) => ctx);
    const routeMiddleware = route(method, path, fakeMiddleware);
    return (requestMethod, requestPath, expectedPathParams) => {
      const context = {
        requestMethod,
        requestUrl: new URL(requestPath, 'http://localhost:8080'),
      };
      routeMiddleware(context);
      if (expectedPathParams == null) {
        assert.equal(fakeMiddleware.callCount, 0);
      }
      else {
        assert.equal(fakeMiddleware.callCount, 1);
        sinon.assert.calledWith(fakeMiddleware, {
          ...context,
          requestPathParams: expectedPathParams,
        });
      }
    };
  }

  describe('no params', () => {

    it('METHOD matches METHOD and *', () => {
      ALL_METHODS.forEach((method) => {
        const testSpecificRoute = createRouteTester(method, '/');
        testSpecificRoute(method, '/', {});
        const testAnyRoute = createRouteTester('*', '/');
        testAnyRoute(method, '/', {});
      });
    });

    it('different paths do not match', () => {
      const testRoute = createRouteTester('GET', '/');
      testRoute('GET', '/foo');
    });

    it('different methods do not match', () => {
      const testRoute = createRouteTester('GET', '/');
      testRoute('POST', '/');
    });
  });

  describe('with simple named param', () => {

    it('matches', () => {
      const testRoute = createRouteTester('GET', '/foo/:id');
      testRoute('GET', '/foo/123', { id: '123' });
    });

    it('does not match', () => {
      const testRoute = createRouteTester('GET', '/foo/:id');
      testRoute('GET', '/foo/');
    });
  });

  describe('with multiple named params', () => {

    it('matches', () => {
      const testRoute = createRouteTester('GET', '/foo/:idFoo/bar/:idBar');
      testRoute('GET', '/foo/123/bar/456', { idFoo: '123', idBar: '456' });
    });

    it('does not match', () => {
      const testRoute = createRouteTester('GET', '/foo/:idFoo/bar/:idBar');
      testRoute('GET', '/foo/123/bar/');
    });
  });

  describe('with dot star expression', () => {

    it('matches', () => {
      const testRoute = createRouteTester('GET', '/foo/(.*)');
      testRoute('GET', '/foo/123', { '0': '123' });
    });

    it('matches with slashes', () => {
      const testRoute = createRouteTester('GET', '/foo/(.*)');
      testRoute('GET', '/foo/123/456', { '0': '123/456' });
    });
  });

  describe('with pipe operator', () => {

    it('matches foo', () => {
      const testRoute = createRouteTester('GET', '/(foo|bar)/details');
      testRoute('GET', '/foo/details', { '0': 'foo' });
    });

    it('matches bar', () => {
      const testRoute = createRouteTester('GET', '/(foo|bar)/details');
      testRoute('GET', '/bar/details', { '0': 'bar' });
    });

    it('does not matches', () => {
      const testRoute = createRouteTester('GET', '/(foo|bar)/details');
      testRoute('GET', '/something/details');
    });
  });
});
