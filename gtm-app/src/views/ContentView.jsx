import { useState, useEffect, useCallback } from 'react';
import { loadContentCalendar, saveContentEntry } from '../utils/dataLayer';
import contentBriefs from '../data/contentBriefs';
import './ContentView.css';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const STATUSES = ['planned', 'drafted', 'in_review', 'approved', 'published', 'skipped'];
const CHANNELS = ['linkedin', 'instagram', 'email', 'community'];

const CHANNEL_LABELS = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  email: 'Email',
  community: 'Community',
};

const CHANNEL_COLORS = {
  linkedin: '#0A66C2',
  instagram: '#E4405F',
  email: '#14B8A6',
  community: '#8B5CF6',
};

/* ── helpers ─────────────────────────────────── */

/** Get Monday of the week containing `date`. */
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Format date as "Apr 7". */
function formatShort(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Format date as "Apr 7, 2026". */
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** YYYY-MM-DD string for a Date object. */
function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Get the 7 days (Mon–Sun) for a given Monday. */
function getWeekDays(monday) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
}

/** Check if two dates fall in the same Mon–Sun week. */
function isSameWeek(a, b) {
  return toISO(getMonday(a)) === toISO(getMonday(b));
}

/** Normalize a status string for comparison. */
function norm(s) {
  return (s || '').toLowerCase().replace(/ /g, '_');
}

/** Look up the content brief for a channel + post type. */
function findBrief(channel, postType) {
  const ch = contentBriefs[(channel || '').toLowerCase()];
  if (!ch) return null;
  const pt = (postType || '').toLowerCase();
  return ch.formats.find((f) => f.type.toLowerCase() === pt) || null;
}

/** Get post type options for a given channel. */
function getPostTypes(channel) {
  const ch = contentBriefs[(channel || '').toLowerCase()];
  if (!ch) return [];
  return ch.formats.map((f) => f.type);
}

