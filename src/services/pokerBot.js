// Poker Bot for 6-max and 9-max games
// Implements GTO-inspired strategy with position awareness and hand ranges

// Utility to normalize position names to match handRanges keys
function normalizePositionName(pos) {
  let base = pos.split(' ')[0].split('(')[0].trim();
  if (base === 'UTG' || base === 'UTG+1' || base === 'UTG+2') return 'UTG';
  if (base === 'LJ' || base === 'HJ') return 'MP';
  return base;
}

class PokerBot {
  constructor() {
    this.rankValues = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 
      'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };
    
    // Master hand order (hardcoded, all 169 hands, custom tiers 1-11 by Sklansky/strength, no repeats)
    this.masterHandOrder = [
      // Tier 1
      'AA','KK','QQ','AKs','AKo','JJ',
      // Tier 2
      'TT','AQs','AJs','KQs',
      // Tier 3
      '99','JTs','KJs','QJs','ATs','AQo',
      // Tier 4
      '88','KTs','QTs','J9s','T9s','98s','AJo','KQo',
      // Tier 5
      '77','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','Q9s','K9s','97s','87s','76s','KJo','QJo','ATo','66',
      // Tier 6
      '55','T8s','J8s','86s','75s','54s','JTo','KTo','QTo',
      // Tier 7
      '44','33','22','K8s','K7s','K6s','K5s','K4s','K3s','K2s','Q8s','Q7s','Q6s','Q5s','Q4s','Q3s','Q2s','T7s','64s','53s','43s','T9o','98o','J9o',
      // Tier 8
      'A9o','K9o','Q9o','J7s','J6s','J5s','J4s','J3s','J2s','96s','95s','94s','93s','92s','85s','84s','83s','82s','74s','73s','72s','62s',
      // Tier 9
      '65s','T6s','T5s','T4s','T3s','T2s',
      // Tier 10
      'A8o','A7o','A6o','A5o','A4o','A3o','A2o','K8o','K7o','K6o','32s','K5o','K4o','K3o','K2o','Q8o','Q7o','Q6o','Q5o','Q4o','Q3o','Q2o','J8o','63s','42s','J7o','J6o','J5o','J4o','J3o','J2o','T8o','T7o','T6o','T5o','T4o','T3o','T2o','97o','96o','95o','94o','93o','92o','87o','86o',
      // Tier 11
      '85o','52s','84o','83o','82o','76o','75o','74o','73o','72o','65o','64o','63o','62o','54o','53o','52o','43o','42o','32o'
    ];
    
    // Position-based opening ranges (GTO-inspired)
    this.rfiRanges = {
      'UTG': this.getTopPercentHands(17.5),
      'MP': this.getTopPercentHands(21.3),
      'CO': this.getTopPercentHands(28.5),
      'BTN': this.getTopPercentHands(41.8),
      'SB': this.getTopPercentHands(41.8)
    };
    // Duplicate reversed keys for rfiRanges (not needed, but for consistency)
    for (const key of Object.keys(this.rfiRanges)) {
      for (const key2 of Object.keys(this.rfiRanges)) {
        if (key !== key2) {
          const comboKey = key + '_vs_' + key2;
          const reversedComboKey = key2 + '_vs_' + key;
          if (!this.rfiRanges[reversedComboKey]) {
            this.rfiRanges[reversedComboKey] = this.rfiRanges[comboKey];
          }
        }
      }
    }

    // Call vs RFI (flatting) ranges
    this.flattingRanges = {
      'MP_vs_UTG_RFI': [], // 0%
      'CO_vs_UTG_RFI': [], // 0%
      'BTN_vs_UTG_RFI': this.getNextPercentHands(4.2, this.rfiRanges['UTG']),
      'SB_vs_UTG_RFI': [], // 0%
      'BB_vs_UTG_RFI': this.getNextPercentHands(18.4, this.rfiRanges['UTG']),
      'CO_vs_MP_RFI': [], // 0%
      'BTN_vs_MP_RFI': this.getNextPercentHands(3.2, this.rfiRanges['MP']),
      'SB_vs_MP_RFI': [], // 0%
      'BB_vs_MP_RFI': this.getNextPercentHands(19.5, this.rfiRanges['MP']),
      'BTN_vs_CO_RFI': this.getNextPercentHands(2.3, this.rfiRanges['CO']),
      'SB_vs_CO_RFI': [], // 0%
      'BB_vs_CO_RFI': this.getNextPercentHands(21.9, this.rfiRanges['CO']),
      'SB_vs_BTN_RFI': [], // 0%
      'BB_vs_BTN_RFI': this.getNextPercentHands(25.8, this.rfiRanges['BTN']),
      'BB_vs_SB_RFI': this.getNextPercentHands(35, this.rfiRanges['SB'])
    };
    for (const key of Object.keys(this.flattingRanges)) {
      const parts = key.split('_vs_');
      if (parts.length === 2) {
        const reversedKey = parts[1] + '_vs_' + parts[0] + '_RFI';
        if (!this.flattingRanges[reversedKey]) {
          this.flattingRanges[reversedKey] = this.flattingRanges[key];
        }
      }
    }

    // 3-Bet ranges (raise vs RFI)
    this.threeBetRanges = {
      'MP_vs_UTG': this.getTopPercentHands(7.9),
      'CO_vs_UTG': this.getTopPercentHands(8.3),
      'BTN_vs_UTG': this.getTopPercentHands(8.3),
      'SB_vs_UTG': this.getTopPercentHands(7.4),
      'BB_vs_UTG': this.getTopPercentHands(5.6),
      'CO_vs_MP': this.getTopPercentHands(9.5),
      'BTN_vs_MP': this.getTopPercentHands(9.5),
      'SB_vs_MP': this.getTopPercentHands(9.2),
      'BB_vs_MP': this.getTopPercentHands(7.2),
      'BTN_vs_CO': this.getTopPercentHands(12.8),
      'SB_vs_CO': this.getTopPercentHands(11.5),
      'BB_vs_CO': this.getTopPercentHands(9.1),
      'SB_vs_BTN': this.getTopPercentHands(15.1),
      'BB_vs_BTN': this.getTopPercentHands(13.9),
      'BB_vs_SB': this.getTopPercentHands(17.4)
    };
    for (const key of Object.keys(this.threeBetRanges)) {
      const parts = key.split('_vs_');
      if (parts.length === 2) {
        const reversedKey = parts[1] + '_vs_' + parts[0];
        if (!this.threeBetRanges[reversedKey]) {
          this.threeBetRanges[reversedKey] = this.threeBetRanges[key];
        }
      }
    }

    // 4-Bet ranges (raise vs 3-bet)
    this.fourBetRanges = {
      'UTG_vs_MP_4B': this.getTopPercentHands(4.2),
      'UTG_vs_CO_4B': this.getTopPercentHands(4.5),
      'UTG_vs_BTN_4B': this.getTopPercentHands(4.5),
      'UTG_vs_SB_4B': this.getTopPercentHands(3),
      'UTG_vs_BB_4B': this.getTopPercentHands(2.7),
      'MP_vs_CO_4B': this.getTopPercentHands(5.1),
      'MP_vs_BTN_4B': this.getTopPercentHands(5.1),
      'MP_vs_SB_4B': this.getTopPercentHands(5.1),
      'MP_vs_BB_4B': this.getTopPercentHands(3.3),
      'CO_vs_BTN_4B': this.getTopPercentHands(6.3),
      'CO_vs_SB_4B': this.getTopPercentHands(5.3),
      'CO_vs_BB_4B': this.getTopPercentHands(4.5),
      'BTN_vs_SB_4B': this.getTopPercentHands(5.6),
      'BTN_vs_BB_4B': this.getTopPercentHands(5),
      'SB_vs_BB_4B': this.getTopPercentHands(7.7)
    };
    for (const key of Object.keys(this.fourBetRanges)) {
      const parts = key.split('_vs_');
      if (parts.length === 2) {
        const reversedKey = parts[1] + '_vs_' + parts[0] + '_4B';
        if (!this.fourBetRanges[reversedKey]) {
          this.fourBetRanges[reversedKey] = this.fourBetRanges[key];
        }
      }
    }

    // 5-Bet ranges (raise vs 4-bet)
    this.fiveBetRanges = {
      'MP_vs_UTG_5B': this.getTopPercentHands(2.1),
      'CO_vs_UTG_5B': this.getTopPercentHands(2.1),
      'BTN_vs_UTG_5B': this.getTopPercentHands(2.1),
      'SB_vs_UTG_5B': this.getTopPercentHands(2.1),
      'BB_vs_UTG_5B': this.getTopPercentHands(2.1),
      'CO_vs_MP_5B': this.getTopPercentHands(2.1),
      'BTN_vs_MP_5B': this.getTopPercentHands(2.6),
      'SB_vs_MP_5B': this.getTopPercentHands(2.9),
      'BB_vs_MP_5B': this.getTopPercentHands(2.6),
      'BTN_vs_CO_5B': this.getTopPercentHands(3.3),
      'SB_vs_CO_5B': this.getTopPercentHands(3.8),
      'BB_vs_CO_5B': this.getTopPercentHands(3.5),
      'SB_vs_BTN_5B': this.getTopPercentHands(5),
      'BB_vs_BTN_5B': this.getTopPercentHands(4.4),
      'BB_vs_SB_5B': this.getTopPercentHands(4.5)
    };
    for (const key of Object.keys(this.fiveBetRanges)) {
      const parts = key.split('_vs_');
      if (parts.length === 2) {
        const reversedKey = parts[1] + '_vs_' + parts[0] + '_5B';
        if (!this.fiveBetRanges[reversedKey]) {
          this.fiveBetRanges[reversedKey] = this.fiveBetRanges[key];
        }
      }
    }

    // Call 3-bet ranges (exclusive from 4-bet range, not 3-bet range)
    this.threeBetCallingRanges = {
      'UTG_vs_MP_3B': this.getNextPercentHands(2.3, this.fourBetRanges['UTG_vs_MP_4B']),
      'UTG_vs_CO_3B': this.getNextPercentHands(2.3, this.fourBetRanges['UTG_vs_CO_4B']),
      'UTG_vs_BTN_3B': this.getNextPercentHands(2.7, this.fourBetRanges['UTG_vs_BTN_4B']),
      'UTG_vs_SB_3B': this.getNextPercentHands(3.2, this.fourBetRanges['UTG_vs_SB_4B']),
      'UTG_vs_BB_3B': this.getNextPercentHands(3.6, this.fourBetRanges['UTG_vs_BB_4B']),
      'MP_vs_CO_3B': this.getNextPercentHands(2.3, this.fourBetRanges['MP_vs_CO_4B']),
      'MP_vs_BTN_3B': this.getNextPercentHands(2.7, this.fourBetRanges['MP_vs_BTN_4B']),
      'MP_vs_SB_3B': this.getNextPercentHands(2.7, this.fourBetRanges['MP_vs_SB_4B']),
      'MP_vs_BB_3B': this.getNextPercentHands(3.9, this.fourBetRanges['MP_vs_BB_4B']),
      'CO_vs_BTN_3B': this.getNextPercentHands(4.2, this.fourBetRanges['CO_vs_BTN_4B']),
      'CO_vs_SB_3B': this.getNextPercentHands(2.9, this.fourBetRanges['CO_vs_SB_4B']),
      'CO_vs_BB_3B': this.getNextPercentHands(4.5, this.fourBetRanges['CO_vs_BB_4B']),
      'BTN_vs_SB_3B': this.getNextPercentHands(4.4, this.fourBetRanges['BTN_vs_SB_4B']),
      'BTN_vs_BB_3B': this.getNextPercentHands(7.1, this.fourBetRanges['BTN_vs_BB_4B']),
      'SB_vs_BB_3B': this.getNextPercentHands(5, this.fourBetRanges['SB_vs_BB_4B'])
    };
    for (const key of Object.keys(this.threeBetCallingRanges)) {
      const parts = key.split('_vs_');
      if (parts.length === 2) {
        const reversedKey = parts[1] + '_vs_' + parts[0] + '_3B';
        if (!this.threeBetCallingRanges[reversedKey]) {
          this.threeBetCallingRanges[reversedKey] = this.threeBetCallingRanges[key];
        }
      }
    }

    // Call 4-bet ranges (exclusive from 5-bet range, not 4-bet range)
    this.fourBetCallingRanges = {
      'MP_3B_vs_UTG_4B': this.getNextPercentHands(1.8, this.fiveBetRanges['MP_vs_UTG_5B']),
      'CO_3B_vs_UTG_4B': this.getNextPercentHands(1.8, this.fiveBetRanges['CO_vs_UTG_5B']),
      'BTN_3B_vs_UTG_4B': this.getNextPercentHands(1.8, this.fiveBetRanges['BTN_vs_UTG_5B']),
      'SB_3B_vs_UTG_4B': this.getNextPercentHands(1.8, this.fiveBetRanges['SB_vs_UTG_5B']),
      'BB_3B_vs_UTG_4B': this.getNextPercentHands(0.8, this.fiveBetRanges['BB_vs_UTG_5B']),
      'CO_3B_vs_MP_4B': this.getNextPercentHands(2.6, this.fiveBetRanges['CO_vs_MP_5B']),
      'BTN_3B_vs_MP_4B': this.getNextPercentHands(2.1, this.fiveBetRanges['BTN_vs_MP_5B']),
      'SB_3B_vs_MP_4B': this.getNextPercentHands(2.1, this.fiveBetRanges['SB_vs_MP_5B']),
      'BB_3B_vs_MP_4B': this.getNextPercentHands(1.2, this.fiveBetRanges['BB_vs_MP_5B']),
      'BTN_3B_vs_CO_4B': this.getNextPercentHands(2.7, this.fiveBetRanges['BTN_vs_CO_5B']),
      'SB_3B_vs_CO_4B': this.getNextPercentHands(1.4, this.fiveBetRanges['SB_vs_CO_5B']),
      'BB_3B_vs_CO_4B': this.getNextPercentHands(0.6, this.fiveBetRanges['BB_vs_CO_5B']),
      'SB_3B_vs_BTN_4B': this.getNextPercentHands(1.8, this.fiveBetRanges['SB_vs_BTN_5B']),
      'BB_3B_vs_BTN_4B': this.getNextPercentHands(2, this.fiveBetRanges['BB_vs_BTN_5B']),
      'BB_3B_vs_SB_4B': this.getNextPercentHands(2.6, this.fiveBetRanges['BB_vs_SB_5B'])
    };
    for (const key of Object.keys(this.fourBetCallingRanges)) {
      const parts = key.split('_3B_vs_');
      if (parts.length === 2) {
        const reversedKey = parts[1] + '_3B_vs_' + parts[0] + '_4B';
        if (!this.fourBetCallingRanges[reversedKey]) {
          this.fourBetCallingRanges[reversedKey] = this.fourBetCallingRanges[key];
        }
      }
    }

    // Call 5-bet ranges (exclusive from 5-bet range, not 5-bet range)
    this.fiveBetCallingRanges = {
      'UTG_4B_vs_MP_5B': this.getTopPercentHands(2.1),
      'UTG_4B_vs_CO_5B': this.getTopPercentHands(2.1),
      'UTG_4B_vs_BTN_5B': this.getTopPercentHands(2.1),
      'UTG_4B_vs_SB_5B': this.getTopPercentHands(2.1),
      'UTG_4B_vs_BB_5B': this.getTopPercentHands(2.1),
      'MP_4B_vs_CO_5B': this.getTopPercentHands(2.6),
      'MP_4B_vs_BTN_5B': this.getTopPercentHands(2.6),
      'MP_4B_vs_SB_5B': this.getTopPercentHands(2.6),
      'MP_4B_vs_BB_5B': this.getTopPercentHands(2.1),
      'CO_4B_vs_BTN_5B': this.getTopPercentHands(3.0),
      'CO_4B_vs_SB_5B': this.getTopPercentHands(3.5),
      'CO_4B_vs_BB_5B': this.getTopPercentHands(3.0),
      'BTN_4B_vs_SB_5B': this.getTopPercentHands(3.3),
      'BTN_4B_vs_BB_5B': this.getTopPercentHands(3.0),
      'SB_4B_vs_BB_5B': this.getTopPercentHands(3.8)
    };
    for (const key of Object.keys(this.fiveBetCallingRanges)) {
      const parts = key.split('_4B_vs_');
      if (parts.length === 2) {
        const reversedKey = parts[1] + '_4B_vs_' + parts[0] + '_5B';
        if (!this.fiveBetCallingRanges[reversedKey]) {
          this.fiveBetCallingRanges[reversedKey] = this.fiveBetCallingRanges[key];
        }
      }
    }

    // BB defend ranges (exclusive from 3-bet ranges, not RFI ranges)
    this.bbDefendRanges = {
      'BB_vs_UTG_RFI': this.getNextPercentHands(18.4, this.threeBetRanges['BB_vs_UTG']),
      'BB_vs_MP_RFI': this.getNextPercentHands(19.5, this.threeBetRanges['BB_vs_MP']),
      'BB_vs_CO_RFI': this.getNextPercentHands(21.9, this.threeBetRanges['BB_vs_CO']),
      'BB_vs_BTN_RFI': this.getNextPercentHands(25.8, this.threeBetRanges['BB_vs_BTN']),
      'BB_vs_SB_RFI': this.getNextPercentHands(35.0, this.threeBetRanges['BB_vs_SB'])
    };
    for (const key of Object.keys(this.bbDefendRanges)) {
      const parts = key.split('_vs_');
      if (parts.length === 2) {
        const reversedKey = parts[1] + '_vs_' + parts[0] + '_RFI';
        if (!this.bbDefendRanges[reversedKey]) {
          this.bbDefendRanges[reversedKey] = this.bbDefendRanges[key];
        }
      }
    }

    // Legacy ranges for backward compatibility
    this.handRanges = this.rfiRanges;
    this.threeBetRange = ['AA','KK','QQ','JJ','AKs','AKo','AQs'];
    this.threeBetBluffRange = ['A5s','KJs','QJs','JTs','T9s'];
    this.fourBetRange = ['AA','KK','AKs'];
  }

