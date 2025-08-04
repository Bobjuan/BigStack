const statsTracker = require('../statsTracker');

function mockGame(opts = {}) {
  return {
    currentBettingRound: opts.currentBettingRound || 'PREFLOP',
    bigBlind: opts.bigBlind || 100,
    currentHighestBet: opts.currentHighestBet || opts.bigBlind || 100,
  };
}

function mockPlayer(id, opts = {}) {
  return {
    userId: id,
    isBB: !!opts.isBB,
    isSB: !!opts.isSB,
    positionName: opts.positionName || 'UTG',
  };
}

function createTestHandStats(playerIds) {
  const handStats = {};
  playerIds.forEach(id => {
    handStats[id] = statsTracker.createHandStatsObject(id);
  });
  handStats.sharedState = statsTracker.createSharedState();
  return handStats;
}

describe('statsTracker - VPIP/PFR Basic Tracking', () => {
  it('tracks VPIP correctly for voluntary actions', () => {
    const handStats = createTestHandStats(['p1', 'p2']);
    const game = mockGame();
    
    // Player 1 calls (VPIP)
    statsTracker.trackAction(handStats, game, mockPlayer('p1', {positionName: 'UTG'}), 'call');
    // Player 2 folds (no VPIP)
    statsTracker.trackAction(handStats, game, mockPlayer('p2', {positionName: 'UTG+1'}), 'fold');
    
    expect(handStats.p1.increments.vpip_opportunities).toBe(1);
    expect(handStats.p1.increments.vpip_actions).toBe(1);
    expect(handStats.p2.increments.vpip_opportunities).toBe(1);
    expect(handStats.p2.increments.vpip_actions).toBe(0);
  });
  
  it('does not count BB free check as VPIP', () => {
    const handStats = createTestHandStats(['bb']);
    const game = mockGame({ currentHighestBet: 100 }); // BB amount
    
    statsTracker.trackAction(handStats, game, mockPlayer('bb', {isBB: true, positionName: 'BB'}), 'check');
    
    expect(handStats.bb.increments.vpip_opportunities).toBe(0);
    expect(handStats.bb.increments.vpip_actions).toBe(0);
  });
  
  it('tracks PFR correctly for raises', () => {
    const handStats = createTestHandStats(['p1', 'p2']);
    const game = mockGame();
    
    // Player 1 raises (PFR)
    statsTracker.trackAction(handStats, game, mockPlayer('p1', {positionName: 'UTG'}), 'bet');
    // Player 2 calls (VPIP but not PFR)
    statsTracker.trackAction(handStats, game, mockPlayer('p2', {positionName: 'UTG+1'}), 'call');
    
    expect(handStats.p1.increments.pfr_opportunities).toBe(1);
    expect(handStats.p1.increments.pfr_actions).toBe(1);
    expect(handStats.p2.increments.pfr_opportunities).toBe(1);
    expect(handStats.p2.increments.pfr_actions).toBe(0);
  });
  
  it('tracks positional VPIP/PFR correctly', () => {
    const handStats = createTestHandStats(['btn']);
    const game = mockGame();
    
    statsTracker.trackAction(handStats, game, mockPlayer('btn', {positionName: 'BTN'}), 'bet');
    
    const posStats = handStats.btn.positionIncrements['BTN'];
    expect(posStats.vpip_opportunities).toBe(1);
    expect(posStats.vpip_actions).toBe(1);
    expect(posStats.pfr_opportunities).toBe(1);
    expect(posStats.pfr_actions).toBe(1);
  });
});

