/**
 * dataLayer.js — The single import point for all views.
 *
 * Strategy: localStorage is the sole data store.
 *   READ  → return cached data from localStorage
 *   WRITE → upsert into cached array, persist to localStorage
 *
 * Views never import localStore directly (except SettingsView/PlaybookView
 * which access getConfig/setConfig for local-only config operations).
 */

import { getCached, setCached, getConfig, setConfig } from './localStore';

/* ── internal helpers ────────────────────────── */

/**
 * Generate a unique local ID for new records.
 */
function localId() {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Upsert an item into an array by a key field.
 * If a matching item exists, replace it; otherwise append.
 * Returns a new array (immutable).
 */
function upsert(arr, item, keyField) {
  const idx = arr.findIndex((row) => row[keyField] === item[keyField]);
  if (idx >= 0) {
    const updated = [...arr];
    updated[idx] = { ...arr[idx], ...item };
    return updated;
  }
  return [...arr, item];
}

/**
 * Read cached data and return in the standard envelope.
 */
function readLocal(cacheKey) {
  const cached = getCached(cacheKey);
  if (cached) {
    return { data: cached.data, source: 'local', cachedAt: cached.timestamp };
  }
  return { data: null, source: 'none' };
}

/* ── reads ───────────────────────────────────── */

export async function loadMetrics(opts = {}) {
  const result = readLocal('metrics');
  if (opts.latest && Array.isArray(result.data) && result.data.length > 0) {
    return { ...result, data: result.data[result.data.length - 1] };
  }
  return result;
}

export async function loadContentCalendar(opts = {}) {
  return readLocal('content_calendar');
}

export async function loadPhaseChecklist(opts = {}) {
  const tab = opts.tab || 'phase_checklist';
  return readLocal(tab);
}

export async function loadPartnerships() {
  return readLocal('partnerships');
}

export async function loadConfig() {
  const cfg = getConfig();
  return { data: cfg, source: cfg ? 'local' : 'none' };
}

/* ── writes ──────────────────────────────────── */

export async function saveWeeklyMetrics(weekData) {
  const cached = getCached('metrics');
  const arr = (cached?.data) || [];
  const updated = upsert(arr, weekData, 'weekOf');
  setCached('metrics', updated);
  return { ok: true, queued: false };
}

export async function saveContentEntry(item) {
  const cached = getCached('content_calendar');
  const arr = (cached?.data) || [];
  if (!item.id) item.id = localId();
  const updated = upsert(arr, item, 'id');
  setCached('content_calendar', updated);
  return { ok: true, queued: false };
}

export async function saveChecklistEntry(item) {
  const tab = item.tab || 'phase_checklist';
  const cached = getCached(tab);
  const arr = (cached?.data) || [];
  if (!item.id) item.id = localId();
  const updated = upsert(arr, item, 'id');
  setCached(tab, updated);
  return { ok: true, queued: false };
}

export async function savePartnership(item) {
  const cached = getCached('partnerships');
  const arr = (cached?.data) || [];
  if (!item.id) item.id = localId();
  const updated = upsert(arr, item, 'id');
  setCached('partnerships', updated);
  return { ok: true, queued: false };
}

export async function saveConfig(config) {
  setConfig(config);
  return { ok: true, queued: false };
}