  // Helper: Get top X% of hands from masterHandOrder
  getTopPercentHands(percent) {
    const total = 169;
    const count = Math.round((percent / 100) * total);
    return this.masterHandOrder.slice(0, count);
  }

  // Helper: Get next Y% of hands, skipping those in excludeList
  getNextPercentHands(percent, excludeList) {
    const total = 169;
    const count = Math.round((percent / 100) * total);
    const filtered = this.masterHandOrder.filter(h => !excludeList.includes(h));
    return filtered.slice(0, count);
  }

  // Helper: Pair up call/raise contexts for exclusivity
  // Example: { raise: {key, percent}, call: {key, percent} }
  getExclusiveRanges(raisePercent, callPercent, raiseKey, callKey) {
    const raiseHands = this.getTopPercentHands(raisePercent);
    const callHands = this.getNextPercentHands(callPercent, raiseHands);
    return {
      [raiseKey]: raiseHands,
      [callKey]: callHands
    };
  }

  // Helper to count raises in preflop betting round
  countPreflopRaises(gameState) {
    let raises = 0;
    if (!gameState.handHistory) return 0;
    for (const action of gameState.handHistory) {
      if (action.round === 'PREFLOP' && (action.type === 'raise' || action.type === 'bet')) {
        raises++;
      }
    }
    return raises;
  }

