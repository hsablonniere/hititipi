import assert from 'assert';
import { cloneStream, streamToBuffer } from './stream-utils.js';

export const HEAD_GET = ['HEAD', 'GET'];
export const ALL_BUT_HEAD_GET = ['PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'];
export const ALL_METHODS = [...HEAD_GET, ...ALL_BUT_HEAD_GET];

export function expectNullHeaders (...headerNames) {
  return (httpResponse) => {
    for (const header of headerNames) {
      assert.ok(httpResponse.headers[header] == null);
    }
  };
}

async function assertEqualStreams (stream, expectedStream) {
  if (stream !== expectedStream) {
    const buffer = await streamToBuffer(cloneStream(stream));
    const expectedBuffer = await streamToBuffer(cloneStream(expectedStream));
    assert.deepStrictEqual(buffer, expectedBuffer);
  }
}

export async function assertEqualContexts (context, expectedContext) {
  const { responseBody, ...subContext } = context;
  const { responseBody: expectedResponseBody, ...expectedSubContext } = expectedContext;
  assert.deepStrictEqual(subContext, expectedSubContext);
  return assertEqualStreams(responseBody, expectedResponseBody);
}

export async function assertEqualContextsOrNull (context, expectedContext) {
  if (context != null) {
    return assertEqualContexts(context, expectedContext);
  }
}
