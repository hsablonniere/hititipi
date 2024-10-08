import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { contentSecurityPolicy } from './content-security-policy.js';

describe('middleware / content-security-policy', () => {
  describe('normal', () => {
    it('no options', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({})(context);
      assert.equal(newContext.responseHeaders.get('content-security-policy'), null);
    });

    it('default-src:empty', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ directives: { 'default-src': [] } })(context);
      assert.equal(newContext.responseHeaders.get('content-security-policy'), null);
    });

    it('default-src:none', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ directives: { 'default-src': 'none' } })(context);
      assert.equal(newContext.responseHeaders.get('content-security-policy'), "default-src 'none'");
    });

    it('default-src:self', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ directives: { 'default-src': ['self'] } })(context);
      assert.equal(newContext.responseHeaders.get('content-security-policy'), "default-src 'self'");
    });

    it('default-src:strict-dynamic', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ directives: { 'default-src': ['strict-dynamic'] } })(context);
      assert.equal(newContext.responseHeaders.get('content-security-policy'), "default-src 'strict-dynamic'");
    });

    it('default-src:report-sample', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ directives: { 'default-src': ['report-sample'] } })(context);
      assert.equal(newContext.responseHeaders.get('content-security-policy'), "default-src 'report-sample'");
    });

    it('default-src:inline-speculation-rules', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ directives: { 'default-src': ['inline-speculation-rules'] } })(
        context,
      );
      assert.equal(newContext.responseHeaders.get('content-security-policy'), "default-src 'inline-speculation-rules'");
    });

    it('default-src:unsafe-inline', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ directives: { 'default-src': ['unsafe-inline'] } })(context);
      assert.equal(newContext.responseHeaders.get('content-security-policy'), "default-src 'unsafe-inline'");
    });

    it('default-src:unsafe-eval', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ directives: { 'default-src': ['unsafe-eval'] } })(context);
      assert.equal(newContext.responseHeaders.get('content-security-policy'), "default-src 'unsafe-eval'");
    });

    it('default-src:unsafe-hashes', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ directives: { 'default-src': ['unsafe-hashes'] } })(context);
      assert.equal(newContext.responseHeaders.get('content-security-policy'), "default-src 'unsafe-hashes'");
    });

    it('default-src:wasm-unsafe-eval', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ directives: { 'default-src': ['wasm-unsafe-eval'] } })(context);
      assert.equal(newContext.responseHeaders.get('content-security-policy'), "default-src 'wasm-unsafe-eval'");
    });

    it('default-src:http://example.com', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ directives: { 'default-src': ['http://example.com'] } })(
        context,
      );
      assert.equal(newContext.responseHeaders.get('content-security-policy'), 'default-src http://example.com');
    });

    it('default-src: multiple values', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ directives: { 'default-src': ['self', 'http://example.com'] } })(
        context,
      );
      assert.equal(newContext.responseHeaders.get('content-security-policy'), "default-src 'self' http://example.com");
    });

    it('sandbox:true', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ directives: { sandbox: true } })(context);
      assert.equal(newContext.responseHeaders.get('content-security-policy'), 'sandbox');
    });

    it('sandbox: multiple values', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ directives: { sandbox: ['allow-downloads', 'allow-forms'] } })(
        context,
      );
      assert.equal(
        newContext.responseHeaders.get('content-security-policy'),
        "sandbox 'allow-downloads' 'allow-forms'",
      );
    });

    it('webrtc:allow', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ directives: { webrtc: 'allow' } })(context);
      assert.equal(newContext.responseHeaders.get('content-security-policy'), "webrtc 'allow'");
    });

    it('upgrade-insecure-requests:true', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ directives: { 'upgrade-insecure-requests': true } })(context);
      assert.equal(newContext.responseHeaders.get('content-security-policy'), 'upgrade-insecure-requests');
    });

    it('multiple directives', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({
        directives: {
          'default-src': 'none',
          'font-src': [],
          'img-src': ['self'],
          'script-src': ['self', 'unsafe-inline', 'images.example.com'],
          'style-src': ['sha256-e02d55e83d66b31cf43295e9df9dc6f1be2b06d7b2213a645011380136f16045'],
          'media-src': ['nonce-ch4hvvbHDpv7xCSvXCs3BrNggHdTzxUA'],
        },
      })(context);
      assert.equal(
        newContext.responseHeaders.get('content-security-policy'),
        "default-src 'none';img-src 'self';script-src 'self' 'unsafe-inline' images.example.com;style-src 'sha256-e02d55e83d66b31cf43295e9df9dc6f1be2b06d7b2213a645011380136f16045';media-src 'nonce-ch4hvvbHDpv7xCSvXCs3BrNggHdTzxUA'",
      );
    });
  });

  describe('report only', () => {
    it('no options', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({})(context);
      assert.equal(newContext.responseHeaders.get('content-security-policy-report-only'), null);
    });

    it('default-src:empty', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ reportOnlyDirectives: { 'default-src': [] } })(context);
      assert.equal(newContext.responseHeaders.get('content-security-policy-report-only'), null);
    });

    it('default-src:none', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ reportOnlyDirectives: { 'default-src': 'none' } })(context);
      assert.equal(newContext.responseHeaders.get('content-security-policy-report-only'), "default-src 'none'");
    });

    it('default-src:self', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ reportOnlyDirectives: { 'default-src': ['self'] } })(context);
      assert.equal(newContext.responseHeaders.get('content-security-policy-report-only'), "default-src 'self'");
    });

    it('default-src:strict-dynamic', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ reportOnlyDirectives: { 'default-src': ['strict-dynamic'] } })(
        context,
      );
      assert.equal(
        newContext.responseHeaders.get('content-security-policy-report-only'),
        "default-src 'strict-dynamic'",
      );
    });

    it('default-src:report-sample', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ reportOnlyDirectives: { 'default-src': ['report-sample'] } })(
        context,
      );
      assert.equal(
        newContext.responseHeaders.get('content-security-policy-report-only'),
        "default-src 'report-sample'",
      );
    });

    it('default-src:inline-speculation-rules', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({
        reportOnlyDirectives: { 'default-src': ['inline-speculation-rules'] },
      })(context);
      assert.equal(
        newContext.responseHeaders.get('content-security-policy-report-only'),
        "default-src 'inline-speculation-rules'",
      );
    });

    it('default-src:unsafe-inline', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ reportOnlyDirectives: { 'default-src': ['unsafe-inline'] } })(
        context,
      );
      assert.equal(
        newContext.responseHeaders.get('content-security-policy-report-only'),
        "default-src 'unsafe-inline'",
      );
    });

    it('default-src:unsafe-eval', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ reportOnlyDirectives: { 'default-src': ['unsafe-eval'] } })(
        context,
      );
      assert.equal(newContext.responseHeaders.get('content-security-policy-report-only'), "default-src 'unsafe-eval'");
    });

    it('default-src:unsafe-hashes', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ reportOnlyDirectives: { 'default-src': ['unsafe-hashes'] } })(
        context,
      );
      assert.equal(
        newContext.responseHeaders.get('content-security-policy-report-only'),
        "default-src 'unsafe-hashes'",
      );
    });

    it('default-src:wasm-unsafe-eval', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ reportOnlyDirectives: { 'default-src': ['wasm-unsafe-eval'] } })(
        context,
      );
      assert.equal(
        newContext.responseHeaders.get('content-security-policy-report-only'),
        "default-src 'wasm-unsafe-eval'",
      );
    });

    it('default-src:http://example.com', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({
        reportOnlyDirectives: { 'default-src': ['http://example.com'] },
      })(context);
      assert.equal(
        newContext.responseHeaders.get('content-security-policy-report-only'),
        'default-src http://example.com',
      );
    });

    it('default-src: multiple values', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({
        reportOnlyDirectives: { 'default-src': ['self', 'http://example.com'] },
      })(context);
      assert.equal(
        newContext.responseHeaders.get('content-security-policy-report-only'),
        "default-src 'self' http://example.com",
      );
    });

    it('sandbox:true', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ reportOnlyDirectives: { sandbox: true } })(context);
      assert.equal(newContext.responseHeaders.get('content-security-policy-report-only'), 'sandbox');
    });

    it('sandbox: multiple values', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({
        reportOnlyDirectives: { sandbox: ['allow-downloads', 'allow-forms'] },
      })(context);
      assert.equal(
        newContext.responseHeaders.get('content-security-policy-report-only'),
        "sandbox 'allow-downloads' 'allow-forms'",
      );
    });

    it('webrtc:allow', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ reportOnlyDirectives: { webrtc: 'allow' } })(context);
      assert.equal(newContext.responseHeaders.get('content-security-policy-report-only'), "webrtc 'allow'");
    });

    it('upgrade-insecure-requests:true', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({ reportOnlyDirectives: { 'upgrade-insecure-requests': true } })(
        context,
      );
      assert.equal(newContext.responseHeaders.get('content-security-policy-report-only'), 'upgrade-insecure-requests');
    });

    it('multiple directives', async () => {
      const context = initTestContext();
      const newContext = await contentSecurityPolicy({
        reportOnlyDirectives: {
          'default-src': 'none',
          'font-src': [],
          'img-src': ['self'],
          'script-src': ['self', 'unsafe-inline', 'images.example.com'],
          'style-src': ['sha256-e02d55e83d66b31cf43295e9df9dc6f1be2b06d7b2213a645011380136f16045'],
          'media-src': ['nonce-ch4hvvbHDpv7xCSvXCs3BrNggHdTzxUA'],
        },
      })(context);
      assert.equal(
        newContext.responseHeaders.get('content-security-policy-report-only'),
        "default-src 'none';img-src 'self';script-src 'self' 'unsafe-inline' images.example.com;style-src 'sha256-e02d55e83d66b31cf43295e9df9dc6f1be2b06d7b2213a645011380136f16045';media-src 'nonce-ch4hvvbHDpv7xCSvXCs3BrNggHdTzxUA'",
      );
    });
  });
});
