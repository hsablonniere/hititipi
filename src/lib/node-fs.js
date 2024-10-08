import { lstatSync } from 'node:fs';
import path from 'node:path';
import { cwd } from 'node:process';

/**
 * @typedef {import('node:fs').Stats} Stats
 */

/**
 * @param {string} filepath
 * @return {Stats|null}
 */
export function getStats(filepath) {
  try {
    const stats = lstatSync(filepath);
    return stats;
  } catch {}
  return null;
}

/**
 * @param {string} relativeOrAbsolutePath
 * @return {string}
 */
export function resolveAbsolutePath(relativeOrAbsolutePath) {
  if (relativeOrAbsolutePath.startsWith('/')) {
    return relativeOrAbsolutePath;
  }
  return path.resolve(cwd(), relativeOrAbsolutePath);
}

/**
 * @param {Array<string>} paths paths to join.
 * @return {string}
 */
export function joinPaths(...paths) {
  return path.join(...paths);
}
