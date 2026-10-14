import { useEffect, useState } from 'react';
import { ENDING_PARAGRAPHS, FAREWELL_BODY, FAREWELL_LEAD } from '../data/dialogue';
import DialogueBox from './DialogueBox';
import PixelScene from './PixelScene';
import { useAudio } from '../hooks/useAudioEngine';

type FinaleProps = {
  onReplay: () => void;
};

// FINAL SCENE — quiet and hopeful. Both characters stand together, no forced
// affection, no forgiveness meter, no countdown, no pressure. The ending is
// understated on purpose.
export default function Finale({ onReplay }: FinaleProps) {
  const audio = useAudio();
  const [ended, setEnded] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    if (!ended) return;
    // Pause audio appropriately when the player closes the game.
    audio.pause();
  }, [ended, audio]);

  const close = () => setEnded(true);

  return (
    <div className="screen scene-night">
      <PixelScene mode="finale" />
      <div className="scene-overlay">
        <div className="moment-wrap">
          <p className="moment-caption">نفس السطح، بس الدنيا أهدى شوية.</p>

          {!showButtons ? (
            <DialogueBox
              paragraphs={ENDING_PARAGRAPHS}
              speed={34}
              finishLabel="اقرأ الزرارين"
              onFinish={() => setShowButtons(true)}
            />
          ) : (
            <div className="finale-card">
              <p className="finale-line">
                خد وقتك. مفيش عداد، ومفيش ضغط، ومفيش رد مطلوب دلوقتي.
              </p>
              <div className="finale-actions">
                <button type="button" className="pixel-btn primary" onClick={onReplay}>
                  نعيد المغامرة من الأول
                </button>
                <button type="button" className="pixel-btn ghost" onClick={close}>
                  نختم اللعبة
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {ended && (
        <div className="farewell">
          <div className="farewell-card">
            <p className="farewell-lead">{FAREWELL_LEAD}</p>
            <p className="farewell-body">{FAREWELL_BODY}</p>
            <div className="farewell-actions">
              <button type="button" className="pixel-btn" onClick={onReplay}>
                نلعب تاني
              </button>
              <button type="button" className="pixel-btn ghost" onClick={() => setEnded(false)}>
                أرجع للسطح
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
