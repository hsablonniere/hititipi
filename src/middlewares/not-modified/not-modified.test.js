import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { notModified } from './not-modified.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiContext} HititipiContext
 * @typedef {import('../../types/hititipi.types.d.ts').Etag} Etag
 */

describe('middleware / not-modified', () => {
  it('both options disabled should do nothing', async () => {
    const context = initTestContext();
    context.responseStatus = 200;
    context.responseHeaders.set('server', 'the-server');
    context.responseHeaders.set('x-foo', 'bar');
    context.responseEtag = { value: '123456', weak: true };
    context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
    await notModified({ etag: false, lastModified: false })(context);
    assert.equal(context.responseStatus, 200);
    assert.equal(context.responseHeaders.get('server'), 'the-server');
    assert.equal(context.responseHeaders.get('x-foo'), 'bar');
    assert.equal(context.responseHeaders.get('etag'), null);
    assert.equal(context.responseHeaders.get('last-modified'), null);
  });

  describe('etag option enabled', () => {
    it('GET with no responseEtag should return 200 and not add etag', async () => {
      const context = initTestContext();
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      await notModified({ etag: true, lastModified: false })(context);
      assert.equal(context.responseStatus, 200);
      assert.equal(context.responseHeaders.get('server'), 'the-server');
      assert.equal(context.responseHeaders.get('x-foo'), 'bar');
      assert.equal(context.responseHeaders.get('etag'), null);
      assert.equal(context.responseHeaders.get('last-modified'), null);
    });

    it('GET with no if-none-match should return 200 and add etag', async () => {
      const context = initTestContext();
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: true, lastModified: false })(context);
      assert.equal(context.responseStatus, 200);
      assert.equal(context.responseHeaders.get('server'), 'the-server');
      assert.equal(context.responseHeaders.get('x-foo'), 'bar');
      assert.equal(context.responseHeaders.get('etag'), 'W/"123456"');
      assert.equal(context.responseHeaders.get('last-modified'), null);
    });

    it('GET with single if-none-match (no match) should return 200 and add etag', async () => {
      const context = initTestContext();
      context.requestHeaders.set('if-none-match', 'W/"abcdef"');
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: true, lastModified: false })(context);
      assert.equal(context.responseStatus, 200);
      assert.equal(context.responseHeaders.get('server'), 'the-server');
      assert.equal(context.responseHeaders.get('x-foo'), 'bar');
      assert.equal(context.responseHeaders.get('etag'), 'W/"123456"');
      assert.equal(context.responseHeaders.get('last-modified'), null);
    });

    it('GET with multiple if-none-match (no match) should return 200 and add etag', async () => {
      const context = initTestContext();
      context.requestHeaders.set('if-none-match', 'W/"abcdef", W/"ghijkl"');
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: true, lastModified: false })(context);
      assert.equal(context.responseStatus, 200);
      assert.equal(context.responseHeaders.get('server'), 'the-server');
      assert.equal(context.responseHeaders.get('x-foo'), 'bar');
      assert.equal(context.responseHeaders.get('etag'), 'W/"123456"');
      assert.equal(context.responseHeaders.get('last-modified'), null);
    });

    it('GET with single if-none-match (one match) should return 304, add etag and clean response headers', async () => {
      const context = initTestContext();
      context.requestHeaders.set('if-none-match', 'W/"123456"');
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: true, lastModified: false })(context);
      assert.equal(context.responseStatus, 304);
      assert.equal(context.responseHeaders.get('server'), null);
      assert.equal(context.responseHeaders.get('x-foo'), null);
      assert.equal(context.responseHeaders.get('etag'), 'W/"123456"');
      assert.equal(context.responseHeaders.get('last-modified'), null);
    });

    it('GET with multiple if-none-match (one match) should return 304, add etag and clean response headers', async () => {
      const context = initTestContext();
      context.requestHeaders.set('if-none-match', 'W/"abcdef", W/"123456"');
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: true, lastModified: false })(context);
      assert.equal(context.responseStatus, 304);
      assert.equal(context.responseHeaders.get('server'), null);
      assert.equal(context.responseHeaders.get('x-foo'), null);
      assert.equal(context.responseHeaders.get('etag'), 'W/"123456"');
      assert.equal(context.responseHeaders.get('last-modified'), null);
    });

    it('POST with single if-none-match (one match) should return 200 and not add etag', async () => {
      const context = initTestContext({ requestMethod: 'POST' });
      context.requestHeaders.set('if-none-match', 'W/"123456"');
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: true, lastModified: false })(context);
      assert.equal(context.responseStatus, 200);
      assert.equal(context.responseHeaders.get('server'), 'the-server');
      assert.equal(context.responseHeaders.get('x-foo'), 'bar');
      assert.equal(context.responseHeaders.get('etag'), null);
      assert.equal(context.responseHeaders.get('last-modified'), null);
    });
  });

  describe('lastModified option enabled', () => {
    it('GET with no responseModificationDate should return 200 and not add last-modified', async () => {
      const context = initTestContext();
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      await notModified({ etag: false, lastModified: true })(context);
      assert.equal(context.responseStatus, 200);
      assert.equal(context.responseHeaders.get('server'), 'the-server');
      assert.equal(context.responseHeaders.get('x-foo'), 'bar');
      assert.equal(context.responseHeaders.get('etag'), null);
      assert.equal(context.responseHeaders.get('last-modified'), null);
    });

    it('GET with no if-modified-since should return 200 and add last-modified', async () => {
      const context = initTestContext();
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: false, lastModified: true })(context);
      assert.equal(context.responseStatus, 200);
      assert.equal(context.responseHeaders.get('server'), 'the-server');
      assert.equal(context.responseHeaders.get('x-foo'), 'bar');
      assert.equal(context.responseHeaders.get('etag'), null);
      assert.equal(context.responseHeaders.get('last-modified'), 'Mon, 01 Jan 2024 00:00:00 GMT');
    });

    it('GET with if-modified-since before responseModificationDate should return 200 and add last-modified', async () => {
      const context = initTestContext();
      context.requestHeaders.set('if-modified-since', 'Sun, 01 Jan 2023 00:00:00 GMT');
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: false, lastModified: true })(context);
      assert.equal(context.responseStatus, 200);
      assert.equal(context.responseHeaders.get('server'), 'the-server');
      assert.equal(context.responseHeaders.get('x-foo'), 'bar');
      assert.equal(context.responseHeaders.get('etag'), null);
      assert.equal(context.responseHeaders.get('last-modified'), 'Mon, 01 Jan 2024 00:00:00 GMT');
    });

    it('GET with if-modified-since after responseModificationDate should return 304, add last-modified and clean response headers', async () => {
      const context = initTestContext();
      context.requestHeaders.set('if-modified-since', 'Wed, 01 Jan 2025 00:00:00 GMT');
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: false, lastModified: true })(context);
      assert.equal(context.responseStatus, 304);
      assert.equal(context.responseHeaders.get('server'), null);
      assert.equal(context.responseHeaders.get('x-foo'), null);
      assert.equal(context.responseHeaders.get('etag'), null);
      assert.equal(context.responseHeaders.get('last-modified'), 'Mon, 01 Jan 2024 00:00:00 GMT');
    });

    it('GET with if-modified-since same as responseModificationDate should return 304, add last-modified and clean response headers', async () => {
      const context = initTestContext();
      context.requestHeaders.set('if-modified-since', 'Mon, 01 Jan 2024 00:00:00 GMT');
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: false, lastModified: true })(context);
      assert.equal(context.responseStatus, 304);
      assert.equal(context.responseHeaders.get('server'), null);
      assert.equal(context.responseHeaders.get('x-foo'), null);
      assert.equal(context.responseHeaders.get('etag'), null);
      assert.equal(context.responseHeaders.get('last-modified'), 'Mon, 01 Jan 2024 00:00:00 GMT');
    });

    it('GET with if-modified-since same (but different millisecond) as responseModificationDate should return 304, add last-modified and clean response headers', async () => {
      const context = initTestContext();
      context.requestHeaders.set('if-modified-since', 'Mon, 01 Jan 2024 00:00:00 GMT');
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.100Z');
      await notModified({ etag: false, lastModified: true })(context);
      assert.equal(context.responseStatus, 304);
      assert.equal(context.responseHeaders.get('server'), null);
      assert.equal(context.responseHeaders.get('x-foo'), null);
      assert.equal(context.responseHeaders.get('etag'), null);
      assert.equal(context.responseHeaders.get('last-modified'), 'Mon, 01 Jan 2024 00:00:00 GMT');
    });

    it('POST with if-modified-since after responseModificationDate should return 200 and not add last-modified', async () => {
      const context = initTestContext({ requestMethod: 'POST' });
      context.requestHeaders.set('if-modified-since', 'Wed, 01 Jan 2025 00:00:00 GMT');
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: false, lastModified: true })(context);
      assert.equal(context.responseStatus, 200);
      assert.equal(context.responseHeaders.get('server'), 'the-server');
      assert.equal(context.responseHeaders.get('x-foo'), 'bar');
      assert.equal(context.responseHeaders.get('etag'), null);
      assert.equal(context.responseHeaders.get('last-modified'), null);
    });
  });

  describe('etag and lastModified options enabled', () => {
    it('GET with no if-none-match and no if-modified-since should return 200 and add etag and last-modified', async () => {
      const context = initTestContext();
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: true, lastModified: true })(context);
      assert.equal(context.responseStatus, 200);
      assert.equal(context.responseHeaders.get('server'), 'the-server');
      assert.equal(context.responseHeaders.get('x-foo'), 'bar');
      assert.equal(context.responseHeaders.get('etag'), 'W/"123456"');
      assert.equal(context.responseHeaders.get('last-modified'), 'Mon, 01 Jan 2024 00:00:00 GMT');
    });

    it('GET with single if-none-match (no match) and if-modified-since before responseModificationDate should return 200 and add etag and last-modified', async () => {
      const context = initTestContext();
      context.requestHeaders.set('if-none-match', 'W/"abcdef"');
      context.requestHeaders.set('if-modified-since', 'Sun, 01 Jan 2023 00:00:00 GMT');
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: true, lastModified: true })(context);
      assert.equal(context.responseStatus, 200);
      assert.equal(context.responseHeaders.get('server'), 'the-server');
      assert.equal(context.responseHeaders.get('x-foo'), 'bar');
      assert.equal(context.responseHeaders.get('etag'), 'W/"123456"');
      assert.equal(context.responseHeaders.get('last-modified'), 'Mon, 01 Jan 2024 00:00:00 GMT');
    });

    it('GET with multiple if-none-match (no match) and if-modified-since before responseModificationDate should return 200 and add etag and last-modified', async () => {
      const context = initTestContext();
      context.requestHeaders.set('if-none-match', 'W/"abcdef", W/"ghijkl"');
      context.requestHeaders.set('if-modified-since', 'Sun, 01 Jan 2023 00:00:00 GMT');
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: true, lastModified: true })(context);
      assert.equal(context.responseStatus, 200);
      assert.equal(context.responseHeaders.get('server'), 'the-server');
      assert.equal(context.responseHeaders.get('x-foo'), 'bar');
      assert.equal(context.responseHeaders.get('etag'), 'W/"123456"');
      assert.equal(context.responseHeaders.get('last-modified'), 'Mon, 01 Jan 2024 00:00:00 GMT');
    });

    it('GET with single if-none-match (one match) and if-modified-since before responseModificationDate should return 304, add etag and clean response headers', async () => {
      const context = initTestContext();
      context.requestHeaders.set('if-none-match', 'W/"123456"');
      context.requestHeaders.set('if-modified-since', 'Sun, 01 Jan 2023 00:00:00 GMT');
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: true, lastModified: true })(context);
      assert.equal(context.responseStatus, 304);
      assert.equal(context.responseHeaders.get('server'), null);
      assert.equal(context.responseHeaders.get('x-foo'), null);
      assert.equal(context.responseHeaders.get('etag'), 'W/"123456"');
      assert.equal(context.responseHeaders.get('last-modified'), null);
    });

    it('GET with multiple if-none-match (one match) and if-modified-since before responseModificationDate should return 304, add etag and clean response headers', async () => {
      const context = initTestContext();
      context.requestHeaders.set('if-none-match', 'W/"abcdef", W/"123456"');
      context.requestHeaders.set('if-modified-since', 'Sun, 01 Jan 2023 00:00:00 GMT');
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: true, lastModified: true })(context);
      assert.equal(context.responseStatus, 304);
      assert.equal(context.responseHeaders.get('server'), null);
      assert.equal(context.responseHeaders.get('x-foo'), null);
      assert.equal(context.responseHeaders.get('etag'), 'W/"123456"');
      assert.equal(context.responseHeaders.get('last-modified'), null);
    });

    it('GET with no etag and if-modified-since after responseModificationDate should return 304 and add last-modified and clean response headers', async () => {
      const context = initTestContext();
      context.requestHeaders.set('if-modified-since', 'Wed, 01 Jan 2025 00:00:00 GMT');
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: false, lastModified: true })(context);
      assert.equal(context.responseStatus, 304);
      assert.equal(context.responseHeaders.get('server'), null);
      assert.equal(context.responseHeaders.get('x-foo'), null);
      assert.equal(context.responseHeaders.get('etag'), null);
      assert.equal(context.responseHeaders.get('last-modified'), 'Mon, 01 Jan 2024 00:00:00 GMT');
    });

    it('GET with single if-none-match (no match) and if-modified-since after responseModificationDate should return 304, add etag and clean response headers', async () => {
      const context = initTestContext();
      context.requestHeaders.set('if-none-match', 'W/"abcdef"');
      context.requestHeaders.set('if-modified-since', 'Wed, 01 Jan 2025 00:00:00 GMT');
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: true, lastModified: true })(context);
      assert.equal(context.responseStatus, 304);
      assert.equal(context.responseHeaders.get('server'), null);
      assert.equal(context.responseHeaders.get('x-foo'), null);
      assert.equal(context.responseHeaders.get('etag'), 'W/"123456"');
      assert.equal(context.responseHeaders.get('last-modified'), null);
    });

    it('GET with multiple if-none-match (no match) and if-modified-since after responseModificationDate should return 304, add etag and clean response headers', async () => {
      const context = initTestContext();
      context.requestHeaders.set('if-none-match', 'W/"abcdef", W/"ghijkl"');
      context.requestHeaders.set('if-modified-since', 'Wed, 01 Jan 2025 00:00:00 GMT');
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: true, lastModified: true })(context);
      assert.equal(context.responseStatus, 304);
      assert.equal(context.responseHeaders.get('server'), null);
      assert.equal(context.responseHeaders.get('x-foo'), null);
      assert.equal(context.responseHeaders.get('etag'), 'W/"123456"');
      assert.equal(context.responseHeaders.get('last-modified'), null);
    });

    it('POST with single if-none-match (one match) and if-modified-since before responseModificationDate should return 200 and not add etag or last-modified', async () => {
      const context = initTestContext({ requestMethod: 'POST' });
      context.requestHeaders.set('if-none-match', 'W/"123456"');
      context.requestHeaders.set('if-modified-since', 'Sun, 01 Jan 2023 00:00:00 GMT');
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: true, lastModified: true })(context);
      assert.equal(context.responseStatus, 200);
      assert.equal(context.responseHeaders.get('server'), 'the-server');
      assert.equal(context.responseHeaders.get('x-foo'), 'bar');
      assert.equal(context.responseHeaders.get('etag'), null);
      assert.equal(context.responseHeaders.get('last-modified'), null);
    });

    it('POST with single if-none-match (no match) and if-modified-since after responseModificationDate should return 200 and not add etag or last-modified', async () => {
      const context = initTestContext({ requestMethod: 'POST' });
      context.requestHeaders.set('if-none-match', 'W/"abcdef"');
      context.requestHeaders.set('if-modified-since', 'Wed, 01 Jan 2025 00:00:00 GMT');
      context.responseStatus = 200;
      context.responseHeaders.set('server', 'the-server');
      context.responseHeaders.set('x-foo', 'bar');
      context.responseEtag = { value: '123456', weak: true };
      context.responseModificationDate = new Date('2024-01-01T00:00:00.000Z');
      await notModified({ etag: true, lastModified: true })(context);
      assert.equal(context.responseStatus, 200);
      assert.equal(context.responseHeaders.get('server'), 'the-server');
      assert.equal(context.responseHeaders.get('x-foo'), 'bar');
      assert.equal(context.responseHeaders.get('etag'), null);
      assert.equal(context.responseHeaders.get('last-modified'), null);
    });
  });
});
