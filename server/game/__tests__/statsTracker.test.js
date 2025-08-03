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

// --- existing tests omitted for brevity (assumed present) ---

describe('statsTracker – Post-flop C-Bet flow', () => {
  it('records flop c-bet and fold-vs-cbet, and turn c-bet', () => {
    const pAgg = 'PFR';
    const pDef = 'DEF';
    const handStats = {
      [pAgg]: statsTracker.createHandStatsObject(pAgg),
      [pDef]: statsTracker.createHandStatsObject(pDef),
      sharedState: {
        preflopRaiseMade: true,
        raiseCount: 1,
        preflopAggressorId: pAgg,
        streets: { FLOP:{actors:[],firstAggressorId:null}, TURN:{actors:[],firstAggressorId:null}, RIVER:{actors:[],firstAggressorId:null} }
      }
    };

    // Mark PFR flag manually since we skip earlier logic in this unit test
    handStats[pAgg].handState.is_preflop_aggressor = true;

    // FLOP
    let game = mockGame({ currentBettingRound: 'FLOP' });
    statsTracker.trackAction(handStats, game, mockPlayer(pAgg,{positionName:'BTN'}), 'bet'); // c-bet
    statsTracker.trackAction(handStats, game, mockPlayer(pDef,{positionName:'BB'}), 'fold'); // defender folds

    // TURN (new street) – aggressor bets again
    game = mockGame({ currentBettingRound: 'TURN' });
    statsTracker.trackAction(handStats, game, mockPlayer(pAgg,{positionName:'BTN'}), 'bet');

    const incAgg = handStats[pAgg].increments;
    expect(incAgg.cbet_flop_opportunities).toBe(1);
    expect(incAgg.cbet_flop_actions).toBe(1);
    expect(incAgg.cbet_turn_opportunities).toBe(1);
    expect(incAgg.cbet_turn_actions).toBe(1);

    const incDef = handStats[pDef].increments;
    expect(incDef.fold_vs_cbet_flop_opportunities).toBe(1);
    expect(incDef.fold_vs_cbet_flop_actions).toBe(1);
  });
});