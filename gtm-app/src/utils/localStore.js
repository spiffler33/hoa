/**
 * localStore.js — localStorage wrapper with cache timestamps.
 *
 * Every key is prefixed with `yeslifers_` so we don't collide with
 * other apps on the same origin.
 */

const PREFIX = 'yeslifers_';

/* ── low-level helpers ───────────────────────── */

function read(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // localStorage full — silent fail; views should still work from memory
  }
}

/* ── cached data (timestamped) ───────────────── */

/**
 * Retrieve cached data for a key.
 * Returns { data, timestamp } or null if nothing cached.
 */
export function getCached(key) {
  return read(`cache_${key}`);
}

/**
 * Store data with a timestamp so views can display staleness.
 */
export function setCached(key, data) {
  write(`cache_${key}`, { data, timestamp: Date.now() });
}

/* ── app config ──────────────────────────────── */

/**
 * Read the app configuration object.
 * Contains appsScriptUrl, sheetId, currentPhase, phase start dates, etc.
 */
export function getConfig() {
  return read('config');
}

/**
 * Persist the full config object.
 */
export function setConfig(config) {
  write('config', config);
}