  // Helper to get the aggressor position from hand history
  getAggressorPosition(gameState) {
    if (!gameState.handHistory) return null;
    
    // Find the last raiser in preflop
    for (let i = gameState.handHistory.length - 1; i >= 0; i--) {
      const action = gameState.handHistory[i];
      if (action.round === 'PREFLOP' && (action.type === 'raise' || action.type === 'bet')) {
        return normalizePositionName(action.position || 'BB');
      }
    }
    return null;
  }

  // Helper to get the original raiser position (first raiser)
  getOriginalRaiserPosition(gameState) {
    if (!gameState.handHistory) return null;
    
    // Find the first raiser in preflop
    for (const action of gameState.handHistory) {
      if (action.round === 'PREFLOP' && (action.type === 'raise' || action.type === 'bet')) {
        return normalizePositionName(action.position || 'BB');
      }
    }
    return null;
  }

  // Helper to check if we're in BB and should defend wide
  shouldBBDefend(handNotation, aggressorPosition) {
    if (!aggressorPosition) return false;
    
    // Get the appropriate BB defend range based on aggressor position
    const bbDefendKey = `BB_vs_${aggressorPosition}_RFI`;
    const bbDefendRange = this.bbDefendRanges[bbDefendKey];
    
    if (!bbDefendRange) {
      console.log(`[PokerBot][WARNING] BB defend range not found: ${bbDefendKey}`);
      return false;
    }
    
    return bbDefendRange.includes(handNotation);
  }

