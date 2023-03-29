import assert from 'assert';
import http from 'http';
import sinon from 'sinon';
import { contentEncoding } from '../../src/middlewares/content-encoding.js';
import { Readable } from 'stream';
import { getStrongEtagHash, getWeakEtag } from '../../src/lib/etag.js';
import { BrotliCompress, createBrotliCompress, createGzip, Gzip } from 'zlib';
import { assertEqualContexts, assertEqualContextsOrNull } from '../lib-test/test-utils.js';

const INIT_CONTEXT = {
  requestMethod: 'GET',
  requestUrl: new URL('http://localhost:8080'),
  requestHeaders: {
    'accept-encoding': 'gzip, deflate, br',
  },
  responseStatus: 200,
  responseHeaders: {
    'content-type': 'text/plain',
  },
  responseTransformers: [],
};

function fakeFile (content, suffix = '') {
  let responseBody = Readable.from(content);
  const responseModificationDate = new Date();
  let responseSize = content.length;
  if (suffix === '.gz') {
    responseBody = responseBody.pipe(createGzip());
    responseSize -= 2;
  }
  if (suffix === '.br') {
    responseBody = responseBody.pipe(createBrotliCompress());
    responseSize -= 3;
  }
  const responseEtag = getWeakEtag({ mtime: responseModificationDate, size: responseSize }, suffix);
  return { responseBody, responseModificationDate, responseSize, responseEtag };
}

function fakeDynamicResponse (content) {
  const responseBody = Readable.from(content);
  const responseSize = content.length;
  const responseEtag = getStrongEtagHash(content);
  return { responseBody, responseSize, responseEtag };
}

function fetch (port, headers) {
  return new Promise((resolve, reject) => {
    const req = http.get({ port, headers }, resolve);
    req.on('error', reject);
  });
}

