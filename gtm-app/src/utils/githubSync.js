/**
 * githubSync.js — Push/pull app data to a JSON file in GitHub.
 *
 * Uses the GitHub Contents API (no library needed).
 * Each sync-to-GitHub creates one commit with a full data snapshot.
 */

import { getCached, setCached, getConfig } from './localStore';

const DATA_KEYS = [
  'metrics',
  'content_calendar',
  'phase_checklist',
  'compliance_log',
  'partnerships',
];

const DEFAULT_REPO = 'spiffler33/hoa';
const DEFAULT_PATH = 'gtm-app/data/app-state.json';

/* ── internal helpers ────────────────────────── */

function apiUrl(repo, path) {
  return `https://api.github.com/repos/${repo}/contents/${path}`;
}

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };
}

/**
 * Collect all localStorage data into a single snapshot object.
 */
function collectData() {
  const snapshot = { exportedAt: new Date().toISOString() };

  for (const key of DATA_KEYS) {
    const cached = getCached(key);
    snapshot[key] = cached?.data ?? null;
  }

  // Include config (stored separately from cache)
  const cfg = getConfig();
  if (cfg) {
    // Strip the token from the persisted snapshot
    const { githubToken, ...rest } = cfg;
    snapshot.config = rest;
  }

  return snapshot;
}

/* ── public API ──────────────────────────────── */

/**
 * Push all app data to GitHub as a single JSON file.
 * Creates a commit in the repo.
 *
 * @param {string} token — GitHub Personal Access Token
 * @param {string} [repo] — owner/repo (defaults to spiffler33/hoa)
 * @param {string} [path] — file path in repo (defaults to gtm-app/data/app-state.json)
 * @returns {{ ok: boolean, message?: string }}
 */
export async function syncToGitHub(token, repo = DEFAULT_REPO, path = DEFAULT_PATH) {
  const url = apiUrl(repo, path);

  // 1. Check if file already exists (need its sha for updates)
  let sha = null;
  try {
    const existing = await fetch(url, { headers: headers(token) });
    if (existing.ok) {
      const data = await existing.json();
      sha = data.sha;
    }
  } catch {
    // File doesn't exist yet — that's fine, we'll create it
  }

  // 2. Collect and encode data
  const snapshot = collectData();
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(snapshot, null, 2))));

  // 3. Create or update the file
  const body = {
    message: `Sync GTM app state — ${new Date().toLocaleString()}`,
    content,
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub API error: ${res.status}`);
  }

  return { ok: true, message: 'Synced to GitHub' };
}

/**
 * Pull app data from GitHub and load it into localStorage.
 *
 * @param {string} token — GitHub Personal Access Token
 * @param {string} [repo]
 * @param {string} [path]
 * @returns {{ ok: boolean, keys: number, message?: string }}
 */
export async function syncFromGitHub(token, repo = DEFAULT_REPO, path = DEFAULT_PATH) {
  const url = apiUrl(repo, path);

  const res = await fetch(url, { headers: headers(token) });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('No app-state.json found in repo — sync to GitHub first');
    }
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const file = await res.json();
  const decoded = decodeURIComponent(escape(atob(file.content.replace(/\n/g, ''))));
  const snapshot = JSON.parse(decoded);

  // Restore each data key
  let restored = 0;
  for (const key of DATA_KEYS) {
    if (snapshot[key] != null) {
      setCached(key, snapshot[key]);
      restored++;
    }
  }

  return { ok: true, keys: restored, message: `Loaded ${restored} data sets from GitHub` };
}