  // Helper to check if hand is in a specific range
  isHandInSpecificRange(handNotation, rangeKey, rangeType) {
    let range = this[rangeType][rangeKey];
    if (!range) {
      // Try reversed key if not found, preserving suffix (e.g., _3B, _4B, etc)
      const match = rangeKey.match(/^([^_]+)_vs_([^_]+)(.*)$/);
      if (match) {
        const reversedKey = `${match[2]}_vs_${match[1]}${match[3]}`;
        range = this[rangeType][reversedKey];
        if (range) {
          console.log(`[PokerBot][INFO] Used reversed key: ${rangeType}[${reversedKey}]`);
        }
      }
    }
    if (!range) {
      console.log(`[PokerBot][WARNING] Range not found: ${rangeType}[${rangeKey}]`);
      return false;
    }
    return range.includes(handNotation);
  }

  // Helper to get the appropriate range key based on positions
  getRangeKey(ourPosition, aggressorPosition, rangeType) {
    if (rangeType === 'threeBetRanges') {
      return `${ourPosition}_vs_${aggressorPosition}`;
    } else if (rangeType === 'threeBetCallingRanges') {
      return `${aggressorPosition}_vs_${ourPosition}_3B`;
    } else if (rangeType === 'fourBetRanges') {
      return `${aggressorPosition}_vs_${ourPosition}_4B`;
    } else if (rangeType === 'fourBetCallingRanges') {
      return `${aggressorPosition}_3B_vs_${ourPosition}_4B`;
    } else if (rangeType === 'fiveBetRanges') {
      return `${aggressorPosition}_vs_${ourPosition}_5B`;
    } else if (rangeType === 'fiveBetCallingRanges') {
      return `${aggressorPosition}_4B_vs_${ourPosition}_5B`;
    } else if (rangeType === 'flattingRanges') {
      return `${ourPosition}_vs_${aggressorPosition}_RFI`;
    }
    return null;
  }

