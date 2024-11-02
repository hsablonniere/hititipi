import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { initTestContext } from '../../lib/init-test-context.js';
import { logRequest } from './log-request.js';

/**
 * @param {any} [_message]
 * @param  {Array<any>} _optionalParams
 */
function consoleLogNoop(_message, ..._optionalParams) {}

describe('middleware / log-request', () => {
  it('hideTimestamps: false', async () => {
    const context = initTestContext({ requestUrl: '/foo?bar=42' });
    const logFunction = mock.fn(consoleLogNoop);
    await logRequest({ hideTimestamps: false, logFunction })(context);
    assert.equal(logFunction.mock.callCount(), 1);
    const callArgs = logFunction.mock.calls[0].arguments;
    assert.equal(callArgs[0], new Date(context.requestTimestamp).toISOString());
    assert.equal(callArgs[1], '[random-id]');
    assert.equal(callArgs[2], 'GET');
    assert.equal(callArgs[3], '/foo');
    assert.equal(callArgs[4], '?bar=42');
    assert.equal(callArgs[5], '501');
    assert.ok(callArgs[6].match(/^\d+ms$/));
  });
  it('hideTimestamps: true', async () => {
    const context = initTestContext({ requestUrl: '/foo?bar=42' });
    const logFunction = mock.fn(consoleLogNoop);
    await logRequest({ hideTimestamps: true, logFunction })(context);
    assert.equal(logFunction.mock.callCount(), 1);
    const callArgs = logFunction.mock.calls[0].arguments;
    assert.equal(callArgs[0], '[random-id]');
    assert.equal(callArgs[1], 'GET');
    assert.equal(callArgs[2], '/foo');
    assert.equal(callArgs[3], '?bar=42');
    assert.equal(callArgs[4], '501');
    assert.ok(callArgs[5].match(/^\d+ms$/));
  });
});
