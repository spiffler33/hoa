import { useState, useEffect, useCallback } from 'react';
import { loadMetrics, loadConfig } from '../utils/dataLayer';
import stageGates from '../data/stageGates';
import killCriteria from '../data/killCriteria';
import phaseChecklists from '../data/phaseChecklists';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import './ControlView.css';

const PHASE_KEYS = ['phase_0', 'phase_1', 'phase_2', 'phase_3'];
const PHASE_LABELS = [
  'Phase 0 \u2014 Foundation',
  'Phase 1 \u2014 Community Build',
  'Phase 2 \u2014 App Launch',
  'Phase 3 \u2014 Retention & Scale',
];

/* ── Category mapping for metric grouping ──── */
const METRIC_CATEGORIES = {
  p0_waitlist_signups: 'Growth',
  p0_email_list: 'Growth',
  p0_linkedin_followers: 'Growth',
  p0_quiz_completions: 'Engagement',
  p0_message_test_winner: 'Validation',
  p1_community_members: 'Growth',
  p1_content_impressions: 'Growth',
  p1_quiz_completions: 'Growth',
  p1_wau: 'Engagement',
  p1_pod_enrolments: 'Engagement',
  p1_referral_invites: 'Distribution',
  p1_organic_referrals: 'Distribution',
  p1_wedge_fit: 'Validation',
  p2_app_signups_community: 'Growth',
  p2_app_signups_public: 'Growth',
  p2_snapshot_community: 'Activation',
  p2_snapshot_cold: 'Activation',
  p2_share_moments: 'Engagement',
  p2_plan_upgrade: 'Revenue',
  p3_total_community: 'Growth',
  p3_mau: 'Growth',
  p3_retention_90d: 'Retention',
  p3_community_app_conversion: 'Retention',
  p3_advisory_conversions: 'Revenue',
  p3_organic_referral_rate: 'Distribution',
  p3_member_content_share: 'Distribution',
  p3_nps: 'Satisfaction',
  p3_revenue_plans: 'Revenue',
  p3_revenue_advisory: 'Revenue',
};

/* ── Kill criteria → related stage gate metric IDs ── */
const KILL_METRIC_MAP = {
  kill_wedge_wrong: ['p1_wedge_fit', 'p1_organic_referrals'],
  kill_community_model: ['p1_wau'],
  kill_app_bridge: ['p2_app_signups_community'],
  kill_revenue_model: ['p2_plan_upgrade'],
  kill_founder_burnout: [],
};

/* ── Funnel stages with metric IDs for actual numbers ── */
const FUNNEL_STAGES = [
  { id: 'awareness', label: 'Awareness', metricIds: ['p0_linkedin_followers', 'p1_content_impressions'] },
  { id: 'waitlist', label: 'Waitlist', metricIds: ['p0_waitlist_signups', 'p0_email_list'] },
  { id: 'community', label: 'Community', metricIds: ['p1_community_members', 'p3_total_community'] },
  { id: 'active', label: 'Active Users', metricIds: ['p2_app_signups_community', 'p2_app_signups_public', 'p3_mau'] },
  { id: 'paying', label: 'Paying', metricIds: ['p2_plan_upgrade', 'p3_advisory_conversions'] },
];

/* ── Helpers ────────────────────────────────── */

/** Same threshold logic as WeeklyReviewView.alertLevel */
function alertLevel(value, metric) {
  if (value == null || value === '') return 'none';
  if (metric.unit === 'boolean' || metric.unit === 'currency') return 'none';
  const n = Number(value);
  if (isNaN(n)) return 'none';
  if (metric.redThreshold != null && n <= metric.redThreshold) return 'red';
  if (metric.amberThreshold != null && n <= metric.amberThreshold) return 'amber';
  return 'green';
}

function formatValue(value, unit) {
  if (value == null || value === '') return '\u2014';
  if (unit === '%') return `${value}%`;
  if (unit === 'count') {
    const n = Number(value);
    if (!isNaN(n) && n >= 1000) return n.toLocaleString();
  }
  return String(value);
}

function formatTarget(target, unit) {
  if (target == null) return '\u2014';
  if (unit === '%') return `${target}%`;
  if (typeof target === 'number' && target >= 1000) return target.toLocaleString();
  return String(target);
}

