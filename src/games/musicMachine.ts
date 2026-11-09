import { SongPreset } from '../types/merlin';

export const SAMPLE_SONGS: SongPreset[] = [
  {
    id: 'twinkle',
    title: 'Twinkle Twinkle Little Star',
    notes: [1, 1, 5, 5, 6, 6, 5, 0, 4, 4, 3, 3, 2, 2, 1],
    tempo: 300,
  },
  {
    id: 'ode-to-joy',
    title: 'Ode to Joy (Beethoven)',
    notes: [3, 3, 4, 5, 5, 4, 3, 2, 1, 1, 2, 3, 3, 2, 2],
    tempo: 280,
  },
  {
    id: 'star-wars',
    title: 'Star Wars Main Theme',
    notes: [1, 1, 1, 4, 8, 0, 7, 6, 5, 10, 8, 0, 7, 6, 5, 10, 8],
    tempo: 260,
  },
  {
    id: 'close-encounters',
    title: 'Close Encounters (5 Tones)',
    notes: [2, 3, 1, 0, 1, 5],
    tempo: 450,
  },
  {
    id: 'yankee-doodle',
    title: 'Yankee Doodle',
    notes: [1, 1, 2, 3, 1, 3, 2, 0, 1, 1, 2, 3, 1, 0, 7, 0],
    tempo: 240,
  },
  {
    id: 'popcorn',
    title: 'Popcorn (1970s Synth Pop)',
    notes: [5, 4, 5, 2, 0, 5, 4, 5, 2, 0, 5, 7, 8, 7, 8, 5],
    tempo: 200,
  },
];

export const MAX_NOTES = 48;

export interface MusicMachineState {
  notes: number[];
  isPlaying: boolean;
  currentPlayIndex: number | null;
  tempo: number; // ms per note
}

export function createInitialMusicState(): MusicMachineState {
  return {
    notes: [],
    isPlaying: false,
    currentPlayIndex: null,
    tempo: 280,
  };
}
