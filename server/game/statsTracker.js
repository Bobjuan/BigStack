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

const POSITIONS = ['BTN', 'SB', 'BB', 'BTN/SB', 'UTG', 'UTG+1', 'MP', 'LJ', 'HJ', 'CO'];

function createBlankPositionStats() {
  return POSITIONS.reduce((acc, pos) => {
    acc[pos] = {
      // Pre-flop positional counters (can extend later)
      vpip_opportunities: 0,
      vpip_actions: 0,
      pfr_opportunities: 0,
      pfr_actions: 0,
    };
    return acc;
  }, {});
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
    positionIncrements: createBlankPositionStats(),
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
 * This function contains the core logic for tracking VPIP, PFR, and post-flop aggression.
 * 
 * @param {object} handStats - The temporary stats object for all players in the hand.
 * @param {object} game - The current game state from gameEngine.
 * @param {object} player - The player who is acting.
 * @param {string} action - The action the player took (e.g., 'fold', 'bet', 'raise').
 */
function trackAction(handStats, game, player, action) {
  const stats = handStats[player.userId];
  if (!stats) return;

  // We split logic by betting round.
  if (game.currentBettingRound === 'PREFLOP') {
    // --- Pre-Flop VPIP Tracking ---
    // A VPIP opportunity is now counted by default. We only need to check if the BB had a free option.
    const isBBOption = player.isBB && game.currentHighestBet === game.bigBlind && action === 'check';
    console.log('TESTTTT');
    if (isBBOption) {
      stats.increments.vpip_opportunities = 0;
      if (stats.positionIncrements[player.positionName]) {
        stats.positionIncrements[player.positionName].vpip_opportunities = 0;
      }
    }
    
    // If an opportunity existed, check if they took a voluntary action.
    if (action === 'call' || action === 'bet' || action === 'raise') {
        stats.increments.vpip_actions = 1;
        const posStats = stats.positionIncrements[player.positionName] || { vpip_opportunities: 0, vpip_actions: 0, pfr_opportunities: 0, pfr_actions: 0 };
        if (posStats.vpip_actions === 0) {
          posStats.vpip_actions = 1;
        }
        stats.positionIncrements[player.positionName] = posStats;
    }

    // --- PFR (Pre-Flop Raise) Tracking ---
    // A PFR action is ANY raise made pre-flop. We only count it once per hand.
    // CRITICAL FIX: We check for 'bet' OR 'raise' as the engine uses 'bet' for the first aggression.
    const isPreflopRaise = (action === 'bet' || action === 'raise');

    if (isPreflopRaise && !stats.handState.hasRaisedPreflop) {
      stats.increments.pfr_actions = 1;
      const posStats = stats.positionIncrements[player.positionName] || { vpip_opportunities: 0, vpip_actions: 0, pfr_opportunities: 0, pfr_actions: 0 };
      posStats.pfr_actions = 1;
      stats.positionIncrements[player.positionName] = posStats;
      stats.handState.hasRaisedPreflop = true; // Mark that they have now raised.
      if (handStats.sharedState) {
        handStats.sharedState.preflopRaiseMade = true;
      }
    }
  } else { // Post-Flop Logic (FLOP, TURN, RIVER)
    // Post-flop actions are simpler to track for Aggression Factor.
    switch (action) {
      case 'bet':
        stats.increments.agg_bets += 1;
        break;
      case 'raise':
        stats.increments.agg_raises += 1;
        break;
      case 'call':
        stats.increments.agg_calls += 1;
        break;
      // 'check' and 'fold' do not contribute to Aggression Factor.
    }
  }
}

/**
 * Helper: Fetch all active stat sessions for a player (returns array of session objects)
 */
async function getActiveSessionsForPlayer(playerId) {
  const DEFAULT_SESSION_ID = '00000000-0000-0000-0000-000000000000';
  if (!supabase) return [{ id: DEFAULT_SESSION_ID, name: 'All Stats', is_active: true }];
  const { data, error } = await supabase
    .from('stat_sessions')
    .select('*')
    .eq('player_id', playerId)
    .eq('is_active', true);
  if (error) {
    console.error('Error fetching active sessions:', error);
    return [{ id: DEFAULT_SESSION_ID, name: 'All Stats', is_active: true }];
  }
  // Always include default session (fixed UUID)
  return [{ id: DEFAULT_SESSION_ID, name: 'All Stats', is_active: true }, ...(data || [])];
}

/**
 * Commits the accumulated hand stats to the database using a batch RPC call.
 * This is called at the end of a hand.
 * Writes stats to all active sessions for each player (including default).
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

  // For each player, get all active sessions and create an update for each session
  let updatesPayload = [];
  for (const playerStat of playersToUpdate) {
    const sessions = await getActiveSessionsForPlayer(playerStat.playerId);
    for (const session of sessions) {
      updatesPayload.push({
        p_player_id: playerStat.playerId,
        p_session_id: session.id, // null for default
        p_increments: playerStat.increments,
        p_position_increments: playerStat.positionIncrements,
      });
    }
  }

  const { error } = await supabase.rpc('batch_update_player_stats', {
    updates: updatesPayload,
  });

  if (error) {
    console.error('[DEBUG] Error returned from batch_update_player_stats RPC:', error);
  } else {
    console.log(`[DEBUG] Successfully committed stats for ${updatesPayload.length} player-session pairs.`);
  }
}

/**
 * Retrieves the latest stats for a given list of player IDs from the database, filtered by session_id.
 * @param {string[]} playerIds - An array of permanent user IDs.
 * @param {string|null} sessionId - The session_id to filter by (null for default session).
 * @returns {Promise<{data: object, error: object}>} - The result from the Supabase query.
 */
async function getStatsForPlayers(playerIds, sessionId = null) {
  if (!supabase) {
    console.error("statsTracker: Supabase client not initialized. Cannot fetch stats.");
    return { data: null, error: new Error("Database connection not initialized.") };
  }
  if (!playerIds || playerIds.length === 0) {
    return { data: [], error: null };
  }

  let query = supabase
    .from('player_stats')
    .select('*')
    .in('player_id', playerIds);
  const DEFAULT_SESSION_ID = '00000000-0000-0000-0000-000000000000';
  if (sessionId === null) {
    query = query.eq('session_id', DEFAULT_SESSION_ID);
  } else {
    query = query.eq('session_id', sessionId);
  }
  const { data, error } = await query;

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
  getActiveSessionsForPlayer,
}; 