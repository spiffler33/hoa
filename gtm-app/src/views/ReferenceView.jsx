import { useState, useRef } from 'react';
import referenceContent from '../data/referenceContent';
import './ReferenceView.css';

const SECTION_KEYS = ['icp', 'roles', 'compliance', 'community', 'monetisation', 'vocabulary'];

export default function ReferenceView() {
  const [activeSection, setActiveSection] = useState(null);
  const sectionRefs = useRef({});

  /* Pill click: always opens the section and scrolls to it */
  const handlePillClick = (key) => {
    setActiveSection(key);
    setTimeout(() => {
      sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  /* Accordion header click: toggle open/close */
  const handleToggle = (key) => {
    setActiveSection(prev => (prev === key ? null : key));
  };

  /* Render subsection content based on type and section */
  const renderContent = (sectionKey, subsection) => {
    const { content } = subsection;

    /* Vocabulary section → definition list (term — definition) */
    if (sectionKey === 'vocabulary') {
      return (
        <dl className="ref-definitions">
          {content.map((item, i) => {
            const sep = item.indexOf(' — ');
            const term = sep >= 0 ? item.slice(0, sep) : item;
            const def  = sep >= 0 ? item.slice(sep + 3) : '';
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
        {SECTION_KEYS.map(key => (
          <button
            key={key}
            className={`ref-pill${activeSection === key ? ' ref-pill--active' : ''}`}
            onClick={() => handlePillClick(key)}
          >
            {referenceContent[key].title}
          </button>
        ))}
      </nav>

      {/* ── Accordion sections ── */}
      <div className="ref-sections">
        {SECTION_KEYS.map(key => {
          const section = referenceContent[key];
          const isOpen = activeSection === key;

          return (
            <section
              key={key}
              ref={el => { sectionRefs.current[key] = el; }}
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
                  {section.subsections.map(sub => (
                    <div key={sub.id} className="ref-subsection">
                      <h3 className="ref-subsection__heading">{sub.heading}</h3>
                      {renderContent(key, sub)}
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
