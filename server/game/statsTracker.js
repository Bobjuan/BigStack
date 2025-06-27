// server/game/statsTracker.js

/**
 * This module is responsible for tracking detailed player statistics during a single hand of poker.
 * It accumulates stats in memory and provides a function to commit them to the database at the end of the hand.
 */

// Placeholder for our database connection (we'll set this up in server.js)
let supabase;

function init(supabaseConnection) {
  supabase = supabaseConnection;
}

/**
 * Creates a fresh, temporary statistics object for a single hand.
 * This is called at the beginning of each new hand for all players involved.
 */
function createHandStatsObject(playerId) {
  return {
    playerId: playerId,
    increments: {
      // General
      hands_played: 1,
      hands_won: 0,
      total_bb_won: 0,
      total_pot_size_won: 0,
      
      // Pre-Flop
      // Every hand a player is dealt is an opportunity for VPIP and PFR.
      // The only exception for VPIP is the big blind checking their option, which is handled in trackAction.
      vpip_opportunities: 1,
      vpip_actions: 0,
      pfr_opportunities: 1,
      pfr_actions: 0,
      btn_rfi_opportunities: 0,
      btn_rfi_actions: 0,
      "3bet_opportunities": 0,
      "3bet_actions": 0,
      fold_vs_3bet_opportunities: 0,
      fold_vs_3bet_actions: 0,
      "4bet_opportunities": 0,
      "4bet_actions": 0,
      fold_vs_4bet_opportunities: 0,
      fold_vs_4bet_actions: 0,
      
      // Post-Flop Aggression
      agg_bets: 0,
      agg_raises: 0,
      agg_calls: 0,
      
      // Post-Flop C-Bet
      cbet_flop_opportunities: 0,
      cbet_flop_actions: 0,
      fold_vs_cbet_flop_opportunities: 0,
      fold_vs_cbet_flop_actions: 0,
      raise_vs_cbet_flop_opportunities: 0,
      raise_vs_cbet_flop_actions: 0,
      
      // Post-Flop Other
      ch_raise_flop_opportunities: 0,
      ch_raise_flop_actions: 0,
      donk_flop_opportunities: 0,
      donk_flop_actions: 0,

      // Showdown
      wtsd_opportunities: 0,
      wtsd_actions: 0,
      wsd_opportunities: 0,
      wsd_actions: 0,
      wwsf_opportunities: 0,
      wwsf_actions: 0,
    },
    // Internal state for tracking complex stats within this hand only
    handState: {
      saw_flop: false,
      is_preflop_aggressor: false,
      hasActedPreflop: false,
      hasRaisedPreflop: false,
    }
  };
}

/**
 * Analyzes a single player action and updates the temporary hand stats object.
 * This function contains the logic for tracking VPIP and PFR.
 * 
 * @param {object} handStats - The temporary stats object for all players in the hand.
 * @param {object} game - The current game state from gameEngine.
 * @param {object} player - The player who is acting.
 * @param {string} action - The action the player took (e.g., 'fold', 'bet', 'raise').
 */
function trackAction(handStats, game, player, action) {
  const stats = handStats[player.userId];
  if (!stats) return;

  // We only track pre-flop stats for VPIP and PFR
  if (game.currentBettingRound !== 'PREFLOP') {
      return;
  }
  
  // A VPIP opportunity is now counted by default. We only need to check if the BB had a free option.
  const isBBOption = player.isBB && game.currentHighestBet === game.bigBlind && action === 'check';
  if (isBBOption) {
    // If the BB checks their option for free, it was not a voluntary action.
    // We correctly remove the opportunity we granted them at the start of the hand.
    stats.increments.vpip_opportunities = 0;
    console.log(`[StatsTracker] Game ${game.id}: VPIP opportunity revoked for ${player.name} due to BB option check.`);
  }
  
  // If an opportunity existed, check if they took a voluntary action.
  if (action === 'call' || action === 'bet' || action === 'raise') {
      stats.increments.vpip_actions = 1;
      console.log(`[StatsTracker] Game ${game.id}: VPIP action taken by ${player.name}.`);
  }

  // --- PFR (Pre-Flop Raise) Tracking ---
  // A PFR action is ANY raise made pre-flop. We only count it once per hand.
  // CRITICAL FIX: We check for 'bet' OR 'raise' as the engine uses 'bet' for the first aggression.
  const isPreflopRaise = (action === 'bet' || action === 'raise');

  if (isPreflopRaise && !stats.handState.hasRaisedPreflop) {
    stats.increments.pfr_actions = 1;
    stats.handState.hasRaisedPreflop = true; // Mark that they have now raised.
    
    // We still set this shared flag for other stats that depend on it (like 3-Bet opportunities).
    if (handStats.sharedState) {
      handStats.sharedState.preflopRaiseMade = true;
    }
    console.log(`[StatsTracker] Game ${game.id}: PFR action taken by ${player.name}.`);
  }
}


/**
 * Commits the accumulated hand stats to the database using a batch RPC call.
 * This is called at the end of a hand.
 * Assumes a Supabase RPC function `increment_player_stats` exists.
 */
async function commitHandStats(handStats) {
  if (!supabase) {
    console.error("statsTracker: Supabase client not initialized. Cannot commit stats.");
    return;
  }

  // Filter out any non-player objects like 'sharedState'.
  const playersToUpdate = Object.values(handStats).filter(statObj => statObj && statObj.playerId);

  if (playersToUpdate.length === 0) {
    return; // Nothing to commit
  }

  // Construct the exact payload the 'batch_update_player_stats' function expects.
  // It requires a single object with a key 'updates' that holds an array.
  const updatesPayload = playersToUpdate.map(playerStat => {
    // Each item in the array must be an object matching the 'player_stat_update' type.
    return {
      p_player_id: playerStat.playerId,
      p_increments: playerStat.increments, // This object now matches the 'player_stat_increments' type
    };
  });

  // Make a single RPC call with the correctly structured batch payload.
  const { error } = await supabase.rpc('batch_update_player_stats', {
    updates: updatesPayload,
  });

  if (error) {
    console.error('Error returned from batch_update_player_stats RPC:', error);
  } else {
    console.log(`Successfully committed stats for ${playersToUpdate.length} players.`);
  }
}

/**
 * Retrieves the latest stats for a given list of player IDs from the database.
 * @param {string[]} playerIds - An array of permanent user IDs.
 * @returns {Promise<{data: object, error: object}>} - The result from the Supabase query.
 */
async function getStatsForPlayers(playerIds) {
    if (!supabase) {
        console.error("statsTracker: Supabase client not initialized. Cannot fetch stats.");
        return { data: null, error: new Error("Database connection not initialized.") };
    }
    if (!playerIds || playerIds.length === 0) {
        return { data: [], error: null };
    }

    const { data, error } = await supabase
        .from('player_stats')
        .select('*')
        .in('player_id', playerIds);

    // Convert the array of stats objects into a map of { playerId: stats } for easier lookup on the client.
    if (data) {
        const statsMap = data.reduce((acc, stats) => {
            acc[stats.player_id] = stats;
            return acc;
        }, {});
        return { data: statsMap, error: null };
    }

    return { data, error };
}


module.exports = {
  init,
  createHandStatsObject,
  trackAction,
  commitHandStats,
  getStatsForPlayers,
}; 