  // Safety check to prevent infinite loops
  shouldPreventInfiniteLoop(numPreflopRaises, stackSize, currentHighestBet) {
    // If we've had more than 5 raises, something is wrong
    if (numPreflopRaises > 5) {
      console.log(`[PokerBot][SAFETY] Too many raises (${numPreflopRaises}), forcing fold`);
      return true;
    }
    
    // If the bet is more than 80% of our stack, be very conservative
    if (currentHighestBet > stackSize * 0.8) {
      console.log(`[PokerBot][SAFETY] Bet too large relative to stack, being conservative`);
      return true;
    }
    
    return false;
  }

  // Main decision function - PREFLOP ONLY
  calculateAction(gameState, playerState) {
    const {
      communityCards,
      holeCards,
      currentPotValue,
      currentHighestBet,
      currentBettingRound,
      minRaiseAmount,
      playerPosition,
      numPlayers,
      activePlayers,
      isPreflop,
      stackSize,
      currentBet
    } = this.parseGameState(gameState, playerState);

    // Only handle preflop decisions
    if (!isPreflop) {
      console.log(`[PokerBot][ERROR] Postflop action requested but bot is preflop-only`);
      return { action: 'fold', amount: 0 };
    }

    const numPreflopRaises = this.countPreflopRaises(gameState);
    const position = this.getPositionValue(playerPosition);
    
    // Check if user is involved in the action
    const userInvolved = this.isUserInvolved(gameState, playerState);
    
    if (userInvolved) {
      return this.handleUserInvolvedAction(gameState, playerState, currentHighestBet, currentBet, stackSize, holeCards, playerPosition, numPreflopRaises);
    } else {
      return this.preflopDecision(gameState, playerState, currentHighestBet, currentBet, stackSize, numPlayers, activePlayers, holeCards, playerPosition, numPreflopRaises);
    }
  }

  parseGameState(gameState, playerState) {
    return {
      communityCards: gameState.communityCards || [],
      holeCards: playerState.cards || [],
      currentPotValue: gameState.pot || 0,
      currentHighestBet: gameState.currentHighestBet || 0,
      currentBettingRound: gameState.currentBettingRound || 'PREFLOP',
      minRaiseAmount: gameState.minRaiseAmount || 10,
      playerPosition: playerState.positionName || 'BB',
      numPlayers: gameState.players?.length || 6,
      activePlayers: gameState.players?.filter(p => !p.isFolded).length || 6,
      isPreflop: gameState.currentBettingRound === 'PREFLOP',
      stackSize: playerState.stack || 1000,
      currentBet: playerState.currentBet || 0
    };
  }