describe('statsTracker - 3-bet/4-bet Tracking', () => {
  it('tracks 3-bet opportunities correctly', () => {
    const handStats = createTestHandStats(['opener', 'threebettor']);
    const game = mockGame();
    
    // Check initial state
    expect(handStats.sharedState.raiseCount).toBe(0);
    
    // Opener raises first
    statsTracker.trackAction(handStats, game, mockPlayer('opener', {positionName: 'UTG'}), 'bet');
    expect(handStats.sharedState.raiseCount).toBe(1);
    expect(handStats.sharedState.preflopRaiseMade).toBe(true);
    
    // Check threebettor state before acting
    expect(handStats.threebettor.handState.hasActedPreflop).toBe(false);
    
    // 3-bettor has opportunity and takes it
    statsTracker.trackAction(handStats, game, mockPlayer('threebettor', {positionName: 'BTN'}), 'raise');
    expect(handStats.sharedState.raiseCount).toBe(2);
    
    expect(handStats.threebettor.increments['3bet_opportunities']).toBe(1);
    expect(handStats.threebettor.increments['3bet_actions']).toBe(1);
  });
  
  it('tracks 4-bet opportunities for original raiser', () => {
    const handStats = createTestHandStats(['opener', 'threebettor']);
    const game = mockGame();
    
    // Set up the scenario
    handStats.opener.handState.was_open_raiser = true;
    handStats.threebettor.handState.was_three_bettor = true;
    handStats.sharedState.raiseCount = 2; // After 3-bet
    
    // Original raiser now faces 3-bet (4-bet opportunity)
    statsTracker.trackAction(handStats, game, mockPlayer('opener', {positionName: 'UTG'}), 'raise');
    
    expect(handStats.opener.increments['4bet_opportunities']).toBe(1);
    expect(handStats.opener.increments['4bet_actions']).toBe(1);
    expect(handStats.opener.increments.fold_vs_3bet_opportunities).toBe(1);
  });
  
  it('tracks fold vs 3-bet correctly', () => {
    const handStats = createTestHandStats(['opener']);
    const game = mockGame();
    
    // Set up scenario where opener faces 3-bet
    handStats.opener.handState.was_open_raiser = true;
    handStats.opener.handState.foldVs3betOpportunityLogged = true;
    handStats.sharedState.raiseCount = 2;
    
    statsTracker.trackAction(handStats, game, mockPlayer('opener', {positionName: 'UTG'}), 'fold');
    
    expect(handStats.opener.increments.fold_vs_3bet_actions).toBe(1);
  });
});

describe('statsTracker - Positional RFI Tracking', () => {
  it('tracks BTN RFI opportunities and actions', () => {
    const handStats = createTestHandStats(['btn']);
    const game = mockGame();
    
    // BTN gets RFI opportunity (pot unopened)
    statsTracker.trackAction(handStats, game, mockPlayer('btn', {positionName: 'BTN'}), 'bet');
    
    expect(handStats.btn.increments.btn_rfi_opportunities).toBe(1);
    expect(handStats.btn.increments.btn_rfi_actions).toBe(1);
  });
  
  it('tracks CO RFI opportunities and actions', () => {
    const handStats = createTestHandStats(['co']);
    const game = mockGame();
    
    statsTracker.trackAction(handStats, game, mockPlayer('co', {positionName: 'CO'}), 'bet');
    
    expect(handStats.co.increments.co_rfi_opportunities).toBe(1);
    expect(handStats.co.increments.co_rfi_actions).toBe(1);
  });
  
  it('does not give RFI opportunity if pot already opened', () => {
    const handStats = createTestHandStats(['btn']);
    handStats.sharedState.preflopRaiseMade = true; // Pot already opened
    const game = mockGame();
    
    statsTracker.trackAction(handStats, game, mockPlayer('btn', {positionName: 'BTN'}), 'raise');
    
    expect(handStats.btn.increments.btn_rfi_opportunities).toBe(0);
    expect(handStats.btn.increments.btn_rfi_actions).toBe(0);
  });
});

