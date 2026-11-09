export interface EchoState {
  targetSequence: number[];
  playerSequence: number[];
  currentStep: number; // which note the player needs to play next
  sequenceLength: number; // 1 to 9 (or progressive mode)
  isProgressive: boolean;
  status: 'setting_length' | 'merlin_playing' | 'player_turn' | 'success' | 'failure';
  activeLight: number | null;
  highScore: number;
}

export function createInitialEchoState(): EchoState {
  return {
    targetSequence: [],
    playerSequence: [],
    currentStep: 0,
    sequenceLength: 4,
    isProgressive: true,
    status: 'setting_length',
    activeLight: null,
    highScore: 0,
  };
}

export function generateRandomEchoSequence(length: number): number[] {
  const seq: number[] = [];
  const validButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = 0; i < length; i++) {
    // Avoid immediate 3 repeats for nicer musicality
    const next = validButtons[Math.floor(Math.random() * validButtons.length)];
    seq.push(next);
  }
  return seq;
}