  preflopDecision(gameState, playerState, currentHighestBet, currentBet, stackSize, numPlayers, activePlayers, holeCards, playerPosition, numPreflopRaises) {
    const callAmount = currentHighestBet - currentBet;
    const positionName = normalizePositionName(playerPosition);
    const handNotation = this.getHandNotation(holeCards);
    const aggressorPosition = this.getAggressorPosition(gameState);
    const originalRaiserPosition = this.getOriginalRaiserPosition(gameState);

    // Debug: Print all relevant info
    console.log(`[PokerBot][DEBUG] PreflopDecision: hand=${handNotation}, pos=${positionName}, raises=${numPreflopRaises}, aggressor=${aggressorPosition}, originalRaiser=${originalRaiserPosition}`);

    // Safety check to prevent infinite loops
    if (this.shouldPreventInfiniteLoop(numPreflopRaises, stackSize, currentHighestBet)) {
      console.log(`[PokerBot][DEBUG] Safety fold/call triggered`);
      if (handNotation === 'AA' || handNotation === 'KK') {
        return { action: 'call', amount: callAmount };
      } else {
        return { action: 'fold', amount: 0 };
      }
    }

    // 0 raises: RFI (open or fold)
    if (numPreflopRaises === 0) {
      const inRFI = this.isHandInSpecificRange(handNotation, positionName, 'rfiRanges');
      console.log(`[PokerBot][DEBUG] RFI: pos=${positionName}, hand=${handNotation}, inRFI=${inRFI}`);
      if (inRFI) {
        return this.decideRaise(currentHighestBet, stackSize, 'open');
      } else {
        return { action: 'fold', amount: 0 };
      }
    }

    // 1 raise: Facing an open (flat, 3-bet, or fold)
    if (numPreflopRaises === 1) {
      // BB special case: defend or 3-bet or fold
      if (positionName === 'BB' && aggressorPosition && aggressorPosition !== 'BB') {
        const threeBetKey = this.getRangeKey('BB', aggressorPosition, 'threeBetRanges');
        const in3Bet = this.isHandInSpecificRange(handNotation, threeBetKey, 'threeBetRanges');
        const inDefend = this.shouldBBDefend(handNotation, aggressorPosition);
        console.log(`[PokerBot][DEBUG] BB: 3betKey=${threeBetKey}, in3Bet=${in3Bet}, inDefend=${inDefend}`);
        if (in3Bet) {
          return this.decideRaise(currentHighestBet, stackSize, '3bet');
        }
        if (inDefend) {
        return { action: 'call', amount: callAmount };
      }
      return { action: 'fold', amount: 0 };
      }
      // Non-BB: 3-bet, flat, or fold
      if (positionName !== 'BB' && aggressorPosition && aggressorPosition !== positionName) {
        const threeBetKey = this.getRangeKey(positionName, aggressorPosition, 'threeBetRanges');
        const flattingKey = this.getRangeKey(positionName, aggressorPosition, 'flattingRanges');
        const in3Bet = this.isHandInSpecificRange(handNotation, threeBetKey, 'threeBetRanges');
        const inFlat = this.isHandInSpecificRange(handNotation, flattingKey, 'flattingRanges');
        console.log(`[PokerBot][DEBUG] 1 raise: pos=${positionName}, hand=${handNotation}, 3betKey=${threeBetKey}, in3Bet=${in3Bet}, flatKey=${flattingKey}, inFlat=${inFlat}`);
        if (in3Bet) {
        return this.decideRaise(currentHighestBet, stackSize, '3bet');
        }
        if (inFlat) {
        return { action: 'call', amount: callAmount };
        }
        return { action: 'fold', amount: 0 };
      }
      // Fallback: fold
      console.log(`[PokerBot][DEBUG] 1 raise fallback fold`);
      return { action: 'fold', amount: 0 };
    }

    // 2 raises: Facing a 3-bet (4-bet, call, or fold)
    if (numPreflopRaises === 2) {
      // Original raiser facing a 3-bet
      if (originalRaiserPosition === positionName && aggressorPosition && aggressorPosition !== positionName) {
        const fourBetKey = this.getRangeKey(positionName, aggressorPosition, 'fourBetRanges');
        const threeBetCallingKey = this.getRangeKey(positionName, aggressorPosition, 'threeBetCallingRanges');
        const in4Bet = this.isHandInSpecificRange(handNotation, fourBetKey, 'fourBetRanges');
        const inCall = this.isHandInSpecificRange(handNotation, threeBetCallingKey, 'threeBetCallingRanges');
        console.log(`[PokerBot][DEBUG] 2 raises: origRaiser=${positionName}, 3bettor=${aggressorPosition}, 4betKey=${fourBetKey}, in4Bet=${in4Bet}, 3betCallKey=${threeBetCallingKey}, inCall=${inCall}`);
        if (in4Bet) {
        return this.decideRaise(currentHighestBet, stackSize, '4bet');
        }
        if (inCall) {
        return { action: 'call', amount: callAmount };
        }
        return { action: 'fold', amount: 0 };
      }
      // 3-bettor facing a 4-bet
      if (aggressorPosition === positionName && originalRaiserPosition && originalRaiserPosition !== positionName) {
        const fourBetCallingKey = `${positionName}_3B_vs_${originalRaiserPosition}_4B`;
        const inCall = this.isHandInSpecificRange(handNotation, fourBetCallingKey, 'fourBetCallingRanges');
        console.log(`[PokerBot][DEBUG] 2 raises: 3bettor=${positionName}, origRaiser=${originalRaiserPosition}, 4betCallKey=${fourBetCallingKey}, inCall=${inCall}`);
        if (inCall) {
          return { action: 'call', amount: callAmount };
        }
        return { action: 'fold', amount: 0 };
      }
      // Bystander: fold
      console.log(`[PokerBot][DEBUG] 2 raises bystander fold`);
      return { action: 'fold', amount: 0 };
    }

    // 3 raises: Facing a 4-bet (5-bet, call, or fold)
    if (numPreflopRaises === 3) {
      // Original raiser facing a 4-bet
      if (originalRaiserPosition === positionName && aggressorPosition && aggressorPosition !== positionName) {
        const fiveBetKey = this.getRangeKey(positionName, aggressorPosition, 'fiveBetRanges');
        const fourBetCallingKey = this.getRangeKey(positionName, aggressorPosition, 'fourBetCallingRanges');
        const in5Bet = this.isHandInSpecificRange(handNotation, fiveBetKey, 'fiveBetRanges');
        const inCall = this.isHandInSpecificRange(handNotation, fourBetCallingKey, 'fourBetCallingRanges');
        console.log(`[PokerBot][DEBUG] 3 raises: origRaiser=${positionName}, 4bettor=${aggressorPosition}, 5betKey=${fiveBetKey}, in5Bet=${in5Bet}, 4betCallKey=${fourBetCallingKey}, inCall=${inCall}`);
        if (in5Bet) {
          return this.decideRaise(currentHighestBet, stackSize, '5bet');
        }
        if (inCall) {
          return { action: 'call', amount: callAmount };
        }
        return { action: 'fold', amount: 0 };
      }
      // 4-bettor facing a 5-bet
      if (aggressorPosition === positionName && originalRaiserPosition && originalRaiserPosition !== positionName) {
        const fiveBetCallingKey = `${positionName}_4B_vs_${originalRaiserPosition}_5B`;
        const inCall = this.isHandInSpecificRange(handNotation, fiveBetCallingKey, 'fiveBetCallingRanges');
        console.log(`[PokerBot][DEBUG] 3 raises: 4bettor=${positionName}, origRaiser=${originalRaiserPosition}, 5betCallKey=${fiveBetCallingKey}, inCall=${inCall}`);
        if (inCall) {
          return { action: 'call', amount: callAmount };
        }
        return { action: 'fold', amount: 0 };
      }
      // Bystander: fold
      console.log(`[PokerBot][DEBUG] 3 raises bystander fold`);
      return { action: 'fold', amount: 0 };
    }

    // 4 raises: Facing a 5-bet (call or fold)
    if (numPreflopRaises === 4) {
      // 5-bettor facing a 6-bet (should be very rare, only AA calls)
      if (handNotation === 'AA') {
        console.log(`[PokerBot][DEBUG] 4 raises: hand=AA, call`);
        return { action: 'call', amount: callAmount };
      }
      console.log(`[PokerBot][DEBUG] 4 raises: hand=${handNotation}, fold`);
      return { action: 'fold', amount: 0 };
    }

    // 5+ raises: Only AA calls, all else folds
    if (handNotation === 'AA') {
      console.log(`[PokerBot][DEBUG] 5+ raises: hand=AA, call`);
      return { action: 'call', amount: callAmount };
    }
    console.log(`[PokerBot][DEBUG] 5+ raises: hand=${handNotation}, fold`);
    return { action: 'fold', amount: 0 };
  }

