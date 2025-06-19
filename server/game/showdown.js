const { Hand } = require('pokersolver');
const { getActivePlayers } = require('./gameState');
const { GamePhase } = require('../constants');

function buildSidePots(game) {
    const players = getActivePlayers(game);
    const pots = [];
    const playerBets = players.map(p => ({ player: p, bet: p.totalBetInHand }));
    
    while (playerBets.some(b => b.bet > 0)) {
        const minBet = Math.min(...playerBets.filter(b => b.bet > 0).map(b => b.bet));
        let potValue = 0;
        const contributors = [];

        playerBets.forEach(b => {
            if (b.bet > 0) {
                const contribution = Math.min(b.bet, minBet);
                potValue += contribution;
                b.bet -= contribution;
                contributors.push(b.player);
            }
        });
        
        if(potValue > 0) {
            pots.push({
                amount: potValue,
                eligiblePlayers: contributors
            });
        }
    }
    game.pots = pots;
    game.pot = 0; // Main pot is now split into side pots
}

function evaluateHands(contenders, communityCards) {
  return contenders.map(player => {
    const sevenCards = player.cards.concat(communityCards);
    const hand = Hand.solve(sevenCards);
    hand.player = player; // Attach player to hand object
    return hand;
  });
}

function resolveShowdown(game) {
    buildSidePots(game);
    game.winners = [];

    game.pots.forEach(pot => {
        const contenders = pot.eligiblePlayers.filter(p => !p.isFolded);
        if (contenders.length === 0) return;

        if (contenders.length === 1) {
            const winner = contenders[0];
            winner.stack += pot.amount;
            game.winners.push({
                id: winner.id, name: winner.name, amountWon: pot.amount,
                handDescription: "Won uncontested pot"
            });
            return;
        }

        const hands = evaluateHands(contenders, game.communityCards);
        const winningHands = Hand.winners(hands);
        
        const potShare = Math.floor(pot.amount / winningHands.length);
        winningHands.forEach(hand => {
            const winner = hand.player;
            winner.stack += potShare;
            game.winners.push({
                id: winner.id, name: winner.name, amountWon: potShare,
                handDescription: hand.descr, cards: hand.cards.map(c => c.value + c.suit)
            });
        });

        // Handle odd chips
        const remainder = pot.amount % winningHands.length;
        if (remainder > 0) {
            // Award to first winner for simplicity
            winningHands[0].player.stack += remainder;
        }
    });

    game.currentBettingRound = GamePhase.HAND_OVER;
    game.handOverMessage = `Hand over. Winners: ${game.winners.map(w => `${w.name} won ${w.amountWon}`).join(', ')}`;
}

module.exports = {
  resolveShowdown,
}; 