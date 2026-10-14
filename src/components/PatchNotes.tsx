import { useEffect, useState } from 'react';
import { DISCLAIMER, PATCH_NOTES } from '../data/dialogue';
import { useReducedMotion } from '../hooks/useReducedMotion';

type PatchNotesProps = {
  onDone: () => void;
};

type Phase = 'notes' | 'install' | 'done';

// SCENE FIVE — Adham v1.1 patch notes. Notes stream in one by one, then the
// update "installs" with an animated bar, ending on an honest disclaimer that
// nothing on a website has actually fixed the friendship.
export default function PatchNotes({ onDone }: PatchNotesProps) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('notes');
  const [shown, setShown] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase !== 'notes') return;
    if (reduced) {
      setShown(PATCH_NOTES.length);
      return;
    }
    if (shown >= PATCH_NOTES.length) return;
    const timer = window.setTimeout(() => setShown((value) => value + 1), 700);
    return () => window.clearTimeout(timer);
  }, [phase, shown, reduced]);

  useEffect(() => {
    if (phase !== 'install') return;
    if (reduced) {
      setProgress(100);
      setPhase('done');
      return;
    }
    if (progress >= 100) {
      setPhase('done');
      return;
    }
    const timer = window.setTimeout(() => {
      setProgress((value) => Math.min(100, value + Math.random() * 12 + 4));
    }, 170);
    return () => window.clearTimeout(timer);
  }, [phase, progress, reduced]);

  const notesComplete = shown >= PATCH_NOTES.length;

  return (
    <div className="screen scene-corporate">
      <div className="pixel-window patch-window">
        <header className="window-head">
          <h1 className="window-title-ar">تحديث جديد متاح: أدهم v1.1</h1>
          <span className="window-code" dir="ltr">
            CHANGELOG
          </span>
        </header>

        <ul className="patch-list">
          {PATCH_NOTES.slice(0, shown).map((note, index) => (
            <li key={index} className={note.known ? 'known' : ''}>
              <span className="patch-mark" aria-hidden="true">
                {note.known ? '!' : '+'}
              </span>
              {note.text}
            </li>
          ))}
        </ul>

        {phase === 'notes' && !notesComplete && (
          <div className="patch-foot">
            <button type="button" className="pixel-btn ghost" onClick={() => setShown(PATCH_NOTES.length)}>
              تخطي التحديثات
            </button>
          </div>
        )}

        {phase === 'notes' && notesComplete && (
          <div className="patch-foot">
            <button
              type="button"
              className="pixel-btn primary"
              onClick={() => setPhase('install')}
            >
              ثبّت التحديث
            </button>
          </div>
        )}

        {phase !== 'notes' && (
          <div className="install-block">
            <p className="install-label">
              جاري تثبيت التحديث... <span dir="ltr">{Math.floor(progress)}%</span>
            </p>
            <div className="bar fill">
              <i style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className="patch-done">
            <p className="disclaimer">{DISCLAIMER}</p>
            <button type="button" className="pixel-btn primary big" onClick={onDone}>
              خلصنا التحديث
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
