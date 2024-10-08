import assert from 'node:assert';
import { describe, it } from 'node:test';
import { getStrongEtagHash } from './etag.js';

describe('lib / etag', () => {
  describe('getStrongEtagHash()', () => {
    it('no content', async () => {
      const etag = await getStrongEtagHash(null);
      assert.equal(etag, null);
    });
    it('some string content', async () => {
      const etag = await getStrongEtagHash('the body content');
      assert.deepEqual(etag, {
        value: '1eSl6KlXXQKYrtfNopRrQ4R6Ea0=',
        weak: false,
      });
    });
  });
});
