// server/game/handHistory.js

const { randomUUID } = require('crypto');

let supabase;

function init(supabaseClient) {
  supabase = supabaseClient;
}

// Build a lightweight JSON representation of the hand.
// For v1 we capture essential data; this can be enriched later.
function buildHandHistory(game) {
  // Build player snapshot from seats directly to avoid circular import
  const seatedPlayers = (game.seats || [])
    .filter(s => s && !s.isEmpty && s.player)
    .map(s => {
      const p = s.player;
      return {
        playerId: p.userId,
        name: p.name,
        position: p.positionName,
        startingStack: p.stack + (p.totalBetInHand || 0), // approximate
        finalStack: p.stack,
        cards: p.cards
      };
    });

  return {
    handId: randomUUID(),
    gameId: game.id,
    handNumber: game.handCounter,
    startedAt: new Date(game.handStartTime || Date.now()).toISOString(),
    blinds: { SB: game.smallBlind, BB: game.bigBlind },
    communityCards: game.communityCards,
    actions: game.handActions || [],
    players: seatedPlayers,
    winners: game.winners,
    potSize: game.pot + (game.pots || []).reduce((sum, p) => sum + p.amount, 0),
    resultText: game.handOverMessage
  };
}

async function saveHandHistory(game) {
  if (!supabase) {
    console.error('[handHistory] Supabase not initialised');
    return;
  }
  try {
    const history = buildHandHistory(game);
    const playerIds = (game.seats || [])
      .filter(s => s && !s.isEmpty && s.player && s.player.userId)
      .map(s => s.player.userId);
    const { error } = await supabase.from('hand_histories_v2').insert({
      hand_id: history.handId,             // explicit PK value
      game_id: game.id,
      hand_number: game.handCounter,
      played_at: history.startedAt,        // keeps the same timestamp used in JSON
      player_ids: playerIds,
      history
    });
    if (error) {
      console.error('[handHistory] Error inserting hand history:', error);
    }
  } catch (err) {
    console.error('[handHistory] Exception building/saving history', err);
  }
}

module.exports = {
  init,
  saveHandHistory,
}; 