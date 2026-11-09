// Game 5: Magic Square
// Goal: 8 outer buttons (1,2,3,4,6,7,8,9) lit ON, center button 5 OFF.

export const TOGGLE_MAP: Record<number, number[]> = {
  // Corners toggle their 2x2 quadrant:
  1: [1, 2, 4, 5],
  3: [2, 3, 5, 6],
  7: [4, 5, 7, 8],
  9: [5, 6, 8, 9],
  // Edges toggle their 3-button row/column:
  2: [1, 2, 3], // Top row
  4: [1, 4, 7], // Left column
  6: [3, 6, 9], // Right column
  8: [7, 8, 9], // Bottom row
  // Center toggles the cross:
  5: [2, 4, 5, 6, 8],
};

export interface MagicSquareState {
  grid: Record<number, boolean>;
  moveCount: number;
  isSolved: boolean;
  history: number[];
}

export function isMagicSquareSolved(grid: Record<number, boolean>): boolean {
  const outerButtons = [1, 2, 3, 4, 6, 7, 8, 9];
  const allOuterOn = outerButtons.every(b => grid[b] === true);
  const centerOff = grid[5] === false;
  return allOuterOn && centerOff;
}

export function toggleSquare(grid: Record<number, boolean>, button: number): Record<number, boolean> {
  const newGrid = { ...grid };
  const affected = TOGGLE_MAP[button] || [];
  for (const b of affected) {
    newGrid[b] = !newGrid[b];
  }
  return newGrid;
}

export function createInitialMagicSquareState(scrambleSteps: number = 8): MagicSquareState {
  // Start with solved state: outer 8 on, center off
  let grid: Record<number, boolean> = {
    1: true, 2: true, 3: true,
    4: true, 5: false, 6: true,
    7: true, 8: true, 9: true,
  };

  // Scramble with valid moves to ensure solvability
  const moves: number[] = [];
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = 0; i < scrambleSteps; i++) {
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    grid = toggleSquare(grid, randomKey);
    moves.push(randomKey);
  }

  // Ensure it's not accidentally solved right after scramble
  if (isMagicSquareSolved(grid)) {
    grid = toggleSquare(grid, 2);
  }

  return {
    grid,
    moveCount: 0,
    isSolved: false,
    history: [],
  };
}
