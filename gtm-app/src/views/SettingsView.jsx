import { useState, useEffect, useCallback } from 'react';
import { loadConfig, saveConfig } from '../utils/dataLayer';
import { useAuth } from '../lib/authContext';
import phaseChecklists from '../data/phaseChecklists';
import './SettingsView.css';

const PHASE_KEYS = ['phase_0', 'phase_1', 'phase_2', 'phase_3'];

export default function SettingsView() {
  const { user, signOut } = useAuth();

  /* ── phase fields ──────────────────────────── */
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseStartDate, setPhaseStartDate] = useState('');

  /* ── transient UI state ────────────────────── */
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState(null);

  /* ── load saved config on mount ────────────── */
  useEffect(() => {
    async function init() {
      try {
        const { data: cfg } = await loadConfig();
        if (cfg) {
          setCurrentPhase(cfg.currentPhase ?? 0);
          setPhaseStartDate(cfg.phaseStartDate || '');
        }
      } catch (err) {
        setError(err.message || 'Failed to load settings.');
      }
    }
    init();
  }, []);

  /* ── save settings ─────────────────────────── */
  const handleSave = useCallback(async () => {
    try {
      await saveConfig({ currentPhase, phaseStartDate });
      setSaveMessage('Saved');
      setTimeout(() => setSaveMessage(''), 2000);
    } catch (err) {
      setSaveMessage('Save failed: ' + (err.message || 'Unknown error'));
    }
  }, [currentPhase, phaseStartDate]);

  /* ── derived ───────────────────────────────── */
  const phaseKey = PHASE_KEYS[currentPhase];
  const phase = phaseChecklists[phaseKey];

  /* ── render ────────────────────────────────── */
  return (
    <div className="view settings-view">
      {/* ── Banner ──────────────────────────────── */}
      <header className="settings-section settings-banner">
        <p className="settings-banner__title">Settings</p>
        <p className="settings-banner__meta">
          Synced to Supabase
        </p>
      </header>

      {error && (
        <div className="settings-section">
          <p className="settings-toast settings-toast--error">{error}</p>
        </div>
      )}

      {/* ── Phase ───────────────────────────────── */}
      <section className="settings-section">
        <h2 className="settings-section__heading">
          <span>Current phase</span>
        </h2>

        <div className="settings-form-grid">
          <label className="settings-field">
            <span className="settings-field__label">Phase</span>
            <span className="settings-field__select-wrap">
              <select
                className="settings-field__input"
                value={currentPhase}
                onChange={(e) => setCurrentPhase(Number(e.target.value))}
              >
                {PHASE_KEYS.map((key, i) => (
                  <option key={key} value={i}>
                    Phase {i} {'\u2014'} Weeks {phaseChecklists[key].weeks}
                  </option>
                ))}
              </select>
            </span>
          </label>

          <label className="settings-field">
            <span className="settings-field__label">Phase start date</span>
            <input
              type="date"
              className="settings-field__input"
              value={phaseStartDate}
              onChange={(e) => setPhaseStartDate(e.target.value)}
            />
          </label>
        </div>

        {phase && (
          <div className="settings-phase-panel">
            <p className="settings-phase-panel__objective">{phase.objective}</p>
            {phase.exitCriteria.length > 0 && (
              <details className="settings-phase-panel__details">
                <summary className="settings-phase-panel__summary">
                  Exit criteria ({phase.exitCriteria.length})
                </summary>
                <ul className="settings-phase-panel__list">
                  {phase.exitCriteria.map((c) => (
                    <li key={c.id}>{c.item}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

        <div className="settings-actions">
          <button
            type="button"
            className="settings-btn settings-btn--primary"
            onClick={handleSave}
          >
            Save
          </button>
          {saveMessage && (
            <span className={`settings-toast ${saveMessage.startsWith('Save failed') ? 'settings-toast--error' : 'settings-toast--success'}`}>
              {saveMessage}
            </span>
          )}
        </div>
      </section>

      {/* ── Account ─────────────────────────────── */}
      <section className="settings-section">
        <h2 className="settings-section__heading">
          <span>Account</span>
        </h2>
        <p className="settings-field__hint" style={{ marginBottom: '12px' }}>
          {user?.email}
        </p>
        <button
          type="button"
          className="settings-btn"
          onClick={signOut}
        >
          Sign out
        </button>
      </section>
    </div>
  );
}