describe('statsTracker - Steal and Defend Scenarios', () => {
  it('tracks BB defend vs steal', () => {
    const handStats = createTestHandStats(['bb']);
    handStats.sharedState.preflopRaiseMade = true;
    const game = mockGame();
    
    statsTracker.trackAction(handStats, game, mockPlayer('bb', {isBB: true, positionName: 'BB'}), 'call');
    
    expect(handStats.bb.increments.bb_defend_opportunities).toBe(1);
    expect(handStats.bb.increments.bb_defend_actions).toBe(1);
  });
  
  it('tracks SB defend and fold vs steal (non-heads-up)', () => {
    const handStats = createTestHandStats(['sb']);
    handStats.sharedState.preflopRaiseMade = true;
    handStats.sharedState.raiseCount = 1;
    handStats.sharedState.isHeadsUp = false;
    const game = mockGame();
    
    // SB calls (defends)
    statsTracker.trackAction(handStats, game, mockPlayer('sb', {isSB: true, positionName: 'SB'}), 'call');
    
    expect(handStats.sb.increments.sb_defend_opportunities).toBe(1);
    expect(handStats.sb.increments.sb_defend_actions).toBe(1);
    expect(handStats.sb.increments.sb_fold_vs_steal_opportunities).toBe(1);
    expect(handStats.sb.increments.sb_fold_vs_steal_actions).toBe(0);
  });
  
  it('tracks SB fold vs steal', () => {
    const handStats = createTestHandStats(['sb']);
    handStats.sharedState.preflopRaiseMade = true;
    handStats.sharedState.raiseCount = 1;
    handStats.sharedState.isHeadsUp = false;
    const game = mockGame();
    
    statsTracker.trackAction(handStats, game, mockPlayer('sb', {isSB: true, positionName: 'SB'}), 'fold');
    
    expect(handStats.sb.increments.sb_fold_vs_steal_opportunities).toBe(1);
    expect(handStats.sb.increments.sb_fold_vs_steal_actions).toBe(1);
  });
  
  it('does not track steal scenarios in heads-up', () => {
    const handStats = createTestHandStats(['sb']);
    handStats.sharedState.preflopRaiseMade = true;
    handStats.sharedState.raiseCount = 1;
    handStats.sharedState.isHeadsUp = true; // Heads-up
    const game = mockGame();
    
    statsTracker.trackAction(handStats, game, mockPlayer('sb', {isSB: true, positionName: 'SB'}), 'fold');
    
    expect(handStats.sb.increments.sb_defend_opportunities).toBe(0);
    expect(handStats.sb.increments.sb_fold_vs_steal_opportunities).toBe(0);
  });
});

describe('statsTracker - Showdown Stats', () => {
  it('tracks WTSD correctly', () => {
    const handStats = createTestHandStats(['p1', 'p2']);
    
    // Mark players as having seen flop
    handStats.p1.handState.saw_flop = true;
    handStats.p2.handState.saw_flop = true;
    
    statsTracker.trackShowdown(handStats, ['p1', 'p2'], 'p1');
    
    expect(handStats.p1.increments.wtsd_actions).toBe(1);
    expect(handStats.p2.increments.wtsd_actions).toBe(1);
  });
  
  it('tracks WSD for winner', () => {
    const handStats = createTestHandStats(['winner', 'loser']);
    handStats.winner.handState.saw_flop = true;
    handStats.loser.handState.saw_flop = true;
    
    statsTracker.trackShowdown(handStats, ['winner', 'loser'], 'winner');
    
    expect(handStats.winner.increments.wsd_opportunities).toBe(1);
    expect(handStats.winner.increments.wsd_actions).toBe(1);
    expect(handStats.loser.increments.wsd_opportunities).toBe(0);
    expect(handStats.loser.increments.wsd_actions).toBe(0);
  });
  
  it('does not track WTSD for players who did not see flop', () => {
    const handStats = createTestHandStats(['p1']);
    // p1 did not see flop (folded preflop)
    
    statsTracker.trackShowdown(handStats, ['p1'], 'p1');
    
    expect(handStats.p1.increments.wtsd_actions).toBe(0);
  });
});

describe('statsTracker - Hand Winner Tracking', () => {
  it('tracks hands won and BB won correctly', () => {
    const handStats = createTestHandStats(['winner']);
    
    statsTracker.trackHandWinner(handStats, ['winner'], 500, 100);
    
    expect(handStats.winner.increments.hands_won).toBe(1);
    expect(handStats.winner.increments.total_bb_won).toBe(5); // 500/100
    expect(handStats.winner.increments.total_pot_size_won).toBe(500);
  });
  
  it('tracks WWSF for winner who saw flop', () => {
    const handStats = createTestHandStats(['winner']);
    handStats.winner.handState.saw_flop = true;
    
    statsTracker.trackHandWinner(handStats, ['winner'], 500, 100);
    
    expect(handStats.winner.increments.wwsf_actions).toBe(1);
  });
  
  it('splits pot correctly for multiple winners', () => {
    const handStats = createTestHandStats(['w1', 'w2']);
    
    statsTracker.trackHandWinner(handStats, ['w1', 'w2'], 600, 100);
    
    expect(handStats.w1.increments.hands_won).toBe(1);
    expect(handStats.w2.increments.hands_won).toBe(1);
    expect(handStats.w1.increments.total_bb_won).toBe(3); // 300/100
    expect(handStats.w2.increments.total_bb_won).toBe(3); // 300/100
  });
  
  it('handles invalid bigBlind gracefully', () => {
    const handStats = createTestHandStats(['winner']);
    
    // Should not crash or set stats with invalid bigBlind
    statsTracker.trackHandWinner(handStats, ['winner'], 500, 0);
    
    expect(handStats.winner.increments.hands_won).toBe(0);
  });
});

