import { useCallback, useState } from 'react';

export type Stage =
  | 'BOOT_SEQUENCE'
  | 'INCIDENT_REPORT'
  | 'EMERGENCY_BOARD_MEETING'
  | 'THE_MOMENT_THAT_MATTERED'
  | 'REDEMPTION_PATCH'
  | 'FINALE';

export const STAGE_ORDER: Stage[] = [
  'BOOT_SEQUENCE',
  'INCIDENT_REPORT',
  'EMERGENCY_BOARD_MEETING',
  'THE_MOMENT_THAT_MATTERED',
  'REDEMPTION_PATCH',
  'FINALE',
];

export type GameState = {
  stage: Stage;
  setStage: (stage: Stage) => void;
  next: () => void;
  reset: () => void;
};

export function useGameState(): GameState {
  const [stage, setStage] = useState<Stage>('BOOT_SEQUENCE');

  const next = useCallback(() => {
    setStage((current) => {
      const index = STAGE_ORDER.indexOf(current);
      const nextIndex = Math.min(index + 1, STAGE_ORDER.length - 1);
      return STAGE_ORDER[nextIndex];
    });
  }, []);

  const reset = useCallback(() => setStage('BOOT_SEQUENCE'), []);

  return { stage, setStage, next, reset };
}
