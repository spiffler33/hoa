import { useState, useEffect, useCallback } from 'react';
import phaseChecklists from '../data/phaseChecklists';
import { loadPhaseChecklist, saveChecklistEntry, saveConfig, loadConfig } from '../utils/dataLayer';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import './PlaybookView.css';

const PHASE_KEYS = ['phase_0', 'phase_1', 'phase_2', 'phase_3'];
const PHASE_NAMES = ['Foundation', 'Community Build', 'App Launch', 'Scale'];

export default function PlaybookView() {
  const [activePhase, setActivePhase] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [advanceMsg, setAdvanceMsg] = useState('');
  const [error, setError] = useState(null);

  /* ── load config + saved checklist state ────── */
  const init = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: cfg } = await loadConfig();
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
    } catch (err) {
      setError(err.message || 'Failed to load checklist data.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    init();
  }, [init]);

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
    await saveConfig({ currentPhase: next });
    setActivePhase(next);
    setAdvanceMsg(`Advanced to Phase ${next} — ${PHASE_NAMES[next]}`);
    setTimeout(() => setAdvanceMsg(''), 3000);
  };

  if (loading) {
    return (
      <div className="view">
        <h1 className="view-title">Playbook</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="view">
        <h1 className="view-title">Playbook</h1>
        <EmptyState
          icon={'\u26A0'}
          message="Failed to load checklist data"
          hint={error}
          actionLabel="Retry"
          onAction={init}
          variant="error"
        />
      </div>
    );
  }

  return (
    <div className="view playbook-view">
      {/* ── Phase tabs ──────────────────────────── */}
      <nav className="playbook-tabs" aria-label="Phase selector">
        {PHASE_KEYS.map((key, i) => {
          const p = phaseChecklists[key];
          const isCurrent = i === activePhase;
          return (
            <button
              key={key}
              type="button"
              className={`playbook-tab${isCurrent ? ' playbook-tab--active' : ''}`}
              onClick={() => setActivePhase(i)}
              aria-current={isCurrent ? 'page' : undefined}
            >
              <span className="playbook-tab__label">Phase {i}</span>
              <span className="playbook-tab__weeks">WK {p.weeks}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Banner: phase title + objective ─────── */}
      <header className="playbook-section playbook-banner">
        <h1 className="playbook-banner__title">
          Phase {activePhase} — {PHASE_NAMES[activePhase]}{' '}
          <span className="playbook-banner__weeks">WK {phase.weeks}</span>
        </h1>
        <p className="playbook-banner__objective">{phase.objective}</p>
      </header>

      {/* ── Progress ────────────────────────────── */}
      <section className="playbook-section">
        <h2 className="playbook-section__heading">
          <span>Progress</span>
          <span className="playbook-section__heading-meta">
            <span
              className={
                allExitMet
                  ? 'playbook-section__heading-meta--done'
                  : undefined
              }
            >
              {exitDone}/{exitTotal} met &middot; {progressPct}%
            </span>
          </span>
        </h2>
        <div className="playbook-progress__track" aria-hidden="true">
          <div
            className="playbook-progress__fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </section>

      {/* ── Infrastructure ──────────────────────── */}
      {phase.infrastructure.length > 0 && (
        <section className="playbook-section">
          <h2 className="playbook-section__heading">
            <span>Infrastructure</span>
            <span className="playbook-section__heading-meta">
              {phase.infrastructure.filter((it) => checkedItems[it.id]).length}
              /{phase.infrastructure.length}
            </span>
          </h2>
          <ul className="playbook-checklist">
            {phase.infrastructure.map((item) => {
              const done = !!checkedItems[item.id];
              return (
                <li key={item.id} className="playbook-checklist__item">
                  <label className="playbook-checklist__label">
                    <input
                      type="checkbox"
                      className="playbook-checklist__cb-native"
                      checked={done}
                      onChange={() =>
                        handleCheck(item.id, 'infrastructure', item.item)
                      }
                    />
                    <span
                      className="playbook-checklist__cb-text"
                      aria-hidden="true"
                    >
                      {done ? '[x]' : '[ ]'}
                    </span>
                    <span
                      className={
                        done
                          ? 'playbook-checklist__text playbook-checklist__text--done'
                          : 'playbook-checklist__text'
                      }
                    >
                      {item.item}
                    </span>
                    <span
                      className="playbook-checklist__leader"
                      aria-hidden="true"
                    />
                    {item.notes && (
                      <span className="playbook-checklist__note">
                        {item.notes}
                      </span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* ── Week-by-week ────────────────────────── */}
      {phase.weekByWeek && phase.weekByWeek.length > 0 && (
        <section className="playbook-section">
          <h2 className="playbook-section__heading">
            <span>Week-by-week</span>
            <span className="playbook-section__heading-meta">
              {phase.weekByWeek.length} weeks
            </span>
          </h2>
          <ul className="playbook-weeks">
            {phase.weekByWeek.map((wk) => (
              <WeekCard key={wk.week} week={wk} />
            ))}
          </ul>
        </section>
      )}

      {/* ── Exit criteria ───────────────────────── */}
      <section className="playbook-section">
        <h2 className="playbook-section__heading">
          <span>Exit criteria</span>
          <span className="playbook-section__heading-meta">
            <span
              className={
                allExitMet
                  ? 'playbook-section__heading-meta--done'
                  : undefined
              }
            >
              {exitDone}/{exitTotal}
            </span>
          </span>
        </h2>
        <ul className="playbook-checklist">
          {phase.exitCriteria.map((ec) => {
            const done = !!checkedItems[ec.id];
            return (
              <li key={ec.id} className="playbook-checklist__item">
                <label className="playbook-checklist__label">
                  <input
                    type="checkbox"
                    className="playbook-checklist__cb-native"
                    checked={done}
                    onChange={() =>
                      handleCheck(ec.id, 'exit_criteria', ec.item)
                    }
                  />
                  <span
                    className="playbook-checklist__cb-text"
                    aria-hidden="true"
                  >
                    {done ? '[x]' : '[ ]'}
                  </span>
                  <span
                    className={
                      done
                        ? 'playbook-checklist__text playbook-checklist__text--done'
                        : 'playbook-checklist__text'
                    }
                  >
                    {ec.item}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        {activePhase < 3 && (
          <div className="playbook-advance">
            <button
              type="button"
              className="playbook-advance__btn"
              disabled={!allExitMet}
              onClick={handleAdvance}
            >
              {allExitMet
                ? `Advance to Phase ${activePhase + 1} \u2192`
                : `${exitDone}/${exitTotal} criteria \u2014 complete all to advance`}
            </button>
            {advanceMsg && (
              <span className="playbook-msg playbook-msg--success">
                {advanceMsg}
              </span>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

/* ── Week Card (collapsible) ── */

function WeekCard({ week }) {
  const [open, setOpen] = useState(true);

  return (
    <li className="playbook-week">
      <button
        type="button"
        className="playbook-week__header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="playbook-week__chevron" aria-hidden="true">
          {open ? '\u25BE' : '\u25B8'}
        </span>
        <span className="playbook-week__title">
          Week {week.week} &mdash; {week.title}
        </span>
      </button>

      {open && (
        <ul className="playbook-week__tasks">
          {week.tasks.map((t, i) => (
            <li key={i} className="playbook-week__task">
              <span className="playbook-week__day">{t.day}</span>
              <span className="playbook-week__task-text">{t.task}</span>
              <span className="playbook-week__leader" aria-hidden="true" />
              {t.owner && (
                <span className="playbook-week__owner">{t.owner}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
