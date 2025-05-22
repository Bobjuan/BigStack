export const SUITS = ['h', 'd', 'c', 's'];
export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
export const BIG_BLIND_AMOUNT = 10;
export const SMALL_BLIND_AMOUNT = 5;

export const GamePhase = {
  PREFLOP: 'PREFLOP',
  FLOP: 'FLOP',
  TURN: 'TURN',
  RIVER: 'RIVER',
  SHOWDOWN: 'SHOWDOWN',
  HAND_OVER: 'HAND_OVER',
};

export const createDeck = () => {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push(rank + suit);
    }
  }
  return deck;
};

export const shuffleDeck = (deck) => {
  let shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
};

export const getNextPlayerIndex = (currentIndex, players) => {
  let nextIndex = (currentIndex + 1) % players.length;
  let loopGuard = 0;
  while (players[nextIndex].isFolded || (players[nextIndex].isAllIn && players[nextIndex].currentBet === 0)) {
    nextIndex = (nextIndex + 1) % players.length;
    loopGuard++;
    if (loopGuard > players.length * 2) return -1;
  }
  return nextIndex;
};

export const POSITIONS_9MAX = ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'MP', 'LJ', 'HJ', 'CO'];
export const POSITIONS_6MAX = ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO'];
export const POSITIONS_HEADSUP = ['BTN/SB', 'BB'];

export const initializePlayer = (id, name, stack) => ({
  id,
  name,
  cards: [],
  stack,
  currentBet: 0,
  totalBetInHand: 0,
  isTurn: false,
  isFolded: false,
  isAllIn: false,
  isDealer: false,
  isSB: false,
  isBB: false,
  hasActedThisRound: false,
  positionName: '',
}); 