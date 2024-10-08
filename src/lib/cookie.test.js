import assert from 'node:assert';
import { describe, it } from 'node:test';
import { getCookieValue } from './cookie.js';

describe('lib / cookie', () => {
  it('empty header', async () => {
    const headers = new Headers();
    const cookieValue = getCookieValue(headers, 'bbb');
    assert.equal(cookieValue, null);
  });
  it('unknown cookieValue', async () => {
    const headers = new Headers({ cookie: 'aaa=AAA; bbb=BBB; ccc=CCC' });
    const cookieValue = getCookieValue(headers, 'ddd');
    assert.equal(cookieValue, null);
  });
  it('without prefix', async () => {
    const headers = new Headers({ cookie: 'aaa=AAA; bbb=BBB; ccc=CCC' });
    const cookieValue = getCookieValue(headers, 'bbb');
    assert.equal(cookieValue, 'BBB');
  });
  it('with __Host- prefix', async () => {
    const headers = new Headers({ cookie: 'aaa=AAA; __Host-bbb=BBB; bbb=not-BBB; ccc=CCC' });
    const cookieValue = getCookieValue(headers, 'bbb', 'host');
    assert.equal(cookieValue, 'BBB');
  });
  it('with __Secure- prefix', async () => {
    const headers = new Headers({ cookie: 'aaa=AAA; __Secure-bbb=BBB; bbb=not-BBB; ccc=CCC' });
    const cookieValue = getCookieValue(headers, 'bbb', 'secure');
    assert.equal(cookieValue, 'BBB');
  });
});
