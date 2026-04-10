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

  /* ── Load saved data on mount ── */
  useEffect(() => {
    async function loadData() {
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
          className="compliance-checklist__clear btn btn--outline"
          onClick={handleClearAll}
          disabled={checkedCount === 0}
        >
          Clear All
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
              />
              <span>{item}</span>
            </label>
          );
        })}
      </div>
    </div>
  );

  /* ── Render: partnership tracker (interactive) ── */

  const renderPartnershipTracker = () => (
    <div className="ref-subsection partnership-tracker">
      <div className="partnership-tracker__header">
        <h3 className="ref-subsection__heading">Partnership Tracker</h3>
        <button
          className="btn btn--primary partnership-tracker__add"
          onClick={() => setShowPartnershipModal(true)}
        >
          + Add Partnership
        </button>
      </div>

      {partnerships.length === 0 ? (
        <EmptyState
          icon="\uD83E\uDD1D"
          message="No partnerships tracked yet."
          hint="Add one to get started."
          actionLabel="+ Add Partnership"
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
                <select
                  className={`partnership-card__status partnership-card__status--${p.status}`}
                  value={p.status}
                  onChange={(e) => handlePartnershipStatus(p, e.target.value)}
                >
                  {PARTNERSHIP_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
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
      <h1 className="view-title">Reference</h1>

      {/* ── Pill navigation ── */}
      <nav className="ref-pills">
        {SECTION_KEYS.map((key) => (
          <button
            key={key}
            className={`ref-pill${
              activeSection === key ? ' ref-pill--active' : ''
            }`}
            onClick={() => handlePillClick(key)}
          >
            {referenceContent[key].title}
          </button>
        ))}
      </nav>

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
          className="modal-overlay"
          onClick={() => setShowPartnershipModal(false)}
        >
          <div
            className="modal-container partnership-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Add Partnership</h2>
            <div className="partnership-modal__form">
              <label className="partnership-modal__field">
                <span>Name</span>
                <input
                  type="text"
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
              <label className="partnership-modal__field">
                <span>Type</span>
                <select
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
              </label>
              <label className="partnership-modal__field">
                <span>Status</span>
                <select
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
              </label>
              <label className="partnership-modal__field">
                <span>Notes</span>
                <textarea
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
              <div className="partnership-modal__actions">
                <button
                  className="btn btn--outline"
                  onClick={() => setShowPartnershipModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn--primary"
                  onClick={handleAddPartnership}
                  disabled={!partnershipForm.name.trim()}
                >
                  Save Partnership
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
