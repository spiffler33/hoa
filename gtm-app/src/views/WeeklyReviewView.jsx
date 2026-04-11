import { useState, useEffect, useCallback } from 'react';
import { loadMetrics, saveWeeklyMetrics, loadConfig } from '../utils/dataLayer';
import stageGates from '../data/stageGates';
import phaseChecklists from '../data/phaseChecklists';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import './WeeklyReviewView.css';

const PHASE_KEYS = ['phase_0', 'phase_1', 'phase_2', 'phase_3'];
const PHASE_LABELS = [
  'Phase 0 \u2014 Foundation',
  'Phase 1 \u2014 Community Build',
  'Phase 2 \u2014 App Launch',
  'Phase 3 \u2014 Retention & Scale',
];

/** Cadence check items (operational discipline, not in stageGates). */
const CADENCE_CHECKS = [
  { id: 'cadence_content_buffer', label: 'Content buffer (weeks ahead)', type: 'select', options: ['0', '1', '2+'], target: '2+' },
  { id: 'cadence_posts_on_schedule', label: 'Posts on schedule', type: 'boolean', target: 'Yes' },
  { id: 'cadence_rituals_completed', label: 'Rituals completed', type: 'boolean', target: 'Yes' },
  { id: 'cadence_pod_checkin', label: 'Pod check-in done', type: 'boolean', target: 'Yes' },
];

/* ── helpers ─────────────────────────────────── */

/** Get Monday of the week containing `date`. */
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Format date as "Apr 7, 2026". */
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** YYYY-MM-DD string for a Date object. */
function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Compare a metric value against thresholds \u2192 'green' | 'amber' | 'red' | 'none'. */
function alertLevel(value, metric) {
  if (value == null || value === '') return 'none';
  if (metric.unit === 'boolean' || metric.unit === 'currency') return 'none';
  const n = Number(value);
  if (isNaN(n)) return 'none';
  if (metric.redThreshold != null && n <= metric.redThreshold) return 'red';
  if (metric.amberThreshold != null && n <= metric.amberThreshold) return 'amber';
  return 'green';
}

/** Cadence check status. */
function cadenceStatus(value, check) {
  if (value == null || value === '') return 'none';
  if (check.type === 'boolean') return value === 'Yes' ? 'green' : 'red';
  if (check.id === 'cadence_content_buffer') {
    if (value === '2+') return 'green';
    if (value === '1') return 'amber';
    return 'red';
  }
  return 'none';
}

/* ── component ───────────────────────────────── */

/** Simple SVG sparkline: dots + line + dashed target. */
function Sparkline({ points, target, width = 200, height = 56 }) {
  const pad = 8;
  const plotW = width - pad * 2;
  const plotH = height - pad * 2;

  const allVals = [...points.map((p) => p.value), target].filter(
    (v) => v != null && !isNaN(v),
  );
  const minVal = Math.min(...allVals);
  const maxVal = Math.max(...allVals);
  const range = maxVal - minVal || 1;

  const x = (i) =>
    pad +
    (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);
  const y = (v) => pad + plotH - ((v - minVal) / range) * plotH;

  const polyPoints = points
    .map((p, i) => `${x(i)},${y(p.value)}`)
    .join(' ');
  const targetY = target != null ? y(target) : null;

  return (
    <svg
      className="sparkline"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
    >
      {targetY != null && (
        <line
          x1={pad}
          y1={targetY}
          x2={width - pad}
          y2={targetY}
          className="sparkline__target"
        />
      )}
      <polyline points={polyPoints} className="sparkline__line" />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={x(i)}
          cy={y(p.value)}
          r="2.5"
          className="sparkline__dot"
        />
      ))}
    </svg>
  );
}

