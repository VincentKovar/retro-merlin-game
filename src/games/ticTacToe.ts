// Game 1: Tic-Tac-Toe
// Player = blinking LED, Merlin = solid LED
// Buttons 1-9 form the 3x3 grid

export type TttCell = 'empty' | 'player' | 'merlin';

export const WINNING_LINES = [
  [1, 2, 3], // Row 1
  [4, 5, 6], // Row 2
  [7, 8, 9], // Row 3
  [1, 4, 7], // Col 1
  [2, 5, 8], // Col 2
  [3, 6, 9], // Col 3
  [1, 5, 9], // Diag 1
  [3, 5, 7], // Diag 2
];

export interface TttState {
  board: Record<number, TttCell>;
  pendingPlayerMove: number | null; // Cell player tapped before pressing COMP TURN
  winner: 'player' | 'merlin' | 'draw' | null;
  winningLine: number[] | null;
  score: { player: number; merlin: number; draws: number };
}

export function createInitialTttState(): TttState {
  const board: Record<number, TttCell> = {};
  for (let i = 1; i <= 9; i++) {
    board[i] = 'empty';
  }
  return {
    board,
    pendingPlayerMove: null,
    winner: null,
    winningLine: null,
    score: { player: 0, merlin: 0, draws: 0 },
  };
}

export function checkTttWinner(board: Record<number, TttCell>): { winner: 'player' | 'merlin' | 'draw' | null; line: number[] | null } {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] !== 'empty' && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }

  // Check draw
  const isFull = Object.values(board).every(cell => cell !== 'empty');
  if (isFull) {
    return { winner: 'draw', line: null };
  }

  return { winner: null, line: null };
}

/**
 * Authentic aggressive Merlin AI strategy
 */
export function getMerlinTttMove(board: Record<number, TttCell>): number | null {
  // 1. Can Merlin win in one move?
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const cells = [board[a], board[b], board[c]];
    const merlinCount = cells.filter(c => c === 'merlin').length;
    const emptyCount = cells.filter(c => c === 'empty').length;
    if (merlinCount === 2 && emptyCount === 1) {
      if (board[a] === 'empty') return a;
      if (board[b] === 'empty') return b;
      if (board[c] === 'empty') return c;
    }
  }

  // 2. Can player win in one move? Block player!
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const cells = [board[a], board[b], board[c]];
    const playerCount = cells.filter(c => c === 'player').length;
    const emptyCount = cells.filter(c => c === 'empty').length;
    if (playerCount === 2 && emptyCount === 1) {
      if (board[a] === 'empty') return a;
      if (board[b] === 'empty') return b;
      if (board[c] === 'empty') return c;
    }
  }

  // 3. Take center (button 5)
  if (board[5] === 'empty') {
    return 5;
  }

  // 4. Take strategic corners: 1, 3, 7, 9
  const corners = [1, 3, 7, 9].filter(c => board[c] === 'empty');
  if (corners.length > 0) {
    // Pick random empty corner
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // 5. Take any remaining empty edges
  const edges = [2, 4, 6, 8].filter(e => board[e] === 'empty');
  if (edges.length > 0) {
    return edges[Math.floor(Math.random() * edges.length)];
  }

  return null;
}
