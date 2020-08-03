import { CACHE_CONTROL } from './lib/cache-control.js';
import { CONTENT_ENCODING } from './lib/content-encoding.js';
import { ETAG } from './lib/etag.js';
import { extractPathAndOptionsString, optionsHasValue, parseOptionsString } from './lib/options.js';
import { KEEP_ALIVE } from './lib/keep-alive.js';
import { LAST_MODIFIED } from './lib/last-modified.js';
import { promises as pfs } from 'fs';
import { ACCESS_CONTROL_ALLOW_ORIGIN, ACCESS_CONTROL_MAX_AGE } from './lib/cors.js';

export const matcher = /^\/__dashboard__$/;

export const mimeType = 'text/html';

// OMG a file returning its own stats ;-)
export async function getStats () {
  return pfs.stat(new URL(import.meta.url).pathname);
}

export const render = (httpRequest) => {

  const { optionsString } = extractPathAndOptionsString(httpRequest.url.pathname);
  const options = parseOptionsString(optionsString);

  function input (type, { key, defaultValue }, value, label) {
    const checked = optionsHasValue(options, { key, defaultValue }, value) ? 'checked' : '';
    return `<label>
      <input type="${type}" name="${key}" value="${value}" ${checked}>${label}
      <span class="border"></span>
    </label>`;
  }

  return `

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
        <legend><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding" target="_blank" rel="noreferrer noopener">Content-Encoding</a></legend>
        <div class="choices">
          ${input('radio', CONTENT_ENCODING, CONTENT_ENCODING.defaultValue, 'none')}
          ${input('radio', CONTENT_ENCODING, CONTENT_ENCODING.GZIP, 'gzip')}
          ${input('radio', CONTENT_ENCODING, CONTENT_ENCODING.BROTLI, 'brotli')}
        </div>
    </fieldset>
  
    <fieldset>
        <legend><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control" target="_blank" rel="noreferrer noopener">Cache-Control</a></legend>
        <div class="choices">
          ${Object
    .entries(CACHE_CONTROL.values)
    .map(([value, label]) => input('checkbox', CACHE_CONTROL, value, label))
    .join('\n')}
        </div>
    </fieldset>
  
    <fieldset>
        <legend><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag" target="_blank" rel="noreferrer noopener">ETag</a></legend>
        <div class="choices">
          ${input('radio', ETAG, ETAG.defaultValue, 'No')}
          ${input('radio', ETAG, ETAG.ENABLED, 'Yes')}
        </div>
    </fieldset>
  
    <fieldset>
        <legend><a href="https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Last-Modified" target="_blank" rel="noreferrer noopener">Last-Modified</a></legend>
        <div class="choices">
          ${input('radio', LAST_MODIFIED, LAST_MODIFIED.defaultValue, 'No')}
          ${input('radio', LAST_MODIFIED, LAST_MODIFIED.ENABLED, 'Yes')}
        </div>
    </fieldset>
  
    <fieldset>
        <legend><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin" target="_blank" rel="noreferrer noopener">Access-Control-Allow-Origin</a></legend>
        <div class="choices">
          ${input('radio', ACCESS_CONTROL_ALLOW_ORIGIN, ACCESS_CONTROL_ALLOW_ORIGIN.defaultValue, 'No')}
          ${input('radio', ACCESS_CONTROL_ALLOW_ORIGIN, ACCESS_CONTROL_ALLOW_ORIGIN.ALL, 'All (*)')}
        </div>
    </fieldset>
  
    <fieldset>
        <legend><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age" target="_blank" rel="noreferrer noopener">Access-Control-Max-Age</a></legend>
        <div class="choices">
          ${input('radio', ACCESS_CONTROL_MAX_AGE, ACCESS_CONTROL_MAX_AGE.defaultValue, 'No')}
          ${input('radio', ACCESS_CONTROL_MAX_AGE, ACCESS_CONTROL_MAX_AGE.ONE_DAY, '1 day')}
        </div>
    </fieldset>
    
    <fieldset>
        <legend>
          <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection" target="_blank" rel="noreferrer noopener">Connection</a>
          and
          <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive" target="_blank" rel="noreferrer noopener">Keep-Alive</a>
        </legend>
        <div class="choices">
          ${input('radio', KEEP_ALIVE, KEEP_ALIVE.defaultValue, 'close')}
          ${input('radio', KEEP_ALIVE, KEEP_ALIVE.REQ_2_TO_100, 'max=2,timeout=100')}
          ${input('radio', KEEP_ALIVE, KEEP_ALIVE.REQ_5_TO_100, 'max=5,timeout=100')}
          ${input('radio', KEEP_ALIVE, KEEP_ALIVE.REQ_100_TO_100, 'max=100,timeout=100')}
          ${input('radio', KEEP_ALIVE, KEEP_ALIVE.REQ_1000_TO_100, 'max=1000,timeout=100')}
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
};
