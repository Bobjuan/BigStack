const SUITS = ['h', 'd', 'c', 's'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const BIG_BLIND_AMOUNT_DEFAULT = 10;
const SMALL_BLIND_AMOUNT_DEFAULT = 5;
const { Hand } = require('pokersolver');

const GamePhase = {
  PREFLOP: 'PREFLOP',
  FLOP: 'FLOP',
  TURN: 'TURN',
  RIVER: 'RIVER',
  SHOWDOWN: 'SHOWDOWN',
  HAND_OVER: 'HAND_OVER',
  WAITING: 'WAITING'
};
module.exports.GamePhase = GamePhase;

function createDeck() {
  const deck = [];
  for (const suit of SUITS) for (const rank of RANKS) deck.push(rank + suit);
  return deck;
}
function shuffleDeck(deck) {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}
function getSeatedPlayers(game) {
  return game.seats.filter(s => s && !s.isEmpty).map(s => s.player);
}

function assignPositions(players, dealerIndex) {
  const POS_9 = ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'MP', 'LJ', 'HJ', 'CO'];
  const POS_6 = ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO'];
  const POS_2 = ['BTN/SB', 'BB'];
  const num = players.length;
  let arr = POS_9;
  if (num <= 2) arr = POS_2; else if (num <= 6) arr = POS_6;
  const rel = arr.slice(0, num);
  players.forEach((p, idx) => {
    const posIdx = (idx - dealerIndex + num) % num;
    p.positionName = rel[posIdx];
    p.isDealer = p.positionName === 'BTN' || p.positionName === 'BTN/SB';
    p.isSB = p.positionName === 'SB' || p.positionName === 'BTN/SB';
    p.isBB = p.positionName === 'BB';
  });
}

function initGameState(gameSettings) {
  const maxPlayers = gameSettings.maxPlayers || 9;
  const seats = Array(maxPlayers).fill(null).map((_, i) => ({ seatIndex: i, isEmpty: true }));

  return {
    seats,
    spectators: [], // Array of playerInfo objects for those not seated
    deck: [],
    communityCards: [],
    pot: 0,
    currentBettingRound: GamePhase.WAITING,
    currentPlayerIndex: -1, // This will now refer to the index within the temporary 'seated players' array
    dealerIndex: -1, // This will also refer to the index within the temporary 'seated players' array
    currentHighestBet: 0,
    minRaiseAmount: gameSettings.blinds?.big || BIG_BLIND_AMOUNT_DEFAULT,
    lastAggressorIndex: -1,
    actionClosingPlayerIndex: -1,
    bigBlind: gameSettings.blinds?.big || BIG_BLIND_AMOUNT_DEFAULT,
    smallBlind: gameSettings.blinds?.small || SMALL_BLIND_AMOUNT_DEFAULT,
    winners: [],
    showdownPlayers: [],
    handOverMessage: "",
  };
}

function startHand(game) {
  const players = getSeatedPlayers(game);
  if (players.length < 2) {
    // Not enough players to start a hand.
    return;
  }
  game.deck = shuffleDeck(createDeck());
  game.communityCards = [];
  game.pot = 0;
  game.currentBettingRound = GamePhase.PREFLOP;
  game.currentHighestBet = 0;
  game.minRaiseAmount = game.bigBlind;
  game.lastAggressorIndex = -1;
  game.winners = [];
  game.showdownPlayers = [];
  game.handOverMessage = "";
  // rotate dealer
  game.dealerIndex = (game.dealerIndex + 1) % players.length;
  assignPositions(players, game.dealerIndex);
  // deal 2 cards each
  players.forEach(p => {
    p.cards = [game.deck.pop(), game.deck.pop()];
    p.isFolded = false;
    p.isAllIn = false;
    p.currentBet = 0;
    p.totalBetInHand = 0;
    p.hasActedThisRound = false;
  });
  // blinds
  const sbPlayerIndex = players.findIndex(p => p.isSB);
  const bbPlayerIndex = players.findIndex(p => p.isBB);

  postBlind(game, sbPlayerIndex, game.smallBlind);
  postBlind(game, bbPlayerIndex, game.bigBlind);

  game.currentHighestBet = game.bigBlind;
  game.lastAggressorIndex = bbPlayerIndex;

  if (players.length === 2) {
    game.currentPlayerIndex = sbPlayerIndex;
    game.actionClosingPlayerIndex = bbPlayerIndex;
  } else {
    game.currentPlayerIndex = (bbPlayerIndex + 1) % players.length;
    game.actionClosingPlayerIndex = bbPlayerIndex;
  }
}
function postBlind(game, idx, amt) {
  const players = getSeatedPlayers(game);
  if (idx === -1) return;
  const p = players[idx];
  const post = Math.min(p.stack, amt);
  p.stack -= post;
  p.currentBet = post;
  p.totalBetInHand = post;
  if (p.stack === 0) p.isAllIn = true;
  game.pot += post;
}

