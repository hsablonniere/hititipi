import assert from 'node:assert';
import { describe, it } from 'node:test';
import { ONE_DAY_S } from '../../lib/durations.js';
import { initTestContext } from '../../lib/init-test-context.js';
import { setCookie } from './set-cookie.js';

describe('middleware / set-cookie', () => {
  it('one set-cookie', async () => {
    const context = initTestContext();
    const newContext = await setCookie('the-name', 'one', {
      httpOnly: true,
      maxAge: ONE_DAY_S,
      path: '/',
      sameSite: 'lax',
      secure: true,
      usePrefix: 'host',
    })(context);
    assert.deepEqual(newContext.responseHeaders.getSetCookie(), [
      '__Host-the-name=one; Max-Age=86400; Path=/; HttpOnly; Secure; SameSite=Lax',
    ]);
  });
  it('multiple set-cookie', async () => {
    const context = initTestContext();
    const contextOne = await setCookie('aaa', 'AAA', {
      httpOnly: true,
      maxAge: ONE_DAY_S,
      path: '/',
      sameSite: 'lax',
      secure: true,
      usePrefix: 'host',
    })(context);
    const contextTwo = await setCookie('bbb', 'BBB', {
      sameSite: 'strict',
      path: '/the-path',
    })(contextOne);
    const contextThree = await setCookie('ccc', 'CCC')(contextTwo);
    assert.deepEqual(contextThree.responseHeaders.getSetCookie(), [
      '__Host-aaa=AAA; Max-Age=86400; Path=/; HttpOnly; Secure; SameSite=Lax',
      'bbb=BBB; Path=/the-path; SameSite=Strict',
      'ccc=CCC',
    ]);
  });
});
