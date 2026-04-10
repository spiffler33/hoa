/**
 * dataLayer.js — The single import point for all views.
 *
 * Strategy:
 *   READ  → try sheetsApi → on success, update cache → on failure, serve cache
 *   WRITE → if online, call sheetsApi → on failure (or if offline), queue write
 *
 * Views never import sheetsApi or localStore directly.
 */

import {
  fetchMetrics,
  saveMetrics,
  fetchContentCalendar,
  saveContentItem,
  fetchPhaseChecklist,
  saveChecklistItem,
  fetchConfig as fetchRemoteConfig,
  fetchPartnerships,
  savePartnershipItem,
} from './sheetsApi';

import {
  getCached,
  setCached,
  getConfig,
  setConfig,
  getWriteQueue,
  addToWriteQueue,
  removeFromWriteQueue,
  isOffline,
} from './localStore';

/* ── internal helpers ────────────────────────── */

function sheetId() {
  const cfg = getConfig();
  return cfg?.sheetId || null;
}

/**
 * Generic read wrapper: try remote, cache on success, return cache on failure.
 */
async function readThrough(cacheKey, remoteFn) {
  if (!isOffline()) {
    try {
      const data = await remoteFn();
      if (data !== null) {
        setCached(cacheKey, data);
        return { data, source: 'remote' };
      }
    } catch {
      // fall through to cache
    }
  }

  const cached = getCached(cacheKey);
  if (cached) {
    return { data: cached.data, source: 'cache', cachedAt: cached.timestamp };
  }

  return { data: null, source: 'none' };
}

/**
 * Generic write wrapper: try remote, queue on failure or if offline.
 */
async function writeThrough(entry, remoteFn) {
  if (!isOffline()) {
    try {
      const result = await remoteFn();
      if (result !== null) return { ok: true, queued: false };
    } catch {
      // fall through to queue
    }
  }

  addToWriteQueue(entry);
  return { ok: true, queued: true };
}

/* ── reads ───────────────────────────────────── */

export async function loadMetrics(opts = {}) {
  return readThrough('metrics', () => fetchMetrics(sheetId(), opts));
}

export async function loadContentCalendar(opts = {}) {
  return readThrough('content_calendar', () =>
    fetchContentCalendar(sheetId(), opts),
  );
}

export async function loadPhaseChecklist(opts = {}) {
  const tab = opts.tab || 'phase_checklist';
  return readThrough(tab, () =>
    fetchPhaseChecklist(sheetId(), opts),
  );
}

export async function loadConfig() {
  // Try remote config first
  if (!isOffline()) {
    try {
      const remote = await fetchRemoteConfig(sheetId());
      if (remote !== null) {
        // Merge remote config with local config (local keeps appsScriptUrl/sheetId)
        const local = getConfig() || {};
        const merged = { ...local };

        // Remote config comes as key/value rows → flatten
        if (Array.isArray(remote)) {
          remote.forEach((row) => {
            if (row.key) merged[row.key] = row.value;
          });
        }

        setConfig(merged);
        return { data: merged, source: 'remote' };
      }
    } catch {
      // fall through to local
    }
  }

  const local = getConfig();
  return { data: local, source: local ? 'cache' : 'none' };
}

/* ── writes ──────────────────────────────────── */

export async function saveWeeklyMetrics(weekData) {
  return writeThrough(
    { action: 'write', tab: 'weekly_metrics', data: weekData },
    () => saveMetrics(sheetId(), weekData),
  );
}

export async function saveContentEntry(item) {
  return writeThrough(
    {
      action: item.id ? 'update' : 'write',
      tab: 'content_calendar',
      id: item.id,
      data: item,
    },
    () => saveContentItem(sheetId(), item),
  );
}

export async function saveChecklistEntry(item) {
  const tab = item.tab || 'phase_checklist';
  return writeThrough(
    { action: 'update', tab, id: item.id, data: item },
    () => saveChecklistItem(sheetId(), item),
  );
}

export async function loadPartnerships() {
  return readThrough('partnerships', () =>
    fetchPartnerships(sheetId()),
  );
}

export async function savePartnership(item) {
  return writeThrough(
    {
      action: item.id && !item.id.startsWith('local_') ? 'update' : 'write',
      tab: 'partnerships',
      id: item.id,
      data: item,
    },
    () => savePartnershipItem(sheetId(), item),
  );
}

export async function saveConfig(config) {
  setConfig(config);
  return { ok: true, queued: false };
}

/* ── queue flush ─────────────────────────────── */

/**
 * Replay all queued writes. Called when connectivity restores
 * or manually from the Settings view.
 *
 * Returns { flushed: number, failed: number }.
 */
export async function flushWriteQueue() {
  const queue = getWriteQueue();
  if (queue.length === 0) return { flushed: 0, failed: 0 };

  let flushed = 0;
  let failed = 0;

  for (const entry of queue) {
    try {
      const conn = getConfig();
      if (!conn?.appsScriptUrl) {
        failed++;
        continue;
      }

      const res = await fetch(conn.appsScriptUrl, {
        method: 'POST',
        body: JSON.stringify({
          action: entry.action,
          tab: entry.tab,
          id: entry.id,
          data: entry.data,
        }),
      });

      if (res.ok) {
        removeFromWriteQueue(entry.queueId);
        flushed++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  return { flushed, failed };
}
