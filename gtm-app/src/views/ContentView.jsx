import { useState, useEffect, useCallback } from 'react';
import { loadContentCalendar, saveContentEntry } from '../utils/dataLayer';
import './ContentView.css';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const STATUSES = ['planned', 'drafted', 'in_review', 'approved', 'published', 'skipped'];

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

/* ── component ───────────────────────────────── */

export default function ContentView() {
  const [weekOf, setWeekOf] = useState(() => getMonday(new Date()));
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

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

  /* ── status change handler ─────────────────── */

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

  /* ── render ──────────────────────────────────── */

  const sunday = weekDays[6];
  const weekLabel = `${formatShort(weekOf)} – ${formatDate(sunday)}`;

  if (loading) {
    return (
      <div className="view content-view">
        <h1 className="view-title">Content</h1>
        <p className="view-placeholder">Loading…</p>
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
            ◀
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
            ▶
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
                    const statusKey = (item.status || 'planned')
                      .toLowerCase()
                      .replace(/ /g, '_');

                    return (
                      <div key={item.id || j} className="content-item">
                        <span
                          className="content-item__channel"
                          style={{ background: channelColor }}
                        >
                          {item.channel || '—'}
                        </span>
                        <span className="content-item__type">
                          {item.post_type || item.postType || '—'}
                        </span>
                        {item.title && (
                          <span className="content-item__title">
                            {item.title}
                          </span>
                        )}
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
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
