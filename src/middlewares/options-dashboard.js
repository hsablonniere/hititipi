import { ONE_YEAR } from './cache-control.js';
import { optionsHasValue, serializeOptions } from '../lib/options.js';
import crypto from 'crypto';
import { Readable } from 'stream';
import { getStrongEtagHash } from '../lib/etag.js';

export function optionsDashboard (options = {}) {

  return async (context) => {

    if (context.requestMethod !== 'GET' || context.requestUrl.pathname !== '/__dashboard__') {
      return;
    }

    if (context.requestUrl.search !== '') {
      const keys = Array.from(new Set(context.requestUrl.searchParams.keys()));
      const options = new Map(keys.map((k) => [k, context.requestUrl.searchParams.getAll(k).join(',')]));
      const optionsString = serializeOptions(options);
      return {
        ...context,
        responseStatus: 302,
        responseHeaders: { 'location': [optionsString, '__dashboard__'].join('/') },
      };
    }

    const responseStatus = 200;

    function input (type, key, value, label) {
      const checked = optionsHasValue(context.pathOptions, key, value) ? 'checked' : '';
      return `<label>
      <input type="${type}" name="${key}" value="${value}" ${checked}>${label}
      <span class="border"></span>
    </label>`;
    }

    const content = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>hititipi</title>
  <style>
    html {
      font-family: monospace;
    }

    body {
      margin: 2rem;
    }

    .favicon {
      height: 2rem;
    }

    .links,
    .blocks {
      font-size: 1.3rem;
    }

    fieldset {
      border: 1px solid #aaa;
      border-radius: 0.5rem;
      padding: 1rem 1.25rem 1rem 1.25rem;
      margin: 2rem 0;
    }

    legend {
      font-weight: bold;
      white-space: nowrap;
    }
    
    .choices-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    p {
      font-style: italic;
      line-height: 1.6;
      margin: 0;
    }
    
    code {
      background-color: #eee;
      border-radius: 5px;
      padding: 0.25rem 0.5rem;
    }

    .choices {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    label,
    .border {
      border-radius: 0.5rem;
    }

    label {
      cursor: pointer;
      padding: 0.75rem;
      position: relative;
      white-space: nowrap;
    }

    .border {
      background-color: #eee;
      box-sizing: border-box;
      display: block;
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: -1;
    }

    input {
      margin-right: 0.5rem;
    }
    
    input:checked + .border {
      background-color: #eeeeff;
      border: 2px solid blue;
    }

    button {
      font-size: 1.3rem;
      font-family: monospace;
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid #AAA;
      background-color: #eee;
      cursor: pointer;
    }
  </style>
</head>
<body>
<h1><img class="favicon" src="/favicon.ico" alt=""> hititipi dashboard</h1>
<div class="links"><a href="./">Go back home</a></div>
<form action="/__dashboard__" method="get">

  <div class="blocks">
  
    <fieldset>
        <legend><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length" target="_blank" rel="noreferrer noopener">Content-Length</a></legend>
        <div class="choices-group">
          <p>
            If "no" is selected, the header <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding" target="_blank" rel="noreferrer noopener">Transfer-Encoding</a> will be set to <code>chunked</code>.
          </p>
          <div class="choices">
            ${input('radio', 'cl', '', 'no')}
            ${input('radio', 'cl', '1', 'yes')}
          </div>
        </div>
    </fieldset>
  
    <fieldset>
        <legend><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding" target="_blank" rel="noreferrer noopener">Content-Encoding</a></legend>
        <div class="choices">
          ${input('radio', 'ce', '', 'none')}
          ${input('radio', 'ce', 'gz', 'gzip')}
          ${input('radio', 'ce', 'br', 'brotli')}
        </div>
    </fieldset>

    <fieldset>
        <legend><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control" target="_blank" rel="noreferrer noopener">Cache-Control</a></legend>
        <div class="choices">
            ${input('checkbox', 'cc', 'pu', 'public')}
            ${input('checkbox', 'cc', 'pv', 'private')}
            ${input('checkbox', 'cc', 'nc', 'no-cache')}
            ${input('checkbox', 'cc', 'ns', 'no-store')}
            ${input('checkbox', 'cc', 'mr', 'must-revalidate')}
            ${input('checkbox', 'cc', 'pr', 'proxy-revalidate')}
            ${input('checkbox', 'cc', 'i', 'immutable')}
            ${input('checkbox', 'cc', 'nt', 'no-transform')}
            ${input('checkbox', 'cc', 'maz', 'max-age=0')}
            ${input('checkbox', 'cc', 'may', 'max-age=' + ONE_YEAR)}
            ${input('checkbox', 'cc', 'smaz', 'stale-while-revalidate=0')}
            ${input('checkbox', 'cc', 'smay', 'stale-while-revalidate=' + ONE_YEAR)}
            ${input('checkbox', 'cc', 'swry', 'stale-while-revalidate=' + ONE_YEAR)}
            ${input('checkbox', 'cc', 'siey', 'stale-if-error=' + ONE_YEAR)}
        </div>
    </fieldset>

    <fieldset>
        <legend><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag" target="_blank" rel="noreferrer noopener">ETag</a></legend>
        <div class="choices">
          ${input('radio', 'et', '', 'No')}
          ${input('radio', 'et', '1', 'Yes')}
        </div>
    </fieldset>

    <fieldset>
        <legend><a href="https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Last-Modified" target="_blank" rel="noreferrer noopener">Last-Modified</a></legend>
        <div class="choices">
          ${input('radio', 'lm', '', 'No')}
          ${input('radio', 'lm', '1', 'Yes')}
        </div>
    </fieldset>

    <fieldset>
        <legend><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin" target="_blank" rel="noreferrer noopener">Access-Control-Allow-Origin</a></legend>
        <div class="choices">
          ${input('radio', 'acao', '', 'No')}
          ${input('radio', 'acao', 'all', 'All (*)')}
        </div>
    </fieldset>

    <fieldset>
        <legend><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age" target="_blank" rel="noreferrer noopener">Access-Control-Max-Age</a></legend>
        <div class="choices">
          ${input('radio', 'acma', '', 'No')}
          ${input('radio', 'acma', '1d', '1 day')}
        </div>
    </fieldset>

    <fieldset>
        <legend><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive" target="_blank" rel="noreferrer noopener">Keep-Alive</a></legend>
        <div class="choices-group">
          <p>
            The <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection" target="_blank" rel="noreferrer noopener">Connection</a> header automatically set:
            default is <code>Connection: close</code> but if <code>max</code> and/or <code>timeout</code> is specified, it will be <code>Connection: Keep-Alive</code>. 
          </p>
          <div class="choices">
            ${input('radio', 'kam', '', '(max not specified)')}
            ${input('radio', 'kam', '2', 'max=2')}
            ${input('radio', 'kam', '5', 'max=5')}
            ${input('radio', 'kam', '100', 'max=100')}
            ${input('radio', 'kam', '1000', 'max=1000')}
          </div>
          <div class="choices">
            ${input('radio', 'kat', '', '(timeout not specified)')}
            ${input('radio', 'kat', '1', 'timeout=1')}
            ${input('radio', 'kat', '10', 'timeout=10')}
            ${input('radio', 'kat', '100', 'timeout=100')}
          </div>
        </div>
    </fieldset>
  </div>

  <div>
    <button type="submit">Update config</button>
  </div>
</form>
</body>
</html>
`.trim();

    const responseHeaders = {
      ...context.headers,
      'content-type': 'text/html',
    };
    const responseBody = Readable.from(content);
    const responseSize = content.length;
    const responseEtag = getStrongEtagHash(content);

    return { ...context, responseStatus, responseHeaders, responseBody, responseSize, responseEtag };
  };
}
