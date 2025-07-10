// Poker Bot for 6-max and 9-max games
// Implements GTO-inspired strategy with position awareness, hand ranges, and proper frequencies

// Utility to normalize position names to match handRanges keys
function normalizePositionName(pos) {
  let base = pos.split(' ')[0].split('(')[0].trim();
  if (base === 'UTG' || base === 'UTG+1' || base === 'UTG+2') return 'EP';
  if (base === 'LJ' || base === 'HJ') return 'MP';
  return base;
}

class PokerBot {
  constructor() {
    this.rankValues = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 
      'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };
    
    // Position-based opening ranges (GTO-inspired)
    this.openingRanges = {
      'BTN': 0.35,
      'CO': 0.25,
      'MP': 0.18,
      'EP': 0.10,
      'SB': 0.40,
      'BB': 0.70,
      'BTN/SB': 0.35
    };
    
    // Bet sizing patterns
    this.betSizing = {
      cbet: { small: 0.33, medium: 0.66, large: 1.0 },
      turn: { small: 0.5, medium: 0.75, large: 1.0 },
      river: { small: 0.5, medium: 0.75, large: 1.0 }
    };

    // Hand strength thresholds for different actions
    this.thresholds = {
      fold: 0.15,      // Lowered from 0.2
      call: 0.3,       // Lowered from 0.4
      raise: 0.6,      // Lowered from 0.7
      valueBet: 0.6,   // Lowered from 0.7 to be more aggressive with top pair
      bluff: 0.2       // Lowered from 0.3
    };

    // Bluffing frequencies (percentage of time to bluff when appropriate)
    this.bluffFrequencies = {
      preflop: 0.15,
      flop: 0.25,
      turn: 0.20,
      river: 0.15
    };

    // EXACT RFI Ranges from the charts (Slightly Looser)
    this.rfiRanges = {
      'EP': [
        '66', '77', '88', '99', 'TT', 'JJ', 'QQ', 'KK', 'AA',
        'A4s', 'A5s', 'ATs', 'AJs', 'AQs', 'AKs', 'KJs', 'KQs',
        'AJo', 'AQo', 'AKo', 'A9s', 'KTs', 'KQo', 'KJs', 'KQs', 'KQo'
      ],
      'MP': [
        '44', '55', '66', '77', '88', '99', 'TT', 'JJ', 'QQ', 'KK', 'AA',
        'A4s', 'A5s', 'A8s', 'A9s', 'ATs', 'AJs', 'AQs', 'AKs',
        'KTs', 'KJs', 'KQs', 'QJs', 'AJo', 'AQo', 'AKo', 'K9s', 'QTs', 'QJs', 'JTs', 'ATo'
      ],
      'CO': [
        '22', '33', '44', '55', '66', '77', '88', '99', 'TT', 'JJ', 'QQ', 'KK', 'AA',
        'A4s', 'A5s', 'A6s', 'A7s', 'A8s', 'A9s', 'ATs', 'AJs', 'AQs', 'AKs',
        'K8s', 'K9s', 'KTs', 'KJs', 'KQs', 'Q9s', 'QTs', 'QJs', 'JTs', 'T9s',
        'A8o', 'A9o', 'AJo', 'AQo', 'AKo', 'KJo', 'KQo'
      ],
      'BTN': [
        '22', '33', '44', '55', '66', '77', '88', '99', 'TT', 'JJ', 'QQ', 'KK', 'AA',
        'A2s', 'A3s', 'A4s', 'A5s', 'A6s', 'A7s', 'A8s', 'A9s', 'ATs', 'AJs', 'AQs', 'AKs',
        'K6s', 'K7s', 'K8s', 'K9s', 'KTs', 'KJs', 'KQs', 'Q7s', 'Q8s', 'Q9s', 'QTs', 'QJs',
        'J8s', 'J9s', 'JTs', 'T8s', 'T9s', '98s', 'A2o', 'A3o', 'A4o', 'A5o', 'A6o', 'A7o',
        'A8o', 'A9o', 'ATo', 'AJo', 'AQo', 'AKo', 'K8o', 'K9o', 'KJo', 'KQo', 'QTo'
      ],
      'SB': [
        '22', '33', '44', '55', '66', '77', '88', '99', 'TT', 'JJ', 'QQ', 'KK', 'AA',
        'A2s', 'A3s', 'A4s', 'A5s', 'A6s', 'A7s', 'A8s', 'A9s', 'ATs', 'AJs', 'AQs', 'AKs',
        'K2s', 'K3s', 'K4s', 'K5s', 'K6s', 'K7s', 'K8s', 'K9s', 'KTs', 'KJs', 'KQs',
        'Q4s', 'Q5s', 'Q6s', 'Q7s', 'Q8s', 'Q9s', 'QTs', 'QJs', 'J6s', 'J7s', 'J8s', 'J9s',
        'JTs', 'T6s', 'T7s', 'T8s', 'T9s', '96s', '97s', '98s', 'A2o', 'A3o', 'A4o', 'A5o',
        'A6o', 'A7o', 'A8o', 'A9o', 'ATo', 'AJo', 'AQo', 'AKo', 'K6o', 'K7o', 'KJo', 'KQo', 'Q8o', 'Q9o'
      ]
    };

    // EXACT 3-Bet Ranges vs RFI (All Positions)
    this.threeBetRanges = {
      // BTN 3B vs earlier RFI
      'BTN_vs_EP': ['QQ', 'KK', 'AA', 'AKs', 'AKo'],
      'BTN_vs_MP': ['JJ', 'QQ', 'KK', 'AA', 'AQs', 'AQo', 'AKs', 'AKo'],
      'BTN_vs_CO': ['TT', 'JJ', 'QQ', 'KK', 'AA', 'AJo', 'AQs', 'ATs', 'AKs', 'KQs', 'AKo'],
      'BTN_vs_BTN': ['88', '99', 'TT', 'JJ', 'QQ', 'KK', 'AA', 'ATo', 'AJo', 'AQs', 'KJo', 'KQs', 'AKs', 'AKo'],
      
      // SB 3B vs earlier RFI
      'SB_vs_EP': ['QQ', 'KK', 'AA', 'AKs', 'AKo'],
      'SB_vs_MP': ['JJ', 'QQ', 'KK', 'AA', 'AQs', 'AQo', 'AKs', 'AKo'],
      'SB_vs_CO': ['TT', 'JJ', 'QQ', 'KK', 'AA', 'AJo', 'AQs', 'AKs', 'AKo'],
      'SB_vs_BTN': ['88', '99', 'TT', 'JJ', 'QQ', 'KK', 'AA', 'ATo', 'AJo', 'AQs', 'KJo', 'KQs', 'AKs', 'AKo'],
      
      // BB 3B vs earlier RFI
      'BB_vs_EP': ['KK', 'AA', 'AKs', 'AKo'],
      'BB_vs_MP': ['QQ', 'KK', 'AA', 'AKs', 'AKo'],
      'BB_vs_CO': ['99', 'TT', 'JJ', 'QQ', 'KK', 'AA', 'AJo', 'AQs', 'AKs', 'AKo'],
      'BB_vs_BTN': ['88', '99', 'TT', 'JJ', 'QQ', 'KK', 'AA', 'ATo', 'AJo', 'AQs', 'AKs', 'AKo'],
      'BB_vs_SB': ['99', 'TT', 'JJ', 'QQ', 'KK', 'AA', 'AQs', 'AQo', 'AKs', 'AKo'],
      
      // EP 3B vs earlier RFI (missing from original)
      'EP_vs_MP': ['QQ', 'KK', 'AA', 'AKs', 'AKo'],
      'EP_vs_CO': ['JJ', 'QQ', 'KK', 'AA', 'AQs', 'AKs', 'AKo'],
      'EP_vs_BTN': ['TT', 'JJ', 'AQs'],
      'EP_vs_SB': ['JJ', 'AQs'],
      
      // MP 3B vs earlier RFI (missing from original)
      'MP_vs_EP': ['QQ', 'KK', 'AA', 'AKs', 'AKo'],
      'MP_vs_CO': ['JJ', 'QQ', 'KK', 'AA', 'AQs', 'AKs', 'AKo'],
      'MP_vs_BTN': ['TT', 'JJ', 'AQs'],
      'MP_vs_SB': ['TT', 'JJ', 'AJs', 'AQs', 'AKs'],
      'MP_vs_BB': ['TT', 'JJ', 'QQ', 'KK', 'AA', 'AJs', 'AQs', 'AKs', 'AKo']
    };

    // POSITIONAL 3-Bet Calling Ranges After RFI (tightest EP, loosest BTN/BB)
    // Hands in the 4-bet range are NOT in the 3-bet call range
    this.threeBetCallingRanges = {
      'EP_vs_MP_3B': ['JJ','AQs'],
      'EP_vs_CO_3B': ['TT','JJ','AQs'],
      'EP_vs_BTN_3B': ['TT','JJ','AQs'],
      'EP_vs_SB_3B': ['TT','JJ','AQs'],
      'EP_vs_BB_3B': ['TT','JJ','AQs'],

      'MP_vs_EP_3B': ['TT','JJ','AJs','AQs'],
      'MP_vs_CO_3B': ['TT','JJ','AJs','AQs'],
      'MP_vs_BTN_3B': ['TT','JJ','AJs','AQs','KQs'],
      'MP_vs_SB_3B': ['TT','JJ','AJs','AQs','KQs'],
      'MP_vs_BB_3B': ['TT','JJ','AJs','AQs','KQs'],

      'CO_vs_EP_3B': ['TT','JJ','AJs','AQs','KQs'],
      'CO_vs_MP_3B': ['TT','JJ','AJs','AQs','KQs','QJs'],
      'CO_vs_BTN_3B': ['99','TT','JJ','ATs','AJs','AQs','KQs','QJs'],
      'CO_vs_SB_3B': ['99','TT','JJ','ATs','AJs','AQs','KQs','QJs'],
      'CO_vs_BB_3B': ['99','TT','JJ','ATs','AJs','AQs','KQs','QJs'],

      'BTN_vs_EP_3B': ['99','TT','JJ','ATs','AJs','AQs','KQs','QJs','JTs'],
      'BTN_vs_MP_3B': ['99','TT','JJ','ATs','AJs','AQs','KQs','QJs','JTs'],
      'BTN_vs_CO_3B': ['88','99','TT','JJ','ATs','AJs','AQs','KJs','KQs','QJs','JTs','T9s'],
      'BTN_vs_SB_3B': ['88','99','TT','JJ','ATs','AJs','AQs','KJs','KQs','QJs','JTs','T9s'],
      'BTN_vs_BB_3B': ['88','99','TT','JJ','ATs','AJs','AQs','KJs','KQs','QJs','JTs','T9s'],

      'SB_vs_EP_3B': ['99','TT','JJ','ATs','AJs','AQs','KQs','QJs','JTs'],
      'SB_vs_MP_3B': ['99','TT','JJ','ATs','AJs','AQs','KQs','QJs','JTs'],
      'SB_vs_CO_3B': ['88','99','TT','JJ','ATs','AJs','AQs','KJs','KQs','QJs','JTs','T9s'],
      'SB_vs_BTN_3B': ['88','99','TT','JJ','ATs','AJs','AQs','KJs','KQs','QJs','JTs','T9s'],
      'SB_vs_BB_3B': ['88','99','TT','JJ','ATs','AJs','AQs','KJs','KQs','QJs','JTs','T9s'],

      'BB_vs_EP_3B': ['99','TT','JJ','ATs','AJs','AQs','KQs','QJs','JTs'],
      'BB_vs_MP_3B': ['99','TT','JJ','ATs','AJs','AQs','KQs','QJs','JTs'],
      'BB_vs_CO_3B': ['88','99','TT','JJ','ATs','AJs','AQs','KJs','KQs','QJs','JTs','T9s'],
      'BB_vs_BTN_3B': ['88','99','TT','JJ','ATs','AJs','AQs','KJs','KQs','QJs','JTs','T9s'],
      'BB_vs_SB_3B': ['88','99','TT','JJ','ATs','AJs','AQs','KJs','KQs','QJs','JTs','T9s']
    };

    // POSITIONAL 4-Bet Calling Ranges (tighter than 3-bet calling, but BTN/SB/BB can be a bit wider)
    // Hands in the 5-bet range are NOT in the 4-bet call range
    this.fourBetCallingRanges = {
      'MP_3B_vs_EP_4B': ['JJ','TT','AJs','KQs'],
      'BTN_3B_vs_CO_4B': ['JJ','TT','99','ATs','KJs'],
      'SB_3B_vs_BTN_4B': ['JJ','TT','99','ATs','KJs','QJs'],
      'BB_3B_vs_SB_4B': ['JJ','TT','99','ATs','KJs','QJs','JTs']
    };

    // EXACT 5-Bet Ranges
    this.fiveBetRanges = ['QQ', 'KK', 'AA', 'AKs'];
    this.fiveBetCallingRanges = ['KK', 'AA', 'AKo'];

    // EXACT Flatting Ranges Facing RFI
    this.flattingRanges = {
      // CO Facing RFI
      'CO_vs_EP_RFI': ['99', 'TT', 'JJ', 'AQs', 'KQs'],
      'CO_vs_MP_RFI': ['88', '99', 'TT', 'JJ', 'AJs', 'AQs', 'AKs', 'KQs'],
      'CO_vs_BTN_RFI': ['77', '88', '99', 'TT', 'JJ', 'QQ', 'KK', 'AA', 'AJs', 'AQs', 'AKs', 'KTs', 'KJs', 'KQs'],
      'CO_vs_SB_RFI': ['66', '77', '88', '99', 'TT', 'JJ', 'QQ', 'KK', 'AA', 'ATs', 'AJs', 'AQs', 'AKs', 'QJs'],
      
      // BTN Facing RFI
      'BTN_vs_EP_RFI': ['TT', 'JJ', 'AQs'],
      'BTN_vs_MP_RFI': ['99', 'TT', 'JJ', 'AJs', 'AQs', 'AKs'],
      'BTN_vs_CO_RFI': ['88', '99', 'TT', 'JJ', 'ATs', 'AJs', 'AQs', 'AKs', 'KJs', 'KQs'],
      'BTN_vs_SB_RFI': ['77', '88', '99', 'TT', 'JJ', 'A9s', 'ATs', 'AJs', 'AQs', 'AKs', 'KTs', 'KJs', 'KQs'],
      'BTN_vs_BB_RFI': ['66', '77', '88', '99', 'TT', 'JJ', 'A9s', 'ATs', 'AJs', 'AQs', 'AKs', 'QTs', 'QJs', 'T9s'],
      
      // SB Facing RFI
      'SB_vs_EP_RFI': ['JJ', 'AQs'],
      'SB_vs_MP_RFI': ['TT', 'JJ', 'AJs', 'AQs', 'AKs'],
      'SB_vs_BTN_RFI': ['88', '99', 'TT', 'JJ', 'QQ', 'KK', 'AA', 'A9s', 'ATs', 'AJs', 'AQs', 'AKs', 'KJs', 'KQs'],
      'SB_vs_CO_RFI': ['77', '88', '99', 'TT', 'JJ', 'A8s', 'A9s', 'ATs', 'AJs', 'AQs', 'AKs', 'QTs', 'QJs'],
      'SB_vs_BB_RFI': ['66', '77', '88', '99', 'TT', 'JJ', 'A2s', 'A3s', 'A4s', 'A5s', 'A6s', 'A7s', 'A8s', 'A9s', 'ATs', 'AJs', 'AQs', 'AKs', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'T9s'],
      
      // EP Facing RFI (missing from original)
      'EP_vs_MP_RFI': ['TT', 'JJ', 'AQs'],
      'EP_vs_BTN_RFI': ['99', 'TT', 'JJ', 'AJs', 'AQs', 'AKs'],
      'EP_vs_CO_RFI': ['88', '99', 'TT', 'JJ', 'ATs', 'AJs', 'AQs', 'AKs', 'KQs']
    };

    // Legacy ranges for backward compatibility
    this.handRanges = this.rfiRanges;
    this.threeBetRange = ['AA','KK','QQ','JJ','AKs','AKo','AQs'];
    this.threeBetBluffRange = ['A5s','KJs','QJs','JTs','T9s'];
    this.fourBetRange = ['AA','KK','AKs'];
    
    // Validate all ranges are properly defined
    this.validateRanges();
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
    
    // BB defends wide against all positions - pairs, suited connectors, broadways, suited aces
    const bbDefendRange = [
      // Pairs
      '22', '33', '44', '55', '66', '77', '88', '99', 'TT', 'JJ', 'QQ', 'KK', 'AA',
      // Suited aces
      'A2s', 'A3s', 'A4s', 'A5s', 'A6s', 'A7s', 'A8s', 'A9s', 'ATs', 'AJs', 'AQs', 'AKs',
      // Suited broadways
      'K2s', 'K3s', 'K4s', 'K5s', 'K6s', 'K7s', 'K8s', 'K9s', 'KTs', 'KJs', 'KQs',
      'Q2s', 'Q3s', 'Q4s', 'Q5s', 'Q6s', 'Q7s', 'Q8s', 'Q9s', 'QTs', 'QJs',
      'J2s', 'J3s', 'J4s', 'J5s', 'J6s', 'J7s', 'J8s', 'J9s', 'JTs',
      'T2s', 'T3s', 'T4s', 'T5s', 'T6s', 'T7s', 'T8s', 'T9s',
      '92s', '93s', '94s', '95s', '96s', '97s', '98s',
      '82s', '83s', '84s', '85s', '86s', '87s',
      '72s', '73s', '74s', '75s', '76s',
      '62s', '63s', '64s', '65s',
      '52s', '53s', '54s',
      '42s', '43s',
      '32s',
      // Offsuit broadways
      'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'A2o',
      'KQo', 'KJo', 'KTo', 'K9o', 'K8o', 'K7o', 'K6o', 'K5o', 'K4o', 'K3o', 'K2o',
      'QJo', 'QTo', 'Q9o', 'Q8o', 'Q7o', 'Q6o', 'Q5o', 'Q4o', 'Q3o', 'Q2o',
      'JTo', 'J9o', 'J8o', 'J7o', 'J6o', 'J5o', 'J4o', 'J3o', 'J2o',
      'T9o', 'T8o', 'T7o', 'T6o', 'T5o', 'T4o', 'T3o', 'T2o',
      '98o', '97o', '96o', '95o', '94o', '93o', '92o',
      '87o', '86o', '85o', '84o', '83o', '82o',
      '76o', '75o', '74o', '73o', '72o',
      '65o', '64o', '63o', '62o',
      '54o', '53o', '52o',
      '43o', '42o',
      '32o'
    ];
    
    return bbDefendRange.includes(handNotation);
  }

