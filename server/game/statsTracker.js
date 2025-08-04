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

      co_rfi_opportunities: 0,
      co_rfi_actions: 0,
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
      
      // Post-Flop C-Bet (Flop/Turn/River)
      cbet_flop_opportunities: 0,
      cbet_flop_actions: 0,
      fold_vs_cbet_flop_opportunities: 0,
      fold_vs_cbet_flop_actions: 0,
      raise_vs_cbet_flop_opportunities: 0,
      raise_vs_cbet_flop_actions: 0,

      cbet_turn_opportunities: 0,
      cbet_turn_actions: 0,
      fold_vs_cbet_turn_opportunities: 0,
      fold_vs_cbet_turn_actions: 0,
      raise_vs_cbet_turn_opportunities: 0,
      raise_vs_cbet_turn_actions: 0,

      cbet_river_opportunities: 0,
      cbet_river_actions: 0,
      fold_vs_cbet_river_opportunities: 0,
      fold_vs_cbet_river_actions: 0,
      raise_vs_cbet_river_opportunities: 0,
      raise_vs_cbet_river_actions: 0,
      
      // Post-Flop Other
      ch_raise_flop_opportunities: 0,
      ch_raise_flop_actions: 0,
      donk_flop_opportunities: 0,
      donk_flop_actions: 0,

      // New Pre-Flop Limp stats (Open-limp frequency)
      open_limp_opportunities: 0,
      open_limp_actions: 0,

      // Big Blind Defence vs Steal
      bb_defend_opportunities: 0,
      bb_defend_actions: 0,
      sb_defend_opportunities: 0,
      sb_defend_actions: 0,

      // Fold vs Steal
      sb_fold_vs_steal_opportunities: 0,
      sb_fold_vs_steal_actions: 0,
      bb_fold_vs_steal_opportunities: 0,
      bb_fold_vs_steal_actions: 0,

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
      bbDefendLogged: false,
      sbStealLogged: false,
      sbDefendLogged: false,
      bbStealLogged: false,
      openLimpActionLogged: false,
      donkOpportunityLogged: false,
      donkActionLogged: false,
      chRaiseOpportunityLogged: false,
      chRaiseActionLogged: false,
      was_open_raiser: false,
      was_three_bettor: false,
      foldVs3betOpportunityLogged: false,
      foldVs4betOpportunityLogged: false,
      foldVs3betActionLogged: false,
      foldVs4betActionLogged: false,
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

    // --- Button / CO RFI Tracking ---
    const isButton = player.positionName === 'BTN';
    const isCO = player.positionName === 'CO';
    const potUnopened = !(handStats.sharedState && handStats.sharedState.preflopRaiseMade);

    if (potUnopened && !stats.handState.hasActedPreflop && (isButton || isCO)) {
      if (isButton) stats.increments.btn_rfi_opportunities = 1;
      if (isCO)     stats.increments.co_rfi_opportunities = 1;
    }
    if (potUnopened && (action === 'bet' || action === 'raise')) {
      if (isButton) stats.increments.btn_rfi_actions = 1;
      if (isCO)     stats.increments.co_rfi_actions = 1;
    }

    // --- Open-Limp Tracking ---
    // Opportunity: Player acts pre-flop before any raise has occurred.
    const noRaiseYet = !(handStats.sharedState && handStats.sharedState.preflopRaiseMade);
    if (noRaiseYet && !stats.handState.hasActedPreflop && !handStats.sharedState.firstPreflopActorLogged) {
      // The very first actor pre-flop (pot unopened) has an open-limp opportunity.
      stats.increments.open_limp_opportunities = 1;
      handStats.sharedState.firstPreflopActorLogged = true;
    }
    // Record an open-limp action only for that first actor.
    if (handStats.sharedState.firstPreflopActorLogged && action === 'call' && !stats.handState.openLimpActionLogged) {
      stats.increments.open_limp_actions = 1;
      stats.handState.openLimpActionLogged = true;
    }

    // --- Big Blind Defence Tracking ---
    if (!stats.handState.bbDefendLogged && player.isBB && handStats.sharedState && handStats.sharedState.preflopRaiseMade) {
      stats.increments.bb_defend_opportunities = 1;
      // Action recorded if player does NOT fold.
      if (action === 'call' || action === 'bet' || action === 'raise') {
        stats.increments.bb_defend_actions = 1;
      }
      stats.handState.bbDefendLogged = true;
    }

    // --- Defence & Fold vs Steal Tracking for SB/BB ---
    const isHeadsUp = handStats.sharedState && handStats.sharedState.isHeadsUp;
    const firstRaiseOnly = handStats.sharedState && handStats.sharedState.raiseCount === 1;
    if (!isHeadsUp && firstRaiseOnly && (player.isSB || player.isBB)) {
      if (player.isSB && !stats.handState.sbStealLogged) {
        // Any time SB faces a single pre-flop raise, they have a defend opportunity.
        stats.increments.sb_defend_opportunities = 1;
        stats.increments.sb_fold_vs_steal_opportunities = 1;

        if (action === 'fold') {
          stats.increments.sb_fold_vs_steal_actions = 1;
        } else if (action === 'call' || action === 'bet' || action === 'raise') {
          stats.increments.sb_defend_actions = 1;
        }
        stats.handState.sbStealLogged = true;
      }
      if (player.isBB && !stats.handState.bbStealLogged) {
        stats.increments.bb_fold_vs_steal_opportunities = 1;
        if (action === 'fold') stats.increments.bb_fold_vs_steal_actions = 1;
        stats.handState.bbStealLogged = true;
      }
    }

    // --- Fold vs 3-bet / 4-bet action logging ---
    if (action === 'fold') {
      if (stats.handState.was_open_raiser && handStats.sharedState && handStats.sharedState.raiseCount >= 2 && stats.handState.foldVs3betOpportunityLogged && !stats.handState.foldVs3betActionLogged) {
        stats.increments.fold_vs_3bet_actions += 1;
        stats.handState.foldVs3betActionLogged = true;
      } else if (stats.handState.was_three_bettor && handStats.sharedState && handStats.sharedState.raiseCount >= 3 && stats.handState.foldVs4betOpportunityLogged && !stats.handState.foldVs4betActionLogged) {
        stats.increments.fold_vs_4bet_actions += 1;
        stats.handState.foldVs4betActionLogged = true;
      }
    }

    // Mark that this player has now acted pre-flop
    stats.handState.hasActedPreflop = true;
    
    // If an opportunity existed, check if they took a voluntary action.
    if (action === 'call' || action === 'bet' || action === 'raise') {
        stats.increments.vpip_actions = 1;
        const posStats = stats.positionIncrements[player.positionName] || { vpip_opportunities: 0, vpip_actions: 0, pfr_opportunities: 0, pfr_actions: 0 };
        if (posStats.vpip_actions === 0) {
          posStats.vpip_actions = 1;
        }
        stats.positionIncrements[player.positionName] = posStats;
    }

    // --- 3-BET / 4-BET OPPORTUNITY TRACKING ---
    if (handStats.sharedState && handStats.sharedState.raiseCount === 1 && !player.isBB && !player.isSB && !stats.handState.hasActedPreflop) {
      // A single raise is in the pot, and this player has the chance to 3-bet.
      stats.increments["3bet_opportunities"] += 1;
    }

    if (handStats.sharedState && handStats.sharedState.raiseCount === 2 && stats.handState.was_open_raiser && !stats.handState.foldVs3betOpportunityLogged) {
      // Original raiser is now facing a 3-bet → 4-bet opportunity + fold-vs-3bet opportunity.
      stats.increments["4bet_opportunities"] += 1;
      stats.increments.fold_vs_3bet_opportunities += 1;
      stats.handState.foldVs3betOpportunityLogged = true;
    }

    if (handStats.sharedState && handStats.sharedState.raiseCount === 3 && stats.handState.was_three_bettor && !stats.handState.foldVs4betOpportunityLogged) {
      // 3-bettor now facing a 4-bet → fold-vs-4bet opportunity.
      stats.increments.fold_vs_4bet_opportunities += 1;
      stats.handState.foldVs4betOpportunityLogged = true;
    }

    // --- PFR (Pre-Flop Raise) Tracking ---
    // A PFR action is ANY raise made pre-flop. We only count it once per hand.
    // CRITICAL FIX: We check for 'bet' OR 'raise' as the engine uses 'bet' for the first aggression.
    const isPreflopRaise = (action === 'bet' || action === 'raise');

    if (isPreflopRaise && !stats.handState.hasRaisedPreflop) {
      // Determine current raise level BEFORE we increment.
      const currentRaiseLevel = handStats.sharedState ? handStats.sharedState.raiseCount : 0; // 0 = unopened, 1 = open-raise, 2 = 3-bet, 3 = 4-bet

      if (handStats.sharedState) {
        handStats.sharedState.preflopRaiseMade = true;
        handStats.sharedState.preflopAggressorId = player.userId;
        if (typeof handStats.sharedState.raiseCount === 'number') {
          handStats.sharedState.raiseCount += 1;
        }
      }

      // Log PFR (open raise) / 3-bet / 4-bet actions
      if (currentRaiseLevel === 0) {
        // First raise = normal open (PFR)
        stats.increments.pfr_actions = 1;
        stats.handState.was_open_raiser = true;
      } else if (currentRaiseLevel === 1) {
        // This is a 3-bet
        stats.increments["3bet_actions"] += 1;
        stats.handState.was_three_bettor = true;
      } else if (currentRaiseLevel === 2) {
        // This is a 4-bet (or higher)
        stats.increments["4bet_actions"] += 1;
      }

      // Positional PFR flag (only meaningful for first raise)
      if (currentRaiseLevel === 0) {
        const posStats = stats.positionIncrements[player.positionName] || { vpip_opportunities: 0, vpip_actions: 0, pfr_opportunities: 0, pfr_actions: 0 };
        posStats.pfr_actions = 1;
        stats.positionIncrements[player.positionName] = posStats;
      }

      // Mark internal flags
      if (currentRaiseLevel === 0) stats.handState.is_preflop_aggressor = true;
      stats.handState.hasRaisedPreflop = true; // Prevent double counting per player

      if (handStats.sharedState) {
        handStats.sharedState.preflopRaiseMade = true;
      }
    }
  } else { // Post-Flop Logic (FLOP, TURN, RIVER)
    // Reset per-street flags when player moves to new street
    if (stats.handState.currentStreet !== game.currentBettingRound) {
      stats.handState.checkedThisStreet = false;
      stats.handState.currentStreet = game.currentBettingRound;
    }
    const street = game.currentBettingRound; // FLOP / TURN / RIVER
    if (!handStats.sharedState.streets) {
      handStats.sharedState.streets = {
        FLOP: { actors: [], firstAggressorId: null, hasAggression: false },
        TURN: { actors: [], firstAggressorId: null, hasAggression: false },
        RIVER: { actors: [], firstAggressorId: null, hasAggression: false }
      };
    }
    const streetState = handStats.sharedState.streets[street];
    // Track action order
    if (!streetState.actors.includes(player.userId)) streetState.actors.push(player.userId);
    // First aggressor on street
    if (!streetState.firstAggressorId && (action === 'bet' || action === 'raise')) {
      streetState.firstAggressorId = player.userId;
    }
    // Mark that aggression has occurred on this street
    if (action === 'bet' || action === 'raise') {
      streetState.hasAggression = true;
    }

    // ===== FLOP-specific advanced stats =====
    const lower = street.toLowerCase();

    // Helper for street-specific counter names
    const cbetOppKey = `cbet_${lower}_opportunities`;
    const cbetActKey = `cbet_${lower}_actions`;
    const foldOppKey = `fold_vs_cbet_${lower}_opportunities`;
    const foldActKey = `fold_vs_cbet_${lower}_actions`;
    const raiseOppKey = `raise_vs_cbet_${lower}_opportunities`;
    const raiseActKey = `raise_vs_cbet_${lower}_actions`;

    const isFlop = street === 'FLOP';
    // ---- generic C-bet stats for any street ----
    const cbetFlag = `cbet${street}Logged`;
    // ----- Improved C-bet opportunity detection -----
    if (stats.handState.is_preflop_aggressor && !streetState.hasAggression) {
      // The aggressor has an opportunity as long as nobody has bet/raised yet on this street.
      if (!stats.handState[cbetFlag]) {
        stats.increments[cbetOppKey] += 1;
        // If they choose to bet or raise now, log the action.
        if (action === 'bet' || action === 'raise') {
          stats.increments[cbetActKey] += 1;
        }
        stats.handState[cbetFlag] = true;
      }
    }

    const facedFlag = `facedCbet${street}`;
    if (streetState.firstAggressorId && streetState.firstAggressorId !== player.userId && !stats.handState[facedFlag]) {
      // One opportunity counts for both fold and raise vs c-bet rates
      stats.increments[foldOppKey] += 1;
      stats.increments[raiseOppKey] += 1;

      if (action === 'fold') stats.increments[foldActKey] += 1;
      if (action === 'raise') stats.increments[raiseActKey] += 1;
      stats.handState[facedFlag] = true;
    }

    // Mark that player saw this street once they act (for WWSF / WTSD)
    const sawFlag = `saw_${lower}`;
    if (!stats.handState[sawFlag]) {
      stats.handState[sawFlag] = true;
      if (street === 'FLOP') {
        stats.increments.wtsd_opportunities += 1;
        stats.increments.wwsf_opportunities += 1;
      }
    }

    if (isFlop) {
      // ------- Donk-bet tracking -------
      const isFirstToAct = streetState.actors[0] === player.userId;
      if (!stats.handState.is_preflop_aggressor && isFirstToAct && !stats.handState.donkOpportunityLogged) {
        stats.increments.donk_flop_opportunities = 1;
        stats.handState.donkOpportunityLogged = true;
      }
      if (!stats.handState.is_preflop_aggressor && isFirstToAct && (action === 'bet' || action === 'raise') && !stats.handState.donkActionLogged) {
        stats.increments.donk_flop_actions = 1;
        stats.handState.donkActionLogged = true;
      }

      // ------- Check-Raise tracking -------
      if (!stats.handState.checkedThisStreet && action === 'check') {
        // Player checks first time this street.
        stats.handState.checkedThisStreet = true;
      } else if (stats.handState.checkedThisStreet && !stats.handState.chRaiseOpportunityLogged) {
        // Once the player has checked, any subsequent aggression they face creates an opportunity.
        stats.increments.ch_raise_flop_opportunities = 1;
        stats.handState.chRaiseOpportunityLogged = true;
      }
      if (stats.handState.chRaiseOpportunityLogged && action === 'raise' && !stats.handState.chRaiseActionLogged) {
        stats.increments.ch_raise_flop_actions = 1;
        stats.handState.chRaiseActionLogged = true;
      }
    }
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