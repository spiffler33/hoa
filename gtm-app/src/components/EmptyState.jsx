import './EmptyState.css';

export default function EmptyState({
  icon = '\u2205',
  message,
  hint,
  actionLabel,
  onAction,
  variant,
}) {
  return (
    <div className={`empty-state${variant ? ` empty-state--${variant}` : ''}`}>
      <span className="empty-state__icon">{icon}</span>
      <p className="empty-state__message">{message}</p>
      {hint && <p className="empty-state__hint">{hint}</p>}
      {actionLabel && onAction && (
        <button
          className="btn btn--outline empty-state__action"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