function processAction(game, playerId, action, details = {}) {
  const players = getSeatedPlayers(game);
  const idx = players.findIndex(p => p.id === playerId);
  if (idx !== game.currentPlayerIndex) return { error: 'Not your turn' };
  const player = players[idx];
  const highest = game.currentHighestBet;
  switch (action) {
    case 'fold':
      player.isFolded = true;
      break;
    case 'check':
      if (player.currentBet < highest) return { error: 'Cannot check' };
      break;
    case 'call': {
      const toCall = highest - player.currentBet;
      const amt = Math.min(toCall, player.stack);
      player.stack -= amt;
      player.currentBet += amt;
      player.totalBetInHand += amt;
      game.pot += amt;
      if (player.stack === 0) player.isAllIn = true;
      break;
    }
    case 'bet': {
      const amt = Number(details.amount);
      if (!amt || amt < 0) return { error: 'Invalid bet amount' };
      
      const betRequiredToCall = game.currentHighestBet - player.currentBet;
      const totalBetAmountOnStreet = amt;

      if (totalBetAmountOnStreet < game.currentHighestBet + game.minRaiseAmount && totalBetAmountOnStreet < player.stack) {
        if (totalBetAmountOnStreet < game.currentHighestBet) return { error: 'Bet/Raise amount is less than current highest bet.' };
        return { error: `Minimum raise is to ${game.currentHighestBet + game.minRaiseAmount}. Your bet is ${totalBetAmountOnStreet}.` };
      }
      if (totalBetAmountOnStreet > player.stack) return { error: 'Not enough chips for this bet/raise amount.' };

      const amountAddedToPot = totalBetAmountOnStreet - player.currentBet;
      player.stack -= amountAddedToPot;
      player.totalBetInHand += amountAddedToPot;
      player.currentBet = totalBetAmountOnStreet;
      game.pot += amountAddedToPot;

      if (player.currentBet > game.currentHighestBet) {
        game.minRaiseAmount = player.currentBet - game.currentHighestBet;
        game.currentHighestBet = player.currentBet;
        game.lastAggressorIndex = idx;
        game.actionClosingPlayerIndex = idx;
        players.forEach((p, i) => {
          if (i !== idx && !p.isFolded && !p.isAllIn) {
            p.hasActedThisRound = false;
          }
        });
      }
      
      if (player.stack === 0) player.isAllIn = true;
      break;
    }
    default:
      return { error: 'Unknown action' };
  }
  player.hasActedThisRound = true;
  advanceTurn(game);
  return { ok: true };
}

function advanceTurn(game) {
  const players = getSeatedPlayers(game);
  const len = players.length;
  let next = game.currentPlayerIndex;
  let guard=0;
  do {
    next = (next +1) % len;
    const p = players[next];
    let needsToAct = !p.isFolded && !p.isAllIn;
    if (needsToAct) {
        if (p.currentBet < game.currentHighestBet) {
        } else if (p.currentBet === game.currentHighestBet) {
            if (!p.hasActedThisRound) {
            } else {
                 needsToAct = false;
            }
        } else {
             needsToAct = false;
        }
    }
    const originalNeedsAction = !p.isFolded && !p.isAllIn && (!p.hasActedThisRound || p.currentBet < game.currentHighestBet);

    if(originalNeedsAction) {
      break;
    }
    guard++;
  } while(guard < len);
  
  if(guard>=len) next = -1;
  game.currentPlayerIndex = next;
}

