export interface BlackjackState {
  playerChips: number; // 0 to 10 (starts at 5)
  playerCards: number[];
  dealerCards: number[];
  playerTotal: number;
  dealerTotal: number;
  phase: 'betting' | 'player_turn' | 'dealer_turn' | 'round_over' | 'game_won' | 'game_lost';
  lastDrawnCard: number | null;
  message: string;
  roundResult: 'player_win' | 'dealer_win' | 'push' | 'player_bust' | 'dealer_bust' | null;
}

export function drawCard(): number {
  // Cards are 1 through 10
  return Math.floor(Math.random() * 10) + 1;
}

export function calculateTotal(cards: number[]): number {
  return cards.reduce((sum, c) => sum + c, 0);
}

export function createInitialBlackjackState(): BlackjackState {
  return {
    playerChips: 5,
    playerCards: [],
    dealerCards: [],
    playerTotal: 0,
    dealerTotal: 0,
    phase: 'player_turn',
    lastDrawnCard: null,
    message: 'Press HIT ME to draw or COMP TURN to stand',
    roundResult: null,
  };
}

export function startNewBlackjackRound(currentChips: number): BlackjackState {
  const pCard = drawCard();
  const dCard = drawCard();
  return {
    playerChips: currentChips,
    playerCards: [pCard],
    dealerCards: [dCard],
    playerTotal: pCard,
    dealerTotal: dCard,
    phase: 'player_turn',
    lastDrawnCard: pCard,
    message: `You were dealt ${pCard}. Press HIT ME or COMP TURN.`,
    roundResult: null,
  };
}