/** Format a camelCase post type for display: "sayYesMoment" → "Say Yes Moment". */
function formatPostType(type) {
  return (type || '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

/** Find the next empty day in the viewed week (from today forward, then from Mon). */
function getNextEmptyDay(weekDays, itemsByDate) {
  const today = toISO(new Date());
  for (const d of weekDays) {
    const iso = toISO(d);
    if (iso >= today && (!itemsByDate[iso] || itemsByDate[iso].length === 0)) {
      return iso;
    }
  }
  for (const d of weekDays) {
    const iso = toISO(d);
    if (!itemsByDate[iso] || itemsByDate[iso].length === 0) {
      return iso;
    }
  }
  return toISO(weekDays[0]);
}

/* ── Brief Modal ────────────────────────────── */

function BriefModal({ item, onClose }) {
  const channel = (item.channel || '').toLowerCase();
  const postType = item.post_type || item.postType || '';
  const brief = findBrief(channel, postType);
  const channelLabel = CHANNEL_LABELS[channel] || item.channel;
  const channelData = contentBriefs[channel];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="content-modal-overlay" onClick={onClose}>
      <div className="content-modal" onClick={(e) => e.stopPropagation()}>
        <header className="content-modal__header">
          <div className="content-modal__header-left">
            <span
              className="content-item__channel"
              style={{
                background: CHANNEL_COLORS[channel] || 'var(--text-muted)',
              }}
            >
              {channelLabel}
            </span>
            <h2 className="content-modal__title">
              {formatPostType(postType)} Brief
            </h2>
          </div>
          <button className="content-modal__close" onClick={onClose}>
            ✕
          </button>
        </header>

        {!brief ? (
          <div className="content-modal__body">
            <p className="content-modal__empty">
              No brief template found for this channel / type combination.
            </p>
          </div>
        ) : (
          <div className="content-modal__body">
            {/* Meta tags */}
            <div className="brief-meta">
              {brief.day && (
                <span className="brief-meta__tag">Day: {brief.day}</span>
              )}
              <span className="brief-meta__tag">
                Frequency: {brief.frequency}
              </span>
            </div>

            {/* Purpose */}
            <section className="brief-section">
              <h3 className="brief-section__label">Purpose</h3>
              <p>{brief.purpose}</p>
            </section>

            {/* Tone */}
            {brief.tone && (
              <section className="brief-section">
                <h3 className="brief-section__label">Tone</h3>
                <p>{brief.tone}</p>
              </section>
            )}

            {/* Structure */}
            {brief.structure?.length > 0 && (
              <section className="brief-section">
                <h3 className="brief-section__label">Structure</h3>
                <ol className="brief-structure">
                  {brief.structure.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </section>
            )}

            {/* Brief Template */}
            {brief.briefTemplate && (
              <section className="brief-section">
                <h3 className="brief-section__label">Template</h3>
                <dl className="brief-template">
                  {Object.entries(brief.briefTemplate).map(([key, val]) => (
                    <div key={key} className="brief-template__row">
                      <dt>{key.replace(/_/g, ' ')}</dt>
                      <dd>{val}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {/* Example posts (LinkedIn only) */}
            {channel === 'linkedin' && channelData?.examplePosts && (
              <section className="brief-section">
                <h3 className="brief-section__label">Example Copy</h3>
                {channelData.examplePosts.map((post, i) => (
                  <blockquote key={i} className="brief-example">
                    {post}
                  </blockquote>
                ))}
              </section>
            )}

            {/* Engagement examples (LinkedIn engagement type) */}
            {channel === 'linkedin' &&
              postType === 'engagement' &&
              channelData?.engagementExamples && (
                <section className="brief-section">
                  <h3 className="brief-section__label">
                    Engagement Examples
                  </h3>
                  <ul className="brief-prompts">
                    {channelData.engagementExamples.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </section>
              )}

            {/* Rotating prompts (community sayYesMoment) */}
            {brief.rotatingPrompts && (
              <section className="brief-section">
                <h3 className="brief-section__label">Rotating Prompts</h3>
                <ul className="brief-prompts">
                  {brief.rotatingPrompts.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Welcome drip email sequence */}
            {brief.emails && (
              <section className="brief-section">
                <h3 className="brief-section__label">Email Sequence</h3>
                {brief.emails.map((email) => (
                  <div key={email.number} className="brief-email">
                    <strong>
                      Email {email.number} (Day {email.day}):
                    </strong>{' '}
                    <em>&ldquo;{email.subject}&rdquo;</em>
                    <p>{email.content}</p>
                    <p className="brief-email__cta">CTA: {email.cta}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Add Content Modal ──────────────────────── */

function AddContentModal({ weekDays, itemsByDate, onSave, onClose }) {
  const defaultDay = getNextEmptyDay(weekDays, itemsByDate);
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [postType, setPostType] = useState(
    () => getPostTypes(CHANNELS[0])[0] || '',
  );
  const [dueDate, setDueDate] = useState(defaultDay);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('planned');
  const [saving, setSaving] = useState(false);

  const postTypes = getPostTypes(channel);

  const handleChannelChange = (newChannel) => {
    setChannel(newChannel);
    const types = getPostTypes(newChannel);
    setPostType(types[0] || '');
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!channel || !postType || !dueDate) return;
    setSaving(true);
    await onSave({
      id: `local_${Date.now()}`,
      channel: CHANNEL_LABELS[channel] || channel,
      post_type: postType,
      dueDate,
      title,
      status,
    });
    setSaving(false);
    onClose();
  };

  const minDate = toISO(weekDays[0]);
  const maxDate = toISO(weekDays[6]);

  return (
    <div className="content-modal-overlay" onClick={onClose}>
      <div
        className="content-modal content-modal--form"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="content-modal__header">
          <h2 className="content-modal__title">Add Content Item</h2>
          <button className="content-modal__close" onClick={onClose}>
            ✕
          </button>
        </header>

        <form className="content-add-form" onSubmit={handleSubmit}>
          <label className="content-add-form__field">
            <span className="content-add-form__label">Channel</span>
            <select
              value={channel}
              onChange={(e) => handleChannelChange(e.target.value)}
            >
              {CHANNELS.map((ch) => (
                <option key={ch} value={ch}>
                  {CHANNEL_LABELS[ch]}
                </option>
              ))}
            </select>
          </label>

          <label className="content-add-form__field">
            <span className="content-add-form__label">Post Type</span>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
            >
              {postTypes.map((pt) => (
                <option key={pt} value={pt}>
                  {formatPostType(pt)}
                </option>
              ))}
            </select>
          </label>

          <label className="content-add-form__field">
            <span className="content-add-form__label">Day</span>
            <input
              type="date"
              value={dueDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>

          <label className="content-add-form__field">
            <span className="content-add-form__label">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Working title or description"
            />
          </label>

          <label className="content-add-form__field">
            <span className="content-add-form__label">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </label>

          <div className="content-add-form__actions">
            <button
              type="button"
              className="btn btn--outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={saving || !channel || !postType || !dueDate}
            >
              {saving ? 'Saving\u2026' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── main component ─────────────────────────── */

export default function ContentView() {
  const [weekOf, setWeekOf] = useState(() => getMonday(new Date()));
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [briefItem, setBriefItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  /* ── load data ─────────────────────────────── */

  const loadData = useCallback(async () => {
    const result = await loadContentCalendar();
    if (result.data) {
      setAllItems(Array.isArray(result.data) ? result.data : []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ── week navigation ───────────────────────── */

  const prevWeek = () => {
    setWeekOf((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const nextWeek = () => {
    setWeekOf((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const isCurrentWeek = isSameWeek(weekOf, new Date());

  /* ── filter items for this week ────────────── */

  const weekDays = getWeekDays(weekOf);
  const weekStart = toISO(weekDays[0]);
  const weekEnd = toISO(weekDays[6]);

  const weekItems = allItems.filter((item) => {
    const d = item.dueDate || item.date;
    if (!d) return false;
    return d >= weekStart && d <= weekEnd;
  });

  // Group items by date string
  const itemsByDate = {};
  weekDays.forEach((d) => {
    itemsByDate[toISO(d)] = [];
  });
  weekItems.forEach((item) => {
    const d = item.dueDate || item.date;
    if (itemsByDate[d]) {
      itemsByDate[d].push(item);
    }
  });

  /* ── buffer status ─────────────────────────── */

  const thisWeekDraftedCount = weekItems.filter((i) =>
    ['drafted', 'in_review', 'approved', 'published'].includes(norm(i.status)),
  ).length;
  const thisWeekTotal = weekItems.length;

  const futureBufferItems = allItems.filter((item) => {
    const d = item.dueDate || item.date;
    if (!d) return false;
    if (d <= weekEnd) return false;
    const s = norm(item.status);
    return s === 'drafted' || s === 'approved';
  });

  const bufferWeekSet = new Set();
  futureBufferItems.forEach((item) => {
    const d = item.dueDate || item.date;
    bufferWeekSet.add(toISO(getMonday(new Date(d + 'T00:00:00'))));
  });
  const bufferWeekCount = bufferWeekSet.size;

  /* ── handlers ──────────────────────────────── */

  const handleStatusChange = async (item, newStatus) => {
    const updated = { ...item, status: newStatus };
    setSaving(item.id);

    // Optimistic UI update
    setAllItems((prev) =>
      prev.map((it) => (it.id === item.id ? updated : it)),
    );

    await saveContentEntry(updated);
    setSaving(null);
  };

  const handleAddContent = async (newItem) => {
    setAllItems((prev) => [...prev, newItem]);
    await saveContentEntry(newItem);
  };

  /* ── render ──────────────────────────────────── */

  const sunday = weekDays[6];
  const weekLabel = `${formatShort(weekOf)} \u2013 ${formatDate(sunday)}`;

  if (loading) {
    return (
      <div className="view content-view">
        <h1 className="view-title">Content</h1>
        <p className="view-placeholder">Loading\u2026</p>
      </div>
    );
  }

  return (
    <div className="view content-view">
      {/* ── Header + Week Nav ──────────────── */}
      <header className="content-header">
        <h1 className="content-header__title">Content Calendar</h1>
        <div className="content-week-nav">
          <button
            className="content-week-nav__btn"
            onClick={prevWeek}
            aria-label="Previous week"
          >
            &#9664;
          </button>
          <span className="content-week-nav__label">{weekLabel}</span>
          {isCurrentWeek && (
            <span className="content-week-nav__current">current</span>
          )}
          <button
            className="content-week-nav__btn"
            onClick={nextWeek}
            aria-label="Next week"
          >
            &#9654;
          </button>
        </div>
      </header>

      {/* ── Calendar Grid or Empty State ───── */}
      {weekItems.length === 0 ? (
        <div className="content-empty">
          <p className="content-empty__text">
            No content scheduled for this week.
          </p>
          <p className="content-empty__hint">
            Content items will appear here once added to the calendar.
          </p>
        </div>
      ) : (
        <div className="content-calendar">
          {weekDays.map((day, i) => {
            const iso = toISO(day);
            const items = itemsByDate[iso] || [];
            const isToday = iso === toISO(new Date());

            return (
              <div
                key={iso}
                className={`content-day${isToday ? ' content-day--today' : ''}${items.length === 0 ? ' content-day--empty' : ''}`}
              >
                <div className="content-day__label">
                  <span className="content-day__name">{DAY_LABELS[i]}</span>
                  <span className="content-day__date">{day.getDate()}</span>
                </div>

                <div className="content-day__items">
                  {items.map((item, j) => {
                    const channel = (item.channel || '').toLowerCase();
                    const channelColor =
                      CHANNEL_COLORS[channel] || 'var(--text-muted)';
                    const statusKey = norm(item.status || 'planned');

                    return (
                      <div key={item.id || j} className="content-item">
                        <span
                          className="content-item__channel"
                          style={{ background: channelColor }}
                        >
                          {item.channel || '\u2014'}
                        </span>
                        <span className="content-item__type">
                          {item.post_type || item.postType || '\u2014'}
                        </span>
                        {item.title && (
                          <span className="content-item__title">
                            {item.title}
                          </span>
                        )}
                        <div className="content-item__row">
                          <select
                            className={`content-item__status content-item__status--${statusKey}`}
                            value={item.status || 'planned'}
                            onChange={(e) =>
                              handleStatusChange(item, e.target.value)
                            }
                            disabled={saving === item.id}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s.replace(/_/g, ' ')}
                              </option>
                            ))}
                          </select>
                          <button
                            className="content-item__brief-btn"
                            onClick={() => setBriefItem(item)}
                            title="View content brief"
                          >
                            Brief
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Buffer Status Bar ──────────────── */}
      <div className="content-buffer">
        <div className="content-buffer__row">
          <span className="content-buffer__label">This week</span>
          <span className="content-buffer__stat">
            {thisWeekDraftedCount}/{thisWeekTotal} drafted
          </span>
        </div>
        <div className="content-buffer__row">
          <span className="content-buffer__label">Buffer</span>
          <span className="content-buffer__stat">
            <span
              className={`content-buffer__dot${
                bufferWeekCount >= 2
                  ? ' content-buffer__dot--green'
                  : bufferWeekCount === 1
                    ? ' content-buffer__dot--amber'
                    : ' content-buffer__dot--red'
              }`}
            />
            {futureBufferItems.length} item
            {futureBufferItems.length !== 1 ? 's' : ''} across{' '}
            {bufferWeekCount} week{bufferWeekCount !== 1 ? 's' : ''} ahead
          </span>
        </div>
      </div>

      {/* ── Add Content Button ─────────────── */}
      <button
        className="btn btn--primary content-add-btn"
        onClick={() => setShowAddForm(true)}
      >
        + Add Content Item
      </button>

      {/* ── Modals ─────────────────────────── */}
      {briefItem && (
        <BriefModal item={briefItem} onClose={() => setBriefItem(null)} />
      )}
      {showAddForm && (
        <AddContentModal
          weekDays={weekDays}
          itemsByDate={itemsByDate}
          onSave={handleAddContent}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}
