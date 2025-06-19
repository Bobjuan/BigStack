const { PlayerAction } = require('../constants');
const { getSeatedPlayers } = require('./gameState');

function processAction(game, playerId, action, details = {}) {
  const players = getSeatedPlayers(game);
  const idx = players.findIndex(p => p.id === playerId);
  if (idx === -1 || idx !== game.currentPlayerIndex) {
    return { success: false, error: 'Not your turn or player not found' };
  }
  
  const player = players[idx];
  const highestBet = game.currentHighestBet;

  switch (action) {
    case PlayerAction.FOLD:
      player.isFolded = true;
      break;

    case PlayerAction.CHECK:
      if (player.currentBet < highestBet) {
        return { success: false, error: 'Cannot check, must call or fold' };
      }
      break;

    case PlayerAction.CALL: {
      const amountToCall = highestBet - player.currentBet;
      if (amountToCall <= 0) {
        return { success: false, error: 'Nothing to call' };
      }
      const callAmount = Math.min(amountToCall, player.stack);
      player.stack -= callAmount;
      player.currentBet += callAmount;
      player.totalBetInHand += callAmount;
      game.pot += callAmount;
      if (player.stack === 0) {
        player.isAllIn = true;
      }
      break;
    }

    case PlayerAction.BET: {
      const totalBetAmount = Number(details.amount);
      if (isNaN(totalBetAmount) || totalBetAmount <= 0) {
        return { success: false, error: 'Invalid bet amount' };
      }

      const amountToAdd = totalBetAmount - player.currentBet;
      if (amountToAdd > player.stack) {
        return { success: false, error: 'Not enough chips' };
      }

      const isRaise = totalBetAmount > highestBet;
      if (isRaise) {
        const raiseAmount = totalBetAmount - highestBet;
        if (raiseAmount < game.minRaiseAmount && (player.stack - amountToAdd) > 0) {
           return { success: false, error: `Minimum raise is ${game.minRaiseAmount}` };
        }
        game.lastRaiseAmount = raiseAmount;
        game.minRaiseAmount = raiseAmount; // The next min raise is this amount
        game.lastAggressorIndex = idx;
        game.actionClosingPlayerIndex = idx; // The action now ends with the player before this one
      } else if (totalBetAmount < highestBet) {
          return { success: false, error: 'Bet amount is less than the current highest bet' };
      }

      player.stack -= amountToAdd;
      player.currentBet = totalBetAmount;
      player.totalBetInHand += amountToAdd;
      game.pot += amountToAdd;
      game.currentHighestBet = totalBetAmount;

      if (player.stack === 0) {
        player.isAllIn = true;
      }
      
      // A bet/raise resets the 'acted' status for all other players
      if(isRaise) {
        players.forEach((p, i) => {
            if (i !== idx && !p.isFolded && !p.isAllIn) {
                p.hasActedThisRound = false;
            }
        });
      }
      break;
    }

    default:
      return { success: false, error: 'Unknown action' };
  }

  player.hasActedThisRound = true;
  return { success: true };
}

function advanceTurn(game) {
  const players = getSeatedPlayers(game);
  const numPlayers = players.length;
  if (numPlayers === 0) return;

  let nextPlayerIndex = game.currentPlayerIndex;
  for (let i = 0; i < numPlayers; i++) {
    nextPlayerIndex = (nextPlayerIndex + 1) % numPlayers;
    const nextPlayer = players[nextPlayerIndex];
    if (nextPlayer && !nextPlayer.isFolded && !nextPlayer.isAllIn) {
      game.currentPlayerIndex = nextPlayerIndex;
      game.turnStartTime = Date.now();
      return;
    }
  }
  
  // If no player can act, set index to -1 to signify end of round
  game.currentPlayerIndex = -1;
}

module.exports = {
  processAction,
  advanceTurn,
}; 