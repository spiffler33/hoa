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
    setSaveMessage('Settings saved');
    setTimeout(() => setSaveMessage(''), 2000);
  }, [currentPhase, phaseStartDate, githubToken]);

  /* ── github sync handlers ──────────────────── */
  const handleSyncTo = useCallback(async () => {
    const token = githubToken || getConfig()?.githubToken;
    if (!token) {
      setSyncMessage({ text: 'Enter a GitHub token first', type: 'error' });
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
      setSyncMessage({ text: 'Enter a GitHub token first', type: 'error' });
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
      <h1 className="view-title">Settings</h1>

      {/* ── Phase ───────────────────────────── */}
      <section className="settings-card">
        <h2 className="settings-card__title">Current Phase</h2>

        <div className="settings-row">
          <label className="settings-field settings-field--half">
            <span className="settings-field__label">Phase</span>
            <select
              className="settings-field__input"
              value={currentPhase}
              onChange={(e) => setCurrentPhase(Number(e.target.value))}
            >
              {PHASE_KEYS.map((key, i) => (
                <option key={key} value={i}>
                  Phase {i} — Weeks {phaseChecklists[key].weeks}
                </option>
              ))}
            </select>
          </label>

          <label className="settings-field settings-field--half">
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
          <div className="settings-phase-desc">
            <p className="settings-phase-desc__objective">{phase.objective}</p>
            {phase.exitCriteria.length > 0 && (
              <details className="settings-phase-desc__details">
                <summary>
                  Exit criteria ({phase.exitCriteria.length})
                </summary>
                <ul className="settings-phase-desc__list">
                  {phase.exitCriteria.map((c) => (
                    <li key={c.id}>{c.item}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

        <div className="settings-card__actions">
          <button className="btn btn--primary" onClick={handleSave}>
            Save
          </button>
          {saveMessage && (
            <span className="settings-toast settings-toast--success">
              {saveMessage}
            </span>
          )}
        </div>
      </section>

      {/* ── GitHub Sync ─────────────────────── */}
      <section className="settings-card">
        <h2 className="settings-card__title">GitHub Sync</h2>

        <label className="settings-field">
          <span className="settings-field__label">
            Personal Access Token
          </span>
          <input
            type="password"
            className="settings-field__input"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
          />
          <span className="settings-field__hint">
            Needs repo scope. Stored locally only.
          </span>
        </label>

        <div className="settings-card__actions">
          <button
            className="btn btn--primary"
            onClick={handleSyncTo}
            disabled={syncing}
          >
            {syncing ? 'Syncing\u2026' : 'Sync to GitHub'}
          </button>
          <button
            className="btn btn--outline"
            onClick={handleSyncFrom}
            disabled={syncing}
          >
            Load from GitHub
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