describe('content-encoding middleware', () => {

  const sandbox = sinon.createSandbox();

  afterEach(() => sandbox.restore());

  describe('gzip', () => {

    const contentEncodingWithGzip = contentEncoding({ gzip: true });

    it('skip when responseBody is nullish', async () => {
      const rawFile = fakeFile('raw-file');
      const initContext = { ...INIT_CONTEXT, ...rawFile, responseBody: null };
      const context = await contentEncodingWithGzip(initContext);
      await assertEqualContextsOrNull(context, initContext);
    });

    it('skip when content-type is not compressible', async () => {
      const rawFile = fakeFile('raw-file');
      const initContext = {
        ...INIT_CONTEXT,
        responseHeaders: {
          ...INIT_CONTEXT.responseHeaders,
          'content-type': 'image/jpeg',
        },
        ...rawFile,
      };
      const context = await contentEncodingWithGzip(initContext);
      await assertEqualContextsOrNull(context, initContext);
    });

    it('skip when accept/encoding does not match', async () => {
      const rawFile = fakeFile('raw-file');
      const initContext = {
        ...INIT_CONTEXT,
        requestHeaders: {
          ...INIT_CONTEXT.requestHeaders,
          'accept-encoding': 'deflate, br',
        },
        ...rawFile,
      };
      const context = await contentEncodingWithGzip(initContext);
      await assertEqualContextsOrNull(context, initContext);
    });

    it('use static gzip from gzipFile', async () => {
      const rawFile = fakeFile('raw-file');
      const gzipFile = fakeFile('gzip-file', '.gz');
      const initContext = { ...INIT_CONTEXT, ...rawFile, gzipFile };
      const context = await contentEncodingWithGzip(initContext);
      await assertEqualContexts(context, {
        ...initContext,
        ...gzipFile,
        responseHeaders: {
          ...initContext.responseHeaders,
          'content-encoding': 'gzip',
          'vary': 'accept-encoding',
        },
      });
    });

    it('use dynamic gzip on responseBody', async () => {
      // With dynamic compression, the fake responseBody will be read inside the middleware
      const initContext = { ...INIT_CONTEXT, ...fakeDynamicResponse('dynamic-response') };
      const context = await contentEncodingWithGzip(initContext);
      await assertEqualContexts(context, {
        ...initContext,
        ...fakeDynamicResponse('dynamic-response'),
        // Mock responseEtag so we can test it later
        responseEtag: context.responseEtag,
        responseSize: null,
        responseHeaders: {
          ...initContext.responseHeaders,
          'content-encoding': 'gzip',
          'vary': 'accept-encoding',
        },
        // Mock responseTransformers so we can test it later
        responseTransformers: context.responseTransformers,
      });

      assert.ok(context.responseEtag.startsWith('W/"'));
      assert.ok(context.responseEtag.endsWith('.gz"'));
      assert.ok(context.responseTransformers.length === 1);
      assert.ok(context.responseTransformers[0] instanceof Gzip);
    });
  });

  describe('brotli', () => {

    const contentEncodingWithBrotli = contentEncoding({ brotli: true });

    it('skip when responseBody is nullish', async () => {
      const rawFile = fakeFile('raw-file');
      const initContext = { ...INIT_CONTEXT, ...rawFile, responseBody: null };
      const context = await contentEncodingWithBrotli(initContext);
      await assertEqualContextsOrNull(context, initContext);
    });

    it('skip when content-type is not compressible', async () => {
      const rawFile = fakeFile('raw-file');
      const initContext = {
        ...INIT_CONTEXT,
        responseHeaders: {
          ...INIT_CONTEXT.responseHeaders,
          'content-type': 'image/jpeg',
        },
        ...rawFile,
      };
      const context = await contentEncodingWithBrotli(initContext);
      await assertEqualContextsOrNull(context, initContext);
    });

    it('skip when accept/encoding does not match', async () => {
      const rawFile = fakeFile('raw-file');
      const initContext = {
        ...INIT_CONTEXT,
        requestHeaders: {
          ...INIT_CONTEXT.requestHeaders,
          'accept-encoding': 'gzip, deflate',
        },
        ...rawFile,
      };
      const context = await contentEncodingWithBrotli(initContext);
      await assertEqualContextsOrNull(context, initContext);
    });

    it('use static brotli from brotliFile', async () => {
      const rawFile = fakeFile('raw-file');
      const brotliFile = fakeFile('brotli-file', '.br');
      const initContext = { ...INIT_CONTEXT, ...rawFile, brotliFile };
      const context = await contentEncodingWithBrotli(initContext);
      await assertEqualContexts(context, {
        ...initContext,
        ...brotliFile,
        responseHeaders: {
          ...initContext.responseHeaders,
          'content-encoding': 'br',
          'vary': 'accept-encoding',
        },
      });
    });

    it('use dynamic brotli on responseBody', async () => {
      const initContext = { ...INIT_CONTEXT, ...fakeDynamicResponse('dynamic-response') };
      const context = await contentEncodingWithBrotli(initContext);
      await assertEqualContexts(context, {
        ...initContext,
        ...fakeDynamicResponse('dynamic-response'),
        // Mock responseEtag so we can test it later
        responseEtag: context.responseEtag,
        responseSize: null,
        responseHeaders: {
          ...initContext.responseHeaders,
          'content-encoding': 'br',
          'vary': 'accept-encoding',
        },
        // Mock responseTransformers so we can test it later
        responseTransformers: context.responseTransformers,
      });

      assert.ok(context.responseEtag.startsWith('W/"'));
      assert.ok(context.responseEtag.endsWith('.br"'));
      assert.ok(context.responseTransformers.length === 1);
      assert.ok(context.responseTransformers[0] instanceof BrotliCompress);
    });
  });

  describe('gzip + brotli', () => {

    const contentEncodingWithBoth = contentEncoding({ gzip: true, brotli: true });

    it('skip when both options are disabled', async () => {
      const rawFile = fakeFile('raw-file');
      const initContext = { ...INIT_CONTEXT, ...rawFile, responseBody: null };
      const context = await contentEncodingWithBoth(initContext);
      await assertEqualContextsOrNull(context, initContext);
    });

    it('prefer static brotli over static gzip', async () => {
      const rawFile = fakeFile('raw-file');
      const brotliFile = fakeFile('brotli-file', '.br');
      const initContext = { ...INIT_CONTEXT, ...rawFile, brotliFile };
      const context = await contentEncodingWithBoth(initContext);
      await assertEqualContexts(context, {
        ...initContext,
        ...brotliFile,
        responseHeaders: {
          ...initContext.responseHeaders,
          'content-encoding': 'br',
          'vary': 'accept-encoding',
        },
      });
    });

    it('prefer dynamic brotli over static gzip', async () => {
      const initContext = { ...INIT_CONTEXT, ...fakeDynamicResponse('dynamic-response') };
      const context = await contentEncodingWithBoth(initContext);
      await assertEqualContexts(context, {
        ...initContext,
        ...fakeDynamicResponse('dynamic-response'),
        // Mock responseEtag so we can test it later
        responseEtag: context.responseEtag,
        responseSize: null,
        responseHeaders: {
          ...initContext.responseHeaders,
          'content-encoding': 'br',
          'vary': 'accept-encoding',
        },
        // Mock responseTransformers so we can test it later
        responseTransformers: context.responseTransformers,
      });

      assert.ok(context.responseEtag.startsWith('W/"'));
      assert.ok(context.responseEtag.endsWith('.br"'));
      assert.ok(context.responseTransformers.length === 1);
      assert.ok(context.responseTransformers[0] instanceof BrotliCompress);
    });
  });
});
