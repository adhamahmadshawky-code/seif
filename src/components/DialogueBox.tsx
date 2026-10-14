import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

type DialogueBoxProps = {
  paragraphs: string[];
  speed?: number;
  onFinish?: () => void;
  finishLabel?: string;
  className?: string;
};

// Types paragraph by paragraph. A click / tap / Enter / Space either completes
// the current paragraph instantly or advances to the next one. Reduced-motion
// users get the full text immediately.
export default function DialogueBox({
  paragraphs,
  speed = 34,
  onFinish,
  finishLabel = 'التالي',
  className = '',
}: DialogueBoxProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState('');

  const full = paragraphs[index] ?? '';
  const complete = typed.length >= full.length;
  const isLast = index >= paragraphs.length - 1;

  useEffect(() => {
    setTyped('');
  }, [index]);

  useEffect(() => {
    if (reduced) {
      setTyped(full);
      return;
    }
    if (typed.length >= full.length) return;
    const timer = window.setTimeout(() => {
      setTyped(full.slice(0, typed.length + 1));
    }, speed);
    return () => window.clearTimeout(timer);
  }, [typed, full, reduced, speed]);

  const advance = () => {
    if (!complete) {
      setTyped(full);
      return;
    }
    if (!isLast) setIndex((value) => value + 1);
    else onFinish?.();
  };

  return (
    <div
      className={`dialogue ${className}`}
      role="button"
      tabIndex={0}
      aria-label="صندوق الحوار، اضغط للتالي"
      onClick={advance}
      onKeyDown={(event) => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
          advance();
        }
      }}
    >
      <p className="dialogue-text">
        {typed}
        <span className="cursor" aria-hidden="true" />
      </p>

      <div className="dialogue-bar">
        <span className="dialogue-hint">
          {complete ? (isLast ? '' : 'اضغط للمتابعة') : 'اضغط لتخطي الكتابة'}
        </span>
        <span className="dialogue-progress" dir="ltr" aria-hidden="true">
          {index + 1}/{paragraphs.length}
        </span>
        {complete && (
          <button
            type="button"
            className="pixel-btn small"
            onClick={(event) => {
              event.stopPropagation();
              advance();
            }}
          >
            {isLast ? finishLabel : 'التالي'}
          </button>
        )}
      </div>
    </div>
  );
}