export default function WeeklyReviewView() {
  const [weekOf, setWeekOf] = useState(() => getMonday(new Date()));
  const [values, setValues] = useState({});
  const [cadenceValues, setCadenceValues] = useState({});
  const [blockers, setBlockers] = useState('');
  const [priorities, setPriorities] = useState('');
  const [founderSummary, setFounderSummary] = useState('');
  const [config, setConfigState] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trendRows, setTrendRows] = useState([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const currentPhase = config?.currentPhase ?? 0;
  const phaseKey = PHASE_KEYS[currentPhase];
  const phaseMetrics = stageGates[phaseKey] || [];
  const weekKey = toISO(weekOf);

  /* load config on mount */
  useEffect(() => {
    loadConfig().then((res) => setConfigState(res.data || {}));
  }, []);

  /* load saved data whenever week or config changes */
  const loadWeekData = useCallback(async () => {
    setLoading(true);
    setSaveMsg(null);
    setError(null);
    try {
      const res = await loadMetrics();
      if (res.data) {
        const rows = Array.isArray(res.data) ? res.data : [res.data];

        // Last 8 weeks sorted chronologically for trend sparklines
        const sorted = [...rows]
          .filter((r) => r.weekOf)
          .sort((a, b) => a.weekOf.localeCompare(b.weekOf));
        setTrendRows(sorted.slice(-8));

        const row = rows.find((r) => r.weekOf === weekKey);
        if (row) {
          const phaseKey_ = PHASE_KEYS[config?.currentPhase ?? 0];
          const metrics = stageGates[phaseKey_] || [];
          const vals = {};
          metrics.forEach((m) => {
            if (row[m.id] != null) vals[m.id] = String(row[m.id]);
          });
          setValues(vals);

          const cVals = {};
          CADENCE_CHECKS.forEach((c) => {
            if (row[c.id] != null) cVals[c.id] = String(row[c.id]);
          });
          setCadenceValues(cVals);

          setBlockers(row.blockers || '');
          setPriorities(row.priorities || '');
          setFounderSummary(row.founderSummary || '');
        } else {
          setValues({});
          setCadenceValues({});
          setBlockers('');
          setPriorities('');
          setFounderSummary('');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load metrics.');
    }
    setLoading(false);
  }, [weekKey, config]);

  useEffect(() => {
    if (config !== null) loadWeekData();
  }, [config, loadWeekData]);

  /* navigation */
  const goWeek = (delta) => {
    setWeekOf((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + delta * 7);
      return d;
    });
  };

  /* input handlers */
  const setMetricValue = (id, val) =>
    setValues((prev) => ({ ...prev, [id]: val }));

  const setCadenceValue = (id, val) =>
    setCadenceValues((prev) => ({ ...prev, [id]: val }));

  /* save */
  const handleSave = async () => {
    setSaving(true);
    setSaveMsg(null);
    const weekData = {
      weekOf: weekKey,
      phase: currentPhase,
      ...values,
      ...cadenceValues,
      blockers,
      priorities,
      founderSummary,
    };
    const result = await saveWeeklyMetrics(weekData);
    setSaving(false);
    if (result.queued) {
      setSaveMsg({ type: 'queued', text: 'Saved to queue \u2014 will sync when connected.' });
    } else {
      setSaveMsg({ type: 'success', text: 'Weekly review saved.' });
    }
  };

  /* computed: stage gate alerts (only amber/red) */
  const gateAlerts = phaseMetrics
    .map((m) => ({
      ...m,
      value: values[m.id],
      level: alertLevel(values[m.id], m),
    }))
    .filter((a) => a.level === 'amber' || a.level === 'red');

  const redCount = gateAlerts.filter((a) => a.level === 'red').length;
  const amberCount = gateAlerts.filter((a) => a.level === 'amber').length;

  /* week range display */
  const weekEnd = new Date(weekOf);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const isCurrentWeek = toISO(getMonday(new Date())) === weekKey;

  /* build plain-text summary for clipboard */
  const buildSummaryText = () => {
    const lines = [
      `Weekly Review \u2014 ${PHASE_LABELS[currentPhase]}`,
      `Week of ${formatDate(weekOf)} \u2014 ${formatDate(weekEnd)}`,
      '',
      '\u2500\u2500 Stage Gate Metrics \u2500\u2500',
    ];
    phaseMetrics.forEach((m) => {
      const val = values[m.id] ?? '\u2014';
      const level = alertLevel(val, m);
      const flag =
        level === 'amber' || level === 'red'
          ? ` [${level.toUpperCase()}]`
          : '';
      lines.push(
        `  ${m.label}: ${val}${m.unit === '%' ? '%' : ''} (target: ${m.target}${m.unit === '%' ? '%' : ''})${flag}`,
      );
    });
    lines.push('', '\u2500\u2500 Cadence Check \u2500\u2500');
    CADENCE_CHECKS.forEach((c) => {
      const val = cadenceValues[c.id] ?? '\u2014';
      const level = cadenceStatus(val, c);
      const flag =
        level === 'amber' || level === 'red'
          ? ` [${level.toUpperCase()}]`
          : '';
      lines.push(`  ${c.label}: ${val}${flag}`);
    });
    if (blockers) lines.push('', '\u2500\u2500 Blockers \u2500\u2500', blockers);
    if (priorities) lines.push('', '\u2500\u2500 Priorities \u2500\u2500', priorities);
    if (founderSummary)
      lines.push('', '\u2500\u2500 Founder Summary \u2500\u2500', founderSummary);
    return lines.join('\n');
  };

  /* copy summary to clipboard */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildSummaryText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API may fail in insecure context
    }
  };

  /* ── loading / error gate ────────────────────── */
  if (loading && config === null) {
    return (
      <div className="view weekly-view">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && config === null) {
    return (
      <div className="view weekly-view">
        <EmptyState
          icon="\u26A0"
          message="Failed to load data"
          hint={error}
          actionLabel="Retry"
          onAction={loadWeekData}
          variant="error"
        />
      </div>
    );
  }

  /* ── render ────────────────────────────────── */
  return (
    <div className="view weekly-view">
      {/* ── Banner ──────────────────────────────── */}
      <header className="weekly-section weekly-banner">
        <h1 className="weekly-banner__title">Weekly Review</h1>
        <p className="weekly-banner__meta">
          WK OF {weekKey}{' '}
          <span className="weekly-banner__sep">{'\u00b7'}</span>{' '}
          {PHASE_LABELS[currentPhase].toUpperCase()}
        </p>
        <div className="weekly-nav">
          <button
            type="button"
            className="weekly-nav__btn"
            onClick={() => goWeek(-1)}
            aria-label="Previous week"
          >
            {'\u2039'}
          </button>
          <span className="weekly-nav__label">
            {formatDate(weekOf)} {'\u2013'} {formatDate(weekEnd)}
            {isCurrentWeek && (
              <span className="weekly-nav__current">[CURRENT]</span>
            )}
          </span>
          <button
            type="button"
            className="weekly-nav__btn"
            onClick={() => goWeek(1)}
            aria-label="Next week"
          >
            {'\u203A'}
          </button>
        </div>
      </header>

      {/* ── Stage Gate Metrics ──────────────────── */}
      <section className="weekly-section">
        <h2 className="weekly-section__heading">
          <span>Stage gate metrics</span>
        </h2>
        {loading ? (
          <LoadingSpinner label="Loading metrics\u2026" />
        ) : phaseMetrics.length === 0 ? (
          <EmptyState icon="\u2205" message="No metrics defined for this phase." />
        ) : (
          <ul className="weekly-metric-list">
            {phaseMetrics.map((m) => {
              const val = values[m.id] ?? '';
              const level = alertLevel(val, m);
              const isBool = m.unit === 'boolean';
              return (
                <li
                  key={m.id}
                  className={`weekly-metric weekly-metric--${level}`}
                >
                  <label className="weekly-metric__label" htmlFor={m.id}>
                    {m.label}
                  </label>
                  <span className="weekly-metric__leader" aria-hidden="true" />
                  {isBool ? (
                    <span className="weekly-metric__select-wrap">
                      <select
                        id={m.id}
                        className="weekly-metric__field"
                        value={val}
                        onChange={(e) => setMetricValue(m.id, e.target.value)}
                      >
                        <option value="">{'\u2014'}</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </span>
                  ) : (
                    <input
                      id={m.id}
                      type="number"
                      className={`weekly-metric__field weekly-metric__field--${level}`}
                      placeholder={String(m.target)}
                      value={val}
                      onChange={(e) => setMetricValue(m.id, e.target.value)}
                    />
                  )}
                  <span className="weekly-metric__target">
                    / {m.target}
                    {m.unit === '%' ? '%' : ''}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Cadence Check ──────────────────────── */}
      <section className="weekly-section">
        <h2 className="weekly-section__heading">
          <span>Cadence check</span>
        </h2>
        <ul className="weekly-metric-list">
          {CADENCE_CHECKS.map((c) => {
            const val = cadenceValues[c.id] ?? '';
            const level = cadenceStatus(val, c);
            return (
              <li
                key={c.id}
                className={`weekly-metric weekly-metric--${level}`}
              >
                <label className="weekly-metric__label" htmlFor={c.id}>
                  {c.label}
                </label>
                <span className="weekly-metric__leader" aria-hidden="true" />
                <span className="weekly-metric__select-wrap">
                  <select
                    id={c.id}
                    className="weekly-metric__field"
                    value={val}
                    onChange={(e) => setCadenceValue(c.id, e.target.value)}
                  >
                    <option value="">{'\u2014'}</option>
                    {c.type === 'select'
                      ? c.options.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))
                      : [
                          <option key="Yes" value="Yes">Yes</option>,
                          <option key="No" value="No">No</option>,
                        ]}
                  </select>
                </span>
                <span className="weekly-metric__target">
                  / {c.target}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Stage Gate Alerts (auto-computed) ──── */}
      {gateAlerts.length > 0 && (
        <section className="weekly-section">
          <h2 className="weekly-section__heading">
            <span>Stage gate alerts</span>
            <span className="weekly-section__heading-meta">
              {redCount > 0 && (
                <span className="weekly-heading-count weekly-heading-count--red">
                  {redCount} priority
                </span>
              )}
              {amberCount > 0 && (
                <span className="weekly-heading-count weekly-heading-count--amber">
                  {amberCount} active
                </span>
              )}
            </span>
          </h2>
          <ul className="weekly-alerts">
            {gateAlerts.map((a) => (
              <li
                key={a.id}
                className={`weekly-alert weekly-alert--${a.level}`}
              >
                <div className="weekly-alert__header">
                  <span className="weekly-alert__label">{a.label}</span>
                  <span className="weekly-alert__leader" aria-hidden="true" />
                  <span className="weekly-alert__value">
                    {a.value}
                    {a.unit === '%' ? '%' : ''}
                  </span>
                  <span className="weekly-alert__target">
                    / {a.target}
                    {a.unit === '%' ? '%' : ''}
                  </span>
                  <span className="weekly-alert__status">
                    {a.level.toUpperCase()}
                  </span>
                </div>
                <p className="weekly-alert__action">
                  <span className="weekly-alert__action-label">Action</span>
                  {a.level === 'red' ? a.redAction : a.amberAction}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Blockers ───────────────────────────── */}
      <section className="weekly-section">
        <h2 className="weekly-section__heading">
          <span>Blockers</span>
        </h2>
        <textarea
          className="weekly-textarea"
          placeholder="What&rsquo;s stuck? Who do you need to poke?"
          rows={3}
          value={blockers}
          onChange={(e) => setBlockers(e.target.value)}
        />
      </section>

      {/* ── Priorities ─────────────────────────── */}
      <section className="weekly-section">
        <h2 className="weekly-section__heading">
          <span>This week&rsquo;s priorities</span>
        </h2>
        <textarea
          className="weekly-textarea"
          placeholder="Top 3 priorities for this week"
          rows={3}
          value={priorities}
          onChange={(e) => setPriorities(e.target.value)}
        />
      </section>

      {/* ── Founder Summary ────────────────────── */}
      <section className="weekly-section">
        <h2 className="weekly-section__heading">
          <span>Founder summary</span>
        </h2>
        <textarea
          className="weekly-textarea"
          placeholder="3 sentences: what&rsquo;s working, what&rsquo;s not, what I need from you"
          rows={4}
          value={founderSummary}
          onChange={(e) => setFounderSummary(e.target.value)}
        />
      </section>

      {/* ── Save + Copy ────────────────────────── */}
      <div className="weekly-actions">
        <button
          type="button"
          className="weekly-btn weekly-btn--primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving\u2026' : 'Save'}
        </button>
        <button
          type="button"
          className={`weekly-btn${copied ? ' weekly-btn--done' : ''}`}
          onClick={handleCopy}
        >
          {copied ? 'Copied' : 'Copy summary'}
        </button>
        {saveMsg && (
          <span className={`weekly-msg weekly-msg--${saveMsg.type}`}>
            {saveMsg.text}
          </span>
        )}
      </div>

      {/* ── Trend ──────────────────────────────── */}
      <section className="weekly-section">
        <h2 className="weekly-section__heading">
          <span>Trend {'\u2014'} last 8 weeks</span>
        </h2>
        {trendRows.length < 2 ? (
          <EmptyState
            icon="\u2014"
            message="Need at least 2 weeks of data to show trends."
          />
        ) : (
          <div className="weekly-trend-grid">
            {phaseMetrics
              .filter((m) => m.unit !== 'boolean' && m.unit !== 'currency')
              .map((m) => {
                const pts = trendRows
                  .map((r) => ({ value: Number(r[m.id]) }))
                  .filter((p) => !isNaN(p.value));
                if (pts.length < 2) return null;
                return (
                  <div key={m.id} className="weekly-trend-item">
                    <span className="weekly-trend-item__label">{m.label}</span>
                    <Sparkline points={pts} target={m.target} />
                  </div>
                );
              })}
          </div>
        )}
      </section>
    </div>
  );
}