  decideRaise(currentHighestBet, stackSize, raiseType) {
    let raiseAmount;
    
    switch (raiseType) {
      case 'open':
        raiseAmount = Math.min(currentHighestBet * 2.5, stackSize * 0.1);
        break;
      case '3bet':
        raiseAmount = Math.min(currentHighestBet * 3, stackSize * 0.15);
        break;
      case '4bet':
        raiseAmount = Math.min(currentHighestBet * 2.5, stackSize * 0.2);
        break;
      case '5bet':
        raiseAmount = Math.min(currentHighestBet * 2, stackSize * 0.25);
        break;
      default:
        raiseAmount = currentHighestBet * 2;
    }
    
    // Ensure minimum raise
    raiseAmount = Math.max(raiseAmount, currentHighestBet + 10);
    
    // Cap at stack size
    raiseAmount = Math.min(raiseAmount, stackSize);
    
    return { action: 'bet', amount: Math.round(raiseAmount) };
  }

  getPositionValue(position) {
    const positionValues = {
      'BTN': 1.0, 'CO': 0.8, 'MP': 0.6, 'LJ': 0.5, 'UTG+1': 0.4, 'UTG': 0.3,
      'SB': 0.7, 'BB': 0.9, 'BTN/SB': 1.0
    };
    return positionValues[position] || 0.5;
  }

  // Get hand notation (e.g., "AKs", "QQ", "72o")
  getHandNotation(holeCards) {
    if (!holeCards || holeCards.length !== 2) return '';

    function parseRank(card) {
      // Accepts '10C', '10d', 'tc', etc. and returns 'T', always uppercase
      let rank = card.toUpperCase();
      if (rank.startsWith('10')) return 'T';
      return rank[0];
    }
    const card1 = holeCards[0].toUpperCase();
    const card2 = holeCards[1].toUpperCase();
    const rank1 = parseRank(card1);
    const rank2 = parseRank(card2);
    const suit1 = card1[card1.length - 1];
    const suit2 = card2[card2.length - 1];

    const isSuited = suit1 === suit2;
    const isPair = rank1 === rank2;

    if (isPair) {
      return rank1 + rank1; // e.g., 'AA', 'KK'
    } else {
      // Always put higher rank first
      const highRank = this.rankValues[rank1] > this.rankValues[rank2] ? rank1 : rank2;
      const lowRank = this.rankValues[rank1] > this.rankValues[rank2] ? rank2 : rank1;
      const suffix = isSuited ? 's' : 'o';
      return highRank + lowRank + suffix; // e.g., 'AKs', '72o'
    }
  }

  // Check if hand is in the opening range for a position
  isHandInRange(handNotation, position) {
    const range = this.rfiRanges[position];
    console.log(`[PokerBot][RANGE CHECK] Position: ${position}, Hand: ${handNotation}, Range:`, range);
    if (!range) return false;
    // Strict, case-sensitive match
    return range.includes(handNotation);
  }

  // Convert action to game format
  formatAction(action) {
    return {
      type: action.action,
      amount: action.amount || 0
    };
  }

  // Check if the user (human player) is involved in the current action
  isUserInvolved(gameState, playerState) {
    if (!gameState.handHistory || gameState.handHistory.length === 0) {
      return false;
    }

    // Check if user has acted in this hand
    const userHasActed = gameState.handHistory.some(action => 
      action.playerId === 'user' || action.playerId === 'human' || action.playerId === 'player'
    );

    // Check if user is still in the hand (not folded)
    const userStillIn = gameState.players?.some(p => 
      (p.id === 'user' || p.id === 'human' || p.id === 'player') && !p.isFolded
    );

    return userHasActed || userStillIn;
  }

