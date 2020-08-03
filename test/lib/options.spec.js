import assert from 'assert';
import {
  extractPathAndOptionsString,
  optionsHasValue,
  parseOptionsString,
  serializeOptions,
} from '../../src/lib/options.js';

describe('options.extractPathAndOptionsString()', () => {

  it('slash is slash', () => {
    assert.deepEqual(extractPathAndOptionsString('/'), { requestPath: '/', optionsString: '' });
  });

  it('one option without slash at the end', () => {
    assert.deepEqual(extractPathAndOptionsString('/@ce=gz'), { requestPath: '/', optionsString: '@ce=gz' });
  });

  it('one option with slash at the end', () => {
    assert.deepEqual(extractPathAndOptionsString('/@ce=gz/'), { requestPath: '/', optionsString: '@ce=gz' });
  });

  it('multiple options', () => {
    assert.deepEqual(extractPathAndOptionsString('/@ce=gz/'), { requestPath: '/', optionsString: '@ce=gz' });
  });

  it('multiple options with path after', () => {
    assert.deepEqual(extractPathAndOptionsString('/@ce=gz/foobar'), {
      requestPath: '/foobar',
      optionsString: '@ce=gz',
    });
  });
});

describe('options.parseOptionsString()', () => {

  it('undefined', () => {
    const options = parseOptionsString(undefined);
    assert.deepEqual(options, new Map());
  });

  it('null', () => {
    const options = parseOptionsString(null);
    assert.deepEqual(options, new Map());
  });

  it('empty string', () => {
    const options = parseOptionsString('');
    assert.deepEqual(options, new Map());
  });

  it('simple option', () => {
    const options = parseOptionsString('@ce=br');
    assert.deepEqual(options, new Map([['ce', 'br']]));
  });

  it('multiple options', () => {
    const options = parseOptionsString('@ce=br@cc=pu');
    assert.deepEqual(options, new Map([['ce', 'br'], ['cc', 'pu']]));
  });

  it('multiple options and multiple values', () => {
    const options = parseOptionsString('@ce=br@cc=pu,may,i');
    assert.deepEqual(options, new Map([['ce', 'br'], ['cc', 'pu,may,i']]));
  });
});

describe('options.serializeOptions()', () => {

  it('empty string', () => {
    const options = serializeOptions(new Map());
    assert.equal(options, '');
  });

  it('simple option', () => {
    const options = serializeOptions(new Map([['ce', 'br']]));
    assert.equal(options, '@ce=br');
  });

  it('multiple options', () => {
    const options = serializeOptions(new Map([['ce', 'br'], ['cc', 'pu']]));
    assert.equal(options, '@ce=br@cc=pu');
  });

  it('multiple options and multiple values', () => {
    const options = serializeOptions(new Map([['ce', 'br'], ['cc', 'pu,may,i']]));
    assert.equal(options, '@ce=br@cc=pu,may,i');
  });
});

describe('options.hasValue()', () => {

  it('simple value', () => {
    const options = new Map([['ce', 'br']]);
    assert.equal(optionsHasValue(options, { key: 'ce', defaultValue: '0' }, 'br'), true);
  });

  it('multiple values', () => {
    const options = new Map([['cc', 'pu,may,i']]);
    assert.equal(optionsHasValue(options, { key: 'cc', defaultValue: '' }, 'may'), true);
  });

  it('multiple values', () => {
    const options = new Map([['cc', 'pu,may,i']]);
    assert.equal(optionsHasValue(options, { key: 'cc', defaultValue: '' }, 'mr'), false);
  });

  it('default value', () => {
    const options = new Map();
    assert.equal(optionsHasValue(options, { key: 'et', defaultValue: '0' }, '0'), true);
  });
});
