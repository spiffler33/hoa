/**
 * dataLayer.js — The single import point for all views.
 *
 * Strategy: Supabase Postgres is the data store.
 *   READ  → fetch from Supabase, return { data }
 *   WRITE → upsert/update in Supabase, return { ok, queued }
 *
 * Views never import supabase directly.
 */

import { supabase } from '../lib/supabase';

/* ── internal helpers ────────────────────────── */

function localId() {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/* ── config cache (avoids N round-trips on nav) ─ */
let _configCache = null;

/* ── reads ───────────────────────────────────── */

export async function loadMetrics(opts = {}) {
  let query = supabase.from('weekly_metrics').select('*').order('week_of', { ascending: true });
  const { data, error } = await query;
  if (error) throw error;

  const rows = (data || []).map((row) => ({ weekOf: row.week_of, ...row.data }));

  if (opts.latest && rows.length > 0) {
    return { data: rows[rows.length - 1] };
  }
  return { data: rows };
}

export async function loadContentCalendar(opts = {}) {
  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .order('due_date', { ascending: true });
  if (error) throw error;

  const rows = (data || []).map((row) => ({
    id: row.id,
    channel: row.channel,
    post_type: row.post_type,
    postType: row.post_type,
    dueDate: row.due_date,
    title: row.title,
    status: row.status,
  }));
  return { data: rows };
}

export async function loadPhaseChecklist(opts = {}) {
  const kind = opts.tab || 'phase_checklist';
  const { data, error } = await supabase
    .from('checklist_entries')
    .select('*')
    .eq('kind', kind);
  if (error) throw error;

  const rows = (data || []).map((row) => ({
    id: row.id,
    phase: row.phase,
    type: row.type,
    item: row.item,
    completed: row.completed,
    completed_date: row.completed_date,
    tab: row.kind,
  }));
  return { data: rows };
}

export async function loadPartnerships() {
  const { data, error } = await supabase
    .from('partnerships')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return { data: data || [] };
}

export async function loadConfig() {
  if (_configCache) return { data: _configCache };

  const { data, error } = await supabase
    .from('app_config')
    .select('*')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw error;

  const cfg = data
    ? { currentPhase: data.current_phase, phaseStartDate: data.phase_start_date }
    : { currentPhase: 0, phaseStartDate: '' };

  _configCache = cfg;
  return { data: cfg };
}

/* ── writes ──────────────────────────────────── */

export async function saveWeeklyMetrics(weekData) {
  const { weekOf, ...rest } = weekData;

  // Read-merge-write to preserve prior JSONB fields
  const { data: existing } = await supabase
    .from('weekly_metrics')
    .select('data')
    .eq('week_of', weekOf)
    .maybeSingle();

  const merged = { ...(existing?.data || {}), ...rest };

  const { error } = await supabase
    .from('weekly_metrics')
    .upsert({ week_of: weekOf, data: merged }, { onConflict: 'week_of' });
  if (error) throw error;

  return { ok: true, queued: false };
}

export async function saveContentEntry(item) {
  if (!item.id) item.id = localId();

  const row = {
    id: item.id,
    channel: item.channel,
    post_type: item.post_type || item.postType,
    due_date: item.dueDate || item.due_date,
    title: item.title,
    status: item.status,
  };

  const { error } = await supabase
    .from('content_items')
    .upsert(row, { onConflict: 'id' });
  if (error) throw error;

  return { ok: true, queued: false };
}

export async function saveChecklistEntry(item) {
  if (!item.id) item.id = localId();
  const kind = item.tab || 'phase_checklist';

  const row = {
    id: item.id,
    kind,
    phase: kind === 'phase_checklist' ? (item.phase ?? null) : null,
    type: item.type || null,
    item: item.item || '',
    completed: !!item.completed,
    completed_date: item.completed_date || null,
  };

  const { error } = await supabase
    .from('checklist_entries')
    .upsert(row, { onConflict: 'id' });
  if (error) throw error;

  return { ok: true, queued: false };
}

export async function savePartnership(item) {
  if (!item.id) item.id = localId();

  const { error } = await supabase
    .from('partnerships')
    .upsert(item, { onConflict: 'id' });
  if (error) throw error;

  return { ok: true, queued: false };
}

export async function saveConfig(config) {
  const { error } = await supabase
    .from('app_config')
    .update({
      current_phase: config.currentPhase ?? undefined,
      phase_start_date: config.phaseStartDate ?? undefined,
    })
    .eq('id', 1);
  if (error) throw error;

  // Invalidate cache
  _configCache = null;

  return { ok: true, queued: false };
}
