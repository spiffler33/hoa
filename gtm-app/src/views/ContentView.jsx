import { useState, useEffect, useCallback } from 'react';
import { loadContentCalendar, saveContentEntry } from '../utils/dataLayer';
import contentBriefs from '../data/contentBriefs';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
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

/** Channel → semantic color role (CSS modifier class on .content-channel). */
const CHANNEL_CLASS = {
  linkedin: 'content-channel--linkedin',
  instagram: 'content-channel--instagram',
  email: 'content-channel--email',
  community: 'content-channel--community',
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
  const channelClass = CHANNEL_CLASS[channel] || '';
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
            <span className={`content-channel ${channelClass}`}>
              {(channelLabel || '').toUpperCase()}
            </span>
            <h2 className="content-modal__title">
              {formatPostType(postType).toUpperCase()}
              <span className="content-modal__title-sep">{'\u00b7'}</span>
              BRIEF
            </h2>
          </div>
          <button
            type="button"
            className="content-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            {'\u2715'}
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
                <span className="brief-meta__tag">
                  DAY {'\u00b7'} {brief.day}
                </span>
              )}
              <span className="brief-meta__tag">
                FREQ {'\u00b7'} {brief.frequency}
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
                  <h3 className="brief-section__label">Engagement Examples</h3>
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
          <h2 className="content-modal__title">ADD CONTENT ITEM</h2>
          <button
            type="button"
            className="content-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            {'\u2715'}
          </button>
        </header>

        <form className="content-form" onSubmit={handleSubmit}>
          <label className="content-form__field">
            <span className="content-form__label">Channel</span>
            <span className="content-form__select-wrap">
              <select
                className="content-form__control"
                value={channel}
                onChange={(e) => handleChannelChange(e.target.value)}
              >
                {CHANNELS.map((ch) => (
                  <option key={ch} value={ch}>
                    {CHANNEL_LABELS[ch]}
                  </option>
                ))}
              </select>
            </span>
          </label>

          <label className="content-form__field">
            <span className="content-form__label">Post type</span>
            <span className="content-form__select-wrap">
              <select
                className="content-form__control"
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
              >
                {postTypes.map((pt) => (
                  <option key={pt} value={pt}>
                    {formatPostType(pt)}
                  </option>
                ))}
              </select>
            </span>
          </label>

          <label className="content-form__field">
            <span className="content-form__label">Day</span>
            <input
              className="content-form__control"
              type="date"
              value={dueDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>

          <label className="content-form__field">
            <span className="content-form__label">Title</span>
            <input
              className="content-form__control"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Working title or description"
            />
          </label>

          <label className="content-form__field">
            <span className="content-form__label">Status</span>
            <span className="content-form__select-wrap">
              <select
                className="content-form__control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </span>
          </label>

          <div className="content-form__actions">
            <button type="button" className="content-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="content-btn content-btn--primary"
              disabled={saving || !channel || !postType || !dueDate}
            >
              {saving ? 'Saving\u2026' : 'Add item'}
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
  const [error, setError] = useState(null);

  /* ── load data ─────────────────────────────── */

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loadContentCalendar();
      if (result.data) {
        setAllItems(Array.isArray(result.data) ? result.data : []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load content calendar.');
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

  const thisWeekLevel =
    thisWeekTotal === 0
      ? 'none'
      : thisWeekDraftedCount === thisWeekTotal
        ? 'green'
        : thisWeekDraftedCount * 2 >= thisWeekTotal
          ? 'amber'
          : 'red';

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

  const bufferLevel =
    bufferWeekCount >= 2 ? 'green' : bufferWeekCount === 1 ? 'amber' : 'red';

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
  const weekRangeLabel = `${formatShort(weekOf)} \u2013 ${formatDate(sunday)}`;

  if (loading) {
    return (
      <div className="view content-view">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="view content-view">
        <EmptyState
          icon={'\u26A0'}
          message="Failed to load content calendar"
          hint={error}
          actionLabel="Retry"
          onAction={loadData}
          variant="error"
        />
      </div>
    );
  }

  return (
    <div className="view content-view">
      {/* ── Banner ─────────────────────────── */}
      <header className="content-section content-banner">
        <h1 className="content-banner__title">Content Calendar</h1>
        <p className="content-banner__meta">
          WK OF {toISO(weekOf)}{' '}
          <span className="content-banner__sep">{'\u00b7'}</span>{' '}
          {weekRangeLabel.toUpperCase()}
        </p>
        <div className="content-nav">
          <button
            type="button"
            className="content-nav__btn"
            onClick={prevWeek}
            aria-label="Previous week"
          >
            {'\u2039'}
          </button>
          <span className="content-nav__label">
            {formatShort(weekOf)} {'\u2013'} {formatShort(sunday)}
            {isCurrentWeek && (
              <span className="content-nav__current">[CURRENT]</span>
            )}
          </span>
          <button
            type="button"
            className="content-nav__btn"
            onClick={nextWeek}
            aria-label="Next week"
          >
            {'\u203A'}
          </button>
        </div>
      </header>

      {/* ── Calendar ───────────────────────── */}
      <section className="content-section">
        <h2 className="content-section__heading">
          Calendar
          <span className="content-section__heading-meta">
            <span className="content-heading-count">
              {weekItems.length} ITEM{weekItems.length !== 1 ? 'S' : ''}
            </span>
          </span>
        </h2>

        {weekItems.length === 0 ? (
          <EmptyState
            icon={'\u00b7'}
            message="No content scheduled for this week."
            hint="Content items appear here once added to the calendar."
            actionLabel="+ Add content item"
            onAction={() => setShowAddForm(true)}
          />
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
                    <span className="content-day__name">
                      {DAY_LABELS[i].toUpperCase()}
                    </span>
                    <span className="content-day__date">
                      {String(day.getDate()).padStart(2, '0')}
                    </span>
                  </div>

                  <ul className="content-day__items">
                    {items.length === 0 && (
                      <li className="content-day__blank">{'\u2014'}</li>
                    )}
                    {items.map((item, j) => {
                      const ch = (item.channel || '').toLowerCase();
                      const channelClass = CHANNEL_CLASS[ch] || '';
                      const statusKey = norm(item.status || 'planned');

                      return (
                        <li key={item.id || j} className="content-item">
                          <div className="content-item__head">
                            <span className={`content-channel ${channelClass}`}>
                              {(item.channel || '\u2014').toUpperCase()}
                            </span>
                            <span className="content-item__type">
                              {formatPostType(
                                item.post_type || item.postType || '',
                              ) || '\u2014'}
                            </span>
                          </div>
                          {item.title && (
                            <p className="content-item__title">{item.title}</p>
                          )}
                          <div className="content-item__row">
                            <span className="content-item__select-wrap">
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
                            </span>
                            <button
                              type="button"
                              className="content-item__brief-btn"
                              onClick={() => setBriefItem(item)}
                              title="View content brief"
                            >
                              Brief {'\u2192'}
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Buffer ─────────────────────────── */}
      <section className="content-section">
        <h2 className="content-section__heading">Buffer</h2>
        <ul className="content-buffer">
          <li
            className={`content-buffer__row content-buffer__row--${thisWeekLevel}`}
          >
            <span className="content-buffer__label">This week</span>
            <span className="content-buffer__leader" />
            <span className="content-buffer__value">
              {thisWeekDraftedCount}/{thisWeekTotal}
            </span>
            <span className="content-buffer__target">drafted</span>
          </li>
          <li
            className={`content-buffer__row content-buffer__row--${bufferLevel}`}
          >
            <span className="content-buffer__label">Ahead</span>
            <span className="content-buffer__leader" />
            <span className="content-buffer__value">
              {futureBufferItems.length}
            </span>
            <span className="content-buffer__target">
              / {bufferWeekCount} wk{bufferWeekCount !== 1 ? 's' : ''}
            </span>
          </li>
        </ul>
      </section>

      {/* ── Add ────────────────────────────── */}
      <section className="content-section content-section--actions">
        <button
          type="button"
          className="content-btn content-btn--primary"
          onClick={() => setShowAddForm(true)}
        >
          + Add content item
        </button>
      </section>

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
