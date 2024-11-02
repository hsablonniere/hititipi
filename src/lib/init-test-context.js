import { mock } from 'node:test';
import { RequestHeadersNode, RequestSearchParamsNode, ResponseHeadersNode } from '../hititipi.node.js';
import { toReadableStream } from './response-body.js';

/**
 * @typedef {import('node:test').Mock<(hints: Record<string, string | string[]>) => Promise<void>>} MockWriteEarlyHints
 * @typedef {import('../types/hititipi.types.d.ts').HititipiContext} HititipiContext
 * @typedef {import('../types/hititipi.types.d.ts').HititipiMethod} HititipiMethod
 * @typedef {import('../types/hititipi.types.d.ts').RequestHeaders} RequestHeaders
 */

/**
 * @param {Object} [base]
 * @param {number} [base.requestHttpVersion]
 * @param {HititipiMethod} [base.requestMethod]
 * @param {'http'|'https'} [base.requestProtocol]
 * @param {string} [base.requestUrl]
 * @param {Record<string, string|Array<string>>} [base.requestHeaders]
 * @return {HititipiContext & { writeEarlyHints: MockWriteEarlyHints }}
 */
export function initTestContext(base = {}) {
  const [requestPathname, rawQueryString] = (base.requestUrl ?? '/').split('?');
  const requestHeaders = base.requestHeaders ?? {};
  return {
    requestTimestamp: Date.now(),
    requestId: 'random-id',
    requestIps: ['127.0.0.1'],
    requestHttpVersion: base.requestHttpVersion ?? 1,
    requestMethod: base.requestMethod ?? 'GET',
    requestProtocol: base.requestProtocol ?? 'http',
    requestPathname,
    requestSearchParams: new RequestSearchParamsNode(rawQueryString),
    requestHeaders: new RequestHeadersNode(requestHeaders),
    requestBody: toReadableStream(''),
    responseHeaders: new ResponseHeadersNode(),
    writeEarlyHints: mock.fn(async () => {}),
  };
}
