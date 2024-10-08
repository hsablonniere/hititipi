import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { sendJson } from './send-json.js';

describe('middleware / send-json', () => {
  it('with object', async () => {
    const context = initTestContext();
    const newContext = await sendJson(200, { foo: 'bar' })(context);
    assert.strictEqual(newContext.responseStatus, 200);
    assert.strictEqual(newContext.responseHeaders.get('content-type'), 'application/json');
    assert.strictEqual(newContext.responseBody, '{"foo":"bar"}');
    assert.strictEqual(newContext.responseSize, 13);
  });
  it('with array', async () => {
    const context = initTestContext();
    const newContext = await sendJson(200, ['one', 'two'])(context);
    assert.strictEqual(newContext.responseStatus, 200);
    assert.strictEqual(newContext.responseHeaders.get('content-type'), 'application/json');
    assert.strictEqual(newContext.responseBody, '["one","two"]');
    assert.strictEqual(newContext.responseSize, 13);
  });
});
