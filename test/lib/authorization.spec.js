import assert from 'assert';
import { getBasicAuth, getBearerToken } from '../../src/lib/authorization.js';

describe('authorization', () => {

  describe('getBearerToken()', () => {

    it('undefined', () => {
      const token = getBearerToken();
      assert.deepStrictEqual(token, null);
    });

    it('null', () => {
      const token = getBearerToken(null);
      assert.deepStrictEqual(token, null);
    });

    it('empty string', () => {
      const token = getBearerToken('');
      assert.deepStrictEqual(token, null);
    });

    it('bad prefix', () => {
      const token = getBearerToken('Bearer');
      assert.deepStrictEqual(token, null);
    });

    it('bad string', () => {
      const token = getBearerToken('something');
      assert.deepStrictEqual(token, null);
    });

    it('valid example', () => {
      const token = getBearerToken('Bearer kx0njWGEpaNEKp8xZ65N');
      assert.deepStrictEqual(token, 'kx0njWGEpaNEKp8xZ65N');
    });
  });

  describe('getBasicAuth()', () => {

    it('undefined', () => {
      const { user, password } = getBasicAuth();
      assert.deepStrictEqual(user, null);
      assert.deepStrictEqual(password, null);
    });

    it('null', () => {
      const { user, password } = getBasicAuth(null);
      assert.deepStrictEqual(user, null);
      assert.deepStrictEqual(password, null);
    });

    it('empty string', () => {
      const { user, password } = getBasicAuth('');
      assert.deepStrictEqual(user, null);
      assert.deepStrictEqual(password, null);
    });

    it('bas string', () => {
      const { user, password } = getBasicAuth('something');
      assert.deepStrictEqual(user, null);
      assert.deepStrictEqual(password, null);
    });

    it('bad prefix', () => {
      const { user, password } = getBasicAuth('Basic');
      assert.deepStrictEqual(user, null);
      assert.deepStrictEqual(password, null);
    });

    it('not base65', () => {
      const { user, password } = getBasicAuth('Basic notbase64');
      assert.deepStrictEqual(user, null);
      assert.deepStrictEqual(password, null);
    });

    it('valid example', () => {
      const { user, password } = getBasicAuth('Basic dGhlLXVzZXI6dGhlLXBhc3N3b3Jk');
      assert.deepStrictEqual(user, 'the-user');
      assert.deepStrictEqual(password, 'the-password');
    });

    it('empty password', () => {
      const { user, password } = getBasicAuth('Basic dGhlLXVzZXI6');
      assert.deepStrictEqual(user, 'the-user');
      assert.deepStrictEqual(password, '');
    });

    it('empty user', () => {
      const { user, password } = getBasicAuth('Basic OnRoZS1wYXNzd29yZA==');
      assert.deepStrictEqual(user, '');
      assert.deepStrictEqual(password, 'the-password');
    });
  });
});
