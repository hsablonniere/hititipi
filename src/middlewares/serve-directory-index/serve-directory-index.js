import fs from 'node:fs/promises';
import { getStrongEtagHash } from '../../lib/etag.js';
import { getStats, joinPaths, resolveAbsolutePath } from '../../lib/node-fs.js';
import { updateResponseBody } from '../../lib/response.js';
import stylesheet from './serve-directory-index.css.js';

/**
 * @typedef {import('../../types/hititipi.types.d.ts').HititipiMiddleware} HititipiMiddleware
 * @typedef {import('./serve-directory-index.types.d.ts').ServeDirectoryIndexOptions} ServeDirectoryIndexOptions
 * @typedef {import('./serve-directory-index.types.d.ts').DirectoryEntry} DirectoryEntry
 */

/**
 * @param {ServeDirectoryIndexOptions} options
 * @return {HititipiMiddleware}
 */
export function serveDirectoryIndex(options) {
  const absoluteRootPath = resolveAbsolutePath(options.root);
  const showHidden = options.showHidden ?? false;

  return async (context) => {
    if (context.requestMethod !== 'HEAD' && context.requestMethod !== 'GET') {
      return;
    }

    const pathname =
      options.basePath != null && context.requestUrl.pathname.startsWith(options.basePath)
        ? context.requestUrl.pathname.replace(options.basePath, '')
        : context.requestUrl.pathname;
    const absolutePathname = joinPaths(absoluteRootPath, pathname);

    const stats = getStats(absolutePathname);
    if (stats == null || !stats.isDirectory()) {
      return;
    }

    const dirEntries = await getDirectoryEntries(absolutePathname, showHidden);
    const responseBody = renderPage(pathname, dirEntries);

    context.responseStatus = 200;
    context.responseHeaders.set('content-type', 'text/html');
    updateResponseBody(context, responseBody);
    context.responseEtag = await getStrongEtagHash(responseBody);
  };
}

/**
 * @param {string} dirpath
 * @param {boolean} showHidden
 * @return {Promise<Array<DirectoryEntry>>}
 */
async function getDirectoryEntries(dirpath, showHidden) {
  const dirEntries = await fs.readdir(dirpath);

  /** @type {Array<DirectoryEntry>} */
  const dirEntriesWithDetails = [];
  for (const name of dirEntries) {
    const isHidden = name.startsWith('.');
    if (showHidden || !isHidden) {
      const fullpath = joinPaths(dirpath, name);
      const stats = getStats(fullpath);
      if (stats != null) {
        dirEntriesWithDetails.push({
          name,
          fullpath,
          isDirectory: stats.isDirectory(),
          size: stats.size,
          modificationDate: new Date(stats.mtime),
          isHidden,
        });
      }
    }
  }

  dirEntriesWithDetails.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) {
      return -1;
    }
    if (!a.isDirectory && b.isDirectory) {
      return 1;
    }
    return a.name.localeCompare(b.name);
  });

  return dirEntriesWithDetails;
}

/**
 * @param {string} pathname
 * @param {DirectoryEntry[]} detailedDirEntries
 * @return {string}
 */
function renderPage(pathname, detailedDirEntries) {
  const renderedPathname = pathname
    .split('/')
    .map((part, i, all) => {
      return `<a href="${all.slice(0, i + 1).join('/')}/">${part}</a>`;
    })
    // Remove first and last slash
    .slice(1, -1)
    .join(`<span class="separator">/</span>`);

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" href="data:image/x-icon;base64,AA">
        <title>${pathname}</title>
        <style>${stylesheet}</style>
      </head>
      <body>
        <div class="list">
          <div class="entry head">
            <div class="icon"><a href="/" class="no-underline">📂</a></div>
            <div class="name">
               ${renderedPathname}
            </div>
          </div>
          ${renderDirEntries(detailedDirEntries)}
        </div>
      </body>
    </html>
  `;
}

/**
 * @param {DirectoryEntry[]} detailedDirEntries
 * @return {string}
 */
function renderDirEntries(detailedDirEntries) {
  if (detailedDirEntries.length === 0) {
    return `
      <div class="entry empty">empty directory</div>
    `;
  }

  return detailedDirEntries
    .map((entry) => {
      const icon = entry.isDirectory ? '📁' : '📄';
      const size = entry.isDirectory ? '' : formatBytes(entry.size);
      const modificationDateIso = entry.modificationDate.toISOString();
      const modificationDateHuman = entry.modificationDate.toLocaleDateString('en', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        hour12: false,
        minute: '2-digit',
        second: '2-digit',
      });
      return `
        <div class="entry">
          <div class="icon">${icon}</div>
          <div class="details">
            <div class="name ${entry.isHidden ? 'is-hidden' : ''}"><a href="./${entry.name}${entry.isDirectory ? '/' : ''}">${entry.name}</a></div>
            ${size !== '' ? `<div class="size">${size}</div>` : ''}
            <div class="date" title="${modificationDateIso}">${modificationDateHuman}</div>
          </div>
        </div>
      `;
    })
    .join('');
}

const IEC_PREFIXES = ['', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi'];

/**
 * @param {number} value
 * @param {number} [fractionDigits=0]
 * @return {string}
 */
function formatBytes(value, fractionDigits = 0) {
  if (value < 1024) {
    const nf = new Intl.NumberFormat('en');
    return nf.format(value) + ' ' + 'B';
  }

  const nf = new Intl.NumberFormat('en', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  // Figure out the "magnitude" of the value: greater than 1024 => 1 / greater than 1024^2 => 2 / greater than 1024^3 => 3 ...
  const prefixIndex = IEC_PREFIXES.slice(0, IEC_PREFIXES.length - 1 + 1).findIndex((_, i) => {
    // Return last prefix of the array if we cannot find a prefix
    return value < 1024 ** (i + 1) || i === IEC_PREFIXES.length - 1;
  });

  // Use the prefixIndex to "rebase" the value into the new base, 1250 => 1.22 / 1444000 => 1.377...
  const rebasedValue = value / 1024 ** prefixIndex;

  // Truncate so the rounding applied by nf.format() does not mess with the prefix we selected
  // Ex: it prevents from returning 1,024.0 KiB if we're just under 1024^2 bytes and returns 1,023.9 KiB instead
  const truncatedValue = Math.trunc(rebasedValue * 10 ** fractionDigits) / 10 ** fractionDigits;

  // Use Intl/i18n aware number formatter
  const formattedValue = nf.format(truncatedValue);

  const prefix = IEC_PREFIXES[prefixIndex];
  return formattedValue + ' ' + prefix + 'B';
}
