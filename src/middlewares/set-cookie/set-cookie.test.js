import assert from 'node:assert';
import { describe, it } from 'node:test';
import { ONE_DAY_S } from '../../lib/durations.js';
import { initTestContext } from '../../lib/init-test-context.js';
import { setCookie } from './set-cookie.js';

describe('middleware / set-cookie', () => {
  it('one set-cookie', async () => {
    const context = initTestContext();
    await setCookie('the-name', 'one', {
      httpOnly: true,
      maxAge: ONE_DAY_S,
      path: '/',
      sameSite: 'lax',
      secure: true,
      usePrefix: 'host',
    })(context);
    assert.deepEqual(context.responseHeaders.getSetCookie(), [
      '__Host-the-name=one; Max-Age=86400; Path=/; HttpOnly; Secure; SameSite=Lax',
    ]);
  });
  it('multiple set-cookie', async () => {
    const context = initTestContext();
    await setCookie('aaa', 'AAA', {
      httpOnly: true,
      maxAge: ONE_DAY_S,
      path: '/',
      sameSite: 'lax',
      secure: true,
      usePrefix: 'host',
    })(context);
    await setCookie('bbb', 'BBB', {
      sameSite: 'strict',
      path: '/the-path',
    })(context);
    await setCookie('ccc', 'CCC')(context);
    assert.deepEqual(context.responseHeaders.getSetCookie(), [
      '__Host-aaa=AAA; Max-Age=86400; Path=/; HttpOnly; Secure; SameSite=Lax',
      'bbb=BBB; Path=/the-path; SameSite=Strict',
      'ccc=CCC',
    ]);
  });
});
