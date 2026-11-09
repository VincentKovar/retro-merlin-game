export type GameId = 
  | 'none'
  | 'tictactoe'      // 1
  | 'music'          // 2
  | 'echo'           // 3
  | 'blackjack'      // 4
  | 'magicsquare'    // 5
  | 'mindbender';    // 6

export interface LedState {
  isOn: boolean;
  isBlinking: boolean;
  intensity?: number; // 0 to 1
  label?: string;
}

export type LedMatrix = Record<number, LedState>; // keys 0 through 10

export type ColorTheme = 'ruby' | 'amber' | 'green' | 'monochrome';

export interface ThemeColors {
  id: ColorTheme;
  name: string;
  ledOn: string;
  ledGlow: string;
  ledCore: string;
  ledOff: string;
  textColor: string;
  accentBorder: string;
  label: string;
}

export interface GameInfo {
  id: GameId;
  number: number;
  name: string;
  subtitle: string;
  goal: string;
  instructions: string[];
  controls: {
    hitMe?: string;
    compTurn: string;
    sameGame: string;
  };
}

export interface SongPreset {
  id: string;
  title: string;
  notes: number[]; // 0 is rest, 1-10 are notes
  tempo: number; // ms per note
}
