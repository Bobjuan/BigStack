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

function startHand(game) {
  const players = getSeatedPlayers(game);
  if (players.length < 2) {
    return;
  }
  game.deck = shuffleDeck(createDeck());
  game.communityCards = [];
  game.pot = 0;
  game.pots = [];
  game.currentBettingRound = GamePhase.PREFLOP;
  game.currentHighestBet = 0;
  game.minRaiseAmount = game.bigBlind;
  game.lastRaiseAmount = game.bigBlind;
  game.lastAggressorIndex = -1;
  game.winners = [];
  game.showdownPlayers = [];
  game.handOverMessage = "";
  game.ritPending = false;
  game.ritVotes = {};
  game.ritRequired = [];
  delete game.runItTwice;
  delete game.runItOut;
  delete game.ritFirstRun;
  delete game.ritSecondRun;
  delete game.ritFirstWinners;
  delete game.ritSecondWinners;
  
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
  game.turnStartTime = Date.now();
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
      const totalBetAmount = Number(details.amount);
      if (!totalBetAmount || totalBetAmount < 0) return { error: 'Invalid bet amount' };
      
      const amountToAdd = totalBetAmount - player.currentBet;
      if (amountToAdd > player.stack) return { error: 'Not enough chips' };
      
      const isAllIn = amountToAdd === player.stack;
      const raiseAmount = totalBetAmount - highest;
      
      // Validate minimum raise (unless all-in)
      if (!isAllIn && raiseAmount < game.minRaiseAmount) {
        return { error: `Minimum raise is ${game.minRaiseAmount}. You raised ${raiseAmount}.` };
      }
      
      // Execute the bet
      player.stack -= amountToAdd;
      player.currentBet = totalBetAmount;
      player.totalBetInHand += amountToAdd;
      game.pot += amountToAdd;
      
      if (totalBetAmount > game.currentHighestBet) {
        game.lastRaiseAmount = raiseAmount;
        game.minRaiseAmount = raiseAmount;
        game.currentHighestBet = totalBetAmount;
        game.lastAggressorIndex = idx;
        game.actionClosingPlayerIndex = idx;
        
        // Reset hasActedThisRound for players who need to respond
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
  let foundNextPlayer = false;
  
  // Look for next player who needs to act
  for (let i = 0; i < len; i++) {
    next = (next + 1) % len;
    const p = players[next];
    
    if (!p.isFolded && !p.isAllIn) {
      const needsToAct = !p.hasActedThisRound || p.currentBet < game.currentHighestBet;
      if (needsToAct) {
        foundNextPlayer = true;
        break;
      }
    }
  }
  
  if (!foundNextPlayer) {
    next = -1;
    // Check if we should auto-proceed when everyone is all-in
    const activePlayers = players.filter(p => !p.isFolded);
    const canActPlayers = activePlayers.filter(p => !p.isAllIn);
    if (activePlayers.length > 1 && canActPlayers.length === 0) {
      // Everyone is all-in, trigger auto-proceed
      setTimeout(() => proceedRound(game), 0);
    }
  }
  
  game.currentPlayerIndex = next;
  game.turnStartTime = next !== -1 ? Date.now() : null;
}

function remainingActivePlayers(game) {
  const players = getSeatedPlayers(game);
  return players.filter(p => !p.isFolded);
}

function bettingRoundComplete(game) {
  const activePlayers = getSeatedPlayers(game).filter(p => !p.isFolded);
  
  if (activePlayers.length <= 1) {
    return true;
  }
  
  const highestBet = Math.max(...activePlayers.map(p => p.currentBet));
  
  if (highestBet === 0) {
    return activePlayers.every(p => p.hasActedThisRound);
  }
  
  const betsSettled = activePlayers.every(p => p.currentBet === highestBet || p.isAllIn);
  if (!betsSettled) return false;
  
  const playersAtHighest = activePlayers.filter(p => !p.isAllIn && p.currentBet === highestBet);
  return playersAtHighest.every(p => p.hasActedThisRound);
}

function dealCommunity(game, count) {
  if (game.deck.length < count + 1) return;
  
  // Burn card
  game.deck.shift();
  
  // Deal community cards
  for (let i = 0; i < count; i++) {
    game.communityCards.push(game.deck.shift());
  }
}

function dealCommunityForRIT(deck, existingCards, cardsNeeded) {
  const community = [...existingCards];
  
  // For RIT, we need to handle burns properly
  // If we're completing from flop (3 cards), we need turn + river (2 more cards)
  // Each street needs a burn
  
  let cardsDealt = existingCards.length;
  
  while (community.length < 5 && deck.length > 0) {
    // Burn before each street
    if (cardsDealt === 0 || cardsDealt === 3 || cardsDealt === 4) {
      deck.shift(); // burn
    }
    
    // Deal the card(s)
    if (cardsDealt < 3) {
      // Dealing flop
      for (let i = 0; i < 3 && community.length < 5; i++) {
        community.push(deck.shift());
        cardsDealt++;
      }
    } else {
      // Dealing turn or river
      community.push(deck.shift());
      cardsDealt++;
    }
  }
  
  return community;
}

function buildSidePots(game) {
  const players = getSeatedPlayers(game);
  const activePlayers = players.filter(p => !p.isFolded);
  
  if (activePlayers.length === 0) return;
  
  // Clear existing pots
  game.pots = [];
  
  // Sort players by their total contribution (ascending)
  const sortedPlayers = [...activePlayers].sort((a, b) => a.totalBetInHand - b.totalBetInHand);
  
  let previousContribution = 0;
  
  for (let i = 0; i < sortedPlayers.length; i++) {
    const player = sortedPlayers[i];
    const contribution = player.totalBetInHand;
    
    if (contribution > previousContribution) {
      const potAmount = contribution - previousContribution;
      const eligiblePlayers = sortedPlayers.slice(i).map(p => p.id);
      
      // Calculate the actual pot size (potAmount * number of contributors)
      const contributors = activePlayers.filter(p => p.totalBetInHand >= contribution);
      const potSize = potAmount * contributors.length;
      
      if (potSize > 0) {
        game.pots.push({
          amount: potSize,
          eligiblePlayerIds: eligiblePlayers
        });
      }
      
      previousContribution = contribution;
    }
  }
  
  // Update main pot display (sum of all side pots)
  game.pot = game.pots.reduce((sum, pot) => sum + pot.amount, 0);
}

function proceedRound(game) {
  const players = getSeatedPlayers(game);
  
  if (bettingRoundComplete(game)) {
    // Build side pots at the end of each betting round
    buildSidePots(game);
    
    // Check for RIT conditions
    const activePlayers = remainingActivePlayers(game);
    const canStillBetPlayers = activePlayers.filter(p => !p.isAllIn);
    
    if (activePlayers.length > 1 && canStillBetPlayers.length <= 1 && 
        game.currentBettingRound !== GamePhase.RIVER && 
        game.currentBettingRound !== GamePhase.SHOWDOWN) {
        
      if (game.gameSettings?.allowRunItTwice && !game.ritPending) {
        game.ritPending = true;
        game.ritRequired = activePlayers.map(p => p.id);
        game.ritVotes = {};
        return;
      }
      game.runItOut = true;
    }
    
    // Reset current bets for new round
    players.forEach(p => {
      p.currentBet = 0;
      p.hasActedThisRound = false;
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
    }
    
    if (newRoundStarted) {
      // Find first player to act in new round
      let nextPlayer = -1;
      const startPos = (game.dealerIndex + 1) % players.length;
      
      for (let i = 0; i < players.length; i++) {
        const idx = (startPos + i) % players.length;
        const player = players[idx];
        if (!player.isFolded && !player.isAllIn) {
          nextPlayer = idx;
          break;
        }
      }
      
      game.currentPlayerIndex = nextPlayer;
      game.currentHighestBet = 0;
      game.minRaiseAmount = game.bigBlind;
      game.lastRaiseAmount = 0;
      game.lastAggressorIndex = -1;
      game.actionClosingPlayerIndex = nextPlayer;
      game.turnStartTime = nextPlayer !== -1 ? Date.now() : null;
      
    } else if (game.currentBettingRound === GamePhase.SHOWDOWN) {
      resolveShowdown(game);
    }
  }
}

function getPlayerPositionFromButton(game, playerId) {
  const players = getSeatedPlayers(game);
  const playerIndex = players.findIndex(p => p.id === playerId);
  if (playerIndex === -1) return -1;
  
  // Calculate position relative to button (0 = button, 1 = SB, etc.)
  return (playerIndex - game.dealerIndex + players.length) % players.length;
}

function distributeOddChips(game, winners, remainder) {
  if (remainder === 0 || winners.length === 0) return;
  
  // Sort winners by position from button
  const sortedWinners = [...winners].sort((a, b) => {
    const posA = getPlayerPositionFromButton(game, a.id);
    const posB = getPlayerPositionFromButton(game, b.id);
    return posA - posB;
  });
  
  // Distribute odd chips starting from closest to button
  for (let i = 0; i < remainder && i < sortedWinners.length; i++) {
    const winner = sortedWinners[i];
    const player = getSeatedPlayers(game).find(p => p.id === winner.id);
    if (player) {
      player.stack += 1;
      winner.amountWon += 1;
    }
  }
}

function resolveShowdown(game) {
  const players = getSeatedPlayers(game);
  const contenders = players.filter(p => !p.isFolded && p.cards && p.cards.length === 2);
  game.showdownPlayers = contenders.map(p => p.id);
  
  if (contenders.length === 0) {
    console.error("No valid contenders at showdown - this shouldn't happen");
    game.handOverMessage = "Error: No valid players for showdown.";
    game.currentBettingRound = GamePhase.HAND_OVER;
    game.winners = [];
    return;
  }
  
  if (contenders.length === 1) {
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
    game.pot = 0;
    game.pots = [];
    game.currentBettingRound = GamePhase.HAND_OVER;
    return;
  }
  
  // Build side pots if not already done
  if (game.pots.length === 0) {
    buildSidePots(game);
  }
  
  game.winners = [];
  let totalMessages = [];
  
  // Process each pot from smallest to largest
  for (const pot of game.pots) {
    const eligibleContenders = contenders.filter(p => pot.eligiblePlayerIds.includes(p.id));
    
    if (eligibleContenders.length === 0) continue;
    
    // Evaluate hands
    const evaluatedHands = eligibleContenders.map(p => {
      const hand = Hand.solve([...p.cards, ...game.communityCards]);
      return { player: p, hand: hand, handDescription: hand.descr };
    });
    
    // Find winners - pokersolver already returns the best hands
    const allHands = evaluatedHands.map(e => e.hand);
    const winningHands = Hand.winners(allHands);
    
    // Map back to players
    const winningHandSet = new Set(winningHands);
    const potWinners = evaluatedHands.filter(e => winningHandSet.has(e.hand));
    
    if (potWinners.length > 0) {
      const share = Math.floor(pot.amount / potWinners.length);
      const remainder = pot.amount % potWinners.length;
      
      const winnersInfo = potWinners.map(w => ({
        id: w.player.id,
        name: w.player.name,
        cards: w.player.cards,
        handDescription: w.handDescription,
        amountWon: share
      }));
      
      // Award main shares
      winnersInfo.forEach(winner => {
        const player = players.find(p => p.id === winner.id);
        if (player) {
          player.stack += winner.amountWon;
        }
        
        // Add to or update existing winner
        const existingWinner = game.winners.find(w => w.id === winner.id);
        if (existingWinner) {
          existingWinner.amountWon += winner.amountWon;
        } else {
          game.winners.push({...winner});
        }
      });
      
      // Distribute odd chips
      distributeOddChips(game, winnersInfo, remainder);
      
      // Build message for this pot
      if (game.pots.length > 1) {
        const potType = pot === game.pots[0] ? "main pot" : "side pot";
        if (winnersInfo.length === 1) {
          totalMessages.push(`${winnersInfo[0].name} wins ${potType} of ${pot.amount}`);
        } else {
          totalMessages.push(`${winnersInfo.map(w => w.name).join(', ')} split ${potType} of ${pot.amount}`);
        }
      }
    }
  }
  
  // Build final message
  if (game.pots.length === 1) {
    // Single pot
    if (game.winners.length === 1) {
      game.handOverMessage = `${game.winners[0].name} wins ${game.pot} with ${game.winners[0].handDescription}`;
    } else {
      game.handOverMessage = `${game.winners.map(w => w.name).join(', ')} split the pot with ${game.winners[0].handDescription}`;
    }
  } else {
    // Multiple pots
    game.handOverMessage = totalMessages.join('. ');
  }
  
  game.pot = 0;
  game.pots = [];
  game.currentBettingRound = GamePhase.HAND_OVER;
}

function resolveShowdownRIT(game) {
  const players = getSeatedPlayers(game);
  const contenders = players.filter(p => !p.isFolded && p.cards && p.cards.length === 2);
  
  if (contenders.length <= 1) {
    return resolveShowdown(game);
  }
  
  // Build side pots if not already done
  if (game.pots.length === 0) {
    buildSidePots(game);
  }
  
  // Snapshot deck and community cards
  const deck = [...game.deck];
  const existingCommunityCards = [...game.communityCards];
  
  // Deal first run
  const firstRunCommunity = dealCommunityForRIT([...deck], existingCommunityCards, 5 - existingCommunityCards.length);
  
  // Deal second run (using the remaining deck after first run)
  const secondRunCommunity = dealCommunityForRIT(deck, existingCommunityCards, 5 - existingCommunityCards.length);
  
  // Process each pot for both runs
  game.winners = [];
  const firstRunMessages = [];
  const secondRunMessages = [];
  
  for (const pot of game.pots) {
    const eligibleContenders = contenders.filter(p => pot.eligiblePlayerIds.includes(p.id));
    if (eligibleContenders.length === 0) continue;
    
    const halfPot = Math.floor(pot.amount / 2);
    const oddChip = pot.amount % 2;
    
    // First run
    const firstRunResults = evaluateHands(eligibleContenders, firstRunCommunity);
    awardPotToWinnersRIT(game, firstRunResults.winners, halfPot + oddChip, players, 'first');
    
    // Second run
    const secondRunResults = evaluateHands(eligibleContenders, secondRunCommunity);
    awardPotToWinnersRIT(game, secondRunResults.winners, halfPot, players, 'second');
    
    // Build messages
    const potType = pot === game.pots[0] ? "main pot" : "side pot";
    if (firstRunResults.winners.length === 1) {
      firstRunMessages.push(`${firstRunResults.winners[0].player.name} wins first run of ${potType}`);
    } else {
      firstRunMessages.push(`${firstRunResults.winners.map(w => w.player.name).join(', ')} split first run of ${potType}`);
    }
    
    if (secondRunResults.winners.length === 1) {
      secondRunMessages.push(`${secondRunResults.winners[0].player.name} wins second run of ${potType}`);
    } else {
      secondRunMessages.push(`${secondRunResults.winners.map(w => w.player.name).join(', ')} split second run of ${potType}`);
    }
  }
  
  // Store RIT boards for display
  game.ritFirstRun = firstRunCommunity;
  game.ritSecondRun = secondRunCommunity;
  game.communityCards = [];
  
  // Build final message
  game.handOverMessage = `Run it twice: ${firstRunMessages.join('. ')} | ${secondRunMessages.join('. ')}`;
  
  game.pot = 0;
  game.pots = [];
  game.currentBettingRound = GamePhase.HAND_OVER;
  game.showdownPlayers = contenders.map(p => p.id);
}

function evaluateHands(contenders, communityCards) {
  const evaluatedHands = contenders.map(p => {
    const hand = Hand.solve([...p.cards, ...communityCards]);
    return { player: p, hand: hand, handDescription: hand.descr };
  });
  
  const allHands = evaluatedHands.map(e => e.hand);
  const winningHands = Hand.winners(allHands);
  
  const winningHandSet = new Set(winningHands);
  const winners = evaluatedHands.filter(e => winningHandSet.has(e.hand));
  
  return { winners, evaluatedHands };
}

function awardPotToWinnersRIT(game, winners, potAmount, players, runType) {
  if (winners.length === 0 || potAmount === 0) return;
  
  const share = Math.floor(potAmount / winners.length);
  const remainder = potAmount % winners.length;
  
  winners.forEach((winner, idx) => {
    const player = players.find(p => p.id === winner.player.id);
    if (player) {
      const amount = share + (idx === 0 ? remainder : 0);
      player.stack += amount;
      
      // Track winner info
      const existingWinner = game.winners.find(w => w.id === winner.player.id);
      if (existingWinner) {
        existingWinner.amountWon += amount;
        existingWinner.runs = existingWinner.runs || [];
        existingWinner.runs.push(runType);
      } else {
        game.winners.push({
          id: winner.player.id,
          name: winner.player.name,
          cards: winner.player.cards,
          handDescription: winner.handDescription,
          amountWon: amount,
          runs: [runType]
        });
      }
    }
  });
}

function runItOutStep(game) {
  if (game.currentBettingRound === GamePhase.RIVER || game.currentBettingRound === GamePhase.SHOWDOWN) {
    if (game.runItTwice) {
      resolveShowdownRIT(game);
    } else {
      resolveShowdown(game);
    }
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
  
  const res = originalProcess(game, playerId, action, details);
  if (res.error) return res;
  
  const activePlayers = remainingActivePlayers(game);
  if (activePlayers.length <= 1) {
    // Build final pots before awarding
    buildSidePots(game);
    
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
      handEndMessage = "All players folded.";
      game.winners = [];
    }
    game.pot = 0;
    game.pots = [];
    game.currentBettingRound = GamePhase.HAND_OVER;
    game.handOverMessage = handEndMessage;
    game.currentPlayerIndex = -1;
    game.turnStartTime = null;
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

function processRitVote(game, playerId, vote) {
  if (!game.ritPending) return { error: 'No RIT vote pending' };
  if (!game.ritRequired.includes(playerId)) return { error: 'You are not eligible to vote' };
  if (game.ritVotes.hasOwnProperty(playerId)) return { error: 'You have already voted' };
  
  game.ritVotes[playerId] = vote;
  
  // Check if all votes are in
  if (Object.keys(game.ritVotes).length === game.ritRequired.length) {
    const allAgree = Object.values(game.ritVotes).every(v => v === true);
    
    game.ritPending = false;
    
    if (allAgree) {
      game.runItTwice = true;
      game.runItOut = true;
    } else {
      game.runItOut = true;
    }
    
    game.currentPlayerIndex = -1;
    game.turnStartTime = null;
    
    // Immediately trigger the run out
    return { ok: true, shouldRunOut: true };
  }
  
  return { ok: true };
}

module.exports = {
  createDeck,
  shuffleDeck,
  initGameState,
  startHand,
  processAction: processActionWrapper,
  processRitVote,
  resolveShowdownRIT,
  GamePhase,
  getSeatedPlayers,
  runItOutStep,
}; 