import sinon from 'sinon';
import { ALL_BUT_HEAD_GET, assertEqualContexts, assertEqualContextsOrNull, HEAD_GET } from '../lib/test-utils.js';
import { notModified } from '../../src/middlewares/not-modified.js';
import { Readable } from 'stream';

const ETAG_FOO = '"87fa2ba623c147d7a0fd7f633d2c61d7"';
const ETAG_BAR = '"a656b689123e4464a4eb341ef8a2f42b"';

const PAST_DATE = new Date('1990-01-01T00:00:00.000Z');
const CURRENT_DATE = new Date('2020-01-01T00:00:00.000Z');
const FUTURE_DATE = new Date('2050-01-01T00:00:00.000Z');

const INIT_CONTEXT = {
  requestMethod: 'GET',
  requestUrl: new URL('http://localhost:8080'),
  requestHeaders: {},
  responseStatus: 200,
  responseHeaders: {
    'x-foo': 'foo',
    'content-type': 'text/plain',
    'content-length': '12',
    'content-encoding': 'identity',
  },
  responseBody: Readable.from('the-response'),
  responseEtag: ETAG_FOO,
  responseModificationDate: CURRENT_DATE,
};

describe('not-modified middleware', () => {

  const sandbox = sinon.createSandbox();

  afterEach(() => sandbox.restore());

  describe('etag', () => {

    const notModifiedWithEtag = notModified({ etag: true });

    it('set "etag" using context.responseEtag with 200 + HEAD/GET', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = { ...INIT_CONTEXT, requestMethod };
        const context = await notModifiedWithEtag(initContext);
        await assertEqualContexts(context, {
          ...initContext,
          responseHeaders: {
            ...INIT_CONTEXT.responseHeaders,
            'etag': ETAG_FOO,
          },
        });
      }
    });

    it('skip if option is disabled', async () => {
      const context = await notModified({ etag: false })(INIT_CONTEXT);
      await assertEqualContextsOrNull(context, INIT_CONTEXT);
    });

    it('skip if context.responseEtag is not defined', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = { ...INIT_CONTEXT, requestMethod, responseEtag: null };
        const context = await notModifiedWithEtag(initContext);
        await assertEqualContextsOrNull(context, initContext);
      }
    });

    it('skip if not 200', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = { ...INIT_CONTEXT, requestMethod, responseStatus: 404 };
        const context = await notModifiedWithEtag(initContext);
        await assertEqualContextsOrNull(context, initContext);
      }
    });

    it('skip if not HEAD/GET', async () => {
      for (const requestMethod of ALL_BUT_HEAD_GET) {
        const initContext = { ...INIT_CONTEXT, requestMethod };
        const context = await notModifiedWithEtag(initContext);
        await assertEqualContextsOrNull(context, initContext);
      }
    });

    it('return 304 and remove some headers when "if-none-match" matches "etag" with HEAD/GET', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = {
          ...INIT_CONTEXT,
          requestMethod,
          requestHeaders: {
            ...INIT_CONTEXT.requestHeaders,
            'if-none-match': ETAG_FOO,
          },
        };
        const context = await notModifiedWithEtag(initContext);
        await assertEqualContexts(context, {
          ...initContext,
          responseStatus: 304,
          responseHeaders: {
            'x-foo': 'foo',
            'etag': ETAG_FOO,
          },
        });
      }
    });

    it('return 200 and keep headers when "if-none-match" does not match "etag" with HEAD/GET', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = {
          ...INIT_CONTEXT,
          requestMethod,
          requestHeaders: {
            ...INIT_CONTEXT.requestHeaders,
            'if-none-match': ETAG_BAR,
          },
        };
        const context = await notModifiedWithEtag(initContext);
        await assertEqualContexts(context, {
          ...initContext,
          responseHeaders: {
            ...INIT_CONTEXT.responseHeaders,
            'etag': ETAG_FOO,
          },
        });
      }
    });
  });

  describe('lastModified', () => {

    const notModifiedWithLastModified = notModified({ lastModified: true });

    it('set "last-modified" using context.responseModificationDate with 200 + HEAD/GET', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = { ...INIT_CONTEXT, requestMethod };
        const context = await notModifiedWithLastModified(initContext);
        await assertEqualContexts(context, {
          ...initContext,
          responseHeaders: {
            ...INIT_CONTEXT.responseHeaders,
            'last-modified': CURRENT_DATE.toGMTString(),
          },
        });
      }
    });

    it('skip if option is disabled', async () => {
      const context = await notModified({ lastModified: false })(INIT_CONTEXT);
      await assertEqualContextsOrNull(context, INIT_CONTEXT);
    });

    it('skip if context.responseModificationDate is not defined', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = { ...INIT_CONTEXT, requestMethod, responseModificationDate: null };
        const context = await notModifiedWithLastModified(initContext);
        await assertEqualContextsOrNull(context, initContext);
      }
    });

    it('skip if not 200', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = { ...INIT_CONTEXT, requestMethod, responseStatus: 404 };
        const context = await notModifiedWithLastModified(initContext);
        await assertEqualContextsOrNull(context, initContext);
      }
    });

    it('skip if not HEAD/GET', async () => {
      for (const requestMethod of ALL_BUT_HEAD_GET) {
        const initContext = { ...INIT_CONTEXT, requestMethod };
        const context = await notModifiedWithLastModified(initContext);
        await assertEqualContextsOrNull(context, initContext);
      }
    });

    it('return 304 and remove some headers when "if-modified-since" is after "last-modified"', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = {
          ...INIT_CONTEXT,
          requestMethod,
          requestHeaders: {
            ...INIT_CONTEXT.requestHeaders,
            'if-modified-since': FUTURE_DATE.toGMTString(),
          },
        };
        const context = await notModifiedWithLastModified(initContext);
        await assertEqualContexts(context, {
          ...initContext,
          responseStatus: 304,
          responseHeaders: {
            'x-foo': 'foo',
            'last-modified': CURRENT_DATE.toGMTString(),
          },
        });
      }
    });

    it('return 304 and remove some headers when "if-modified-since" equals "last-modified"', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = {
          ...INIT_CONTEXT,
          requestMethod,
          requestHeaders: {
            ...INIT_CONTEXT.requestHeaders,
            'if-modified-since': CURRENT_DATE.toGMTString(),
          },
        };
        const context = await notModifiedWithLastModified(initContext);
        await assertEqualContexts(context, {
          ...initContext,
          responseStatus: 304,
          responseHeaders: {
            'x-foo': 'foo',
            'last-modified': CURRENT_DATE.toGMTString(),
          },
        });
      }
    });

    it('keep headers when "if-modified-since" is before "last-modified"', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = {
          ...INIT_CONTEXT,
          requestMethod,
          requestHeaders: {
            ...INIT_CONTEXT.requestHeaders,
            'if-modified-since': PAST_DATE.toGMTString(),
          },
        };
        const context = await notModifiedWithLastModified(initContext);
        await assertEqualContexts(context, {
          ...initContext,
          responseHeaders: {
            ...INIT_CONTEXT.responseHeaders,
            'last-modified': CURRENT_DATE.toGMTString(),
          },
        });
      }
    });
  });

  describe('etag + lastModified', () => {

    const notModifiedWithBoth = notModified({ etag: true, lastModified: true });

    it('set "etag" using context.responseEtag and "last-modified" using context.responseModificationDate with 200 + HEAD/GET', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = { ...INIT_CONTEXT, requestMethod };
        const context = await notModifiedWithBoth(initContext);
        await assertEqualContexts(context, {
          ...initContext,
          responseHeaders: {
            ...INIT_CONTEXT.responseHeaders,
            'etag': ETAG_FOO,
            'last-modified': CURRENT_DATE.toGMTString(),
          },
        });
      }
    });

    it('skip if both options are disabled', async () => {
      const context = await notModified({ etag: false, lastModified: false })(INIT_CONTEXT);
      await assertEqualContextsOrNull(context, INIT_CONTEXT);
    });

    it('return 304 and remove some headers when both "if-none-match" and "if-modified-since" matches with HEAD/GET', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = {
          ...INIT_CONTEXT,
          requestMethod,
          requestHeaders: {
            ...INIT_CONTEXT.requestHeaders,
            'if-none-match': ETAG_FOO,
            'if-modified-since': FUTURE_DATE.toGMTString(),
          },
        };
        const context = await notModifiedWithBoth(initContext);
        await assertEqualContexts(context, {
          ...initContext,
          responseStatus: 304,
          responseHeaders: {
            'x-foo': 'foo',
            'etag': ETAG_FOO,
          },
        });
      }
    });

    it('keep headers when "if-none-match" matches but not "if-modified-since" with HEAD/GET', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = {
          ...INIT_CONTEXT,
          requestMethod,
          requestHeaders: {
            ...INIT_CONTEXT.requestHeaders,
            'if-none-match': ETAG_FOO,
            'if-modified-since': PAST_DATE.toGMTString(),
          },
        };
        const context = await notModifiedWithBoth(initContext);
        await assertEqualContexts(context, {
          ...initContext,
          responseHeaders: {
            ...INIT_CONTEXT.responseHeaders,
            'etag': ETAG_FOO,
            'last-modified': CURRENT_DATE.toGMTString(),
          },
        });
      }
    });

    it('keep headers when "if-none-match" does not match but "if-modified-since" does with HEAD/GET', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = {
          ...INIT_CONTEXT,
          requestMethod,
          requestHeaders: {
            ...INIT_CONTEXT.requestHeaders,
            'if-none-match': ETAG_BAR,
            'if-modified-since': FUTURE_DATE.toGMTString(),
          },
        };
        const context = await notModifiedWithBoth(initContext);
        await assertEqualContexts(context, {
          ...initContext,
          responseHeaders: {
            ...INIT_CONTEXT.responseHeaders,
            'etag': ETAG_FOO,
            'last-modified': CURRENT_DATE.toGMTString(),
          },
        });
      }
    });

    it('keep headers when "if-none-match" and "if-modified-since" do not match with HEAD/GET', async () => {
      for (const requestMethod of HEAD_GET) {
        const initContext = {
          ...INIT_CONTEXT,
          requestMethod,
          requestHeaders: {
            ...INIT_CONTEXT.requestHeaders,
            'if-none-match': ETAG_BAR,
            'if-modified-since': PAST_DATE.toGMTString(),
          },
        };
        const context = await notModifiedWithBoth(initContext);
        await assertEqualContexts(context, {
          ...initContext,
          responseHeaders: {
            ...INIT_CONTEXT.responseHeaders,
            'etag': ETAG_FOO,
            'last-modified': CURRENT_DATE.toGMTString(),
          },
        });
      }
    });
  });
});
