// Jest setup file for testing environment

import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock console methods to reduce test noise
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
};

// Restore console for debugging when needed
global.restoreConsole = () => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
};

// Mock console by default
console.log = jest.fn();
console.error = jest.fn();
console.warn = jest.fn();

// Mock socket.io-client globally
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
    connected: true,
    id: 'mock-socket-id'
  }))
}));

// Mock PokerBot
jest.mock('./services/pokerBot', () => {
  return jest.fn().mockImplementation(() => ({
    getAction: jest.fn().mockReturnValue({
      action: 'call',
      amount: 0
    })
  }));
});

// Mock SlumbotAPI
jest.mock('./services/slumbotAPI', () => ({
  resetSession: jest.fn(),
  getAction: jest.fn().mockResolvedValue({
    action: 'check'
  })
}));

// Set up test environment
beforeEach(() => {
  // Clear localStorage before each test
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  
  // Reset localStorage state
  const store = {};
  localStorageMock.getItem.mockImplementation(key => store[key] || null);
  localStorageMock.setItem.mockImplementation((key, value) => {
    store[key] = value.toString();
  });
  localStorageMock.removeItem.mockImplementation(key => {
    delete store[key];
  });
  localStorageMock.clear.mockImplementation(() => {
    Object.keys(store).forEach(key => delete store[key]);
  });
});

// Add custom matchers for poker-specific testing
expect.extend({
  toBeValidPokerState(received) {
    const requiredProperties = [
      'players',
      'communityCards', 
      'pot',
      'currentBettingRound',
      'currentPlayerIndex'
    ];
    
    const missingProperties = requiredProperties.filter(prop => !(prop in received));
    
    if (missingProperties.length > 0) {
      return {
        message: () => `Expected valid poker state but missing properties: ${missingProperties.join(', ')}`,
        pass: false
      };
    }
    
    // Check player array
    if (!Array.isArray(received.players)) {
      return {
        message: () => 'Expected players to be an array',
        pass: false
      };
    }
    
    // Check each player has required properties
    const requiredPlayerProps = ['id', 'name', 'stack'];
    for (const player of received.players) {
      const missingPlayerProps = requiredPlayerProps.filter(prop => !(prop in player));
      if (missingPlayerProps.length > 0) {
        return {
          message: () => `Player missing properties: ${missingPlayerProps.join(', ')}`,
          pass: false
        };
      }
    }
    
    // Check pot is non-negative number
    if (typeof received.pot !== 'number' || received.pot < 0) {
      return {
        message: () => `Expected pot to be non-negative number, got ${received.pot}`,
        pass: false
      };
    }
    
    return {
      message: () => 'Poker state is valid',
      pass: true
    };
  },
  
  toHaveConsistentChips(received, expectedTotal) {
    const totalPlayerChips = received.players.reduce((sum, player) => sum + player.stack, 0);
    const totalChips = totalPlayerChips + received.pot;
    
    if (totalChips !== expectedTotal) {
      return {
        message: () => `Expected total chips to be ${expectedTotal}, but got ${totalChips} (${totalPlayerChips} in stacks + ${received.pot} in pot)`,
        pass: false
      };
    }
    
    return {
      message: () => 'Chip conservation is maintained',
      pass: true
    };
  }
});

// Add global test utilities
global.testUtils = {
  createMockGameState: (overrides = {}) => ({
    players: [
      { id: 'player1', name: 'Test', stack: 1000, currentBet: 0, cards: ['Ah', 'Kd'] },
      { id: 'bot1', name: 'Bot1', stack: 1000, currentBet: 0, cards: ['2h', '3d'] }
    ],
    communityCards: [],
    pot: 0,
    currentBettingRound: 'PREFLOP',
    currentPlayerIndex: 0,
    dealerIndex: 0,
    ...overrides
  }),
  
  waitFor: (condition, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        if (condition()) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Timeout waiting for condition'));
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    });
  }
};