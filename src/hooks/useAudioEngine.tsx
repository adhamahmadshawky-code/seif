import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { TRACKS, type Track } from '../data/audioTracks';

export type AudioEngine = {
  tracks: Track[];
  currentId: string | null;
  currentTrack: Track | null;
  playing: boolean;
  volume: number;
  muted: boolean;
  error: string | null;
  selectTrack: (id: string) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
};

const AudioContext = createContext<AudioEngine | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  // A single, persistent HTMLAudioElement lives here for the whole app so a
  // React re-render or scene change never reloads or restarts the track.
  const elementRef = useRef<HTMLAudioElement | null>(null);
  const resumeOnLoadRef = useRef(false);

  const [currentId, setCurrentId] = useState<string | null>(TRACKS[0]?.id ?? null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.6);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentTrack = useMemo(
    () => TRACKS.find((track) => track.id === currentId) ?? null,
    [currentId],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const element = new Audio();
    element.preload = 'metadata';
    element.loop = true;
    element.volume = volume;
    elementRef.current = element;

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleError = () => {
      setError('الملف الصوتي غير متاح — ضيف الملفات في public/audio');
      setPlaying(false);
    };

    element.addEventListener('play', handlePlay);
    element.addEventListener('pause', handlePause);
    element.addEventListener('error', handleError);

    return () => {
      element.pause();
      element.removeEventListener('play', handlePlay);
      element.removeEventListener('pause', handlePause);
      element.removeEventListener('error', handleError);
      element.src = '';
      elementRef.current = null;
    };
    // Volume is applied through its own effect; intentionally run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap the source only when the selected track changes.
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !currentTrack) return;

    setError(null);
    const absolute = new URL(currentTrack.src, window.location.href).href;
    if (element.src !== absolute) {
      element.src = currentTrack.src;
      element.load();
      if (resumeOnLoadRef.current) {
        resumeOnLoadRef.current = false;
        void element.play().catch(() => {
          setError('تعذّر تشغيل الصوت، جرّب تدوس تاني');
        });
      }
    }
  }, [currentTrack]);

  // Keep the element volume in sync with the UI.
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    element.volume = muted ? 0 : volume;
  }, [volume, muted, currentId]);

  const play = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;
    setError(null);
    const result = element.play();
    if (result && typeof result.catch === 'function') {
      result.catch(() => {
        setError('تعذّر تشغيل الصوت، جرّب تدوس تاني');
        setPlaying(false);
      });
    }
  }, []);

  const pause = useCallback(() => {
    elementRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;
    if (element.paused) play();
    else pause();
  }, [play, pause]);

  const selectTrack = useCallback((id: string) => {
    const element = elementRef.current;
    resumeOnLoadRef.current = element ? !element.paused : false;
    setError(null);
    setCurrentId(id);
  }, []);

  const setVolume = useCallback((value: number) => {
    setVolumeState(Math.min(1, Math.max(0, value)));
  }, []);

  const toggleMute = useCallback(() => setMuted((value) => !value), []);

  const value = useMemo<AudioEngine>(
    () => ({
      tracks: TRACKS,
      currentId,
      currentTrack,
      playing,
      volume,
      muted,
      error,
      selectTrack,
      play,
      pause,
      toggle,
      setVolume,
      toggleMute,
    }),
    [
      currentId,
      currentTrack,
      playing,
      volume,
      muted,
      error,
      selectTrack,
      play,
      pause,
      toggle,
      setVolume,
      toggleMute,
    ],
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio(): AudioEngine {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
