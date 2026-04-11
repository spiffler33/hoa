import { useState, useEffect, useCallback } from 'react';
import { setConfig, getConfig } from '../utils/localStore';
import { syncToGitHub, syncFromGitHub } from '../utils/githubSync';
import phaseChecklists from '../data/phaseChecklists';
import './SettingsView.css';

const PHASE_KEYS = ['phase_0', 'phase_1', 'phase_2', 'phase_3'];

export default function SettingsView() {
  /* ── phase fields ──────────────────────────── */
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseStartDate, setPhaseStartDate] = useState('');

  /* ── github sync fields ────────────────────── */
  const [githubToken, setGithubToken] = useState('');

  /* ── transient UI state ────────────────────── */
  const [saveMessage, setSaveMessage] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null); // { text, type }

  /* ── load saved config on mount ────────────── */
  useEffect(() => {
    const cfg = getConfig();
    if (cfg) {
      setCurrentPhase(cfg.currentPhase ?? 0);
      setPhaseStartDate(cfg.phaseStartDate || '');
      setGithubToken(cfg.githubToken || '');
    }
  }, []);

  /* ── save settings ─────────────────────────── */
  const handleSave = useCallback(() => {
    const cfg = getConfig() || {};
    setConfig({ ...cfg, currentPhase, phaseStartDate, githubToken });
    setSaveMessage('Saved');
    setTimeout(() => setSaveMessage(''), 2000);
  }, [currentPhase, phaseStartDate, githubToken]);

  /* ── github sync handlers ──────────────────── */
  const handleSyncTo = useCallback(async () => {
    const token = githubToken || getConfig()?.githubToken;
    if (!token) {
      setSyncMessage({ text: 'Token required', type: 'error' });
      return;
    }
    setSyncing(true);
    setSyncMessage(null);
    try {
      const result = await syncToGitHub(token);
      setSyncMessage({ text: result.message, type: 'success' });
    } catch (err) {
      setSyncMessage({ text: err.message, type: 'error' });
    } finally {
      setSyncing(false);
    }
  }, [githubToken]);

  const handleSyncFrom = useCallback(async () => {
    const token = githubToken || getConfig()?.githubToken;
    if (!token) {
      setSyncMessage({ text: 'Token required', type: 'error' });
      return;
    }
    setSyncing(true);
    setSyncMessage(null);
    try {
      const result = await syncFromGitHub(token);
      setSyncMessage({ text: result.message, type: 'success' });
    } catch (err) {
      setSyncMessage({ text: err.message, type: 'error' });
    } finally {
      setSyncing(false);
    }
  }, [githubToken]);

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
          Local storage <span className="settings-banner__sep">·</span>{' '}
          sync to GitHub on demand
        </p>
      </header>

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
                    Phase {i} \u2014 Weeks {phaseChecklists[key].weeks}
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
            <span className="settings-toast settings-toast--success">
              {saveMessage}
            </span>
          )}
        </div>
      </section>

      {/* ── GitHub Sync ─────────────────────────── */}
      <section className="settings-section">
        <h2 className="settings-section__heading">
          <span>GitHub sync</span>
        </h2>

        <label className="settings-field">
          <span className="settings-field__label">Personal access token</span>
          <input
            type="password"
            className="settings-field__input"
            placeholder="ghp_\u2026"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
          />
          <span className="settings-field__hint">
            Repo scope. Stored locally only.
          </span>
        </label>

        <div className="settings-actions">
          <button
            type="button"
            className="settings-btn settings-btn--primary"
            onClick={handleSyncTo}
            disabled={syncing}
          >
            {syncing ? 'Syncing\u2026' : 'Push to GitHub'}
          </button>
          <button
            type="button"
            className="settings-btn"
            onClick={handleSyncFrom}
            disabled={syncing}
          >
            Pull from GitHub
          </button>
          {syncMessage && (
            <span
              className={`settings-toast ${
                syncMessage.type === 'success'
                  ? 'settings-toast--success'
                  : 'settings-toast--error'
              }`}
            >
              {syncMessage.text}
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
