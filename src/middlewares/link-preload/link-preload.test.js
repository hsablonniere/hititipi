import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { linkPreload } from './link-preload.js';

describe('middleware / link-preload', () => {
  it('resource match in manifest with preload style should set link header and call writeEarlyHints', async () => {
    const context = initTestContext({ requestUrl: '/foo.html' });
    await linkPreload({
      earlyHints: 'always',
      manifest: {
        manifestVersion: 1,
        resources: {
          '/foo.html': [{ rel: 'preload', href: '/foo.css', as: 'style' }],
        },
      },
    })(context);
    assert.equal(context.responseHeaders.get('link'), '</foo.css>; rel=preload; as=style');
    assert.equal(context.writeEarlyHints.mock.callCount(), 1);
    assert.deepEqual(context.writeEarlyHints.mock.calls[0].arguments, [
      { link: ['</foo.css>; rel=preload; as=style'] },
    ]);
  });

  it('resource match in manifest with modulepreload script should set link header and call writeEarlyHints', async () => {
    const context = initTestContext({ requestUrl: '/foo.html' });
    await linkPreload({
      earlyHints: 'always',
      manifest: {
        manifestVersion: 1,
        resources: {
          '/foo.html': [{ rel: 'modulepreload', href: '/foo.js', as: 'script' }],
        },
      },
    })(context);
    assert.equal(context.responseHeaders.get('link'), '</foo.js>; rel=modulepreload; as=script');
    assert.deepEqual(context.writeEarlyHints.mock.calls[0].arguments, [
      { link: ['</foo.js>; rel=modulepreload; as=script'] },
    ]);
  });

  it('resource match in manifest with crossorigin preload font should set link header and call writeEarlyHints', async () => {
    const context = initTestContext({ requestUrl: '/foo.html' });
    await linkPreload({
      earlyHints: 'always',
      manifest: {
        manifestVersion: 1,
        resources: {
          '/foo.html': [{ rel: 'preload', href: '/foo.woff2', as: 'font', crossorigin: 'anonymous' }],
        },
      },
    })(context);
    assert.equal(context.responseHeaders.get('link'), '</foo.woff2>; rel=preload; as=font; crossorigin=anonymous');
    assert.deepEqual(context.writeEarlyHints.mock.calls[0].arguments, [
      { link: ['</foo.woff2>; rel=preload; as=font; crossorigin=anonymous'] },
    ]);
  });

  it('resource match in manifest with multiple configs should set link header and call writeEarlyHints', async () => {
    const context = initTestContext({ requestUrl: '/foo.html' });
    await linkPreload({
      earlyHints: 'always',
      manifest: {
        manifestVersion: 1,
        resources: {
          '/foo.html': [
            { rel: 'preload', href: '/foo.css', as: 'style' },
            { rel: 'modulepreload', href: '/foo.js', as: 'script' },
            { rel: 'preload', href: '/foo.woff2', as: 'font', crossorigin: 'anonymous' },
          ],
        },
      },
    })(context);
    assert.equal(
      context.responseHeaders.get('link'),
      '</foo.css>; rel=preload; as=style, </foo.js>; rel=modulepreload; as=script, </foo.woff2>; rel=preload; as=font; crossorigin=anonymous',
    );
    assert.deepEqual(context.writeEarlyHints.mock.calls[0].arguments, [
      {
        link: [
          '</foo.css>; rel=preload; as=style',
          '</foo.js>; rel=modulepreload; as=script',
          '</foo.woff2>; rel=preload; as=font; crossorigin=anonymous',
        ],
      },
    ]);
  });

  it('no resource match in manifest should not set link header and not call writeEarlyHints', async () => {
    const context = initTestContext({ requestUrl: '/foo.html' });
    await linkPreload({
      earlyHints: 'always',
      manifest: {
        manifestVersion: 1,
        resources: {
          '/bar.html': [{ rel: 'preload', href: '/bar.css', as: 'style' }],
        },
      },
    })(context);
    assert.equal(context.responseHeaders.get('link'), undefined);
    assert.equal(context.writeEarlyHints.mock.callCount(), 0);
  });

  it('no resources in manifest should not set link header and not call writeEarlyHints', async () => {
    const context = initTestContext({ requestUrl: '/foo.html' });
    await linkPreload({
      earlyHints: 'always',
      manifest: {
        manifestVersion: 1,
        resources: {},
      },
    })(context);
    assert.equal(context.responseHeaders.get('link'), undefined);
    assert.equal(context.writeEarlyHints.mock.callCount(), 0);
  });

  it('earlyHints "never" with HTTP 1.1 should only set link header', async () => {
    const context = initTestContext({ requestHttpVersion: 1, requestUrl: '/foo.html' });
    await linkPreload({
      earlyHints: 'never',
      manifest: {
        manifestVersion: 1,
        resources: {
          '/foo.html': [{ rel: 'preload', href: '/foo.css', as: 'style' }],
        },
      },
    })(context);
    assert.equal(context.responseHeaders.get('link'), '</foo.css>; rel=preload; as=style');
    assert.equal(context.writeEarlyHints.mock.callCount(), 0);
  });

  it('earlyHints "never" with HTTP/2 should only set link header', async () => {
    const context = initTestContext({ requestHttpVersion: 2, requestUrl: '/foo.html' });
    await linkPreload({
      earlyHints: 'never',
      manifest: {
        manifestVersion: 1,
        resources: {
          '/foo.html': [{ rel: 'preload', href: '/foo.css', as: 'style' }],
        },
      },
    })(context);
    assert.equal(context.responseHeaders.get('link'), '</foo.css>; rel=preload; as=style');
    assert.equal(context.writeEarlyHints.mock.callCount(), 0);
  });

  it('earlyHints "http2-only" with HTTP 1.1 should only set link header', async () => {
    const context = initTestContext({ requestHttpVersion: 1, requestUrl: '/foo.html' });
    await linkPreload({
      earlyHints: 'http2-only',
      manifest: {
        manifestVersion: 1,
        resources: {
          '/foo.html': [{ rel: 'preload', href: '/foo.css', as: 'style' }],
        },
      },
    })(context);
    assert.equal(context.responseHeaders.get('link'), '</foo.css>; rel=preload; as=style');
    assert.equal(context.writeEarlyHints.mock.callCount(), 0);
  });

  it('earlyHints "http2-only" with HTTP/2 should set link header and call writeEarlyHints', async () => {
    const context = initTestContext({ requestHttpVersion: 2, requestUrl: '/foo.html' });
    await linkPreload({
      earlyHints: 'http2-only',
      manifest: {
        manifestVersion: 1,
        resources: {
          '/foo.html': [{ rel: 'preload', href: '/foo.css', as: 'style' }],
        },
      },
    })(context);
    assert.equal(context.responseHeaders.get('link'), '</foo.css>; rel=preload; as=style');
    assert.equal(context.writeEarlyHints.mock.callCount(), 1);
    assert.deepEqual(context.writeEarlyHints.mock.calls[0].arguments, [
      { link: ['</foo.css>; rel=preload; as=style'] },
    ]);
  });
});
