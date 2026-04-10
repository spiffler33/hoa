/**
 * localStore.js — localStorage wrapper with cache timestamps and a
 * write queue for offline resilience.
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

/* ── offline write queue ─────────────────────── */

/**
 * Return the current write queue (array of pending entries).
 * Each entry: { id, action, tab, data, createdAt }
 */
export function getWriteQueue() {
  return read('write_queue') || [];
}

/**
 * Add a write operation to the queue.
 * @param {{ action: string, tab: string, data: object, id?: string }} entry
 */
export function addToWriteQueue(entry) {
  const queue = getWriteQueue();
  queue.push({
    ...entry,
    queueId: `wq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  });
  write('write_queue', queue);
}

/**
 * Remove a successfully-flushed entry by its queueId.
 */
export function removeFromWriteQueue(queueId) {
  const queue = getWriteQueue().filter((e) => e.queueId !== queueId);
  write('write_queue', queue);
}

/* ── connectivity check ──────────────────────── */

/**
 * Simple offline detection.
 * Uses navigator.onLine as a fast heuristic — not 100 % reliable,
 * but good enough to decide "should I even try the network call?"
 */
export function isOffline() {
  return !navigator.onLine;
}
