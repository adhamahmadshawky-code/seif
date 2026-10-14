import { useEffect, useRef, useState } from 'react';
import { CASE_FIELDS, DOCUMENTS, INCIDENT_INTRO, type DocumentEntry } from '../data/dialogue';

type IncidentReportProps = {
  onDone: () => void;
};

// SCENE TWO — the friendship incident report. Four documents, each opening a
// working modal. The documents are satirical but never guess what really
// happened; they stay at the level of accountability and bureaucracy.
export default function IncidentReport({ onDone }: IncidentReportProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [opened, setOpened] = useState<string[]>([]);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const active: DocumentEntry | null =
    DOCUMENTS.find((doc) => doc.id === openId) ?? null;

  useEffect(() => {
    if (!active) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  const openDocument = (id: string) => {
    setOpenId(id);
    setOpened((list) => (list.includes(id) ? list : [...list, id]));
  };

  const inspectedAll = opened.length === DOCUMENTS.length;

  return (
    <div className="screen scene-corporate">
      <div className="pixel-window">
        <header className="window-head">
          <h1 className="window-title-ar">تقرير حادثة الصداقة</h1>
          <span className="window-code" dir="ltr">
            CASE FRIENDSHIP-001
          </span>
        </header>

        <div className="incident-intro">
          {INCIDENT_INTRO.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>

        <div className="case-grid">
          {CASE_FIELDS.map((field) => (
            <div className="case-field" key={field.k}>
              <span className="k">{field.k}</span>
              <span className="v">{field.v}</span>
            </div>
          ))}
        </div>

        <p className="section-label">الملفات المتاحة — افتحها بالترتيب اللي تحبه:</p>

        <div className="doc-grid">
          {DOCUMENTS.map((doc) => (
            <button
              type="button"
              key={doc.id}
              className={`doc-card${opened.includes(doc.id) ? ' done' : ''}`}
              onClick={() => openDocument(doc.id)}
              aria-haspopup="dialog"
            >
              <span className="doc-tag" dir="ltr">
                {doc.tag}
                {opened.includes(doc.id) ? ' ✓' : ''}
              </span>
              <span className="doc-label">{doc.label}</span>
            </button>
          ))}
        </div>

        <footer className="window-foot">
          <span className="inspect-count">
            تم فحص {opened.length} من {DOCUMENTS.length}
          </span>
          <button type="button" className="pixel-btn primary" onClick={onDone}>
            {inspectedAll ? 'متابعة' : 'متابعة على مسؤوليتي'}
          </button>
        </footer>
      </div>

      {active && (
        <div
          className="modal-backdrop"
          onClick={() => setOpenId(null)}
          role="presentation"
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="doc-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-head">
              <span className="doc-tag" dir="ltr">
                ملف {active.tag}
              </span>
              <h2 id="doc-modal-title" className="modal-title">
                {active.title}
              </h2>
              <button
                type="button"
                ref={closeRef}
                className="modal-close"
                onClick={() => setOpenId(null)}
                aria-label="إغلاق الملف"
              >
                <span dir="ltr">✕</span>
              </button>
            </div>
            <div className="modal-body">
              {active.lines.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