describe('statsTracker - Post-flop Aggression and C-bet', () => {
  it('tracks aggression factor correctly', () => {
    const handStats = createTestHandStats(['p1']);
    const game = mockGame({ currentBettingRound: 'FLOP' });
    
    statsTracker.trackAction(handStats, game, mockPlayer('p1'), 'bet');
    statsTracker.trackAction(handStats, game, mockPlayer('p1'), 'call');
    statsTracker.trackAction(handStats, game, mockPlayer('p1'), 'raise');
    
    expect(handStats.p1.increments.agg_bets).toBe(1);
    expect(handStats.p1.increments.agg_calls).toBe(1);
    expect(handStats.p1.increments.agg_raises).toBe(1);
  });
  
  it('tracks c-bet opportunities and actions', () => {
    const handStats = createTestHandStats(['aggressor']);
    handStats.aggressor.handState.is_preflop_aggressor = true;
    handStats.sharedState.streets = {
      FLOP: { actors: [], firstAggressorId: null, hasAggression: false },
      TURN: { actors: [], firstAggressorId: null, hasAggression: false },
      RIVER: { actors: [], firstAggressorId: null, hasAggression: false }
    };
    
    
    const game = mockGame({ currentBettingRound: 'FLOP' });
    statsTracker.trackAction(handStats, game, mockPlayer('aggressor'), 'bet');
    
    expect(handStats.aggressor.increments.cbet_flop_opportunities).toBe(1);
    expect(handStats.aggressor.increments.cbet_flop_actions).toBe(1);
  });
});

describe('statsTracker - Multiway Pot Scenarios', () => {
  it('tracks 3-bet opportunities for multiple players facing a raise', () => {
    const handStats = createTestHandStats(['opener', 'p2', 'p3', 'p4']);
    const game = mockGame();
    
    // Opener raises
    statsTracker.trackAction(handStats, game, mockPlayer('opener', {positionName: 'UTG'}), 'bet');
    
    // All other players get 3-bet opportunities
    statsTracker.trackAction(handStats, game, mockPlayer('p2', {positionName: 'MP'}), 'fold');
    statsTracker.trackAction(handStats, game, mockPlayer('p3', {positionName: 'CO'}), 'raise');
    statsTracker.trackAction(handStats, game, mockPlayer('p4', {positionName: 'BTN'}), 'fold');
    
    expect(handStats.p2.increments['3bet_opportunities']).toBe(1);
    expect(handStats.p3.increments['3bet_opportunities']).toBe(1);
    expect(handStats.p4.increments['3bet_opportunities']).toBe(1);
    expect(handStats.p3.increments['3bet_actions']).toBe(1);
  });
  
  it('tracks donk bet only when preflop aggressor is still active', () => {
    const handStats = createTestHandStats(['aggressor', 'donker', 'other']);
    handStats.aggressor.handState.is_preflop_aggressor = true;
    handStats.sharedState.preflopAggressorId = 'aggressor';
    handStats.sharedState.activePlayers = new Set(['aggressor', 'donker', 'other']);
    handStats.sharedState.streets = {
      FLOP: { actors: [], firstAggressorId: null, hasAggression: false },
      TURN: { actors: [], firstAggressorId: null, hasAggression: false },
      RIVER: { actors: [], firstAggressorId: null, hasAggression: false }
    };
    
    const game = mockGame({ currentBettingRound: 'FLOP' });
    
    // Donker acts first on flop and donks
    statsTracker.trackAction(handStats, game, mockPlayer('donker'), 'bet');
    
    expect(handStats.donker.increments.donk_flop_opportunities).toBe(1);
    expect(handStats.donker.increments.donk_flop_actions).toBe(1);
  });
  
  it('does not track donk bet when preflop aggressor folded', () => {
    const handStats = createTestHandStats(['aggressor', 'donker']);
    handStats.sharedState.preflopAggressorId = 'aggressor';
    handStats.sharedState.activePlayers = new Set(['donker']); // Aggressor not active
    handStats.sharedState.streets = {
      FLOP: { actors: [], firstAggressorId: null, hasAggression: false },
      TURN: { actors: [], firstAggressorId: null, hasAggression: false },
      RIVER: { actors: [], firstAggressorId: null, hasAggression: false }
    };
    
    const game = mockGame({ currentBettingRound: 'FLOP' });
    
    statsTracker.trackAction(handStats, game, mockPlayer('donker'), 'bet');
    
    expect(handStats.donker.increments.donk_flop_opportunities).toBe(0);
    expect(handStats.donker.increments.donk_flop_actions).toBe(0);
  });
  
  it('tracks multiple players seeing flop for WTSD opportunities', () => {
    const handStats = createTestHandStats(['p1', 'p2', 'p3']);
    const game = mockGame({ currentBettingRound: 'FLOP' });
    
    // All players act on flop (sees flop)
    statsTracker.trackAction(handStats, game, mockPlayer('p1'), 'check');
    statsTracker.trackAction(handStats, game, mockPlayer('p2'), 'bet');
    statsTracker.trackAction(handStats, game, mockPlayer('p3'), 'call');
    
    expect(handStats.p1.increments.wtsd_opportunities).toBe(1);
    expect(handStats.p2.increments.wtsd_opportunities).toBe(1);
    expect(handStats.p3.increments.wtsd_opportunities).toBe(1);
    expect(handStats.p1.increments.wwsf_opportunities).toBe(1);
    expect(handStats.p2.increments.wwsf_opportunities).toBe(1);
    expect(handStats.p3.increments.wwsf_opportunities).toBe(1);
  });
});

