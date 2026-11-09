import { GameInfo, GameId } from '../types/merlin';

export const MERLIN_GAMES: Record<GameId, GameInfo> = {
  none: {
    id: 'none',
    number: 0,
    name: 'SELECT GAME',
    subtitle: 'Press 1 to 6 to start',
    goal: 'Choose one of Merlin\'s six built-in electronic games.',
    instructions: [
      '1 - Tic-Tac-Toe',
      '2 - Music Machine',
      '3 - Echo',
      '4 - Blackjack 13',
      '5 - Magic Square',
      '6 - Mindbender'
    ],
    controls: {
      compTurn: 'Select game',
      sameGame: 'Restart'
    }
  },
  tictactoe: {
    id: 'tictactoe',
    number: 1,
    name: 'TIC-TAC-TOE',
    subtitle: 'Play against Merlin\'s aggressive AI',
    goal: 'Get three of your blinking lights in a row—horizontally, vertically, or diagonally—before Merlin does with solid lights.',
    instructions: [
      'Buttons 1 through 9 form the 3x3 grid.',
      'Touch any unlighted square to place your move. Your mark will BLINK.',
      'Press COMP TURN for Merlin to calculate and make its move (solid light).',
      'Merlin plays aggressive defense and offense—watch your corners!'
    ],
    controls: {
      compTurn: 'Hand turn to Merlin',
      sameGame: 'Rematch with same starting player'
    }
  },
  music: {
    id: 'music',
    number: 2,
    name: 'MUSIC MACHINE',
    subtitle: 'Compose & playback tunes up to 48 notes',
    goal: 'Turn Merlin into an electronic musical instrument and record your own original compositions.',
    instructions: [
      'Buttons 1 through 10 play distinct musical scale notes.',
      'Button 0 acts as a musical REST (quarter pause).',
      'Merlin records up to 48 notes in its electronic memory.',
      'Press COMP TURN to have Merlin play back your masterpiece in real-time!',
      'Try loading retro classics from the Song Library!'
    ],
    controls: {
      compTurn: 'Play back recorded tune',
      sameGame: 'Replay last composed song'
    }
  },
  echo: {
    id: 'echo',
    number: 3,
    name: 'ECHO',
    subtitle: 'Memory light-and-sound challenge',
    goal: 'Repeat Merlin\'s secret sequence of lights and tones without a single error.',
    instructions: [
      'Merlin will play a sequence of random tones and flashing lights.',
      'Listen and watch closely, then repeat the exact sequence on the keypad.',
      'In Progressive Mode, each round adds another note to test your memory limits (up to 9 notes)!',
      'A mistake triggers Merlin\'s low defeat buzz.'
    ],
    controls: {
      compTurn: 'Re-listen to current sequence',
      sameGame: 'Replay current round or restart sequence'
    }
  },
  blackjack: {
    id: 'blackjack',
    number: 4,
    name: 'BLACKJACK 13',
    subtitle: 'Electronic card duel vs Merlin Dealer',
    goal: 'Reach 13 or as close as possible without busting. Win 10 chips to bankrupt Merlin!',
    instructions: [
      'Cards are numbered 1 through 10 (represented by buttons 1 to 10).',
      'You and Merlin are each dealt cards. You start with 5 chips (LEDs 1–5).',
      'Press HIT ME to draw another card and add to your total.',
      'If your total exceeds 13, you BUST and lose 1 chip.',
      'Press COMP TURN to stand. Merlin reveals its card and draws until 10 or more.',
      'Accumulate 10 chips to win the game! Lose all 5 chips and Merlin wins.'
    ],
    controls: {
      hitMe: 'Deal another card to yourself',
      compTurn: 'Stand with your current total',
      sameGame: 'Deal the next hand'
    }
  },
  magicsquare: {
    id: 'magicsquare',
    number: 5,
    name: 'MAGIC SQUARE',
    subtitle: 'Electronic 8-light perimeter puzzle',
    goal: 'Form an 8-light square around the perimeter (buttons 1, 2, 3, 4, 6, 7, 8, 9 lit ON) and center button 5 turned OFF.',
    instructions: [
      'Buttons 1 through 9 toggle specific patterns when pressed:',
      'Corners (1, 3, 7, 9): Reverses state of 4 buttons in that 2x2 corner square.',
      'Edges (2, 4, 6, 8): Reverses the 3 buttons in that row or column.',
      'Center (5): Reverses the 5 buttons in the \'+\' cross shape.',
      'Can you solve it in the minimum number of moves?'
    ],
    controls: {
      compTurn: 'Check solution status',
      sameGame: 'Restart same scrambled board'
    }
  },
  mindbender: {
    id: 'mindbender',
    number: 6,
    name: 'MINDBENDER',
    subtitle: 'Mastermind codebreaking logic duel',
    goal: 'Deduce Merlin\'s secret hidden number combination in 9 attempts or fewer.',
    instructions: [
      'Enter your guess using the numbered keys (default 3 digits).',
      'Press COMP TURN to submit your guess to Merlin.',
      'SOLID LIGHT: Guessed number is CORRECT and in the EXACT position!',
      'FLASHING LIGHT: Guessed number is CORRECT but in the WRONG position!',
      'NO LIGHT: Number is not in the secret code.'
    ],
    controls: {
      compTurn: 'Submit current guess to Merlin',
      sameGame: 'Start new secret code with same length'
    }
  }
};

export const COLOR_THEMES = [
  {
    id: 'ruby',
    name: '1978 Ruby Red',
    ledOn: '#ff1a1a',
    ledGlow: 'rgba(255, 30, 30, 0.85)',
    ledCore: '#ffffff',
    ledOff: '#2a0a0a',
    textColor: '#ff4d4d',
    accentBorder: '#8a1c1c',
    label: 'Classic 1978'
  },
  {
    id: 'amber',
    name: 'Vintage Amber',
    ledOn: '#ff9900',
    ledGlow: 'rgba(255, 160, 20, 0.85)',
    ledCore: '#fff7e6',
    ledOff: '#2b1b08',
    textColor: '#ffa726',
    accentBorder: '#8c5000',
    label: 'Plasma Amber'
  },
  {
    id: 'green',
    name: 'VFD Phosphor',
    ledOn: '#00ff66',
    ledGlow: 'rgba(0, 255, 102, 0.85)',
    ledCore: '#e6fff0',
    ledOff: '#06240f',
    textColor: '#4ade80',
    accentBorder: '#0e5f2a',
    label: 'Phosphor Green'
  },
  {
    id: 'monochrome',
    name: 'High-Contrast Monochrome',
    ledOn: '#f5f5f5',
    ledGlow: 'rgba(240, 240, 240, 0.85)',
    ledCore: '#ffffff',
    ledOff: '#1f1f1f',
    textColor: '#e5e5e5',
    accentBorder: '#555555',
    label: 'Monochrome Silver'
  }
] as const;
