import { useState, useEffect, useCallback } from 'react';
import { loadConfig, loadMetrics, loadContentCalendar } from '../utils/dataLayer';
import cadence from '../data/cadence';
import stageGates from '../data/stageGates';
import phaseChecklists from '../data/phaseChecklists';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import './TodayView.css';

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday',
];
const DAY_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
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
  const [error, setError] = useState(null);

  /* load all data on mount */
  const init = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cfgResult = await loadConfig();
      setConfigState(cfgResult.data || {});

      const [mRes, cRes] = await Promise.allSettled([
        loadMetrics({ latest: true }),
        loadContentCalendar(),
      ]);

      if (mRes.status === 'fulfilled' && mRes.value.data) {
        const raw = mRes.value.data;
        setMetrics(Array.isArray(raw) ? raw[raw.length - 1] : raw);
      }
      if (cRes.status === 'fulfilled' && cRes.value.data) {
        setContentItems(Array.isArray(cRes.value.data) ? cRes.value.data : []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load data.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const toggleCheck = (i) =>
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  /* ── derived ───────────────────────────────── */
  const currentPhase = config?.currentPhase ?? 0;
  const phaseKey = PHASE_KEYS[currentPhase];
  const phase = phaseChecklists[phaseKey];
  const weekNum = getWeekNumber(config?.phaseStartDate);
  const dayIdx = new Date().getDay();
  const dayName = DAY_NAMES[dayIdx];
  const dayShort = DAY_SHORT[dayIdx];

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

  /* ── loading / error states ──────────────────── */
  if (loading) {
    return (
      <div className="view today-view">
        <h1 className="view-title">Today</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="view today-view">
        <h1 className="view-title">Today</h1>
        <EmptyState
          icon="\u26A0"
          message="Failed to load data"
          hint={error}
          actionLabel="Retry"
          onAction={init}
          variant="error"
        />
      </div>
    );
  }

  /* ── render ────────────────────────────────── */
  return (
    <div className="view today-view">
      {/* ── Banner ──────────────────────────────── */}
      <header className="today-section today-banner">
        <p className="today-banner__greeting">{getGreeting()}.</p>
        <p className="today-banner__meta">
          {today} <span className="today-banner__sep">·</span> {dayShort}
          {weekNum != null && (
            <>
              {' '}
              <span className="today-banner__sep">·</span> WK {weekNum}
            </>
          )}{' '}
          <span className="today-banner__sep">·</span> {PHASE_LABELS[currentPhase]}
        </p>
        {phase && (
          <p className="today-banner__objective">{phase.objective}</p>
        )}
      </header>

      {/* ── Stage Gate Alerts ───────────────────── */}
      <section className="today-section">
        <h2 className="today-section__heading">
          <span>Stage gate alerts</span>
          {(redCount > 0 || amberCount > 0) && (
            <span className="today-section__heading-meta">
              {redCount > 0 && (
                <span className="today-heading-count today-heading-count--red">
                  {redCount} priority
                </span>
              )}
              {amberCount > 0 && (
                <span className="today-heading-count today-heading-count--amber">
                  {amberCount} active
                </span>
              )}
            </span>
          )}
        </h2>

        {metrics === null ? (
          <EmptyState
            icon="\u2014"
            message="No metrics data yet"
            hint="Connect a sheet in Settings or enter data in Weekly Review."
          />
        ) : alerts.length === 0 ? (
          <EmptyState icon="\u2205" message="No stage gates defined for this phase." />
        ) : (
          <ul className="today-alerts">
            {alerts.map((a) => {
              const expanded = expandedAlert === a.id;
              return (
                <li
                  key={a.id}
                  className={`today-alert today-alert--${a.level}${expanded ? ' today-alert--expanded' : ''}`}
                >
                  <button
                    type="button"
                    className="today-alert__row"
                    onClick={() =>
                      setExpandedAlert(expanded ? null : a.id)
                    }
                    aria-expanded={expanded}
                  >
                    <span className="today-alert__label">{a.label}</span>
                    <span className="today-alert__leader" aria-hidden="true" />
                    <span className="today-alert__value">
                      {a.value != null ? a.value : '\u2014'}
                      {a.unit === '%' && a.value != null ? '%' : ''}
                    </span>
                    <span className="today-alert__target">
                      / {a.target}
                      {a.unit === '%' ? '%' : ''}
                    </span>
                  </button>

                  {expanded && (
                    <div className="today-alert__detail">
                      {a.level === 'red' && a.redAction && (
                        <p>
                          <span className="today-alert__detail-label">Action</span>
                          {a.redAction}
                        </p>
                      )}
                      {a.level === 'amber' && a.amberAction && (
                        <p>
                          <span className="today-alert__detail-label">Action</span>
                          {a.amberAction}
                        </p>
                      )}
                      {a.level === 'green' && (
                        <p className="today-alert__ok">On track.</p>
                      )}
                      {a.level === 'none' && (
                        <p>No data entered for this metric.</p>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Today's Cadence ─────────────────────── */}
      <section className="today-section">
        <h2 className="today-section__heading">
          <span>Today&rsquo;s cadence</span>
        </h2>

        {todayTasks.length === 0 ? (
          <EmptyState
            icon="\u2713"
            message={
              cadence[phaseKey]
                ? 'No tasks scheduled for today.'
                : 'No daily cadence defined for this phase.'
            }
          />
        ) : (
          <ul className="today-checklist">
            {todayTasks.map((task, i) => {
              const done = !!checked[i];
              return (
                <li key={i} className="today-checklist__item">
                  <label className="today-checklist__label">
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggleCheck(i)}
                      className="today-checklist__cb-native"
                    />
                    <span className="today-checklist__cb-text" aria-hidden="true">
                      {done ? '[x]' : '[ ]'}
                    </span>
                    <span
                      className={
                        done
                          ? 'today-checklist__text today-checklist__text--done'
                          : 'today-checklist__text'
                      }
                    >
                      {task.activity}
                    </span>
                    <span className="today-checklist__leader" aria-hidden="true" />
                    {task.time && (
                      <span className="today-checklist__time">{task.time}</span>
                    )}
                    <span className="today-checklist__owner">{task.owner}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Content Due ─────────────────────────── */}
      <section className="today-section">
        <h2 className="today-section__heading">
          <span>Content due</span>
        </h2>

        {contentDue.length === 0 ? (
          <EmptyState icon="\u2713" message="No content due today." />
        ) : (
          <ul className="today-content-list">
            {contentDue.map((item, i) => {
              const due = item.dueDate || item.date;
              const overdue = due && due < today;
              const statusKey = (item.status || 'pending').toLowerCase();
              return (
                <li
                  key={item.id || i}
                  className={`today-content-item${overdue ? ' today-content-item--overdue' : ''}`}
                >
                  <span className="today-content-item__prefix" aria-hidden="true">
                    {overdue ? '!' : '\u00b7'}
                  </span>
                  <span className="today-content-item__title">
                    {item.title || 'Untitled'}
                  </span>
                  <span className="today-content-item__leader" aria-hidden="true" />
                  <span className="today-content-item__channel">
                    {item.channel || '\u2014'}
                  </span>
                  <span className={`today-content-tag today-content-tag--${statusKey}`}>
                    [{(item.status || 'pending').toUpperCase()}]
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
