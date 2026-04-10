import { useState, useEffect, useCallback } from 'react';
import { loadConfig, flushWriteQueue } from '../utils/dataLayer';
import { setConfig, getConfig, getWriteQueue } from '../utils/localStore';
import phaseChecklists from '../data/phaseChecklists';
import './SettingsView.css';

const PHASE_KEYS = ['phase_0', 'phase_1', 'phase_2', 'phase_3'];

export default function SettingsView() {
  /* ── connection fields ─────────────────────── */
  const [appsScriptUrl, setAppsScriptUrl] = useState('');
  const [sheetId, setSheetId] = useState('');

  /* ── phase fields ──────────────────────────── */
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseStartDate, setPhaseStartDate] = useState('');

  /* ── status ────────────────────────────────── */
  const [connectionStatus, setConnectionStatus] = useState('not-configured');
  const [queueLength, setQueueLength] = useState(0);

  /* ── transient UI state ────────────────────── */
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);   // 'success' | 'error'
  const [testMessage, setTestMessage] = useState('');
  const [isFlushing, setIsFlushing] = useState(false);
  const [flushResult, setFlushResult] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');

  /* ── load saved config on mount ────────────── */
  useEffect(() => {
    const cfg = getConfig();
    if (cfg) {
      setAppsScriptUrl(cfg.appsScriptUrl || '');
      setSheetId(cfg.sheetId || '');
      setCurrentPhase(cfg.currentPhase ?? 0);
      setPhaseStartDate(cfg.phaseStartDate || '');
      if (cfg.appsScriptUrl) {
        setConnectionStatus('disconnected'); // configured but unverified
      }
    }
    setQueueLength(getWriteQueue().length);
  }, []);

  /* ── test connection ───────────────────────── */
  const handleTestConnection = useCallback(async () => {
    if (!appsScriptUrl || !sheetId) {
      setTestResult('error');
      setTestMessage('Enter both Apps Script URL and Sheet ID first');
      return;
    }

    // Persist URL + sheetId so sheetsApi.getConnection() can read them
    const cfg = getConfig() || {};
    setConfig({ ...cfg, appsScriptUrl, sheetId });

    setIsTesting(true);
    setTestResult(null);
    setTestMessage('');

    try {
      const result = await loadConfig();
      if (result.source === 'remote') {
        setTestResult('success');
        setTestMessage('Connected successfully');
        setConnectionStatus('connected');
      } else {
        setTestResult('error');
        setTestMessage('Could not reach sheet — check URL and permissions');
        setConnectionStatus('disconnected');
      }
    } catch {
      setTestResult('error');
      setTestMessage('Connection failed — check URL and try again');
      setConnectionStatus('disconnected');
    } finally {
      setIsTesting(false);
    }
  }, [appsScriptUrl, sheetId]);

  /* ── save all settings ─────────────────────── */
  const handleSave = useCallback(() => {
    setConfig({ appsScriptUrl, sheetId, currentPhase, phaseStartDate });
    setSaveMessage('Settings saved');
    setTimeout(() => setSaveMessage(''), 2000);
  }, [appsScriptUrl, sheetId, currentPhase, phaseStartDate]);

  /* ── flush write queue ─────────────────────── */
  const handleFlush = useCallback(async () => {
    setIsFlushing(true);
    setFlushResult(null);
    try {
      const result = await flushWriteQueue();
      setFlushResult(result);
      setQueueLength(getWriteQueue().length);
    } catch {
      setFlushResult({ flushed: 0, failed: queueLength });
    } finally {
      setIsFlushing(false);
    }
  }, [queueLength]);

  /* ── derived ───────────────────────────────── */
  const phaseKey = PHASE_KEYS[currentPhase];
  const phase = phaseChecklists[phaseKey];

  const statusLabel =
    connectionStatus === 'connected'    ? 'Connected'
    : connectionStatus === 'disconnected' ? 'Disconnected'
    : 'Not configured';

  const statusClass =
    connectionStatus === 'connected'    ? 'status--green'
    : connectionStatus === 'disconnected' ? 'status--red'
    : 'status--muted';

  /* ── render ────────────────────────────────── */
  return (
    <div className="view settings-view">
      <h1 className="view-title">Settings</h1>

      {/* ── Connection ──────────────────────── */}
      <section className="settings-card">
        <h2 className="settings-card__title">Google Sheet Connection</h2>

        <label className="settings-field">
          <span className="settings-field__label">Apps Script URL</span>
          <input
            type="url"
            className="settings-field__input"
            placeholder="https://script.google.com/macros/s/.../exec"
            value={appsScriptUrl}
            onChange={(e) => setAppsScriptUrl(e.target.value)}
          />
        </label>

        <label className="settings-field">
          <span className="settings-field__label">Sheet ID</span>
          <input
            type="text"
            className="settings-field__input"
            placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
            value={sheetId}
            onChange={(e) => setSheetId(e.target.value)}
          />
        </label>

        <div className="settings-card__actions">
          <button
            className="btn btn--outline"
            onClick={handleTestConnection}
            disabled={isTesting}
          >
            {isTesting ? 'Testing\u2026' : 'Test Connection'}
          </button>
          <button className="btn btn--primary" onClick={handleSave}>
            Save
          </button>
          {testResult && (
            <span
              className={`settings-toast ${
                testResult === 'success'
                  ? 'settings-toast--success'
                  : 'settings-toast--error'
              }`}
            >
              {testMessage}
            </span>
          )}
          {saveMessage && (
            <span className="settings-toast settings-toast--success">
              {saveMessage}
            </span>
          )}
        </div>
      </section>

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
      </section>

      {/* ── Status ──────────────────────────── */}
      <section className="settings-card">
        <h2 className="settings-card__title">Status</h2>

        <div className="settings-status-grid">
          <div className="settings-status-item">
            <span className="settings-status-item__label">Connection</span>
            <span className={`settings-status-item__value ${statusClass}`}>
              {statusLabel}
            </span>
          </div>

          <div className="settings-status-item">
            <span className="settings-status-item__label">Write queue</span>
            <span className="settings-status-item__value">
              {queueLength} pending
            </span>
          </div>
        </div>

        {queueLength > 0 && (
          <div className="settings-card__actions">
            <button
              className="btn btn--outline"
              onClick={handleFlush}
              disabled={isFlushing || connectionStatus !== 'connected'}
            >
              {isFlushing ? 'Flushing\u2026' : 'Flush Queue'}
            </button>
            {flushResult && (
              <span className="settings-toast">
                {flushResult.flushed} flushed, {flushResult.failed} failed
              </span>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
