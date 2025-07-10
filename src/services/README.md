# Poker Bot Implementation

This directory contains the poker bot services for the BigStack poker application.

## Services

### SlumbotAPI (`slumbotAPI.js`)
- **Purpose**: External API integration for heads-up poker against Slumbot
- **Usage**: Used for 2-player (heads-up) games only
- **Features**: 
  - Session management with tokens
  - Action conversion between game format and Slumbot format
  - Hand history tracking

### PokerBot (`pokerBot.js`)
- **Purpose**: Internal poker bot for 6-max and 9-max games
- **Usage**: Used for multi-player games (6 or 9 players)
- **Features**: 
  - GTO-inspired strategy
  - Position-aware decision making
  - Hand range analysis
  - Board texture analysis
  - Bluffing with proper frequencies
  - Pot odds calculations

## PokerBot Features

### 1. Hand Evaluation
- **Made Hand Strength**: Evaluates current hand strength (pair, flush, straight, etc.)
- **Hole Card Strength**: Considers suitedness, connectivity, and high card value
- **Potential**: Calculates drawing strength (flush draws, straight draws, overcards)

### 2. Position-Based Strategy
- **Opening Ranges**: Different hand ranges for each position
- **Position Multipliers**: Adjusts hand strength based on position
- **Player Count Adjustments**: Adapts strategy for 6-max vs 9-max

### 3. Board Texture Analysis
- **Flush Draws**: Detects potential flush draws
- **Straight Draws**: Identifies straight draw possibilities
- **Paired Boards**: Recognizes paired community cards
- **High/Low Card Boards**: Distinguishes between high and low card boards

### 4. Bluffing Strategy
- **Street-Based Frequencies**: Different bluff frequencies for each street
- **Board Texture Adjustments**: Bluffs more on draw-heavy boards, less on paired boards
- **Hand Strength Thresholds**: Only bluffs with hands above minimum threshold

### 5. Bet Sizing
- **Position-Based Sizing**: Different sizing for different positions
- **Hand Strength Sizing**: Larger bets with stronger hands
- **Bluff Sizing**: Appropriate sizing for bluff hands
- **Stack-to-Pot Ratios**: Considers stack size relative to pot

## Hand Ranges

The bot uses simplified but realistic hand ranges for each position:

### UTG (Under the Gun)
- Premium hands: AA, KK, QQ, JJ, TT
- Strong broadway: AKs, AKo, AQs, AQo, AJs, KQs

### UTG+1
- Adds: 99, ATs, KQo

### MP (Middle Position)
- Adds: 88, A9s, KJs, QJs

### LJ (LoJack)
- Adds: 77, A8s, KTs, QTs, JTs

### CO (Cutoff)
- Adds: 66, A7s, K9s, Q9s, J9s, T9s

### BTN (Button)
- Wide range including suited connectors and small pairs

### SB (Small Blind)
- Very wide range for defense

### BB (Big Blind)
- Widest range for defense

## Decision Making Process

1. **Parse Game State**: Extract relevant information from game and player state
2. **Evaluate Hand Strength**: Calculate current hand strength and potential
3. **Position Analysis**: Apply position-based adjustments
4. **Range Checking**: Verify if hand is in opening range for position
5. **Board Texture Analysis**: Analyze community cards for texture
6. **Pot Odds Calculation**: Calculate pot odds for calling decisions
7. **Action Selection**: Choose fold, call, check, or bet/raise
8. **Bet Sizing**: Determine appropriate bet size if betting

## Usage

```javascript
import PokerBot from './pokerBot';

// Calculate bot action
const gameState = {
  communityCards: ['Ah', 'Kh', 'Qh'],
  currentBettingRound: 'FLOP',
  currentHighestBet: 50,
  pot: 100,
  players: [{ isFolded: false }, { isFolded: false }]
};

const playerState = {
  cards: ['Jh', 'Th'],
  stack: 1000,
  currentBet: 0,
  positionName: 'BTN'
};

const decision = PokerBot.calculateAction(gameState, playerState);
// Returns: { action: 'bet', amount: 75 }
```

## Testing

Run the test suite to verify bot functionality:

```javascript
import { testPokerBot } from './pokerBot.test';
testPokerBot();
```

## Future Enhancements

1. **Opponent Modeling**: Track opponent tendencies and adjust strategy
2. **Advanced Hand Ranges**: More sophisticated range construction
3. **Multi-Street Planning**: Consider future streets in decision making
4. **Game Theory Optimal**: Implement more GTO-based strategies
5. **Machine Learning**: Use ML to improve decision making over time 