import { useId, useState } from 'react';
import { useAudio } from '../hooks/useAudioEngine';

// Persistent, unobtrusive audio control. Playback only ever starts after an
// explicit user action; missing files surface as a clear message rather than
// a silent failure or a fake "now playing".
export default function MusicPlayer() {
  const {
    tracks,
    currentTrack,
    playing,
    volume,
    muted,
    error,
    selectTrack,
    toggle,
    setVolume,
    toggleMute,
  } = useAudio();
  const [open, setOpen] = useState(false);
  const sliderId = useId();

  return (
    <div className="music-player">
      <button
        type="button"
        className="mp-toggle"
        aria-expanded={open}
        aria-controls="mp-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="mp-icon" aria-hidden="true">
          {playing ? '❚❚' : '▶'}
        </span>
        <span className="mp-label">الموسيقى</span>
        <span className="mp-title">{currentTrack ? currentTrack.title : 'مفيش مسار'}</span>
      </button>

      {open && (
        <div className="mp-panel" id="mp-panel">
          <div className="mp-row">
            <button
              type="button"
              className="pixel-btn small"
              onClick={toggle}
              aria-label={playing ? 'إيقاف مؤقت' : 'تشغيل'}
            >
              {playing ? 'إيقاف' : 'تشغيل'}
            </button>
            <button
              type="button"
              className="pixel-btn small ghost"
              onClick={toggleMute}
              aria-pressed={muted}
              aria-label={muted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
            >
              {muted ? 'صوت مقفول' : 'كتم'}
            </button>
          </div>

          <div className="mp-row mp-volume">
            <label htmlFor={sliderId}>مستوى الصوت</label>
            <input
              id={sliderId}
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(event) => {
                if (muted) toggleMute();
                setVolume(Number(event.target.value));
              }}
            />
          </div>

          <div className="mp-tracks">
            {tracks.map((track) => (
              <button
                type="button"
                key={track.id}
                className={`mp-track${track.id === currentTrack?.id ? ' active' : ''}`}
                onClick={() => selectTrack(track.id)}
                aria-pressed={track.id === currentTrack?.id}
              >
                {track.title}
                <span className="mp-file" dir="ltr">
                  {track.src.split('/').pop()}
                </span>
              </button>
            ))}
          </div>

          {error && <p className="mp-error">{error}</p>}
          {!error && (
            <p className="mp-note">
              لو مفيش صوت، حط ملفاتك في <span dir="ltr">public/audio/</span>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
