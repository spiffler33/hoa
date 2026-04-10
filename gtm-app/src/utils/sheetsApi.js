/**
 * sheetsApi.js — Google Sheets read/write via Apps Script web app.
 *
 * Every function reads the Apps Script URL and Sheet ID from localStorage
 * config (set in the Settings view). If either is missing, the function
 * returns null so the caller can fall back to cached data.
 */

const TIMEOUT_MS = 10_000;

/* ── helpers ─────────────────────────────────── */

function getConnection() {
  try {
    const raw = localStorage.getItem('yeslifers_config');
    if (!raw) return null;
    const config = JSON.parse(raw);
    const url = config.appsScriptUrl;
    const sheetId = config.sheetId;
    if (!url || !sheetId) return null;
    return { url, sheetId };
  } catch {
    return null;
  }
}

async function sheetGet(url, params) {
  const qs = new URLSearchParams(params).toString();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${url}?${qs}`, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function sheetPost(url, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/* ── reads ───────────────────────────────────── */

/**
 * Fetch all weekly_metrics rows (or just the latest).
 * @param {string} sheetId
 * @param {{ latest?: boolean, week?: string }} [opts]
 */
export async function fetchMetrics(sheetId, opts = {}) {
  const conn = getConnection();
  if (!conn) return null;

  const params = { action: 'read', tab: 'weekly_metrics' };
  if (opts.latest) params.latest = '1';
  if (opts.week) params.week = opts.week;

  return sheetGet(conn.url, params);
}

/**
 * Fetch content_calendar rows, optionally filtered by week.
 * @param {string} sheetId
 * @param {{ week?: string }} [opts]
 */
export async function fetchContentCalendar(sheetId, opts = {}) {
  const conn = getConnection();
  if (!conn) return null;

  const params = { action: 'read', tab: 'content_calendar' };
  if (opts.week) params.week = opts.week;

  return sheetGet(conn.url, params);
}

/**
 * Fetch checklist rows from a given tab (default: phase_checklist).
 * @param {string} sheetId
 * @param {{ tab?: string }} [opts]
 */
export async function fetchPhaseChecklist(sheetId, opts = {}) {
  const conn = getConnection();
  if (!conn) return null;

  const tab = opts.tab || 'phase_checklist';
  return sheetGet(conn.url, { action: 'read', tab });
}

/**
 * Fetch all partnerships rows.
 * @param {string} sheetId
 */
export async function fetchPartnerships(sheetId) {
  const conn = getConnection();
  if (!conn) return null;

  return sheetGet(conn.url, { action: 'read', tab: 'partnerships' });
}

/**
 * Fetch all config key/value pairs.
 * @param {string} sheetId
 */
export async function fetchConfig(sheetId) {
  const conn = getConnection();
  if (!conn) return null;

  return sheetGet(conn.url, { action: 'read', tab: 'config' });
}

/* ── writes ──────────────────────────────────── */

/**
 * Save (append) a weekly metrics row.
 * @param {string} sheetId
 * @param {object} weekData
 */
export async function saveMetrics(sheetId, weekData) {
  const conn = getConnection();
  if (!conn) return null;

  return sheetPost(conn.url, {
    action: 'write',
    tab: 'weekly_metrics',
    data: weekData,
  });
}

/**
 * Save or update a content calendar item.
 * If item.id is set, performs an update; otherwise appends a new row.
 * @param {string} sheetId
 * @param {object} item
 */
export async function saveContentItem(sheetId, item) {
  const conn = getConnection();
  if (!conn) return null;

  if (item.id) {
    return sheetPost(conn.url, {
      action: 'update',
      tab: 'content_calendar',
      id: item.id,
      data: item,
    });
  }

  return sheetPost(conn.url, {
    action: 'write',
    tab: 'content_calendar',
    data: item,
  });
}

/**
 * Update a checklist item's completed status.
 * Uses item.tab if provided, otherwise defaults to phase_checklist.
 * @param {string} sheetId
 * @param {object} item  — { id, completed, tab? }
 */
export async function saveChecklistItem(sheetId, item) {
  const conn = getConnection();
  if (!conn) return null;

  const tab = item.tab || 'phase_checklist';
  return sheetPost(conn.url, {
    action: 'update',
    tab,
    id: item.id,
    data: item,
  });
}

/**
 * Save or update a partnership item.
 * @param {string} sheetId
 * @param {object} item
 */
export async function savePartnershipItem(sheetId, item) {
  const conn = getConnection();
  if (!conn) return null;

  if (item.id && !item.id.startsWith('local_')) {
    return sheetPost(conn.url, {
      action: 'update',
      tab: 'partnerships',
      id: item.id,
      data: item,
    });
  }

  return sheetPost(conn.url, {
    action: 'write',
    tab: 'partnerships',
    data: item,
  });
}
