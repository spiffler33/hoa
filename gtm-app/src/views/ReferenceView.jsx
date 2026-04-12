import { useState, useRef, useEffect } from 'react';
import referenceContent from '../data/referenceContent';
import {
  loadPhaseChecklist,
  saveChecklistEntry,
  loadPartnerships,
  savePartnership,
} from '../utils/dataLayer';
import EmptyState from '../components/EmptyState';
import './ReferenceView.css';

const SECTION_KEYS = ['icp', 'roles', 'compliance', 'community', 'monetisation', 'vocabulary'];

const PARTNERSHIP_TYPES = [
  'Co-branded content',
  'Cross-pollination',
  'Corporate tie-in',
  'Podcast/media',
  'Other',
];

const PARTNERSHIP_STATUSES = ['prospect', 'active', 'completed'];

export default function ReferenceView() {
  const [activeSection, setActiveSection] = useState(null);
  const sectionRefs = useRef({});

  /* ── Compliance checklist state ── */
  const [checkedItems, setCheckedItems] = useState({});
  const complianceItems =
    referenceContent.compliance.subsections.find(
      (s) => s.id === 'compliance_checklist'
    )?.content || [];
  const checkedCount = complianceItems.filter(
    (_, i) => checkedItems[`compliance_${i}`]
  ).length;

  /* ── Partnership state ── */
  const [partnerships, setPartnerships] = useState([]);
  const [showPartnershipModal, setShowPartnershipModal] = useState(false);
  const [partnershipForm, setPartnershipForm] = useState({
    name: '',
    type: PARTNERSHIP_TYPES[0],
    status: 'prospect',
    notes: '',
  });

  const [loadError, setLoadError] = useState(null);

  /* ── Load saved data on mount ── */
  useEffect(() => {
    async function loadData() {
      try {
        const [compRes, partRes] = await Promise.all([
          loadPhaseChecklist({ tab: 'compliance_log' }),
          loadPartnerships(),
        ]);

        if (compRes.data && Array.isArray(compRes.data)) {
          const map = {};
          compRes.data.forEach((row) => {
            map[row.id] = row.completed;
          });
          setCheckedItems(map);
        }

        if (partRes.data && Array.isArray(partRes.data)) {
          setPartnerships(partRes.data);
        }
      } catch (err) {
        setLoadError(err.message || 'Failed to load reference data.');
      }
    }
    loadData();
  }, []);

  /* ── Close modal on Escape ── */
  useEffect(() => {
    if (!showPartnershipModal) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setShowPartnershipModal(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showPartnershipModal]);

  /* ── Navigation ── */

  const handlePillClick = (key) => {
    setActiveSection(key);
    setTimeout(() => {
      sectionRefs.current[key]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 50);
  };

  const handleToggle = (key) => {
    setActiveSection((prev) => (prev === key ? null : key));
  };

  /* ── Compliance handlers ── */

  const handleComplianceToggle = async (index) => {
    const id = `compliance_${index}`;
    const newVal = !checkedItems[id];
    setCheckedItems((prev) => ({ ...prev, [id]: newVal }));
    await saveChecklistEntry({ id, tab: 'compliance_log', completed: newVal });
  };

  const handleClearAll = async () => {
    const cleared = {};
    complianceItems.forEach((_, i) => {
      cleared[`compliance_${i}`] = false;
    });
    setCheckedItems(cleared);
    for (let i = 0; i < complianceItems.length; i++) {
      await saveChecklistEntry({
        id: `compliance_${i}`,
        tab: 'compliance_log',
        completed: false,
      });
    }
  };

  /* ── Partnership handlers ── */

  const handleAddPartnership = async () => {
    const entry = { id: `local_${Date.now()}`, ...partnershipForm };
    setPartnerships((prev) => [...prev, entry]);
    setShowPartnershipModal(false);
    setPartnershipForm({
      name: '',
      type: PARTNERSHIP_TYPES[0],
      status: 'prospect',
      notes: '',
    });
    await savePartnership(entry);
  };

  const handlePartnershipStatus = async (p, newStatus) => {
    const updated = { ...p, status: newStatus };
    setPartnerships((prev) =>
      prev.map((item) => (item.id === p.id ? updated : item))
    );
    await savePartnership(updated);
  };

  /* ── Render: compliance checklist (interactive) ── */

  const renderComplianceChecklist = (items) => (
    <div className="compliance-checklist">
      <div className="compliance-checklist__header">
        <span className="compliance-checklist__count">
          {checkedCount}/{items.length} checked
        </span>
        <button
          type="button"
          className="ref-btn"
          onClick={handleClearAll}
          disabled={checkedCount === 0}
        >
          Clear all
        </button>
      </div>
      <div className="compliance-checklist__items">
        {items.map((item, i) => {
          const id = `compliance_${i}`;
          const checked = !!checkedItems[id];
          return (
            <label
              key={i}
              className={`compliance-checklist__item${
                checked ? ' compliance-checklist__item--checked' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleComplianceToggle(i)}
                className="compliance-checklist__cb-native"
              />
              <span
                className="compliance-checklist__cb-text"
                aria-hidden="true"
              >
                {checked ? '[x]' : '[ ]'}
              </span>
              <span className="compliance-checklist__text">{item}</span>
            </label>
          );
        })}
      </div>
    </div>
  );

  /* ── Render: partnership tracker (interactive) ── */

  const renderPartnershipTracker = () => (
    <div className="partnership-tracker">
      <div className="partnership-tracker__header">
        <h3 className="ref-subsection__heading">Partnership tracker</h3>
        <button
          type="button"
          className="ref-btn ref-btn--primary"
          onClick={() => setShowPartnershipModal(true)}
        >
          + Add partnership
        </button>
      </div>

      {partnerships.length === 0 ? (
        <EmptyState
          icon={'\u2205'}
          message="No partnerships tracked yet."
          hint="Add one to get started."
          actionLabel="+ Add partnership"
          onAction={() => setShowPartnershipModal(true)}
        />
      ) : (
        <div className="partnership-tracker__cards">
          {partnerships.map((p) => (
            <div
              key={p.id}
              className={`partnership-card partnership-card--${p.status}`}
            >
              <div className="partnership-card__header">
                <span className="partnership-card__name">{p.name}</span>
                <div className="partnership-card__status-wrap">
                  <select
                    className="partnership-card__status"
                    value={p.status}
                    onChange={(e) =>
                      handlePartnershipStatus(p, e.target.value)
                    }
                    aria-label={`Status for ${p.name}`}
                  >
                    {PARTNERSHIP_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <span className="partnership-card__type">{p.type}</span>
              {p.notes && (
                <p className="partnership-card__notes">{p.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* ── Render subsection content based on type and section ── */

  const renderContent = (sectionKey, subsection) => {
    const { content } = subsection;

    /* Interactive compliance checklist */
    if (sectionKey === 'compliance' && subsection.id === 'compliance_checklist') {
      return renderComplianceChecklist(content);
    }

    /* Vocabulary section → definition list (term — definition) */
    if (sectionKey === 'vocabulary') {
      return (
        <dl className="ref-definitions">
          {content.map((item, i) => {
            const sep = item.indexOf(' — ');
            const term = sep >= 0 ? item.slice(0, sep) : item;
            const def = sep >= 0 ? item.slice(sep + 3) : '';
            return (
              <div key={i} className="ref-definitions__entry">
                <dt>{term}</dt>
                <dd>{def}</dd>
              </div>
            );
          })}
        </dl>
      );
    }

    /* String → paragraph */
    if (typeof content === 'string') {
      return <p className="ref-subsection__body">{content}</p>;
    }

    /* Array → bullet list */
    if (Array.isArray(content)) {
      return (
        <ul className="ref-subsection__list">
          {content.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }

    return null;
  };

  return (
    <div className="view reference-view">
      {loadError && (
        <EmptyState
          variant="error"
          icon={'\u26a0'}
          message={loadError}
          action={{ label: 'Retry', onClick: () => window.location.reload() }}
        />
      )}
      {/* ── Banner ──────────────────────────────── */}
      <header className="ref-banner">
        <h1 className="ref-banner__title">Reference</h1>
        <p className="ref-banner__meta">
          {SECTION_KEYS.length} sections{' '}
          <span className="ref-banner__sep">{'\u00b7'}</span> operational
          reference
        </p>

        {/* ── Quick nav pills ─────────────────────── */}
        <nav className="ref-pills" aria-label="Section quick nav">
          {SECTION_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className={`ref-pill${
                activeSection === key ? ' ref-pill--active' : ''
              }`}
              onClick={() => handlePillClick(key)}
            >
              {referenceContent[key].title}
            </button>
          ))}
        </nav>
      </header>

      {/* ── Accordion sections ── */}
      <div className="ref-sections">
        {SECTION_KEYS.map((key) => {
          const section = referenceContent[key];
          const isOpen = activeSection === key;

          return (
            <section
              key={key}
              ref={(el) => {
                sectionRefs.current[key] = el;
              }}
              className={`ref-section${isOpen ? ' ref-section--open' : ''}`}
            >
              <button
                className="ref-section__header"
                onClick={() => handleToggle(key)}
                aria-expanded={isOpen}
              >
                <span className="ref-section__chevron">
                  {isOpen ? '\u25BE' : '\u25B8'}
                </span>
                <span className="ref-section__title">{section.title}</span>
                <span className="ref-section__count">
                  {section.subsections.length}
                </span>
              </button>

              {isOpen && (
                <div className="ref-section__body">
                  {section.subsections.map((sub) => (
                    <div key={sub.id} className="ref-subsection">
                      <h3 className="ref-subsection__heading">
                        {sub.heading}
                      </h3>
                      {renderContent(key, sub)}
                    </div>
                  ))}

                  {/* Interactive partnership tracker inside Community section */}
                  {key === 'community' && renderPartnershipTracker()}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* ── Partnership modal ── */}
      {showPartnershipModal && (
        <div
          className="ref-modal-overlay"
          onClick={() => setShowPartnershipModal(false)}
        >
          <div
            className="ref-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Add partnership"
          >
            <div className="ref-modal__header">
              <span className="ref-modal__title">Add partnership</span>
              <button
                type="button"
                className="ref-modal__close"
                onClick={() => setShowPartnershipModal(false)}
                aria-label="Close"
              >
                {'\u00d7'}
              </button>
            </div>

            <div className="ref-form">
              <label className="ref-form__field">
                <span className="ref-form__label">Name</span>
                <input
                  type="text"
                  className="ref-form__control"
                  value={partnershipForm.name}
                  onChange={(e) =>
                    setPartnershipForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Partnership or contact name"
                  autoFocus
                />
              </label>

              <label className="ref-form__field">
                <span className="ref-form__label">Type</span>
                <div className="ref-form__select-wrap">
                  <select
                    className="ref-form__control"
                    value={partnershipForm.type}
                    onChange={(e) =>
                      setPartnershipForm((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                  >
                    {PARTNERSHIP_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="ref-form__field">
                <span className="ref-form__label">Status</span>
                <div className="ref-form__select-wrap">
                  <select
                    className="ref-form__control"
                    value={partnershipForm.status}
                    onChange={(e) =>
                      setPartnershipForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  >
                    {PARTNERSHIP_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="ref-form__field">
                <span className="ref-form__label">Notes</span>
                <textarea
                  className="ref-form__control ref-form__control--textarea"
                  value={partnershipForm.notes}
                  onChange={(e) =>
                    setPartnershipForm((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="Additional context, contacts, next steps..."
                  rows={3}
                />
              </label>

              <div className="ref-form__actions">
                <button
                  type="button"
                  className="ref-btn"
                  onClick={() => setShowPartnershipModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="ref-btn ref-btn--primary"
                  onClick={handleAddPartnership}
                  disabled={!partnershipForm.name.trim()}
                >
                  Save partnership
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
