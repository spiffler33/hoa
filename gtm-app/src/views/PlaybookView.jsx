import { useState, useEffect } from 'react';
import phaseChecklists from '../data/phaseChecklists';
import { loadPhaseChecklist, saveChecklistEntry, saveConfig } from '../utils/dataLayer';
import { getConfig, setConfig } from '../utils/localStore';
import './PlaybookView.css';

const PHASE_KEYS = ['phase_0', 'phase_1', 'phase_2', 'phase_3'];
const PHASE_NAMES = ['Foundation', 'Community Build', 'App Launch', 'Scale'];

export default function PlaybookView() {
  const [activePhase, setActivePhase] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [advanceMsg, setAdvanceMsg] = useState('');

  /* ── load config + saved checklist state ────── */
  useEffect(() => {
    async function init() {
      const cfg = getConfig();
      if (cfg?.currentPhase !== undefined) {
        setActivePhase(Number(cfg.currentPhase));
      }

      const { data } = await loadPhaseChecklist();
      if (data && Array.isArray(data)) {
        const map = {};
        data.forEach((row) => {
          if (row.id) map[row.id] = !!row.completed;
        });
        setCheckedItems(map);
      }
      setLoading(false);
    }
    init();
  }, []);

  const phaseKey = PHASE_KEYS[activePhase];
  const phase = phaseChecklists[phaseKey];

  /* ── checkbox toggle ────────────────────────── */
  const handleCheck = async (id, type, itemText) => {
    const newVal = !checkedItems[id];
    setCheckedItems((prev) => ({ ...prev, [id]: newVal }));

    await saveChecklistEntry({
      id,
      phase: phaseKey,
      type,
      item: itemText,
      completed: newVal,
      completed_date: newVal ? new Date().toISOString().slice(0, 10) : '',
    });
  };

  /* ── progress counts ────────────────────────── */
  const exitTotal = phase.exitCriteria.length;
  const exitDone = phase.exitCriteria.filter((ec) => checkedItems[ec.id]).length;
  const progressPct = exitTotal > 0 ? Math.round((exitDone / exitTotal) * 100) : 0;
  const allExitMet = exitTotal > 0 && exitDone === exitTotal;

  /* ── advance to next phase ──────────────────── */
  const handleAdvance = async () => {
    if (activePhase >= 3 || !allExitMet) return;
    const next = activePhase + 1;
    const cfg = getConfig() || {};
    cfg.currentPhase = next;
    setConfig(cfg);
    await saveConfig(cfg);
    setActivePhase(next);
    setAdvanceMsg(`Advanced to Phase ${next} — ${PHASE_NAMES[next]}`);
    setTimeout(() => setAdvanceMsg(''), 3000);
  };

  if (loading) {
    return (
      <div className="view">
        <h1 className="view-title">Playbook</h1>
        <p className="view-placeholder">Loading…</p>
      </div>
    );
  }

  return (
    <div className="view playbook-view">
      <h1 className="view-title">Playbook</h1>

      {/* ── Phase Tab Bar ── */}
      <div className="playbook-tabs">
        {PHASE_KEYS.map((key, i) => {
          const p = phaseChecklists[key];
          const isCurrent = i === activePhase;
          return (
            <button
              key={key}
              className={`playbook-tab ${isCurrent ? 'playbook-tab--active' : ''}`}
              onClick={() => setActivePhase(i)}
            >
              <span className={`playbook-tab__dot ${isCurrent ? 'dot--active' : ''}`} />
              <span className="playbook-tab__label">Phase {i}</span>
              <span className="playbook-tab__weeks">Wk {p.weeks}</span>
            </button>
          );
        })}
      </div>

      {/* ── Phase Header ── */}
      <div className="playbook-card playbook-header">
        <h2 className="playbook-header__title">
          Phase {activePhase} — {PHASE_NAMES[activePhase]}{' '}
          <span className="playbook-header__weeks">(Weeks {phase.weeks})</span>
        </h2>
        <p className="playbook-header__objective">{phase.objective}</p>
      </div>

      {/* ── Progress Bar ── */}
      <div className="playbook-card playbook-progress">
        <div className="playbook-progress__header">
          <span className="playbook-card__title">Progress</span>
          <span className="playbook-progress__count">
            {exitDone}/{exitTotal} exit criteria met
          </span>
        </div>
        <div className="playbook-progress__bar">
          <div
            className="playbook-progress__fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="playbook-progress__pct">{progressPct}%</span>
      </div>

      {/* ── Infrastructure Checklist ── */}
      {phase.infrastructure.length > 0 && (
        <div className="playbook-card">
          <h3 className="playbook-card__title">Infrastructure Checklist</h3>
          <ul className="playbook-checklist">
            {phase.infrastructure.map((item) => {
              const done = !!checkedItems[item.id];
              return (
                <li key={item.id} className="playbook-checklist__item">
                  <label className="playbook-checklist__label">
                    <input
                      type="checkbox"
                      className="playbook-checklist__cb"
                      checked={done}
                      onChange={() =>
                        handleCheck(item.id, 'infrastructure', item.item)
                      }
                    />
                    <span
                      className={`playbook-checklist__text ${done ? 'playbook-checklist__text--done' : ''}`}
                    >
                      {item.item}
                    </span>
                  </label>
                  {item.notes && (
                    <span className="playbook-checklist__note">{item.notes}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ── Week-by-Week Breakdown ── */}
      {phase.weekByWeek && phase.weekByWeek.length > 0 && (
        <div className="playbook-card">
          <h3 className="playbook-card__title">Week-by-Week Tasks</h3>
          <div className="playbook-weeks">
            {phase.weekByWeek.map((wk) => (
              <WeekCard key={wk.week} week={wk} />
            ))}
          </div>
        </div>
      )}

      {/* ── Exit Criteria ── */}
      <div className="playbook-card">
        <h3 className="playbook-card__title">Exit Criteria</h3>
        <ul className="playbook-checklist">
          {phase.exitCriteria.map((ec) => {
            const done = !!checkedItems[ec.id];
            return (
              <li key={ec.id} className="playbook-checklist__item">
                <label className="playbook-checklist__label">
                  <span
                    className={`playbook-exit__dot ${done ? 'dot--green' : 'dot--none'}`}
                  />
                  <input
                    type="checkbox"
                    className="playbook-checklist__cb"
                    checked={done}
                    onChange={() =>
                      handleCheck(ec.id, 'exit_criteria', ec.item)
                    }
                  />
                  <span
                    className={`playbook-checklist__text ${done ? 'playbook-checklist__text--done' : ''}`}
                  >
                    {ec.item}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        {/* Advance button */}
        {activePhase < 3 && (
          <div className="playbook-advance">
            <button
              className={`btn btn--primary playbook-advance__btn ${!allExitMet ? 'playbook-advance__btn--disabled' : ''}`}
              disabled={!allExitMet}
              onClick={handleAdvance}
            >
              {allExitMet
                ? `All exit criteria met → Advance to Phase ${activePhase + 1}`
                : `${exitDone}/${exitTotal} criteria met — complete all to advance`}
            </button>
            {advanceMsg && (
              <span className="settings-toast settings-toast--success">
                {advanceMsg}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Week Card (collapsible) ── */

function WeekCard({ week }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="playbook-week">
      <button
        className="playbook-week__header"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="playbook-week__chevron">{open ? '▾' : '▸'}</span>
        <span className="playbook-week__title">
          Week {week.week} — {week.title}
        </span>
      </button>

      {open && (
        <ul className="playbook-week__tasks">
          {week.tasks.map((t, i) => (
            <li key={i} className="playbook-week__task">
              <span className="playbook-week__day">{t.day}</span>
              <span className="playbook-week__task-text">{t.task}</span>
              {t.owner && (
                <span className="playbook-week__owner">{t.owner}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
