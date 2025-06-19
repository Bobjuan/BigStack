const { GamePhase } = require('../constants');

// Default values, can be overridden by gameSettings
const BIG_BLIND_AMOUNT_DEFAULT = 10;
const SMALL_BLIND_AMOUNT_DEFAULT = 5;

function createInitialState(gameSettings) {
  const maxPlayers = gameSettings.maxPlayers || 9;
  const seats = Array(maxPlayers).fill(null).map((_, i) => ({ seatIndex: i, isEmpty: true }));

  return {
    seats,
    spectators: [],
    deck: [],
    communityCards: [],
    pot: 0,
    pots: [],
    currentBettingRound: GamePhase.WAITING,
    currentPlayerIndex: -1,
    dealerIndex: -1,
    currentHighestBet: 0,
    minRaiseAmount: gameSettings.blinds?.big || BIG_BLIND_AMOUNT_DEFAULT,
    lastRaiseAmount: 0,
    lastAggressorIndex: -1,
    actionClosingPlayerIndex: -1,
    bigBlind: gameSettings.blinds?.big || BIG_BLIND_AMOUNT_DEFAULT,
    smallBlind: gameSettings.blinds?.small || SMALL_BLIND_AMOUNT_DEFAULT,
    winners: [],
    showdownPlayers: [],
    handOverMessage: "",
    turnStartTime: null,
    timeBank: gameSettings.timeBank || 60,
    ritPending: false,
    ritVotes: {},
    ritRequired: [],
    gameSettings: gameSettings
  };
}

function getSeatedPlayers(game) {
  return game.seats.filter(s => s && !s.isEmpty).map(s => s.player);
}

function getActivePlayers(game) {
    return getSeatedPlayers(game).filter(p => !p.isFolded);
}

module.exports = {
  createInitialState,
  getSeatedPlayers,
  getActivePlayers,
}; 