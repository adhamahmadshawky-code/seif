import { useCallback, useEffect, useRef, useState } from 'react';
import { useGameState, type Stage } from '../hooks/useGameState';
import { useAudio } from '../hooks/useAudioEngine';
import TerminalSequence from './TerminalSequence';
import IncidentReport from './IncidentReport';
import BoardMeeting from './BoardMeeting';
import TheMoment from './TheMoment';
import PatchNotes from './PatchNotes';
import Finale from './Finale';
import MusicPlayer from './MusicPlayer';

// Central orchestrator: owns the current stage, the pixelated wipe transition,
// and the persistent music player. Scenes are keyed by stage so each one
// mounts fresh (clean state, clean entry animation) and unmounts cleanly.
export default function GameShell() {
  const { stage, setStage, reset } = useGameState();
  const audio = useAudio();
  const [wiping, setWiping] = useState(false);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const transition = useCallback(
    (target: Stage, startAudio = false) => {
      setWiping(true);
      if (startAudio) audio.play();
      clearTimer();
      timerRef.current = window.setTimeout(() => {
        setStage(target);
        setWiping(false);
        timerRef.current = null;
        window.scrollTo(0, 0);
      }, 430);
    },
    [audio, setStage, clearTimer],
  );

  const handleReplay = useCallback(() => {
    setWiping(true);
    reset();
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      setWiping(false);
      timerRef.current = null;
      window.scrollTo(0, 0);
    }, 430);
  }, [reset, clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return (
    <div className="game-root">
      <div key={stage} className="stage-enter">
        {stage === 'BOOT_SEQUENCE' && (
          <TerminalSequence onStart={() => transition('INCIDENT_REPORT')} />
        )}
        {stage === 'INCIDENT_REPORT' && (
          <IncidentReport onDone={() => transition('EMERGENCY_BOARD_MEETING')} />
        )}
        {stage === 'EMERGENCY_BOARD_MEETING' && (
          <BoardMeeting onDone={() => transition('THE_MOMENT_THAT_MATTERED', true)} />
        )}
        {stage === 'THE_MOMENT_THAT_MATTERED' && (
          <TheMoment onDone={() => transition('REDEMPTION_PATCH')} />
        )}
        {stage === 'REDEMPTION_PATCH' && (
          <PatchNotes onDone={() => transition('FINALE')} />
        )}
        {stage === 'FINALE' && <Finale onReplay={handleReplay} />}
      </div>

      <MusicPlayer />

      {wiping && <div className="wipe" aria-hidden="true" />}
    </div>
  );
}
