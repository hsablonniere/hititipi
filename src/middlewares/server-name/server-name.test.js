import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { serverName } from './server-name.js';

describe('middleware / server-name', () => {
  it('should add a server response header', async () => {
    const context = initTestContext();
    await serverName('the-awesome-server')(context);
    assert.strictEqual(context.responseHeaders.get('server'), 'the-awesome-server');
  });
});