function remainingActivePlayers(game){
    const players = getSeatedPlayers(game);
  return players.filter(p=>!p.isFolded);
}
function allPlayersActed(game){
    const players = getSeatedPlayers(game);
  return players.every(p=> p.isFolded || p.isAllIn || p.hasActedThisRound);
}
function bettingRoundComplete(game){
  const players = getSeatedPlayers(game);
  const activePlayers = players.filter(p => !p.isFolded);

  // 1. If 0 or 1 active players, betting is over.
  if (activePlayers.length <= 1) {
    return true;
  }

  // 2. Check if all active players who are not all-in have effectively matched the current highest bet.
  const allBetsSettled = activePlayers.every(p => 
    p.isAllIn || 
    p.currentBet === game.currentHighestBet ||
    (p.currentBet > 0 && game.currentHighestBet === 0) // This covers cases where first player bets and others fold around
  );
  
  if (!allBetsSettled) {
    // Exception: If currentHighestBet is 0, and only one player has a currentBet > 0 (they made an opening bet)
    // and everyone else folded back to them. The round should end. But activePlayers.length <=1 handles this.
    // This check is more for when betting has occurred and needs to be matched by multiple players.
    
    // If highestBet > 0, then all non-all-in players must have matched it if they are to be considered settled.
    if (game.currentHighestBet > 0 && !activePlayers.every(p => p.isAllIn || p.currentBet === game.currentHighestBet)) {
        return false; // Bets are not yet settled for all active, non-all-in players against a raise/bet.
    }
    // If highestBet is 0, but some players have acted (e.g. checked) but not all. Round is not over yet.
    // This is handled by the currentPlayerIndex check below.
  }

  // 3. Check if action has completed: game.currentPlayerIndex will be -1 
  // if advanceTurn found no player needing to act (they are folded, all-in, or have acted and their bet matches the highest).
  // When a raise occurs, `hasActedThisRound` is reset for others, ensuring they will be found by `advanceTurn` if they need to act.
  if (game.currentPlayerIndex === -1) {
    // This indicates advanceTurn (called after the last action) determined no one else has a required move.
    // And if allBetsSettled is also effectively true (or handled by activePlayers <=1), round is complete.
    // We need to ensure that `allBetsSettled` is robust for the `currentPlayerIndex === -1` case.
    // If currentPlayerIndex is -1, it means all players who *could* act have done so and their currentBet matches currentHighestBet (or they are all-in/folded).
    // So, if currentPlayerIndex is -1, the bets *must* be settled among those who could act.
    return true;
  }
  
  return false; // Default: betting round is not complete.
}
function dealCommunity(game, count){
  if(game.deck.length<count+1) return;
  game.deck.shift();
  for(let i=0;i<count;i++) game.communityCards.push(game.deck.shift());
}
function proceedRound(game) {
  const players = getSeatedPlayers(game);
  if (bettingRoundComplete(game)) {
    players.forEach(p => {
    });

    let newRoundStarted = false;
    switch (game.currentBettingRound) {
      case GamePhase.PREFLOP:
        dealCommunity(game, 3);
        game.currentBettingRound = GamePhase.FLOP;
        newRoundStarted = true;
        break;
      case GamePhase.FLOP:
        dealCommunity(game, 1);
        game.currentBettingRound = GamePhase.TURN;
        newRoundStarted = true;
        break;
      case GamePhase.TURN:
        dealCommunity(game, 1);
        game.currentBettingRound = GamePhase.RIVER;
        newRoundStarted = true;
        break;
      case GamePhase.RIVER:
        game.currentBettingRound = GamePhase.SHOWDOWN;
        break;
      default:
        return; 
    }

    if (newRoundStarted) {
      players.forEach(p => {
        if (!p.isFolded && !p.isAllIn) {
          p.hasActedThisRound = false;
        }
      });

      let nextPlayerForNewRound = -1;
      let guard = 0;
      let currentEvalPlayer = (game.dealerIndex + 1 + players.length) % players.length; 
      
      while (guard < players.length) {
        const player = players[currentEvalPlayer];
        if (!player.isFolded && !player.isAllIn) {
          nextPlayerForNewRound = currentEvalPlayer;
          break;
        }
        currentEvalPlayer = (currentEvalPlayer + 1 + players.length) % players.length;
        guard++;
      }
      game.currentPlayerIndex = nextPlayerForNewRound;
      game.currentHighestBet = 0;
      players.forEach(p => { 
        if(!p.isFolded && !p.isAllIn) p.currentBet = 0;
      });
      game.minRaiseAmount = game.bigBlind;
      game.lastAggressorIndex = -1;
      if (nextPlayerForNewRound !== -1) {
         let potentialClosing = nextPlayerForNewRound;
         let searchIdx = nextPlayerForNewRound;
         let searchGuard = 0;
         do {
            const p = players[searchIdx];
            if (!p.isFolded && !p.isAllIn) potentialClosing = searchIdx;
            searchIdx = (searchIdx + 1) % players.length;
            searchGuard++;
         } while (searchGuard < players.length && searchIdx !== nextPlayerForNewRound);
         game.actionClosingPlayerIndex = potentialClosing;
      } else {
        game.actionClosingPlayerIndex = -1;
      }

    } else if (game.currentBettingRound === GamePhase.SHOWDOWN) {
      resolveShowdown(game);
    }
  } 
}
function resolveShowdown(game){
  const players = getSeatedPlayers(game);
  const contenders = players.filter(p=>!p.isFolded && p.cards && p.cards.length === 2);
  game.showdownPlayers = contenders.map(p => p.id);

  if(contenders.length === 0) {
    game.handOverMessage = "No contenders for showdown.";
    game.currentBettingRound = GamePhase.HAND_OVER;
    game.winners = [];
    return;
  }

  if(contenders.length === 1){
     const winner = contenders[0];
     winner.stack += game.pot;
     game.winners = [{ 
        id: winner.id, 
        name: winner.name, 
        cards: winner.cards,
        handDescription: "Only remaining player", 
        amountWon: game.pot 
     }];
     game.handOverMessage = `${winner.name} wins ${game.pot} as the only remaining player.`;
     game.pot=0;
     game.currentBettingRound = GamePhase.HAND_OVER;
     return;
  }

  game.solvedHands = contenders.map(p => {
    const hand = Hand.solve([...p.cards, ...game.communityCards]);
    return { player: p, hand: hand, handDescription: hand.descr };
  });

  const allPlayerHandsForSolver = game.solvedHands.map(s => s.hand);
  let _winningSolverHands = Hand.winners(allPlayerHandsForSolver);

  // Safeguard: If pokersolver returns multiple "winners", ensure they are of the same actual rank.
  if (_winningSolverHands.length > 1) {
    let bestRank = -1;
    // Find the best rank among the tentatively winning hands (lower rank is better)
    _winningSolverHands.forEach(h => {
      if (bestRank === -1 || h.rank < bestRank) {
        bestRank = h.rank;
      }
    });
    // Filter to only include hands that match this best rank
    _winningSolverHands = _winningSolverHands.filter(h => h.rank === bestRank);
  }
  // Now _winningSolverHands contains only the truly best hand(s)

  game.winners = [];
  let totalPotAwarded = 0;

  // Use a Set for efficient lookup based on object reference
  const winningHandObjectSet = new Set(_winningSolverHands);
  const actualWinnersData = game.solvedHands.filter(s => 
    winningHandObjectSet.has(s.hand) // Check if the hand object itself is in the set of winning hands
  );

  if (actualWinnersData.length > 0) {
    const potShare = Math.floor(game.pot / actualWinnersData.length);
    actualWinnersData.forEach(winnerData => {
      winnerData.player.stack += potShare;
      totalPotAwarded += potShare;
      game.winners.push({
        id: winnerData.player.id,
        name: winnerData.player.name,
        cards: winnerData.player.cards,
        handDescription: winnerData.handDescription,
        amountWon: potShare
      });
    });
    const remainder = game.pot - totalPotAwarded;
    if (remainder > 0 && game.winners.length > 0) {
      const firstWinnerId = game.winners[0].id;
      const firstWinnerPlayer = players.find(p => p.id === firstWinnerId);
      if (firstWinnerPlayer) firstWinnerPlayer.stack += remainder;
      game.winners[0].amountWon += remainder;
    }
    // Construct handOverMessage based on the number of actual winners
    if (game.winners.length === 1) {
      game.handOverMessage = `${game.winners[0].name} (with ${game.winners[0].handDescription}) wins ${game.winners[0].amountWon}.`;
    } else if (game.winners.length > 1) {
      // Assuming potShare was calculated correctly for an even split before remainder.
      // The amountWon in each winner object should reflect their share.
      game.handOverMessage = `${game.winners.map(w => `${w.name} (with ${w.handDescription})`).join(', ')} split the pot. Each wins ${game.winners[0].amountWon}.`;
    } else {
      // This case should ideally not be reached if actualWinnersData had entries.
      game.handOverMessage = "Error determining winner message.";
    }

  } else {
     game.handOverMessage = "Error determining winners or a chop with no one qualifying?";
  }

  game.pot = 0;
  game.currentBettingRound = GamePhase.HAND_OVER;
}

