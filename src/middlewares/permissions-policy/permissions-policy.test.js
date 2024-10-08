import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { permissionsPolicy } from './permissions-policy.js';

describe('middleware / permissions-policy', () => {
  it('no options', async () => {
    const context = initTestContext();
    const newContext = await permissionsPolicy({})(context);
    assert.equal(newContext.responseHeaders.get('permissions-policy'), null);
  });

  it('*', async () => {
    const context = initTestContext();
    const newContext = await permissionsPolicy({
      features: {
        camera: '*',
      },
    })(context);
    assert.equal(newContext.responseHeaders.get('permissions-policy'), 'camera=*');
  });

  it('empty', async () => {
    const context = initTestContext();
    const newContext = await permissionsPolicy({
      features: {
        camera: [],
      },
    })(context);
    assert.equal(newContext.responseHeaders.get('permissions-policy'), 'camera=()');
  });

  it('self', async () => {
    const context = initTestContext();
    const newContext = await permissionsPolicy({
      features: {
        camera: ['self'],
      },
    })(context);
    assert.equal(newContext.responseHeaders.get('permissions-policy'), 'camera=(self)');
  });

  it('src', async () => {
    const context = initTestContext();
    const newContext = await permissionsPolicy({
      features: {
        camera: ['src'],
      },
    })(context);
    assert.equal(newContext.responseHeaders.get('permissions-policy'), 'camera=(src)');
  });

  it('http://example.com', async () => {
    const context = initTestContext();
    const newContext = await permissionsPolicy({
      features: {
        camera: ['http://example.com'],
      },
    })(context);
    assert.equal(newContext.responseHeaders.get('permissions-policy'), 'camera=("http://example.com")');
  });

  it('self + http://example.com', async () => {
    const context = initTestContext();
    const newContext = await permissionsPolicy({
      features: {
        camera: ['self', 'http://example.com'],
      },
    })(context);
    assert.equal(newContext.responseHeaders.get('permissions-policy'), 'camera=(self "http://example.com")');
  });

  it('multiple features', async () => {
    const context = initTestContext();
    const newContext = await permissionsPolicy({
      features: {
        accelerometer: '*',
        autoplay: [],
        bluetooth: ['self'],
        camera: ['src'],
        microphone: ['http://example.com'],
        fullscreen: ['self', 'http://example.com'],
      },
    })(context);
    assert.equal(
      newContext.responseHeaders.get('permissions-policy'),
      'accelerometer=*,autoplay=(),bluetooth=(self),camera=(src),microphone=("http://example.com"),fullscreen=(self "http://example.com")',
    );
  });
});
