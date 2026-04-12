import { useState } from 'react';
import { useAuth } from '../lib/authContext';

export default function SignInScreen() {
  const { sendCode, verifyCode } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'code'
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setError('');
    try {
      await sendCode(email.trim());
      setStep('code');
    } catch (err) {
      setError(err.message || 'Failed to send code.');
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    setError('');
    try {
      await verifyCode(email.trim(), code.trim());
    } catch (err) {
      setError(err.message || 'Invalid code.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="signin">
      <div className="signin__card">
        <h1 className="signin__title">GTM</h1>
        <p className="signin__subtitle">Yes Lifers operating cockpit</p>

        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="signin__form">
            <label className="signin__label">
              <span className="signin__label-text">Email</span>
              <input
                className="signin__input"
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={busy}
              />
            </label>
            {error && <p className="signin__error">{error}</p>}
            <button
              className="signin__btn"
              type="submit"
              disabled={busy || !email.trim()}
            >
              {busy ? 'Sending...' : 'Send code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="signin__form">
            <p className="signin__hint">
              Code sent to <strong>{email}</strong>
            </p>
            <label className="signin__label">
              <span className="signin__label-text">6-digit code</span>
              <input
                className="signin__input signin__input--code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                maxLength={8}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="00000000"
                disabled={busy}
              />
            </label>
            {error && <p className="signin__error">{error}</p>}
            <button
              className="signin__btn"
              type="submit"
              disabled={busy || code.length < 6}
            >
              {busy ? 'Verifying...' : 'Verify'}
            </button>
            <button
              type="button"
              className="signin__link"
              onClick={() => {
                setStep('email');
                setCode('');
                setError('');
              }}
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