function runItOutStep(game) {
    if (game.currentBettingRound === GamePhase.RIVER || game.currentBettingRound === GamePhase.SHOWDOWN) {
        resolveShowdown(game);
        return;
    }

    switch (game.currentBettingRound) {
        case GamePhase.PREFLOP:
            dealCommunity(game, 3);
            game.currentBettingRound = GamePhase.FLOP;
            break;
        case GamePhase.FLOP:
            dealCommunity(game, 1);
            game.currentBettingRound = GamePhase.TURN;
            break;
        case GamePhase.TURN:
            dealCommunity(game, 1);
            game.currentBettingRound = GamePhase.RIVER;
            break;
    }
}

const originalProcess = processAction;
function processActionWrapper(game, playerId, action, details = {}) {
  const roundInitial = game.currentBettingRound;
  const playerInitialTurn = game.currentPlayerIndex; 

  const res = originalProcess(game, playerId, action, details);
  if (res.error) return res;

  const activePlayers = remainingActivePlayers(game);
  if (activePlayers.length <= 1) {
    let handEndMessage = "";
    if (activePlayers.length === 1) {
      const winner = activePlayers[0];
      winner.stack += game.pot;
      game.winners = [{ 
          id: winner.id, 
          name: winner.name, 
          cards: winner.cards,
          handDescription: "Opponents folded", 
          amountWon: game.pot 
      }];
      handEndMessage = `${winner.name} wins ${game.pot} as opponents folded.`;
    } else {
      handEndMessage = "All players folded. Pot remains or split (logic TBD).";
      game.winners = [];
    }
    game.pot = 0;
    game.currentBettingRound = GamePhase.HAND_OVER;
    game.handOverMessage = handEndMessage;
    game.currentPlayerIndex = -1;
    return res;
  }

  const canStillBetPlayers = activePlayers.filter(p => !p.isAllIn);
  if (activePlayers.length > 1 && canStillBetPlayers.length <= 1) {
    game.runItOut = true;
    game.currentPlayerIndex = -1;
    return res;
  }

  proceedRound(game);

  if (game.currentBettingRound === roundInitial && 
      game.currentBettingRound !== GamePhase.HAND_OVER && 
      game.currentBettingRound !== GamePhase.SHOWDOWN) {
    if (game.currentPlayerIndex === -1) {
      proceedRound(game);
    }
  }

  return res;
}

module.exports = {
  createDeck,
  shuffleDeck,
  initGameState,
  startHand,
  processAction: processActionWrapper,
  GamePhase,
  getSeatedPlayers,
  runItOutStep,
}; 