  // Handle actions when user is involved - make bots fold to help user
  handleUserInvolvedAction(gameState, playerState, currentHighestBet, currentBet, stackSize, holeCards, playerPosition, numPreflopRaises) {
    const callAmount = currentHighestBet - currentBet;
    const handNotation = this.getHandNotation(holeCards);
    const aggressorPosition = this.getAggressorPosition(gameState);
    const originalRaiserPosition = this.getOriginalRaiserPosition(gameState);

    console.log(`[PokerBot][USER INVOLVED] Bot helping user: hand=${handNotation}, raises=${numPreflopRaises}, aggressor=${aggressorPosition}, originalRaiser=${originalRaiserPosition}`);

    // If user raised first, make all bots fold
    if (numPreflopRaises === 1 && this.isUserOriginalRaiser(gameState)) {
      console.log(`[PokerBot][USER INVOLVED] User raised first, bot folding to help`);
      return { action: 'fold', amount: 0 };
    }

    // If user is facing a 3-bet, make all bots fold around to user
    if (numPreflopRaises === 2 && this.isUserFacingThreeBet(gameState)) {
      console.log(`[PokerBot][USER INVOLVED] User facing 3-bet, bot folding to help`);
      return { action: 'fold', amount: 0 };
    }

    // If user is the 3-bettor, make all bots fold around to user
    if (numPreflopRaises === 2 && this.isUserThreeBettor(gameState)) {
      console.log(`[PokerBot][USER INVOLVED] User is 3-bettor, bot folding to help`);
      return { action: 'fold', amount: 0 };
    }

    // If user is facing a 4-bet, make all bots fold around to user
    if (numPreflopRaises === 3 && this.isUserFacingFourBet(gameState)) {
      console.log(`[PokerBot][USER INVOLVED] User facing 4-bet, bot folding to help`);
        return { action: 'fold', amount: 0 };
    }

    // If user is the 4-bettor, make all bots fold around to user
    if (numPreflopRaises === 3 && this.isUserFourBettor(gameState)) {
      console.log(`[PokerBot][USER INVOLVED] User is 4-bettor, bot folding to help`);
        return { action: 'fold', amount: 0 };
    }

    // If user is involved in any other action, fold to help
    console.log(`[PokerBot][USER INVOLVED] User involved in action, bot folding to help`);
    return { action: 'fold', amount: 0 };
  }

  // Check if user is the original raiser
  isUserOriginalRaiser(gameState) {
    if (!gameState.handHistory) return false;
    
    for (const action of gameState.handHistory) {
      if (action.round === 'PREFLOP' && (action.type === 'raise' || action.type === 'bet')) {
        return action.playerId === 'user' || action.playerId === 'human' || action.playerId === 'player';
      }
    }
    return false;
  }

  // Check if user is facing a 3-bet
  isUserFacingThreeBet(gameState) {
    if (!gameState.handHistory) return false;
    
    let userRaised = false;
    let someoneElseRaised = false;
    
    for (const action of gameState.handHistory) {
      if (action.round === 'PREFLOP' && (action.type === 'raise' || action.type === 'bet')) {
        if (action.playerId === 'user' || action.playerId === 'human' || action.playerId === 'player') {
          userRaised = true;
      } else {
          someoneElseRaised = true;
        }
      }
    }
    
    return userRaised && someoneElseRaised;
  }

  // Check if user is the 3-bettor
  isUserThreeBettor(gameState) {
    if (!gameState.handHistory) return false;
    
    const raises = gameState.handHistory.filter(action => 
      action.round === 'PREFLOP' && (action.type === 'raise' || action.type === 'bet')
    );
    
    if (raises.length >= 2) {
      const lastRaiser = raises[raises.length - 1];
      return lastRaiser.playerId === 'user' || lastRaiser.playerId === 'human' || lastRaiser.playerId === 'player';
    }
    
    return false;
  }

  // Check if user is facing a 4-bet
  isUserFacingFourBet(gameState) {
    if (!gameState.handHistory) return false;
    
    const raises = gameState.handHistory.filter(action => 
      action.round === 'PREFLOP' && (action.type === 'raise' || action.type === 'bet')
    );
    
    if (raises.length >= 3) {
      const lastRaiser = raises[raises.length - 1];
      const secondLastRaiser = raises[raises.length - 2];
      
      // User was the 3-bettor and someone else 4-bet
      return (secondLastRaiser.playerId === 'user' || secondLastRaiser.playerId === 'human' || secondLastRaiser.playerId === 'player') &&
             (lastRaiser.playerId !== 'user' && lastRaiser.playerId !== 'human' && lastRaiser.playerId !== 'player');
    }
    
    return false;
  }

  // Check if user is the 4-bettor
  isUserFourBettor(gameState) {
    if (!gameState.handHistory) return false;
    
    const raises = gameState.handHistory.filter(action => 
      action.round === 'PREFLOP' && (action.type === 'raise' || action.type === 'bet')
    );
    
    if (raises.length >= 3) {
      const lastRaiser = raises[raises.length - 1];
      return lastRaiser.playerId === 'user' || lastRaiser.playerId === 'human' || lastRaiser.playerId === 'player';
    }
    
    return false;
  }
}

export default new PokerBot(); 