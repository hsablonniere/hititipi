import assert from 'assert';
import fs from 'fs/promises';
import path from 'path';
import sinon from 'sinon';
import { ALL_BUT_HEAD_GET, assertEqualContextsOrNull, HEAD_GET } from '../lib-test/test-utils.js';
import { staticFile } from '../../src/middlewares/static-file.js';
import { streamToBuffer, streamToString } from '../lib-test/stream-utils.js';

const INIT_CONTEXT = {
  requestMethod: 'GET',
  requestUrl: new URL('http://localhost:8080/text.txt'),
  requestHeaders: {},
  responseHeaders: {
    'x-foo': 'foo',
  },
};

describe('static middleware', () => {

  const sandbox = sinon.createSandbox();

  afterEach(() => sandbox.restore());

  describe('full requests', () => {

    const staticFilePublic = staticFile({ root: 'public' });

    it('skip if not HEAD/GET', async () => {
      for (const requestMethod of ALL_BUT_HEAD_GET) {
        const initContext = { ...INIT_CONTEXT, requestMethod };
        const context = await staticFilePublic(initContext);
        await assertEqualContextsOrNull(context, initContext);
      }
    });

    it('return 200 with headers and file body (text) with HEAD/GET', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = { ...INIT_CONTEXT, requestMethod };
        const context = await staticFilePublic(initContext);
        assert.strictEqual(context.responseStatus, 200);
        const responseString = await streamToString(context.responseBody);
        assert.strictEqual(responseString, 'Hello World!\n');
      }
    });

    it('return 200 with headers and file body (HTML) with HEAD/GET', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = { ...INIT_CONTEXT, requestMethod, requestUrl: new URL('http://localhost:8080/index.html') };
        const context = await staticFilePublic(initContext);
        assert.strictEqual(context.responseStatus, 200);
        assert.strictEqual(context.responseHeaders['content-type'], 'text/html; charset=utf-8');
        const responseString = await streamToString(context.responseBody);
        assert.match(responseString, /^<!doctype html>/);
      }
    });

    it('add context.responseModificationDate to context', async () => {
      const filepath = path.join(process.cwd(), 'public/text.txt');
      const filestats = await fs.stat(filepath);
      for (const requestMethod of HEAD_GET) {
        const initContext = { ...INIT_CONTEXT, requestMethod };
        const context = await staticFilePublic(initContext);
        assert.strictEqual(context.responseModificationDate.toISOString(), filestats.mtime.toISOString());
      }
    });

    it('add context.responseSize to context', async () => {
      const filepath = path.join(process.cwd(), 'public/text.txt');
      const filestats = await fs.stat(filepath);
      for (const requestMethod of HEAD_GET) {
        const initContext = { ...INIT_CONTEXT, requestMethod };
        const context = await staticFilePublic(initContext);
        assert.strictEqual(context.responseSize, filestats.size);
      }
    });

    it('add context.responseEtag to context', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = { ...INIT_CONTEXT, requestMethod };
        const context = await staticFilePublic(initContext);
        assert.match(context.responseEtag, /W\/"[0-f]+-[0-f]+"/);
      }
    });

    it('add context.gzipFile to context', async () => {
      const expectedGzipFilePath = path.join(process.cwd(), 'public/text.txt.gz');
      const expectedGzipFileStats = await fs.stat(expectedGzipFilePath);
      const expectedGzipFileBuffer = await fs.readFile(expectedGzipFilePath);
      for (const requestMethod of HEAD_GET) {
        const initContext = { ...INIT_CONTEXT, requestMethod };
        const context = await staticFilePublic(initContext);
        assert.match(context.responseEtag, /W\/"[0-f]+-[0-f]+"/);
        const gzipFileBuffer = await streamToBuffer(context.gzipFile.responseBody);
        assert.deepStrictEqual(gzipFileBuffer, expectedGzipFileBuffer);
        assert.strictEqual(context.gzipFile.responseModificationDate.toISOString(), expectedGzipFileStats.mtime.toISOString());
        assert.strictEqual(context.gzipFile.responseSize, expectedGzipFileStats.size);
        assert.match(context.gzipFile.responseEtag, /W\/"[0-f]+-[0-f]+\.gz"/);
      }
    });

    it('add context.brotliFile to context', async () => {
      const expectedBrotliFilePath = path.join(process.cwd(), 'public/text.txt.br');
      const expectedBrotliFileStats = await fs.stat(expectedBrotliFilePath);
      const expectedBrotliFileBuffer = await fs.readFile(expectedBrotliFilePath);
      for (const requestMethod of HEAD_GET) {
        const initContext = { ...INIT_CONTEXT, requestMethod };
        const context = await staticFilePublic(initContext);
        assert.match(context.responseEtag, /W\/"[0-f]+-[0-f]+"/);
        const brotliFileBuffer = await streamToBuffer(context.brotliFile.responseBody);
        assert.deepStrictEqual(brotliFileBuffer, expectedBrotliFileBuffer);
        assert.strictEqual(context.brotliFile.responseModificationDate.toISOString(), expectedBrotliFileStats.mtime.toISOString());
        assert.strictEqual(context.brotliFile.responseSize, expectedBrotliFileStats.size);
        assert.match(context.brotliFile.responseEtag, /W\/"[0-f]+-[0-f]+\.br"/);
      }
    });

    it('skip if file is not found', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = {
          ...INIT_CONTEXT,
          requestMethod,
          requestUrl: new URL('http://localhost:8080/unknown.txt'),
        };
        const context = await staticFilePublic(initContext);
        await assertEqualContextsOrNull(context, initContext);
      }
    });
  });

  describe('byte range requests', () => {

    const staticFilePublic = staticFile({ root: 'public', enableRange: true });

    it('return 206 with responseSite, headers and file body with HEAD/GET', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = {
          ...INIT_CONTEXT,
          requestMethod,
          requestUrl: new URL('http://localhost:8080/index.html'),
          requestHeaders: {
            ...INIT_CONTEXT.requestHeaders,
            'range': 'bytes=0-14',
          },
        };
        const context = await staticFilePublic(initContext);
        assert.strictEqual(context.responseStatus, 206);
        assert.strictEqual(context.responseHeaders['accept-ranges'], 'bytes');
        assert.strictEqual(context.responseHeaders['content-range'], 'bytes 0-14/124650');
        assert.strictEqual(context.responseSize, 15);
        const responseString = await streamToString(context.responseBody);
        assert.strictEqual(responseString, '<!doctype html>');
      }
    });
  });
});
