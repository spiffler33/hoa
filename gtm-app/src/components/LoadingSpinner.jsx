import './LoadingSpinner.css';

export default function LoadingSpinner({ label = 'Loading\u2026' }) {
  return (
    <div className="loading-spinner">
      <div className="loading-spinner__ring" />
      {label && <span className="loading-spinner__label">{label}</span>}
    </div>
  );
}
