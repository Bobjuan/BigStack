// Simple test file for PokerBot functionality
import PokerBot from './pokerBot';

// Test the bot with various scenarios
function testPokerBot() {
  console.log('Testing PokerBot...\n');

  // Test 1: Preflop decision with strong hand
  console.log('Test 1: Preflop with AA');
  const gameState1 = {
    communityCards: [],
    currentBettingRound: 'PREFLOP',
    currentHighestBet: 10,
    pot: 15,
    minRaiseAmount: 10,
    players: [{ isFolded: false }, { isFolded: false }, { isFolded: false }]
  };
  
  const playerState1 = {
    cards: ['Ah', 'Ad'],
    stack: 1000,
    currentBet: 0,
    positionName: 'BTN'
  };
  
  const decision1 = PokerBot.calculateAction(gameState1, playerState1);
  console.log('Decision:', decision1);

  // Test 2: Postflop decision with flush draw
  console.log('\nTest 2: Flop with flush draw');
  const gameState2 = {
    communityCards: ['Kh', '7h', '2c'],
    currentBettingRound: 'FLOP',
    currentHighestBet: 0,
    pot: 30,
    minRaiseAmount: 10,
    players: [{ isFolded: false }, { isFolded: false }]
  };
  
  const playerState2 = {
    cards: ['Ah', 'Th'],
    stack: 1000,
    currentBet: 0,
    positionName: 'BB'
  };
  
  const decision2 = PokerBot.calculateAction(gameState2, playerState2);
  console.log('Decision:', decision2);

  // Test 3: Facing a raise
  console.log('\nTest 3: Facing a raise with medium hand');
  const gameState3 = {
    communityCards: ['Kh', '7h', '2c'],
    currentBettingRound: 'FLOP',
    currentHighestBet: 50,
    pot: 80,
    minRaiseAmount: 10,
    players: [{ isFolded: false }, { isFolded: false }]
  };
  
  const playerState3 = {
    cards: ['Jc', 'Tc'],
    stack: 1000,
    currentBet: 0,
    positionName: 'BB'
  };
  
  const decision3 = PokerBot.calculateAction(gameState3, playerState3);
  console.log('Decision:', decision3);

  // Test 4: Hand notation
  console.log('\nTest 4: Hand notation');
  const notation1 = PokerBot.getHandNotation(['Ah', 'Kh']);
  const notation2 = PokerBot.getHandNotation(['7c', '7d']);
  const notation3 = PokerBot.getHandNotation(['As', '2h']);
  console.log('AKs:', notation1);
  console.log('77:', notation2);
  console.log('A2o:', notation3);

  // Test 5: Range checking
  console.log('\nTest 5: Range checking');
  const inRange1 = PokerBot.isHandInRange('AKs', 'BTN');
  const inRange2 = PokerBot.isHandInRange('72o', 'UTG');
  console.log('AKs in BTN range:', inRange1);
  console.log('72o in UTG range:', inRange2);

  console.log('\nPokerBot tests completed!');
}

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.testPokerBot = testPokerBot;
} else {
  // Node.js environment
  testPokerBot();
}

export { testPokerBot }; 