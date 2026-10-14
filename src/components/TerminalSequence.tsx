import { useEffect, useState } from 'react';
import { BOOT_LINES } from '../data/dialogue';
import { useReducedMotion } from '../hooks/useReducedMotion';

type TerminalSequenceProps = {
  onStart: () => void;
};

// SCENE ONE — retro boot. Lines appear one by one but never disappear, so the
// player can always read back. A skip control reveals everything at once.
export default function TerminalSequence({ onStart }: TerminalSequenceProps) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced) {
      setCount(BOOT_LINES.length);
      return;
    }
    if (count >= BOOT_LINES.length) return;
    const timer = window.setTimeout(() => setCount((value) => value + 1), 620);
    return () => window.clearTimeout(timer);
  }, [count, reduced]);

  const done = count >= BOOT_LINES.length;

  return (
    <div className="screen boot">
      <div className="crt" />
      <div className="terminal" role="log" aria-live="polite" aria-label="رسائل تشغيل النظام">
        <div className="terminal-head">
          <span dir="ltr">FRIENDSHIP.EXE</span>
          <span className="terminal-sub" dir="ltr">
            v1.0 — THE REDEMPTION ARC
          </span>
        </div>

        {BOOT_LINES.slice(0, count).map((line, index) => (
          <p key={index} className={`term-line${line.tone ? ` tone-${line.tone}` : ''}`}>
            <span className="term-prompt" dir="ltr">
              {line.prompt}
            </span>
            <span>{line.text}</span>
          </p>
        ))}

        {!done && (
          <p className="term-line">
            <span className="cursor" />
          </p>
        )}
      </div>

      <div className="boot-actions">
        {!done ? (
          <button type="button" className="pixel-btn ghost" onClick={() => setCount(BOOT_LINES.length)}>
            تخطي الرسائل
          </button>
        ) : (
          <button type="button" className="pixel-btn primary big" onClick={onStart}>
            ابدأ مهمة الإنقاذ
          </button>
        )}
      </div>
    </div>
  );
}