/** Group metrics array by category, preserving encounter order. */
function groupByCategory(metrics) {
  const groups = [];
  const seen = new Set();
  for (const m of metrics) {
    const cat = METRIC_CATEGORIES[m.id] || 'Other';
    if (!seen.has(cat)) {
      seen.add(cat);
      groups.push({ category: cat, metrics: [] });
    }
    groups.find((g) => g.category === cat).metrics.push(m);
  }
  return groups;
}

/* ── Component ─────────────────────────────── */

export default function ControlView() {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);
  const [latestValues, setLatestValues] = useState({});

  const currentPhase = config?.currentPhase ?? 0;
  const phaseKey = PHASE_KEYS[currentPhase];
  const phaseMetrics = stageGates[phaseKey] || [];
  const phaseData = phaseChecklists[phaseKey];

  /* Compute week-in-phase and total weeks */
  const phaseStartDate = config?.phaseStartDate;
  let weekNum = null;
  let totalWeeks = null;
  let weeksRemaining = null;

  if (phaseStartDate) {
    const start = new Date(phaseStartDate);
    weekNum = Math.max(
      1,
      Math.ceil((Date.now() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)),
    );
  }
  if (phaseData?.weeks) {
    const parts = phaseData.weeks.match(/(\d+)/g);
    if (parts && parts.length >= 2) {
      totalWeeks = parseInt(parts[1]) - parseInt(parts[0]) + 1;
    }
  }
  if (weekNum != null && totalWeeks != null) {
    weeksRemaining = Math.max(0, totalWeeks - weekNum);
  }

  const [error, setError] = useState(null);

  /* Load config + latest metrics on mount */
  const init = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [configRes, metricsRes] = await Promise.all([
        loadConfig(),
        loadMetrics(),
      ]);
      setConfig(configRes.data || {});

      if (metricsRes.data) {
        const rows = Array.isArray(metricsRes.data)
          ? metricsRes.data
          : [metricsRes.data];
        const sorted = rows
          .filter((r) => r.weekOf)
          .sort((a, b) => b.weekOf.localeCompare(a.weekOf));
        if (sorted.length > 0) setLatestValues(sorted[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load control data.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  /* Alert levels for current-phase metrics */
  const metricAlerts = {};
  phaseMetrics.forEach((m) => {
    metricAlerts[m.id] = alertLevel(latestValues[m.id], m);
  });

  /* Cross-phase alerts (for kill criteria that reference other phases) */
  const allAlerts = {};
  Object.values(stageGates)
    .flat()
    .forEach((m) => {
      allAlerts[m.id] = alertLevel(latestValues[m.id], m);
    });

  /* Kill criteria status: 'triggered' | 'clear' | 'pending' */
  const killStatus = {};
  killCriteria.forEach((kc) => {
    const ids = KILL_METRIC_MAP[kc.id] || [];
    if (ids.length === 0) {
      killStatus[kc.id] = 'pending';
      return;
    }
    const hasData = ids.some(
      (id) => latestValues[id] != null && latestValues[id] !== '',
    );
    if (!hasData) {
      killStatus[kc.id] = 'pending';
      return;
    }
    killStatus[kc.id] = ids.some((id) => allAlerts[id] === 'red')
      ? 'triggered'
      : 'clear';
  });

  /* Metric grouping */
  const metricGroups = groupByCategory(phaseMetrics);

  /* Summary counts */
  const redCount = Object.values(metricAlerts).filter((l) => l === 'red').length;
  const amberCount = Object.values(metricAlerts).filter((l) => l === 'amber').length;
  const greenCount = Object.values(metricAlerts).filter((l) => l === 'green').length;

  /* Funnel: best available value per stage */
  const allMetrics = Object.values(stageGates).flat();
  const funnelValues = {};
  FUNNEL_STAGES.forEach((stage) => {
    for (const mid of stage.metricIds) {
      if (latestValues[mid] != null && latestValues[mid] !== '') {
        const def = allMetrics.find((m) => m.id === mid);
        funnelValues[stage.id] = {
          value: latestValues[mid],
          unit: def?.unit || 'count',
        };
        break;
      }
    }
  });

  /* ── Loading / error gate ── */
  if (loading) {
    return (
      <div className="view control-view">
        <h1 className="view-title">Control</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="view control-view">
        <h1 className="view-title">Control</h1>
        <EmptyState
          icon="\u26A0"
          message="Failed to load control data"
          hint={error}
          actionLabel="Retry"
          onAction={init}
          variant="error"
        />
      </div>
    );
  }

  /* ── Render ── */
  return (
    <div className="view control-view">
      {/* ── Phase Header ──────────────────── */}
      <header className="control-header">
        <div className="control-header__top">
          <h1 className="control-header__title">Control</h1>
          <span className="control-header__subtitle">
            Stage Gates &amp; Funnel
          </span>
        </div>
        <div className="control-header__phase">
          <span className="control-header__phase-label">
            {PHASE_LABELS[currentPhase]}
          </span>
          {weekNum != null && totalWeeks != null && (
            <span className="control-header__week">
              Week {weekNum} of {totalWeeks}
              {weeksRemaining != null &&
                ` \u00b7 ${weeksRemaining} week${weeksRemaining !== 1 ? 's' : ''} to exit target`}
            </span>
          )}
        </div>
        {(redCount > 0 || amberCount > 0 || greenCount > 0) && (
          <div className="control-header__summary">
            {redCount > 0 && (
              <span className="control-summary-badge control-summary-badge--red">
                {redCount} red
              </span>
            )}
            {amberCount > 0 && (
              <span className="control-summary-badge control-summary-badge--amber">
                {amberCount} amber
              </span>
            )}
            {greenCount > 0 && (
              <span className="control-summary-badge control-summary-badge--green">
                {greenCount} green
              </span>
            )}
          </div>
        )}
      </header>

      {/* ── Stage Gates ───────────────────── */}
      <section className="control-panel">
        <h2 className="control-panel__title">
          Stage Gates ({PHASE_LABELS[currentPhase].split(' \u2014 ')[0]})
        </h2>
        {metricGroups.length === 0 ? (
          <EmptyState icon="\u2205" message="No metrics defined for this phase." />
        ) : (
          metricGroups.map((group) => (
            <div key={group.category} className="control-category">
              <h3 className="control-category__label">{group.category}</h3>
              {group.metrics.map((m) => {
                const val = latestValues[m.id];
                const level = metricAlerts[m.id];
                return (
                  <div
                    key={m.id}
                    className={`control-metric control-metric--${level}`}
                  >
                    <div className="control-metric__row">
                      <div className="control-metric__info">
                        <span className="control-metric__label">{m.label}</span>
                        <span className="control-metric__target">
                          Target: {formatTarget(m.target, m.unit)}
                        </span>
                      </div>
                      <div className="control-metric__right">
                        <span className="control-metric__value">
                          {formatValue(val, m.unit)}
                        </span>
                        <span
                          className={`control-badge control-badge--${level}`}
                          title={level}
                        />
                      </div>
                    </div>
                    {(level === 'amber' || level === 'red') && (
                      <p className="control-metric__action">
                        {level === 'red' ? m.redAction : m.amberAction}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </section>

      {/* ── Kill Criteria ─────────────────── */}
      <section className="control-panel">
        <h2 className="control-panel__title">Kill Criteria</h2>
        <div className="control-kills">
          {killCriteria.map((kc) => {
            const status = killStatus[kc.id];
            return (
              <div
                key={kc.id}
                className={`control-kill control-kill--${status}`}
              >
                <div className="control-kill__header">
                  <span
                    className={`control-kill__dot control-kill__dot--${status}`}
                  >
                    {status === 'clear'
                      ? '\u2713'
                      : status === 'triggered'
                        ? '!'
                        : '\u2014'}
                  </span>
                  <h3 className="control-kill__condition">{kc.condition}</h3>
                </div>
                <p className="control-kill__signal">
                  <strong>Signal:</strong> {kc.signal}
                </p>
                <p className="control-kill__action">
                  <strong>Action:</strong> {kc.action}
                </p>
                {status === 'pending' && (
                  <span className="control-kill__pending">
                    Not yet testable
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Funnel Model ──────────────────── */}
      <section className="control-panel">
        <h2 className="control-panel__title">Funnel Model</h2>
        <div className="control-funnel">
          {FUNNEL_STAGES.map((stage, i) => (
            <div key={stage.id} className="control-funnel__step">
              <div className="control-funnel__stage">
                <span className="control-funnel__label">{stage.label}</span>
                <span className="control-funnel__value">
                  {funnelValues[stage.id]
                    ? formatValue(
                        funnelValues[stage.id].value,
                        funnelValues[stage.id].unit,
                      )
                    : '\u2014'}
                </span>
              </div>
              {i < FUNNEL_STAGES.length - 1 && (
                <span className="control-funnel__arrow">&rarr;</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
