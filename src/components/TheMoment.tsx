import { APOLOGY_PARAGRAPHS } from '../data/dialogue';
import DialogueBox from './DialogueBox';
import PixelScene from './PixelScene';
import { useAudio } from '../hooks/useAudioEngine';

type TheMomentProps = {
  onDone: () => void;
};

// SCENE FOUR — the emotional centerpiece. Quiet night scene, minimal UI,
// no corporate noise. The apology is sincere, does not describe the real
// incident, and stays editable in src/data/dialogue.ts.
export default function TheMoment({ onDone }: TheMomentProps) {
  const audio = useAudio();
  const showMusicHint = !audio.playing;

  return (
    <div className="screen scene-night">
      <PixelScene mode="moment" />
      <div className="scene-overlay">
        <div className="moment-wrap">
          <p className="moment-caption">على السطح، بعيد عن زحمة الاجتماعات...</p>

          <DialogueBox
            paragraphs={APOLOGY_PARAGRAPHS}
            speed={30}
            finishLabel="كمل"
            onFinish={onDone}
          />

          {showMusicHint && (
            <p className="moment-music-hint" role="status">
              لو حابب، شغّل الموسيقى من تحت.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
