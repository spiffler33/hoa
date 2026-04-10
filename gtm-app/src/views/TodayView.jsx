import { useState, useEffect } from 'react';
import { loadConfig, loadMetrics, loadContentCalendar } from '../utils/dataLayer';
import cadence from '../data/cadence';
import stageGates from '../data/stageGates';
import phaseChecklists from '../data/phaseChecklists';
import './TodayView.css';

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday',
];
const PHASE_KEYS = ['phase_0', 'phase_1', 'phase_2', 'phase_3'];
const PHASE_LABELS = [
  'Phase 0 — Foundation',
  'Phase 1 — Community Build',
  'Phase 2 — App Launch',
  'Phase 3 — Retention & Scale',
];

/* ── helpers ─────────────────────────────────── */

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/** Returns 1-based week number within the phase, or null. */
function getWeekNumber(phaseStartDate) {
  if (!phaseStartDate) return null;
  const start = new Date(phaseStartDate + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((now - start) / 86_400_000);
  if (diffDays < 0) return null;
  return Math.floor(diffDays / 7) + 1;
}

/** Look up today's cadence tasks for the given phase and week. */
function getTodayTasks(phaseKey, weekNum) {
  const dayKey = DAY_KEYS[new Date().getDay()];
  const phaseData = cadence[phaseKey];
  if (!phaseData) return [];

  // Phase 0: keyed by week number → day
  if (phaseKey === 'phase_0') {
    const weekData = phaseData[weekNum];
    return weekData?.[dayKey] || [];
  }

  // Phase 1+: keyed by day-of-week directly
  return phaseData[dayKey] || [];
}

/** Compare a metric value against thresholds → 'green' | 'amber' | 'red' | 'none'. */
function alertLevel(value, metric) {
  if (value == null) return 'none';
  if (metric.unit === 'boolean' || metric.unit === 'currency') return 'none';
  const n = Number(value);
  if (isNaN(n)) return 'none';
  if (metric.redThreshold != null && n <= metric.redThreshold) return 'red';
  if (metric.amberThreshold != null && n <= metric.amberThreshold) return 'amber';
  return 'green';
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/* ── component ───────────────────────────────── */

export default function TodayView() {
  const [config, setConfigState] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [contentItems, setContentItems] = useState([]);
  const [checked, setChecked] = useState({});
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  /* load all data on mount */
  useEffect(() => {
    async function init() {
      const cfgResult = await loadConfig();
      setConfigState(cfgResult.data || {});

      const [mRes, cRes] = await Promise.allSettled([
        loadMetrics({ latest: true }),
        loadContentCalendar(),
      ]);

      if (mRes.status === 'fulfilled' && mRes.value.data) {
        const raw = mRes.value.data;
        // Handle both single object and array-of-rows from the sheet
        setMetrics(Array.isArray(raw) ? raw[raw.length - 1] : raw);
      }
      if (cRes.status === 'fulfilled' && cRes.value.data) {
        setContentItems(Array.isArray(cRes.value.data) ? cRes.value.data : []);
      }

      setLoading(false);
    }
    init();
  }, []);

  const toggleCheck = (i) =>
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  /* ── derived ───────────────────────────────── */
  const currentPhase = config?.currentPhase ?? 0;
  const phaseKey = PHASE_KEYS[currentPhase];
  const phase = phaseChecklists[phaseKey];
  const weekNum = getWeekNumber(config?.phaseStartDate);
  const dayName = DAY_NAMES[new Date().getDay()];

  // Cadence tasks
  const todayTasks = getTodayTasks(phaseKey, weekNum);

  // Alerts: metrics vs thresholds
  const phaseMetrics = stageGates[phaseKey] || [];
  const alerts = phaseMetrics.map((m) => {
    const value = metrics?.[m.id] ?? null;
    return { ...m, value, level: alertLevel(value, m) };
  });
  const redCount = alerts.filter((a) => a.level === 'red').length;
  const amberCount = alerts.filter((a) => a.level === 'amber').length;

  // Content due today or overdue (not yet published)
  const today = todayISO();
  const contentDue = contentItems.filter((item) => {
    const due = item.dueDate || item.date;
    if (!due) return false;
    if ((item.status || '').toLowerCase() === 'published') return false;
    return due <= today;
  });

  /* ── loading state ─────────────────────────── */
  if (loading) {
    return (
      <div className="view today-view">
        <h1 className="view-title">Today</h1>
        <p className="view-placeholder">Loading\u2026</p>
      </div>
    );
  }

  /* ── render ────────────────────────────────── */
  return (
    <div className="view today-view">
      {/* ── Phase Banner ────────────────────── */}
      <header className="today-banner">
        <h1 className="today-banner__greeting">
          {getGreeting()}.{' '}
          <span className="today-banner__phase">
            {PHASE_LABELS[currentPhase]}
          </span>
        </h1>
        <p className="today-banner__sub">
          {weekNum != null ? `Week ${weekNum}, ${dayName}` : dayName}
        </p>
        {phase && (
          <p className="today-banner__objective">{phase.objective}</p>
        )}
      </header>

      {/* ── Alerts ──────────────────────────── */}
      <section className="today-card">
        <h2 className="today-card__title">
          Stage Gate Alerts
          {(redCount > 0 || amberCount > 0) && (
            <span className="today-card__badge-group">
              {redCount > 0 && (
                <span className="badge badge--red">{redCount} red</span>
              )}
              {amberCount > 0 && (
                <span className="badge badge--amber">{amberCount} amber</span>
              )}
            </span>
          )}
        </h2>

        {metrics === null ? (
          <p className="today-empty">
            No metrics data yet — connect a sheet in Settings or enter data in
            Weekly Review.
          </p>
        ) : alerts.length === 0 ? (
          <p className="today-empty">
            No stage gates defined for this phase.
          </p>
        ) : (
          <ul className="today-alerts">
            {alerts.map((a) => (
              <li
                key={a.id}
                className={`today-alert today-alert--${a.level}`}
                onClick={() =>
                  setExpandedAlert(expandedAlert === a.id ? null : a.id)
                }
              >
                <div className="today-alert__row">
                  <span className={`today-alert__dot dot--${a.level}`} />
                  <span className="today-alert__label">{a.label}</span>
                  <span className="today-alert__value">
                    {a.value != null ? a.value : '\u2014'}
                    {a.unit === '%' && a.value != null ? '%' : ''}
                  </span>
                  <span className="today-alert__target">
                    / {a.target}
                    {a.unit === '%' ? '%' : ''}
                  </span>
                </div>

                {expandedAlert === a.id && (
                  <div className="today-alert__detail">
                    {a.level === 'red' && a.redAction && (
                      <p>
                        <strong>Action:</strong> {a.redAction}
                      </p>
                    )}
                    {a.level === 'amber' && a.amberAction && (
                      <p>
                        <strong>Action:</strong> {a.amberAction}
                      </p>
                    )}
                    {a.level === 'green' && (
                      <p className="today-alert__ok">On track</p>
                    )}
                    {a.level === 'none' && (
                      <p>No data entered for this metric.</p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Daily Checklist ─────────────────── */}
      <section className="today-card">
        <h2 className="today-card__title">Today&rsquo;s Cadence</h2>

        {todayTasks.length === 0 ? (
          <p className="today-empty">
            {cadence[phaseKey]
              ? 'No tasks scheduled for today.'
              : 'No daily cadence defined for this phase.'}
          </p>
        ) : (
          <ul className="today-checklist">
            {todayTasks.map((task, i) => (
              <li key={i} className="today-checklist__item">
                <label className="today-checklist__label">
                  <input
                    type="checkbox"
                    checked={!!checked[i]}
                    onChange={() => toggleCheck(i)}
                    className="today-checklist__cb"
                  />
                  <span
                    className={
                      checked[i] ? 'today-checklist__text today-checklist__text--done' : 'today-checklist__text'
                    }
                  >
                    {task.activity}
                  </span>
                </label>
                <div className="today-checklist__meta">
                  {task.time && (
                    <span className="today-checklist__time">{task.time}</span>
                  )}
                  <span className="today-checklist__owner">{task.owner}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Content Due ─────────────────────── */}
      <section className="today-card">
        <h2 className="today-card__title">Content Due Today</h2>

        {contentDue.length === 0 ? (
          <p className="today-empty">No content due today.</p>
        ) : (
          <ul className="today-content-list">
            {contentDue.map((item, i) => {
              const due = item.dueDate || item.date;
              const overdue = due && due < today;
              return (
                <li
                  key={item.id || i}
                  className={`today-content-item${overdue ? ' today-content-item--overdue' : ''}`}
                >
                  <span className="today-content-item__title">
                    {item.title || 'Untitled'}
                  </span>
                  <span className="today-content-item__channel">
                    {item.channel || '\u2014'}
                  </span>
                  <span
                    className={`status-badge status-badge--${(item.status || 'pending').toLowerCase()}`}
                  >
                    {item.status || 'pending'}
                  </span>
                  {overdue && (
                    <span className="status-badge status-badge--overdue">
                      overdue
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
