import assert from 'node:assert';
import { describe, it } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { sendJson } from './send-json.js';

describe('middleware / send-json', () => {
  it('with object', async () => {
    const context = initTestContext();
    await sendJson(200, { foo: 'bar' })(context);
    assert.strictEqual(context.responseStatus, 200);
    assert.strictEqual(context.responseHeaders.get('content-type'), 'application/json');
    assert.strictEqual(context.responseHeaders.get('content-length'), '13');
    assert.strictEqual(context.responseBody, '{"foo":"bar"}');
  });
  it('with array', async () => {
    const context = initTestContext();
    await sendJson(200, ['one', 'two'])(context);
    assert.strictEqual(context.responseStatus, 200);
    assert.strictEqual(context.responseHeaders.get('content-type'), 'application/json');
    assert.strictEqual(context.responseHeaders.get('content-length'), '13');
    assert.strictEqual(context.responseBody, '["one","two"]');
  });
});
