export interface MindbenderFeedback {
  exactMatches: number; // Correct number & position (Solid lights)
  valueMatches: number; // Correct number, wrong position (Blinking lights)
  solidLeds: number[]; // button numbers that get solid light
  blinkingLeds: number[]; // button numbers that get blinking light
}

export interface GuessRecord {
  guess: number[];
  feedback: MindbenderFeedback;
}

export interface MindbenderState {
  codeLength: number; // 2, 3, or 4 (default 3)
  secretCode: number[];
  currentInput: number[];
  guesses: GuessRecord[];
  maxAttempts: number;
  status: 'playing' | 'won' | 'lost';
  lastFeedback: MindbenderFeedback | null;
}

export function generateMindbenderCode(length: number): number[] {
  // Numbers 1 through 9, typically unique or allowed duplicates
  const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const code: number[] = [];
  const available = [...pool];

  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * available.length);
    code.push(available[idx]);
    available.splice(idx, 1);
  }
  return code;
}

export function evaluateMindbenderGuess(guess: number[], secret: number[]): MindbenderFeedback {
  const solidLeds: number[] = [];
  const blinkingLeds: number[] = [];

  const secretMatched = new Array(secret.length).fill(false);
  const guessMatched = new Array(guess.length).fill(false);

  // First pass: exact matches (solid)
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secret[i]) {
      solidLeds.push(guess[i]);
      secretMatched[i] = true;
      guessMatched[i] = true;
    }
  }

  // Second pass: value matches (blinking)
  for (let i = 0; i < guess.length; i++) {
    if (!guessMatched[i]) {
      for (let j = 0; j < secret.length; j++) {
        if (!secretMatched[j] && guess[i] === secret[j]) {
          blinkingLeds.push(guess[i]);
          secretMatched[j] = true;
          break;
        }
      }
    }
  }

  return {
    exactMatches: solidLeds.length,
    valueMatches: blinkingLeds.length,
    solidLeds,
    blinkingLeds,
  };
}

export function createInitialMindbenderState(length: number = 3): MindbenderState {
  const secretCode = generateMindbenderCode(length);
  return {
    codeLength: length,
    secretCode,
    currentInput: [],
    guesses: [],
    maxAttempts: 9,
    status: 'playing',
    lastFeedback: null,
  };
}
