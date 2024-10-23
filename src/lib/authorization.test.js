import assert from 'node:assert';
import { describe, it } from 'node:test';
import { RequestHeadersNode } from '../hititipi.node.js';
import { getBasicAuth, getBearerToken } from './authorization.js';

describe('lib / authorization', () => {
  describe('getBearerToken()', () => {
    it('empty authorization header', async () => {
      const headers = new RequestHeadersNode({});
      const token = getBearerToken(headers);
      assert.equal(token, null);
    });
    it('bad format', async () => {
      const headers = new RequestHeadersNode({
        authorization: 'Basic dGhlLXVzZXI6dGhlLXBhc3N3b3Jk',
      });
      const token = getBearerToken(headers);
      assert.equal(token, null);
    });
    it('ok', async () => {
      const headers = new RequestHeadersNode({
        authorization: 'Bearer the-token',
      });
      const token = getBearerToken(headers);
      assert.equal(token, 'the-token');
    });
  });

  describe('getBasicAuth()', () => {
    it('empty authorization header', async () => {
      const headers = new RequestHeadersNode({});
      const { user, password } = getBasicAuth(headers);
      assert.equal(user, null);
      assert.equal(password, null);
    });
    it('bad format', async () => {
      const headers = new RequestHeadersNode({
        authorization: 'Bearer the-token',
      });
      const { user, password } = getBasicAuth(headers);
      assert.equal(user, null);
      assert.equal(password, null);
    });
    it('ok', async () => {
      const headers = new RequestHeadersNode({
        authorization: 'Basic dGhlLXVzZXI6dGhlLXBhc3N3b3Jk',
      });
      const { user, password } = getBasicAuth(headers);
      assert.equal(user, 'the-user');
      assert.equal(password, 'the-password');
    });
  });
});