describe('statsTracker - Heads-Up Specific Scenarios', () => {
  it('handles heads-up button/small blind position correctly', () => {
    const handStats = createTestHandStats(['btn_sb', 'bb']);
    handStats.sharedState.isHeadsUp = true;
    const game = mockGame();
    
    // BTN/SB raises (RFI)
    statsTracker.trackAction(handStats, game, mockPlayer('btn_sb', {positionName: 'BTN/SB'}), 'bet');
    // BB calls
    statsTracker.trackAction(handStats, game, mockPlayer('bb', {isBB: true, positionName: 'BB'}), 'call');
    
    expect(handStats.btn_sb.increments.btn_rfi_opportunities).toBe(1);
    expect(handStats.btn_sb.increments.btn_rfi_actions).toBe(1);
    expect(handStats.bb.increments.bb_defend_opportunities).toBe(1);
    expect(handStats.bb.increments.bb_defend_actions).toBe(1);
  });
  
  it('does not track steal scenarios in heads-up play', () => {
    const handStats = createTestHandStats(['btn_sb', 'bb']);
    handStats.sharedState.isHeadsUp = true;
    handStats.sharedState.preflopRaiseMade = true;
    handStats.sharedState.raiseCount = 1;
    const game = mockGame();
    
    // BB folds to steal - but no steal stats in heads-up
    statsTracker.trackAction(handStats, game, mockPlayer('bb', {isBB: true, positionName: 'BB'}), 'fold');
    
    expect(handStats.bb.increments.bb_fold_vs_steal_opportunities).toBe(0);
    expect(handStats.bb.increments.bb_fold_vs_steal_actions).toBe(0);
  });
  
  it('tracks 3-bet opportunities in heads-up correctly', () => {
    const handStats = createTestHandStats(['btn_sb', 'bb']);
    handStats.sharedState.isHeadsUp = true;
    const game = mockGame();
    
    // BTN/SB raises
    statsTracker.trackAction(handStats, game, mockPlayer('btn_sb', {positionName: 'BTN/SB'}), 'bet');
    // BB can 3-bet
    statsTracker.trackAction(handStats, game, mockPlayer('bb', {isBB: true, positionName: 'BB'}), 'raise');
    
    expect(handStats.bb.increments['3bet_opportunities']).toBe(1);
    expect(handStats.bb.increments['3bet_actions']).toBe(1);
  });
});