  // Helper to check if hand is in a specific range
  isHandInSpecificRange(handNotation, rangeKey, rangeType) {
    const range = this[rangeType][rangeKey];
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
    } else if (rangeType === 'flattingRanges') {
      return `${ourPosition}_vs_${aggressorPosition}_RFI`;
    }
    return null;
  }

  // Safety check to prevent infinite loops
  shouldPreventInfiniteLoop(numPreflopRaises, stackSize, currentHighestBet) {
    // If we've had more than 4 raises, something is wrong
    if (numPreflopRaises > 4) {
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

  // Validation method to check that all ranges are properly defined
  validateRanges() {
    const errors = [];
    
    // Check RFI ranges
    const expectedPositions = ['EP', 'MP', 'CO', 'BTN', 'SB'];
    for (const pos of expectedPositions) {
      if (!this.rfiRanges[pos]) {
        errors.push(`Missing RFI range for position: ${pos}`);
      }
    }
    
    // Check 3-bet ranges for common scenarios
    const commonThreeBetScenarios = [
      'BTN_vs_EP', 'BTN_vs_MP', 'BTN_vs_CO', 'BTN_vs_BTN', 'BTN_vs_SB',
      'SB_vs_EP', 'SB_vs_MP', 'SB_vs_CO', 'SB_vs_BTN', 'SB_vs_BB',
      'BB_vs_EP', 'BB_vs_MP', 'BB_vs_CO', 'BB_vs_BTN', 'BB_vs_SB',
      'EP_vs_MP', 'EP_vs_CO', 'EP_vs_BTN', 'EP_vs_SB',
      'MP_vs_EP', 'MP_vs_CO', 'MP_vs_BTN', 'MP_vs_SB', 'MP_vs_BB',
      'CO_vs_EP', 'CO_vs_MP', 'CO_vs_BTN', 'CO_vs_SB', 'CO_vs_BB',
      'BTN_vs_EP', 'BTN_vs_MP', 'BTN_vs_CO', 'BTN_vs_SB', 'BTN_vs_BB'
    ];
    
    for (const scenario of commonThreeBetScenarios) {
      if (!this.threeBetRanges[scenario]) {
        errors.push(`Missing 3-bet range for scenario: ${scenario}`);
      }
    }
    
    if (errors.length > 0) {
      console.error('[PokerBot][VALIDATION] Range validation errors:', errors);
      return false;
    }
    
    console.log('[PokerBot][VALIDATION] All ranges validated successfully');
    return true;
  }

  // Debug method to log range information
  debugRangeInfo(handNotation, positionName, aggressorPosition, originalRaiserPosition, numPreflopRaises) {
    console.log(`[PokerBot][DEBUG] Range Analysis:`);
    console.log(`  Hand: ${handNotation}`);
    console.log(`  Position: ${positionName}`);
    console.log(`  Aggressor: ${aggressorPosition}`);
    console.log(`  Original Raiser: ${originalRaiserPosition}`);
    console.log(`  Preflop Raises: ${numPreflopRaises}`);
    
    // Check RFI range
    const isInRfi = this.isHandInSpecificRange(handNotation, positionName, 'rfiRanges');
    console.log(`  In RFI Range: ${isInRfi}`);
    
    // Check 3-bet range if applicable
    if (aggressorPosition && aggressorPosition !== positionName) {
      const threeBetKey = this.getRangeKey(positionName, aggressorPosition, 'threeBetRanges');
      const isInThreeBet = this.isHandInSpecificRange(handNotation, threeBetKey, 'threeBetRanges');
      console.log(`  3-Bet Key: ${threeBetKey}, In 3-Bet Range: ${isInThreeBet}`);
    }
    
    // Check flatting range if applicable
    if (originalRaiserPosition && originalRaiserPosition !== positionName) {
      const flattingKey = this.getRangeKey(positionName, originalRaiserPosition, 'flattingRanges');
      const isInFlatting = this.isHandInSpecificRange(handNotation, flattingKey, 'flattingRanges');
      console.log(`  Flatting Key: ${flattingKey}, In Flatting Range: ${isInFlatting}`);
    }
  }

  // Main decision function
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
      isPostflop,
      stackSize,
      currentBet
    } = this.parseGameState(gameState, playerState);

    const numPreflopRaises = this.countPreflopRaises(gameState);

    // Calculate hand strength
    const handStrength = this.evaluateHandStrength(communityCards, holeCards);
    const position = this.getPositionValue(playerPosition);
    const potOdds = this.calculatePotOdds(currentHighestBet - currentBet, currentPotValue);
    const stackToPotRatio = stackSize / currentPotValue;
    
    // Determine action based on street
    if (isPreflop) {
      return this.preflopDecision(gameState, playerState, handStrength, position, currentHighestBet, currentBet, stackSize, numPlayers, activePlayers, holeCards, playerPosition, numPreflopRaises);
    } else {
      return this.postflopDecision(handStrength, currentBettingRound, currentHighestBet, currentBet, currentPotValue, stackSize, activePlayers, communityCards, gameState, playerState);
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
      isPostflop: gameState.currentBettingRound !== 'PREFLOP',
      stackSize: playerState.stack || 1000,
      currentBet: playerState.currentBet || 0
    };
  }

  preflopDecision(gameState, playerState, handStrength, position, currentHighestBet, currentBet, stackSize, numPlayers, activePlayers, holeCards, playerPosition, numPreflopRaises) {
    const callAmount = currentHighestBet - currentBet;
    const positionName = normalizePositionName(playerPosition);
    const handNotation = this.getHandNotation(holeCards);
    const aggressorPosition = this.getAggressorPosition(gameState);
    const originalRaiserPosition = this.getOriginalRaiserPosition(gameState);

    // Debug: Print all relevant info
    console.log(`[PokerBot][DEBUG] PreflopDecision: hand=${handNotation}, pos=${positionName}, raises=${numPreflopRaises}, aggressor=${aggressorPosition}, originalRaiser=${originalRaiserPosition}`);
    console.log(`[PokerBot][DEBUG] Hand history:`, gameState.handHistory);

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
      const in5Bet = this.fiveBetRanges.includes(handNotation);
      const inCall = this.fiveBetCallingRanges.includes(handNotation);
      console.log(`[PokerBot][DEBUG] 3 raises: hand=${handNotation}, in5Bet=${in5Bet}, inCall=${inCall}`);
      if (in5Bet) {
        return this.decideRaise(currentHighestBet, stackSize, '5bet');
      }
      if (inCall) {
        return { action: 'call', amount: callAmount };
      }
      return { action: 'fold', amount: 0 };
    }

    // 4+ raises: Only AA calls, all else folds
      if (handNotation === 'AA') {
      console.log(`[PokerBot][DEBUG] 4+ raises: hand=AA, call`);
        return { action: 'call', amount: callAmount };
    }
    console.log(`[PokerBot][DEBUG] 4+ raises: hand=${handNotation}, fold`);
    return { action: 'fold', amount: 0 };
  }

  // Handle RFI (Raise First In) scenarios
  handleRFI(handNotation, positionName, currentHighestBet, stackSize) {
    const isInRfiRange = this.isHandInSpecificRange(handNotation, positionName, 'rfiRanges');
    if (isInRfiRange) {
      console.log(`[PokerBot][PREFLOP] RFI with ${handNotation} from ${positionName}`);
      return this.decideRaise(currentHighestBet, stackSize, 'open');
      } else {
      console.log(`[PokerBot][PREFLOP] Fold ${handNotation} from ${positionName} - not in RFI range`);
        return { action: 'fold', amount: 0 };
      }
    }

  // Handle facing a single raise (3-bet, call, or fold)
  handleFacingSingleRaise(handNotation, positionName, aggressorPosition, originalRaiserPosition, callAmount, currentHighestBet, stackSize) {
    // Special case: BB defense
    if (positionName === 'BB' && aggressorPosition && aggressorPosition !== 'BB') {
      return this.handleBBDefense(handNotation, aggressorPosition, callAmount, currentHighestBet, stackSize);
    }
    
    // Regular position logic (non-BB positions)
    if (positionName !== 'BB' && aggressorPosition && aggressorPosition !== positionName) {
      return this.handleNonBBFacingRaise(handNotation, positionName, aggressorPosition, originalRaiserPosition, callAmount, currentHighestBet, stackSize);
    }
    
    // Fallback: fold if we can't determine the scenario
    console.log(`[PokerBot][PREFLOP] Fold ${handNotation} from ${positionName} - unclear scenario`);
    return { action: 'fold', amount: 0 };
  }

  // Handle BB defense against a raise
  handleBBDefense(handNotation, aggressorPosition, callAmount, currentHighestBet, stackSize) {
    // Check if we should 3-bet as BB
    const threeBetKey = this.getRangeKey('BB', aggressorPosition, 'threeBetRanges');
    const shouldThreeBet = this.isHandInSpecificRange(handNotation, threeBetKey, 'threeBetRanges');
    
    if (shouldThreeBet) {
      console.log(`[PokerBot][PREFLOP] BB 3-bet with ${handNotation} vs ${aggressorPosition}`);
      return this.decideRaise(currentHighestBet, stackSize, '3bet');
    }
    
    // BB defends wide against all positions
    if (this.shouldBBDefend(handNotation, aggressorPosition)) {
      console.log(`[PokerBot][PREFLOP] BB defend with ${handNotation} vs ${aggressorPosition}`);
      return { action: 'call', amount: callAmount };
    }
    
    console.log(`[PokerBot][PREFLOP] BB fold ${handNotation} vs ${aggressorPosition}`);
    return { action: 'fold', amount: 0 };
  }

  // Handle non-BB positions facing a raise
  handleNonBBFacingRaise(handNotation, positionName, aggressorPosition, originalRaiserPosition, callAmount, currentHighestBet, stackSize) {
    // Check if we should 3-bet
    const threeBetKey = this.getRangeKey(positionName, aggressorPosition, 'threeBetRanges');
    const shouldThreeBet = this.isHandInSpecificRange(handNotation, threeBetKey, 'threeBetRanges');
    
    if (shouldThreeBet) {
      console.log(`[PokerBot][PREFLOP] 3-bet with ${handNotation} from ${positionName} vs ${aggressorPosition}`);
      return this.decideRaise(currentHighestBet, stackSize, '3bet');
    }
    
    // Check if we should call (flatting ranges)
    if (originalRaiserPosition && originalRaiserPosition !== positionName) {
      const flattingKey = this.getRangeKey(positionName, originalRaiserPosition, 'flattingRanges');
      const shouldCall = this.isHandInSpecificRange(handNotation, flattingKey, 'flattingRanges');
      
      if (shouldCall) {
        console.log(`[PokerBot][PREFLOP] Call with ${handNotation} from ${positionName} vs ${originalRaiserPosition}`);
        return { action: 'call', amount: callAmount };
      }
    }
    
    // Default fold if not in any range
    console.log(`[PokerBot][PREFLOP] Fold ${handNotation} from ${positionName} - not in any range`);
    return { action: 'fold', amount: 0 };
  }

  // Handle facing a 3-bet (4-bet or call)
  handleFacingThreeBet(handNotation, positionName, aggressorPosition, originalRaiserPosition, callAmount, currentHighestBet, stackSize) {
    // We are the original raiser, facing a 3-bet
    if (originalRaiserPosition === positionName && aggressorPosition && aggressorPosition !== positionName) {
      return this.handleOriginalRaiserFacingThreeBet(handNotation, positionName, aggressorPosition, callAmount, currentHighestBet, stackSize);
    }
    
    // We are the 3-bettor, facing a 4-bet
    if (aggressorPosition === positionName && originalRaiserPosition && originalRaiserPosition !== positionName) {
      return this.handleThreeBettorFacingFourBet(handNotation, positionName, originalRaiserPosition, callAmount, currentHighestBet, stackSize);
    }
    
    // We are a bystander facing a 3-bet (should rarely happen, but handle it)
    if (positionName !== originalRaiserPosition && positionName !== aggressorPosition) {
      console.log(`[PokerBot][PREFLOP] Bystander fold ${handNotation} from ${positionName} facing 3-bet`);
      return { action: 'fold', amount: 0 };
    }
    
    // Fallback: fold
    console.log(`[PokerBot][PREFLOP] Fold ${handNotation} from ${positionName} - unclear 3-bet scenario`);
    return { action: 'fold', amount: 0 };
  }

  // Handle original raiser facing a 3-bet
  handleOriginalRaiserFacingThreeBet(handNotation, positionName, aggressorPosition, callAmount, currentHighestBet, stackSize) {
    // Check if we should 4-bet
    const fourBetKey = this.getRangeKey(positionName, aggressorPosition, 'fourBetRanges');
    const shouldFourBet = this.isHandInSpecificRange(handNotation, fourBetKey, 'fourBetRanges');
    
    if (shouldFourBet) {
      console.log(`[PokerBot][PREFLOP] 4-bet with ${handNotation} from ${positionName} vs ${aggressorPosition}`);
      return this.decideRaise(currentHighestBet, stackSize, '4bet');
    }
    
    // Check if we should call the 3-bet
    const threeBetCallingKey = this.getRangeKey(positionName, aggressorPosition, 'threeBetCallingRanges');
    const shouldCall = this.isHandInSpecificRange(handNotation, threeBetCallingKey, 'threeBetCallingRanges');
    
    if (shouldCall) {
      console.log(`[PokerBot][PREFLOP] Call 3-bet with ${handNotation} from ${positionName} vs ${aggressorPosition}`);
      return { action: 'call', amount: callAmount };
    }
    
    // Default fold
    console.log(`[PokerBot][PREFLOP] Fold ${handNotation} from ${positionName} - not in 4-bet or calling range`);
    return { action: 'fold', amount: 0 };
  }

  // Handle 3-bettor facing a 4-bet
  handleThreeBettorFacingFourBet(handNotation, positionName, originalRaiserPosition, callAmount, currentHighestBet, stackSize) {
    const fourBetCallingKey = `${positionName}_3B_vs_${originalRaiserPosition}_4B`;
    const shouldCall = this.isHandInSpecificRange(handNotation, fourBetCallingKey, 'fourBetCallingRanges');
    
    if (shouldCall) {
      console.log(`[PokerBot][PREFLOP] Call 4-bet with ${handNotation} from ${positionName} vs ${originalRaiserPosition}`);
      return { action: 'call', amount: callAmount };
    }
    
    // Default fold
    console.log(`[PokerBot][PREFLOP] Fold ${handNotation} from ${positionName} - not in 4-bet calling range`);
    return { action: 'fold', amount: 0 };
  }

  // Handle facing a 4-bet (5-bet or call)
  handleFacingFourBet(handNotation, callAmount, currentHighestBet, stackSize) {
    const shouldFiveBet = this.fiveBetRanges.includes(handNotation);
    if (shouldFiveBet) {
      console.log(`[PokerBot][PREFLOP] 5-bet with ${handNotation}`);
      return this.decideRaise(currentHighestBet, stackSize, '5bet');
    }
    
    const shouldCall = this.fiveBetCallingRanges.includes(handNotation);
    if (shouldCall) {
      console.log(`[PokerBot][PREFLOP] Call 5-bet with ${handNotation}`);
      return { action: 'call', amount: callAmount };
    }
    
    console.log(`[PokerBot][PREFLOP] Fold ${handNotation} - not in 5-bet range`);
    return { action: 'fold', amount: 0 };
  }

  // Handle multiple raises (more than 3)
  handleMultipleRaises(handNotation, callAmount) {
    if (handNotation === 'AA') {
      console.log(`[PokerBot][PREFLOP] Call with AA in multi-way action`);
      return { action: 'call', amount: callAmount };
    } else {
      console.log(`[PokerBot][PREFLOP] Fold ${handNotation} - too many raises`);
      return { action: 'fold', amount: 0 };
    }
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
      case 'value':
        raiseAmount = Math.min(currentHighestBet * 2, stackSize * 0.2);
        break;
      case 'bluff':
        raiseAmount = Math.min(currentHighestBet * 1.5, stackSize * 0.1);
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

  evaluateHandStrength(communityCards, holeCards) {
    if (!holeCards || holeCards.length !== 2) return 0;
    
    const allCards = [...communityCards, ...holeCards];
    if (allCards.length < 2) return 0;
    
    // Convert cards to numeric format
    const formattedCards = allCards.map(card => {
      const rank = card[0];
      const suit = card[1];
      return { rank: this.rankValues[rank], suit };
    });
    
    const holeCardRanks = holeCards.map(card => this.rankValues[card[0]]);
    const holeCardSuits = holeCards.map(card => card[1]);
    
    // Calculate made hand strength
    const madeHandStrength = this.calculateMadeHandStrength(formattedCards);
    
    // Calculate hole card strength
    const holeCardStrength = this.calculateHoleCardStrength(holeCardRanks, holeCardSuits);
    
    // Calculate potential (drawing strength)
    const potential = this.calculatePotential(formattedCards, communityCards.length);
    
    // Calculate board interaction strength
    const boardInteraction = this.calculateBoardInteraction(formattedCards, holeCardRanks, holeCardSuits);
    
    // Weight the components based on street
    let finalStrength;
    if (communityCards.length === 0) {
      // Preflop - focus on hole cards
      finalStrength = holeCardStrength * 0.8 + potential * 0.2;
    } else if (communityCards.length === 3) {
      // Flop - balance made hands and draws
      finalStrength = madeHandStrength * 0.6 + holeCardStrength * 0.2 + potential * 0.15 + boardInteraction * 0.05;
    } else if (communityCards.length === 4) {
      // Turn - made hands more important
      finalStrength = madeHandStrength * 0.7 + holeCardStrength * 0.15 + potential * 0.1 + boardInteraction * 0.05;
    } else {
      // River - made hands dominate
      finalStrength = madeHandStrength * 0.8 + holeCardStrength * 0.1 + potential * 0.05 + boardInteraction * 0.05;
    }
    
    return finalStrength;
  }

  calculateBoardInteraction(allCards, holeCardRanks, holeCardSuits) {
    if (allCards.length < 5) return 0; // Need at least flop + hole cards
    
    const communityCards = allCards.slice(0, -2);
    const communityRanks = communityCards.map(c => c.rank);
    const communitySuits = communityCards.map(c => c.suit);
    
    let interaction = 0;
    
    // Check if hole cards connect with the board
    const highHoleCard = Math.max(...holeCardRanks);
    const lowHoleCard = Math.min(...holeCardRanks);
    const isSuited = holeCardSuits[0] === holeCardSuits[1];
    
    // Overcard potential
    const maxBoardRank = Math.max(...communityRanks);
    if (highHoleCard > maxBoardRank) {
      interaction += 0.3;
    }
    
    // Connected to board
    const allRanks = [...communityRanks, ...holeCardRanks];
    const uniqueRanks = [...new Set(allRanks)].sort((a, b) => a - b);
    for (let i = 0; i < uniqueRanks.length - 2; i++) {
      if (uniqueRanks[i + 2] - uniqueRanks[i] <= 4) {
        interaction += 0.2;
        break;
      }
    }
    
    // Suited with board
    if (isSuited) {
      const suitCounts = {};
      allCards.forEach(card => suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1);
      const maxSuitCount = Math.max(...Object.values(suitCounts));
      if (maxSuitCount >= 4) {
        interaction += 0.4;
      } else if (maxSuitCount === 3) {
        interaction += 0.2;
      }
    }
    
    // Pair with board
    const rankCounts = {};
    allRanks.forEach(rank => rankCounts[rank] = (rankCounts[rank] || 0) + 1);
    const pairs = Object.values(rankCounts).filter(count => count >= 2);
    if (pairs.length > 0) {
      interaction += 0.3;
    }
    
    return interaction;
  }

  calculateMadeHandStrength(cards) {
    const ranks = cards.map(c => c.rank).sort((a, b) => a - b);
    const suits = cards.map(c => c.suit);
    
    // Check for made hands with kicker consideration
    if (this.isStraightFlush(ranks, suits)) {
      return 9 + this.getKickerValue(ranks) * 0.01;
    }
    if (this.isFourOfAKind(ranks)) {
      return 8 + this.getKickerValue(ranks) * 0.01;
    }
    if (this.isFullHouse(ranks)) {
      return 7 + this.getFullHouseValue(ranks) * 0.01;
    }
    if (this.isFlush(suits)) {
      return 6 + this.getKickerValue(ranks) * 0.01;
    }
    if (this.isStraight(ranks)) {
      return 5 + this.getStraightValue(ranks) * 0.01;
    }
    if (this.isThreeOfAKind(ranks)) {
      return 4 + this.getKickerValue(ranks) * 0.01;
    }
    if (this.isTwoPair(ranks)) {
      return 3 + this.getTwoPairValue(ranks) * 0.01;
    }
    if (this.isOnePair(ranks)) {
      return this.getOnePairValue(ranks, cards) * 0.01;
    }
    
    return 1 + this.getKickerValue(ranks) * 0.01; // High card
  }

  // Enhanced one pair evaluation that distinguishes top/middle/bottom pair
  getOnePairValue(ranks, allCards) {
    const counts = {};
    ranks.forEach(rank => counts[rank] = (counts[rank] || 0) + 1);
    
    // Find the pair rank
    let pairRank = 0;
    for (const [rank, count] of Object.entries(counts)) {
      if (count >= 2) {
        pairRank = parseInt(rank);
        break;
      }
    }
    
    // Get kickers (ranks not in the pair)
    const kickers = ranks.filter(rank => rank !== pairRank).sort((a, b) => b - a);
    
    // Determine if this is a pocket pair or board pair
    const holeCardRanks = allCards.slice(-2).map(c => c.rank);
    const communityRanks = allCards.slice(0, -2).map(c => c.rank);
    
    const isPocketPair = holeCardRanks[0] === holeCardRanks[1];
    const isBoardPair = communityRanks.includes(pairRank);
    const isHoleCardPair = holeCardRanks.includes(pairRank);
    
    let baseValue = 2.0; // Base value for one pair
    
    if (isPocketPair) {
      // Pocket pairs are strong - overpair to most boards
      baseValue = 2.5 + (pairRank / 14) * 0.5; // 2.5 to 3.0 range
    } else if (isHoleCardPair && isBoardPair) {
      // Top pair with hole card
      baseValue = this.getTopPairValue(pairRank, communityRanks, kickers);
    } else if (isBoardPair) {
      // Board pair with hole card kicker
      baseValue = this.getBoardPairValue(pairRank, communityRanks, kickers);
    } else {
      // This shouldn't happen with one pair, but handle it
      baseValue = 2.0 + (pairRank / 14) * 0.3;
    }
    
    // Add kicker value
    const kickerValue = this.calculateKickerValue(kickers);
    
    return baseValue + kickerValue;
  }

  // Evaluate top pair strength
  getTopPairValue(pairRank, communityRanks, kickers) {
    const maxBoardRank = Math.max(...communityRanks);
    const minBoardRank = Math.min(...communityRanks);
    
    // Top pair is when our pair rank is higher than all board cards
    if (pairRank > maxBoardRank) {
      // Overpair - very strong
      return 2.8 + (pairRank / 14) * 0.4; // 2.8 to 3.2 range
    }
    
    // Top pair - our pair matches the highest board card
    if (pairRank === maxBoardRank) {
      let baseValue = 2.4; // Base top pair value
      
      // Adjust based on kicker strength
      const topKicker = kickers[0] || 0;
      if (topKicker >= 12) baseValue += 0.3; // Broadway kicker
      else if (topKicker >= 10) baseValue += 0.2; // Ten kicker
      else if (topKicker >= 8) baseValue += 0.1; // Eight kicker
      
      // Adjust based on board texture
      const uniqueBoardRanks = [...new Set(communityRanks)];
      if (uniqueBoardRanks.length === 3) {
        // Rainbow board - top pair is stronger
        baseValue += 0.1;
      } else if (uniqueBoardRanks.length === 2) {
        // Paired board - top pair is weaker
        baseValue -= 0.1;
      }
      
      return baseValue;
    }
    
    // Middle pair - our pair is between highest and lowest board cards
    if (pairRank < maxBoardRank && pairRank > minBoardRank) {
      let baseValue = 2.0; // Base middle pair value
      
      // Adjust based on kicker strength
      const topKicker = kickers[0] || 0;
      if (topKicker >= 12) baseValue += 0.2; // Broadway kicker
      else if (topKicker >= 10) baseValue += 0.1; // Ten kicker
      
      // Middle pair is weaker than top pair
      baseValue -= 0.2;
      
      return baseValue;
    }
    
    // Bottom pair - our pair matches the lowest board card
    if (pairRank === minBoardRank) {
      let baseValue = 1.8; // Base bottom pair value
      
      // Adjust based on kicker strength
      const topKicker = kickers[0] || 0;
      if (topKicker >= 12) baseValue += 0.2; // Broadway kicker
      else if (topKicker >= 10) baseValue += 0.1; // Ten kicker
      
      // Bottom pair is much weaker
      baseValue -= 0.4;
      
      return baseValue;
    }
    
    // Fallback
    return 2.0 + (pairRank / 14) * 0.2;
  }

  // Evaluate board pair strength (when board is paired and we have a kicker)
  getBoardPairValue(pairRank, communityRanks, kickers) {
    const maxBoardRank = Math.max(...communityRanks);
    const minBoardRank = Math.min(...communityRanks);
    
    let baseValue = 1.6; // Base board pair value (weaker than hole card pairs)
    
    // Adjust based on kicker strength
    const topKicker = kickers[0] || 0;
    if (topKicker >= 12) baseValue += 0.3; // Broadway kicker
    else if (topKicker >= 10) baseValue += 0.2; // Ten kicker
    else if (topKicker >= 8) baseValue += 0.1; // Eight kicker
    
    // Adjust based on pair rank relative to board
    if (pairRank === maxBoardRank) {
      baseValue += 0.2; // Top board pair
    } else if (pairRank === minBoardRank) {
      baseValue -= 0.2; // Bottom board pair
    }
    
    return baseValue;
  }

  // Calculate kicker value for pairs
  calculateKickerValue(kickers) {
    if (!kickers || kickers.length === 0) return 0;
    
    let kickerValue = 0;
    for (let i = 0; i < kickers.length; i++) {
      kickerValue += kickers[i] * Math.pow(0.01, i + 1);
    }
    
    return kickerValue;
  }

  getKickerValue(ranks) {
    const counts = {};
    ranks.forEach(rank => counts[rank] = (counts[rank] || 0) + 1);
    
    // Find the main hand rank (most frequent)
    let mainRank = 0;
    let maxCount = 0;
    for (const [rank, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        mainRank = parseInt(rank);
      }
    }
    
    // Get kickers (ranks not in the main hand)
    const kickers = ranks.filter(rank => rank !== mainRank).sort((a, b) => b - a);
    
    // Calculate kicker value (weighted by position)
    let kickerValue = 0;
    for (let i = 0; i < kickers.length; i++) {
      kickerValue += kickers[i] * Math.pow(0.1, i + 1);
    }
    
    return mainRank + kickerValue;
  }

  getFullHouseValue(ranks) {
    const counts = {};
    ranks.forEach(rank => counts[rank] = (counts[rank] || 0) + 1);
    
    let threeRank = 0;
    let pairRank = 0;
    
    for (const [rank, count] of Object.entries(counts)) {
      if (count >= 3 && parseInt(rank) > threeRank) {
        threeRank = parseInt(rank);
      } else if (count >= 2 && parseInt(rank) > pairRank) {
        pairRank = parseInt(rank);
      }
    }
    
    return threeRank * 100 + pairRank;
  }

  getTwoPairValue(ranks) {
    const counts = {};
    ranks.forEach(rank => counts[rank] = (counts[rank] || 0) + 1);
    
    const pairs = [];
    for (const [rank, count] of Object.entries(counts)) {
      if (count >= 2) {
        pairs.push(parseInt(rank));
      }
    }
    
    pairs.sort((a, b) => b - a);
    const kicker = ranks.find(rank => !pairs.includes(rank)) || 0;
    
    return pairs[0] * 10000 + pairs[1] * 100 + kicker;
  }

  getStraightValue(ranks) {
    const uniqueRanks = [...new Set(ranks)].sort((a, b) => a - b);
    
    // Find the highest straight
    for (let i = uniqueRanks.length - 1; i >= 4; i--) {
      if (uniqueRanks[i] - uniqueRanks[i - 4] === 4) {
        return uniqueRanks[i]; // Return the high card of the straight
      }
    }
    
    // Check for Ace-low straight
    if (uniqueRanks.includes(14)) { // Ace
      const lowRanks = uniqueRanks.filter(r => r <= 5);
      if (lowRanks.length >= 4 && lowRanks.includes(2)) {
        return 5; // A-2-3-4-5 straight
      }
    }
    
    return 0;
  }

  calculateHoleCardStrength(ranks, suits) {
    const highCard = Math.max(...ranks);
    const lowCard = Math.min(...ranks);
    const isSuited = suits[0] === suits[1];
    const isConnected = Math.abs(highCard - lowCard) <= 4;
    const isBroadway = highCard >= 10;
    
    let strength = 0;
    
    // Suited bonus
    if (isSuited) strength += 0.3;
    
    // Connected bonus
    if (isConnected) strength += 0.2;
    
    // Broadway bonus
    if (isBroadway) strength += 0.2;
    
    // High card value
    strength += highCard / 14 * 0.3;
    
    // Pair bonus
    if (highCard === lowCard) strength += 0.5;
    
    return strength;
  }

  calculatePotential(cards, communityCardCount) {
    if (communityCardCount === 0) return 0; // Preflop
    
    const ranks = cards.map(c => c.rank);
    const suits = cards.map(c => c.suit);
    
    let potential = 0;
    
    // Flush draw potential - give more credit
    const suitCounts = {};
    suits.forEach(suit => suitCounts[suit] = (suitCounts[suit] || 0) + 1);
    const maxSuitCount = Math.max(...Object.values(suitCounts));
    if (maxSuitCount >= 4) potential += 0.6; // Increased from 0.4
    else if (maxSuitCount === 3) potential += 0.4; // Increased from 0.2
    
    // Straight draw potential - give more credit
    const uniqueRanks = [...new Set(ranks)].sort((a, b) => a - b);
    for (let i = 0; i < uniqueRanks.length - 2; i++) {
      if (uniqueRanks[i + 2] - uniqueRanks[i] <= 4) {
        potential += 0.4; // Increased from 0.2
        break;
      }
    }
    
    // Overcard potential - give more credit
    const holeCardRanks = ranks.slice(-2);
    const communityRanks = ranks.slice(0, -2);
    const maxCommunityRank = Math.max(...communityRanks);
    if (holeCardRanks.some(rank => rank > maxCommunityRank)) {
      potential += 0.2; // Increased from 0.1
    }
    
    // Gutshot potential
    for (let i = 0; i < uniqueRanks.length - 3; i++) {
      if (uniqueRanks[i + 3] - uniqueRanks[i] <= 4) {
        potential += 0.2;
        break;
      }
    }
    
    // Backdoor flush potential
    if (maxSuitCount === 2) {
      potential += 0.1;
    }
    
    return potential;
  }

  getHandRank(strength) {
    // Convert hand strength to percentile (0-1)
    return Math.min(1, Math.max(0, strength / 10));
  }

  getPositionValue(position) {
    const positionValues = {
      'BTN': 1.0, 'CO': 0.8, 'MP': 0.6, 'LJ': 0.5, 'UTG+1': 0.4, 'UTG': 0.3,
      'SB': 0.7, 'BB': 0.9, 'BTN/SB': 1.0
    };
    return positionValues[position] || 0.5;
  }

  getPositionMultiplier(position, numPlayers) {
    const baseMultiplier = this.getPositionValue(position);
    
    // Adjust for number of players
    if (numPlayers <= 3) return baseMultiplier * 1.2; // Heads-up or 3-way
    if (numPlayers <= 6) return baseMultiplier; // 6-max
    return baseMultiplier * 0.8; // 9-max
  }

  calculatePotOdds(callAmount, potSize) {
    if (callAmount === 0) return 0;
    return callAmount / (potSize + callAmount);
  }

  // Hand evaluation helper functions
  isStraightFlush(ranks, suits) {
    return this.isFlush(suits) && this.isStraight(ranks);
  }

  isFourOfAKind(ranks) {
    const counts = {};
    ranks.forEach(rank => counts[rank] = (counts[rank] || 0) + 1);
    return Object.values(counts).some(count => count >= 4);
  }

  isFullHouse(ranks) {
    const counts = {};
    ranks.forEach(rank => counts[rank] = (counts[rank] || 0) + 1);
    const values = Object.values(counts).sort((a, b) => b - a);
    return values.length >= 2 && values[0] >= 3 && values[1] >= 2;
  }

  isFlush(suits) {
    const suitCounts = {};
    suits.forEach(suit => suitCounts[suit] = (suitCounts[suit] || 0) + 1);
    return Object.values(suitCounts).some(count => count >= 5);
  }

  isStraight(ranks) {
    const uniqueRanks = [...new Set(ranks)].sort((a, b) => a - b);
    for (let i = 0; i <= uniqueRanks.length - 5; i++) {
      if (uniqueRanks[i + 4] - uniqueRanks[i] === 4) {
        return true;
      }
    }
    // Check for Ace-low straight (A-2-3-4-5)
    if (uniqueRanks.includes(14)) { // Ace
      const lowRanks = uniqueRanks.filter(r => r <= 5);
      if (lowRanks.length >= 4 && lowRanks.includes(2)) {
        return true;
      }
    }
    return false;
  }

  isThreeOfAKind(ranks) {
    const counts = {};
    ranks.forEach(rank => counts[rank] = (counts[rank] || 0) + 1);
    return Object.values(counts).some(count => count >= 3);
  }

  isTwoPair(ranks) {
    const counts = {};
    ranks.forEach(rank => counts[rank] = (counts[rank] || 0) + 1);
    const pairs = Object.values(counts).filter(count => count >= 2);
    return pairs.length >= 2;
  }

  isOnePair(ranks) {
    const counts = {};
    ranks.forEach(rank => counts[rank] = (counts[rank] || 0) + 1);
    return Object.values(counts).some(count => count >= 2);
  }

  // Convert action to game format
  formatAction(action) {
    return {
      type: action.action,
      amount: action.amount || 0
    };
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

  // Enhanced postflop decision with bluffing and board texture analysis
  postflopDecision(handStrength, bettingRound, currentHighestBet, currentBet, potSize, stackSize, activePlayers, communityCards, gameState, playerState) {
    const callAmount = currentHighestBet - currentBet;
    const potOdds = callAmount / (potSize + callAmount);
    const isRaised = currentHighestBet > 0;
    const betSize = this.getBetSize(currentHighestBet, potSize);
    const position = this.getPositionValue(playerState.positionName || 'BB');
    const isAggressor = this.isAggressor(gameState, playerState);
    const isLastAggressor = this.isLastAggressor(gameState, playerState);
    
    // Calculate hand strength percentile
    const handRank = this.getHandRank(handStrength);
    
    // Adjust for number of players
    const playerMultiplier = Math.max(0.5, 1 - (activePlayers - 2) * 0.1);
    const adjustedHandRank = handRank * playerMultiplier;
    
    // Analyze board texture
    const boardTexture = this.analyzeBoardTexture(communityCards);
    const textureMultiplier = this.getBoardTextureMultiplier(boardTexture, handStrength);
    const finalHandRank = adjustedHandRank * textureMultiplier;
    
    // Position adjustment
    const positionMultiplier = this.getPostflopPositionMultiplier(position, bettingRound);
    const finalHandRankWithPosition = finalHandRank * positionMultiplier;
    
    // Get opponent betting pattern and adjust calling frequency
    const opponentBettingPattern = this.getOpponentBettingPattern(gameState, bettingRound);
    const patternMultiplier = this.getBettingPatternMultiplier(opponentBettingPattern, bettingRound);
    const finalHandRankWithPattern = finalHandRankWithPosition * patternMultiplier;
    
    // Determine bluff frequency based on street and board texture
    const bluffFreq = this.getBluffFrequency(bettingRound, boardTexture);
    const shouldBluff = Math.random() < bluffFreq;
    
    // Debug pair type information
    const pairType = this.getPairType(handStrength, communityCards, playerState.cards || []);
    
    console.log(`[PokerBot][POSTFLOP] Hand: ${this.getHandNotation(playerState.cards || [])}, Strength: ${finalHandRankWithPattern.toFixed(3)}, Pair Type: ${pairType}, Bet: ${betSize}, Pot: ${potSize}, Call: ${callAmount}, Position: ${playerState.positionName}, Aggressor: ${isAggressor}, Pattern: ${opponentBettingPattern}, Multiplier: ${patternMultiplier.toFixed(2)}`);
    
    if (isRaised) {
      // Facing a bet/raise
      return this.handleFacingBet(finalHandRankWithPattern, betSize, potOdds, callAmount, stackSize, bettingRound, boardTexture, position, isAggressor, currentHighestBet, opponentBettingPattern);
    } else {
      // First to act
      return this.handleFirstToAct(finalHandRankWithPattern, bettingRound, boardTexture, position, isLastAggressor, shouldBluff, currentHighestBet, stackSize, potSize);
    }
  }

  // Helper to determine pair type for debugging
  getPairType(handStrength, communityCards, holeCards) {
    if (!communityCards || communityCards.length === 0) return 'preflop';
    
    const allCards = [...communityCards, ...holeCards];
    const formattedCards = allCards.map(card => {
      const rank = card[0];
      const suit = card[1];
      return { rank: this.rankValues[rank], suit };
    });
    
    const holeCardRanks = holeCards.map(card => this.rankValues[card[0]]);
    const communityRanks = communityCards.map(card => this.rankValues[card[0]]);
    
    // Check if it's a pocket pair
    if (holeCardRanks[0] === holeCardRanks[1]) {
      const maxBoardRank = Math.max(...communityRanks);
      if (holeCardRanks[0] > maxBoardRank) {
        return 'overpair';
      } else {
        return 'pocket_pair';
      }
    }
    
    // Check for one pair
    const allRanks = [...communityRanks, ...holeCardRanks];
    const counts = {};
    allRanks.forEach(rank => counts[rank] = (counts[rank] || 0) + 1);
    
    let pairRank = 0;
    for (const [rank, count] of Object.entries(counts)) {
      if (count >= 2) {
        pairRank = parseInt(rank);
        break;
      }
    }
    
    if (pairRank > 0) {
      const maxBoardRank = Math.max(...communityRanks);
      const minBoardRank = Math.min(...communityRanks);
      
      if (holeCardRanks.includes(pairRank)) {
        if (pairRank > maxBoardRank) {
          return 'overpair';
        } else if (pairRank === maxBoardRank) {
          return 'top_pair';
        } else if (pairRank < maxBoardRank && pairRank > minBoardRank) {
          return 'middle_pair';
        } else if (pairRank === minBoardRank) {
          return 'bottom_pair';
        }
      } else {
        return 'board_pair';
      }
    }
    
    return 'no_pair';
  }

  // Handle facing a bet/raise
  handleFacingBet(handRank, betSize, potOdds, callAmount, stackSize, bettingRound, boardTexture, position, isAggressor, currentHighestBet, opponentBettingPattern) {
    // Calculate adjusted thresholds based on bet size
    const betSizeMultiplier = this.getBetSizeMultiplier(betSize);
    const baseThresholds = {
      fold: this.thresholds.fold * betSizeMultiplier,
      call: this.thresholds.call * betSizeMultiplier,
      raise: this.thresholds.raise * betSizeMultiplier,
      valueBet: this.thresholds.valueBet * betSizeMultiplier
    };

    // Adjust thresholds based on opponent betting pattern
    const adjustedThresholds = this.getPatternAdjustedThresholds(baseThresholds, opponentBettingPattern, bettingRound);

    // Special cases for very strong hands
    if (handRank > 0.9) {
      console.log(`[PokerBot][POSTFLOP] Very strong hand (${handRank.toFixed(3)}), raising for value`);
      return this.decideRaise(currentHighestBet, stackSize, 'value');
    }

    // Special handling for top pair hands - be more aggressive
    const isTopPair = this.isTopPairHand(handRank, bettingRound);
    if (isTopPair) {
      console.log(`[PokerBot][POSTFLOP] Top pair detected (${handRank.toFixed(3)}), being more aggressive`);
      // Lower the value bet threshold for top pair
      adjustedThresholds.valueBet *= 0.8;
      adjustedThresholds.raise *= 0.9;
    }

    // Safety check: if pot odds are very good, call with any reasonable hand
    if (potOdds < 0.2 && handRank > 0.1) {
      console.log(`[PokerBot][POSTFLOP] Good pot odds (${potOdds.toFixed(3)}), calling with reasonable hand (${handRank.toFixed(3)})`);
      return { action: 'call', amount: Math.round(callAmount) };
    }

    // Handle different bet sizes
    if (betSize === 'tiny') {
      return this.handleTinyBet(handRank, potOdds, callAmount, adjustedThresholds, position, boardTexture, opponentBettingPattern, isTopPair);
    } else if (betSize === 'small') {
      return this.handleSmallBet(handRank, potOdds, callAmount, adjustedThresholds, position, boardTexture, opponentBettingPattern, isTopPair);
    } else if (betSize === 'medium') {
      return this.handleMediumBet(handRank, potOdds, callAmount, adjustedThresholds, position, boardTexture, bettingRound, opponentBettingPattern, isTopPair);
    } else {
      return this.handleLargeBet(handRank, potOdds, callAmount, adjustedThresholds, position, boardTexture, bettingRound, isAggressor, opponentBettingPattern, isTopPair);
    }
  }

  // Enhanced bet handling functions with top pair awareness
  handleTinyBet(handRank, potOdds, callAmount, thresholds, position, boardTexture, opponentBettingPattern, isTopPair) {
    // Against tiny bets, call almost anything with any reasonable hand
    const callThreshold = Math.max(0.02, potOdds * 0.3); // Extremely lenient
    
    // Adjust calling frequency based on pattern
    const patternMultiplier = this.getBettingPatternMultiplier(opponentBettingPattern, 'TURN');
    const adjustedCallThreshold = callThreshold / patternMultiplier;
    
    // Top pair should almost always raise tiny bets for value
    if (isTopPair && handRank > 0.25) {
      console.log(`[PokerBot][POSTFLOP] Top pair raising tiny bet for value`);
      return { action: 'bet', amount: Math.round(callAmount * 3) };
    }
    
    if (handRank > thresholds.valueBet) {
      return { action: 'bet', amount: Math.round(callAmount * 3) }; // Raise for value
    } else if (handRank > adjustedCallThreshold) {
      return { action: 'call', amount: Math.round(callAmount) };
    } else if (handRank > 0.05 && Math.random() < 0.6) { // Bluff frequently against tiny bets
      return { action: 'bet', amount: Math.round(callAmount * 2.5) }; // Bluff raise frequently
    } else if (handRank > 0.02 && Math.random() < 0.3) { // Call some very weak hands
      return { action: 'call', amount: Math.round(callAmount) };
    } else {
      return { action: 'fold', amount: 0 };
    }
  }

  handleSmallBet(handRank, potOdds, callAmount, thresholds, position, boardTexture, opponentBettingPattern, isTopPair) {
    // Against small bets, we can call much wider - be very aggressive
    const callThreshold = Math.max(0.05, potOdds * 0.5); // Much more lenient - only need 50% of pot odds
    
    // Adjust calling frequency based on pattern
    const patternMultiplier = this.getBettingPatternMultiplier(opponentBettingPattern, 'TURN');
    const adjustedCallThreshold = callThreshold / patternMultiplier;
    
    // Top pair should frequently raise small bets for value
    if (isTopPair && handRank > 0.25) {
      console.log(`[PokerBot][POSTFLOP] Top pair raising small bet for value`);
      return { action: 'bet', amount: Math.round(callAmount * 2.5) };
    }
    
    if (handRank > thresholds.valueBet) {
      return { action: 'bet', amount: Math.round(callAmount * 2.5) }; // Raise for value
    } else if (handRank > adjustedCallThreshold) {
      return { action: 'call', amount: Math.round(callAmount) };
    } else if (handRank > 0.1 && Math.random() < 0.4) { // Bluff more against small bets
      return { action: 'bet', amount: Math.round(callAmount * 2) }; // Bluff raise frequently
    } else {
      return { action: 'fold', amount: 0 };
    }
  }

  handleMediumBet(handRank, potOdds, callAmount, thresholds, position, boardTexture, bettingRound, opponentBettingPattern, isTopPair) {
    const callThreshold = Math.max(0.1, potOdds * 0.8); // More lenient than before
    
    // Adjust calling frequency based on pattern
    const patternMultiplier = this.getBettingPatternMultiplier(opponentBettingPattern, bettingRound);
    const adjustedCallThreshold = callThreshold / patternMultiplier;
    
    // Top pair should call medium bets and sometimes raise
    if (isTopPair && handRank > 0.3) {
      console.log(`[PokerBot][POSTFLOP] Top pair calling medium bet`);
      return { action: 'call', amount: Math.round(callAmount) };
    }
    
    if (handRank > thresholds.valueBet) {
      return { action: 'bet', amount: Math.round(callAmount * 2.5) }; // Raise for value
    } else if (handRank > adjustedCallThreshold) {
      return { action: 'call', amount: Math.round(callAmount) };
    } else if (handRank > thresholds.bluff && this.shouldBluffAgainstMediumBet(boardTexture, bettingRound, position)) {
      return { action: 'bet', amount: Math.round(callAmount * 2) }; // Bluff raise
    } else if (handRank > 0.15 && Math.random() < 0.2) { // Call some marginal hands
      return { action: 'call', amount: Math.round(callAmount) };
    } else {
      return { action: 'fold', amount: 0 };
    }
  }

  handleLargeBet(handRank, potOdds, callAmount, thresholds, position, boardTexture, bettingRound, isAggressor, opponentBettingPattern, isTopPair) {
    // Against large bets, we need to be more selective but not overly tight
    const callThreshold = Math.max(0.15, potOdds * 1.2); // More lenient than before
    
    // If we were the aggressor, we can call much wider
    const aggressorBonus = isAggressor ? 0.15 : 0;
    const adjustedHandRank = handRank + aggressorBonus;
    
    // Adjust calling frequency based on pattern
    const patternMultiplier = this.getBettingPatternMultiplier(opponentBettingPattern, bettingRound);
    const adjustedCallThreshold = callThreshold / patternMultiplier;
    
    // Top pair should call large bets more often
    if (isTopPair && adjustedHandRank > 0.25) {
      console.log(`[PokerBot][POSTFLOP] Top pair calling large bet`);
      return { action: 'call', amount: Math.round(callAmount) };
    }
    
    if (adjustedHandRank > thresholds.valueBet) {
      return { action: 'bet', amount: Math.round(callAmount * 2.5) }; // Raise for value
    } else if (adjustedHandRank > adjustedCallThreshold) {
      return { action: 'call', amount: Math.round(callAmount) };
    } else if (adjustedHandRank > thresholds.bluff && this.shouldBluffAgainstLargeBet(boardTexture, bettingRound, position, isAggressor)) {
      return { action: 'bet', amount: Math.round(callAmount * 2) }; // Bluff raise
    } else if (adjustedHandRank > 0.2 && Math.random() < 0.15) { // Call some strong hands even against large bets
      return { action: 'call', amount: Math.round(callAmount) };
    } else {
      return { action: 'fold', amount: 0 };
    }
  }

  // Handle first to act
  handleFirstToAct(handRank, bettingRound, boardTexture, position, isLastAggressor, shouldBluff, currentHighestBet, stackSize, potSize) {
    // Special handling for top pair hands - be more aggressive
    const isTopPair = this.isTopPairHand(handRank, bettingRound);
    const adjustedValueBetThreshold = isTopPair ? this.thresholds.valueBet * 0.8 : this.thresholds.valueBet;
    
    if (handRank > adjustedValueBetThreshold) {
      // Value bet - be more aggressive with top pair
      const betType = isTopPair ? 'value' : 'value';
      const betSize = this.getOptimalBetSize(potSize, stackSize, betType, bettingRound);
      console.log(`[PokerBot][POSTFLOP] Value betting with ${isTopPair ? 'top pair' : 'strong hand'} (${handRank.toFixed(3)})`);
      return { action: 'bet', amount: Math.round(betSize) };
    } else if (shouldBluff && handRank > this.thresholds.bluff && this.shouldBluffFirstToAct(boardTexture, bettingRound, position, isLastAggressor)) {
      // Bluff bet
      const betSize = this.getOptimalBetSize(potSize, stackSize, 'bluff', bettingRound);
      return { action: 'bet', amount: Math.round(betSize) };
    } else {
      return { action: 'check', amount: 0 };
    }
  }

  // Helper to detect if this is likely a top pair hand
  isTopPairHand(handRank, bettingRound) {
    // Top pair hands typically have handRank between 0.25 and 0.45
    // This is a rough heuristic based on the new pair evaluation system
    return handRank >= 0.25 && handRank <= 0.45;
  }

  // Helper methods for postflop decision making
  getBetSize(betAmount, potSize) {
    if (betAmount === 0) return 'none';
    const betPercentage = betAmount / potSize;
    if (betPercentage <= 0.25) return 'tiny'; // Very small bets
    if (betPercentage <= 0.33) return 'small';
    if (betPercentage <= 0.66) return 'medium';
    return 'large';
  }

  getBetSizeMultiplier(betSize) {
    const multipliers = {
      'tiny': 0.3,     // Extremely aggressive against tiny bets
      'small': 0.5,    // Much more aggressive against small bets
      'medium': 0.8,   // More aggressive against medium bets
      'large': 1.0     // Standard thresholds for large bets
    };
    return multipliers[betSize] || 1.0;
  }

  getPostflopPositionMultiplier(position, bettingRound) {
    // Position matters more on later streets
    const streetMultiplier = bettingRound === 'RIVER' ? 1.3 : 
                            bettingRound === 'TURN' ? 1.2 : 1.0;
    
    return position * streetMultiplier;
  }

  isAggressor(gameState, playerState) {
    if (!gameState.handHistory) return false;
    
    // Check if we were the last to bet/raise in the current round
    for (let i = gameState.handHistory.length - 1; i >= 0; i--) {
      const action = gameState.handHistory[i];
      if (action.round === gameState.currentBettingRound) {
        return action.playerId === playerState.id && (action.type === 'bet' || action.type === 'raise');
      }
    }
    return false;
  }

  isLastAggressor(gameState, playerState) {
    if (!gameState.handHistory) return false;
    
    // Check if we were the last aggressor in any postflop round
    for (let i = gameState.handHistory.length - 1; i >= 0; i--) {
      const action = gameState.handHistory[i];
      if (action.round !== 'PREFLOP') {
        return action.playerId === playerState.id && (action.type === 'bet' || action.type === 'raise');
      }
    }
    return false;
  }

  shouldBluffAgainstMediumBet(boardTexture, bettingRound, position) {
    // Bluff more on draw-heavy boards and in position
    const textureBonus = boardTexture === 'drawHeavy' ? 0.3 : 
                        boardTexture === 'flushDraw' ? 0.2 : 0;
    const positionBonus = position > 0.7 ? 0.2 : 0;
    const streetBonus = bettingRound === 'FLOP' ? 0.1 : 0;
    
    return Math.random() < (0.2 + textureBonus + positionBonus + streetBonus);
  }

  shouldBluffAgainstLargeBet(boardTexture, bettingRound, position, isAggressor) {
    // Be more selective about bluffing against large bets
    const textureBonus = boardTexture === 'drawHeavy' ? 0.2 : 
                        boardTexture === 'flushDraw' ? 0.1 : 0;
    const positionBonus = position > 0.8 ? 0.1 : 0;
    const aggressorBonus = isAggressor ? 0.1 : 0;
    
    return Math.random() < (0.1 + textureBonus + positionBonus + aggressorBonus);
  }

  shouldBluffFirstToAct(boardTexture, bettingRound, position, isLastAggressor) {
    // Bluff more when we were the last aggressor and in position
    const textureBonus = boardTexture === 'drawHeavy' ? 0.3 : 
                        boardTexture === 'flushDraw' ? 0.2 : 0;
    const positionBonus = position > 0.7 ? 0.2 : 0;
    const aggressorBonus = isLastAggressor ? 0.2 : 0;
    const streetBonus = bettingRound === 'FLOP' ? 0.1 : 0;
    
    return Math.random() < (0.15 + textureBonus + positionBonus + aggressorBonus + streetBonus);
  }

  getOptimalBetSize(potSize, stackSize, betType, bettingRound) {
    let betPercentage;
    
    if (betType === 'value') {
      betPercentage = bettingRound === 'FLOP' ? 0.66 : 
                     bettingRound === 'TURN' ? 0.75 : 0.75;
    } else { // bluff
      betPercentage = bettingRound === 'FLOP' ? 0.5 : 
                     bettingRound === 'TURN' ? 0.66 : 0.75;
    }
    
    const betAmount = Math.min(potSize * betPercentage, stackSize * 0.3);
    return Math.max(Math.round(betAmount), 10); // Ensure integer and minimum bet
  }

  // Track opponent betting pattern across streets
  getOpponentBettingPattern(gameState, currentBettingRound) {
    if (!gameState.handHistory) return 'unknown';
    
    const streetOrder = ['FLOP', 'TURN', 'RIVER'];
    const currentStreetIndex = streetOrder.indexOf(currentBettingRound);
    if (currentStreetIndex <= 0) return 'unknown'; // Can't analyze pattern on flop or preflop
    
    const pattern = [];
    
    // Check previous streets for opponent betting
    for (let i = 0; i < currentStreetIndex; i++) {
      const street = streetOrder[i];
      const streetActions = gameState.handHistory.filter(action => action.round === street);
      
      // Check if opponent bet on this street
      const opponentBet = streetActions.some(action => 
        action.type === 'bet' || action.type === 'raise'
      );
      
      pattern.push(opponentBet ? 'bet' : 'check');
    }
    
    return pattern.join('-');
  }

  // Get multiplier based on betting pattern
  getBettingPatternMultiplier(pattern, bettingRound) {
    if (pattern === 'unknown') return 1.0;
    
    const multipliers = {
      // Turn patterns
      'check': 1.2,        // Opponent checked flop, more likely to call turn bet
      'bet': 0.8,          // Opponent bet flop, more likely to fold turn bet
      
      // River patterns
      'check-check': 1.3,  // Opponent checked both flop and turn, very likely to call river
      'check-bet': 1.0,    // Mixed pattern, neutral
      'bet-check': 1.1,    // Opponent bet flop, checked turn, slightly more likely to call
      'bet-bet': 0.7       // Opponent bet both flop and turn, much more likely to fold river
    };
    
    return multipliers[pattern] || 1.0;
  }

  // Adjust calling thresholds based on betting pattern
  getPatternAdjustedThresholds(baseThresholds, pattern, bettingRound) {
    if (pattern === 'unknown') return baseThresholds;
    
    const patternMultiplier = this.getBettingPatternMultiplier(pattern, bettingRound);
    
    return {
      fold: baseThresholds.fold / patternMultiplier,    // Lower fold threshold = more likely to fold
      call: baseThresholds.call / patternMultiplier,    // Lower call threshold = more likely to call
      raise: baseThresholds.raise * patternMultiplier,  // Higher raise threshold = more likely to raise
      valueBet: baseThresholds.valueBet * patternMultiplier,
      bluff: baseThresholds.bluff * patternMultiplier
    };
  }

  // Analyze board texture for better decision making
  analyzeBoardTexture(communityCards) {
    if (!communityCards || communityCards.length === 0) return 'preflop';
    
    const ranks = communityCards.map(card => this.rankValues[card[0]]);
    const suits = communityCards.map(card => card[1]);
    
    // Check for flush draw
    const suitCounts = {};
    suits.forEach(suit => suitCounts[suit] = (suitCounts[suit] || 0) + 1);
    const maxSuitCount = Math.max(...Object.values(suitCounts));
    const hasFlushDraw = maxSuitCount >= 3;
    
    // Check for straight draw
    const uniqueRanks = [...new Set(ranks)].sort((a, b) => a - b);
    let hasStraightDraw = false;
    for (let i = 0; i <= uniqueRanks.length - 3; i++) {
      if (uniqueRanks[i + 2] - uniqueRanks[i] <= 4) {
        hasStraightDraw = true;
        break;
      }
    }
    
    // Check for paired board
    const rankCounts = {};
    ranks.forEach(rank => rankCounts[rank] = (rankCounts[rank] || 0) + 1);
    const pairs = Object.values(rankCounts).filter(count => count >= 2);
    const isPaired = pairs.length > 0;
    
    // Determine texture type
    if (hasFlushDraw && hasStraightDraw) return 'drawHeavy';
    if (hasFlushDraw) return 'flushDraw';
    if (hasStraightDraw) return 'straightDraw';
    if (isPaired) return 'paired';
    if (Math.max(...ranks) >= 12) return 'highCard';
    return 'lowCard';
  }

  // Get board texture multiplier for hand strength adjustment
  getBoardTextureMultiplier(texture, handStrength) {
    const multipliers = {
      'drawHeavy': 1.3, // Draw-heavy boards favor strong hands
      'flushDraw': 1.2,
      'straightDraw': 1.1,
      'paired': 0.9, // Paired boards reduce hand strength
      'highCard': 1.0,
      'lowCard': 1.1, // Low card boards favor strong hands
      'preflop': 1.0
    };
    
    return multipliers[texture] || 1.0;
  }

  // Get bluff frequency based on street and board texture
  getBluffFrequency(bettingRound, boardTexture) {
    const baseFreq = this.bluffFrequencies[bettingRound.toLowerCase()] || 0.2;
    
    // Adjust bluff frequency based on board texture
    const textureAdjustments = {
      'drawHeavy': 1.5, // Bluff more on draw-heavy boards
      'flushDraw': 1.3,
      'straightDraw': 1.2,
      'paired': 0.7, // Bluff less on paired boards
      'highCard': 1.0,
      'lowCard': 1.1,
      'preflop': 1.0
    };
    
    return baseFreq * (textureAdjustments[boardTexture] || 1.0);
  }
}

export default new PokerBot(); 