describe('statsTracker - Edge Cases and Complex Scenarios', () => {
  it('handles open limp correctly - only first actor gets opportunity', () => {
    const handStats = createTestHandStats(['first', 'second', 'third']);
    const game = mockGame();
    
    // First player to act has open limp opportunity
    statsTracker.trackAction(handStats, game, mockPlayer('first', {positionName: 'UTG'}), 'call');
    // Second player acts - no open limp opportunity (first already acted)
    statsTracker.trackAction(handStats, game, mockPlayer('second', {positionName: 'MP'}), 'call');
    
    expect(handStats.first.increments.open_limp_opportunities).toBe(1);
    expect(handStats.first.increments.open_limp_actions).toBe(1);
    expect(handStats.second.increments.open_limp_opportunities).toBe(0);
    expect(handStats.second.increments.open_limp_actions).toBe(0);
  });
  
  it('tracks check-raise only when player actually faces aggression after checking', () => {
    const handStats = createTestHandStats(['checker', 'bettor']);
    handStats.sharedState.streets = {
      FLOP: { actors: [], firstAggressorId: null, hasAggression: false },
      TURN: { actors: [], firstAggressorId: null, hasAggression: false },
      RIVER: { actors: [], firstAggressorId: null, hasAggression: false }
    };
    const game = mockGame({ currentBettingRound: 'FLOP' });
    
    // Player checks first
    statsTracker.trackAction(handStats, game, mockPlayer('checker'), 'check');
    // Opponent bets (creates aggression)
    statsTracker.trackAction(handStats, game, mockPlayer('bettor'), 'bet');
    // Now checker faces aggression and can check-raise
    statsTracker.trackAction(handStats, game, mockPlayer('checker'), 'raise');
    
    expect(handStats.checker.increments.ch_raise_flop_opportunities).toBe(1);
    expect(handStats.checker.increments.ch_raise_flop_actions).toBe(1);
  });
  
  it('handles serialized activePlayers Set correctly', () => {
    const handStats = createTestHandStats(['p1']);
    // Simulate activePlayers being serialized to array
    handStats.sharedState.activePlayers = ['existing_player'];
    
    const game = mockGame();
    
    // Should convert array back to Set and work normally
    expect(() => {
      statsTracker.trackAction(handStats, game, mockPlayer('p1'), 'fold');
    }).not.toThrow();
    
    expect(handStats.sharedState.activePlayers instanceof Set).toBe(true);
  });
  
  it('tracks all position types correctly', () => {
    const positions = ['UTG', 'UTG+1', 'MP', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB', 'BTN/SB'];
    const handStats = createTestHandStats(['player']);
    const game = mockGame();
    
    positions.forEach(pos => {
      const playerStats = statsTracker.createHandStatsObject('player');
      const mockHandStats = { player: playerStats, sharedState: statsTracker.createSharedState() };
      
      statsTracker.trackAction(mockHandStats, game, mockPlayer('player', {positionName: pos}), 'call');
      
      expect(mockHandStats.player.positionIncrements[pos].vpip_opportunities).toBe(1);
      expect(mockHandStats.player.positionIncrements[pos].vpip_actions).toBe(1);
    });
  });
});

describe('statsTracker - Error Handling', () => {
  it('handles missing parameters gracefully', () => {
    expect(() => {
      statsTracker.trackAction(null, null, null, null);
    }).not.toThrow();
    
    expect(() => {
      statsTracker.trackShowdown(null, null, null);
    }).not.toThrow();
    
    expect(() => {
      statsTracker.trackHandWinner(null, null, null, null);
    }).not.toThrow();
  });
  
  it('handles missing player stats gracefully', () => {
    const handStats = createTestHandStats(['p1']);
    const game = mockGame();
    
    expect(() => {
      statsTracker.trackAction(handStats, game, mockPlayer('nonexistent'), 'fold');
    }).not.toThrow();
  });
  
  it('handles corrupted sharedState gracefully', () => {
    const handStats = createTestHandStats(['p1']);
    handStats.sharedState = null; // Corrupted state
    const game = mockGame();
    
    expect(() => {
      statsTracker.trackAction(handStats, game, mockPlayer('p1'), 'fold');
    }).not.toThrow();
    
    // Should recreate sharedState
    expect(handStats.sharedState).toBeTruthy();
    expect(handStats.sharedState.activePlayers instanceof Set).toBe(true);
  });
});