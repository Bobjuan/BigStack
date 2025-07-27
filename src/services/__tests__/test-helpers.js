// Test helpers and utilities for poker game testing

export const createMockSocket = () => {
  const listeners = {};
  const emitCalls = [];
  
  return {
    id: 'mock-socket-id',
    connected: true,
    listeners,
    emitCalls,
    
    on: jest.fn((event, handler) => {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(handler);
    }),
    
    emit: jest.fn((event, data, callback) => {
      emitCalls.push({ event, data, callback });
      
      // Simulate async responses
      if (callback) {
        setTimeout(() => {
          switch (event) {
            case 'CREATE_GAME':
              callback({ status: 'ok', gameId: 'test-game-123' });
              break;
            case 'JOIN_GAME':
            case 'TAKE_SEAT':
            case 'START_GAME':
              callback({ status: 'ok' });
              break;
            default:
              callback({ status: 'ok' });
          }
        }, 0);
      }
    }),
    
    disconnect: jest.fn(),
    
    // Helper to trigger events
    triggerEvent(event, data) {
      if (listeners[event]) {
        listeners[event].forEach(handler => handler(data));
      }
    },
    
    // Helper to clear all mocks
    clearAll() {
      this.on.mockClear();
      this.emit.mockClear();
      this.disconnect.mockClear();
      this.emitCalls.length = 0;
    }
  };
};

export const createMockGameState = (overrides = {}) => ({
  id: 'test-game',
  seats: [
    {
      seatIndex: 0,
      isEmpty: false,
      player: {
        id: 'player1',
        name: 'TestPlayer',
        cards: ['Ah', 'Kd'],
        stack: 1000,
        currentBet: 0,
        totalBetInHand: 0,
        isFolded: false,
        isAllIn: false,
        isDealer: true,
        isSB: false,
        isBB: false,
        hasActedThisRound: false,
        positionName: 'BTN'
      }
    },
    {
      seatIndex: 1,
      isEmpty: false,
      player: {
        id: 'bot1',
        name: 'Bot1',
        cards: ['2h', '3d'],
        stack: 990,
        currentBet: 5,
        totalBetInHand: 5,
        isFolded: false,
        isAllIn: false,
        isDealer: false,
        isSB: true,
        isBB: false,
        hasActedThisRound: false,
        positionName: 'SB',
        isBot: true
      }
    },
    {
      seatIndex: 2,
      isEmpty: false,
      player: {
        id: 'bot2',
        name: 'Bot2',
        cards: ['7c', '8c'],
        stack: 980,
        currentBet: 10,
        totalBetInHand: 10,
        isFolded: false,
        isAllIn: false,
        isDealer: false,
        isSB: false,
        isBB: true,
        hasActedThisRound: false,
        positionName: 'BB',
        isBot: true
      }
    }
  ],
  communityCards: [],
  pot: 15,
  totalPot: 15,
  pots: [],
  currentBettingRound: 'PREFLOP',
  currentPlayerIndex: 0,
  dealerIndex: 0,
  currentHighestBet: 10,
  minRaiseAmount: 20,
  bigBlind: 10,
  smallBlind: 5,
  gameSettings: {
    maxPlayers: 6,
    blinds: { small: 5, big: 10 },
    timeBank: 60
  },
  ...overrides
});

export const createMockPokerBot = () => ({
  getAction: jest.fn().mockReturnValue({
    action: 'call',
    amount: 0
  })
});

export const createMockSlumbotAPI = () => ({
  resetSession: jest.fn(),
  getAction: jest.fn().mockResolvedValue({
    action: 'check'
  })
});

export const waitForCondition = (condition, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Condition not met within timeout'));
      } else {
        setTimeout(check, 50);
      }
    };
    
    check();
  });
};

export const simulateGameFlow = async (adapter, actions) => {
  const results = [];
  
  for (const action of actions) {
    try {
      if (action.type === 'wait') {
        await new Promise(resolve => setTimeout(resolve, action.duration));
      } else if (action.type === 'action') {
        await adapter.performAction(action.action, action.details);
        results.push({ success: true, action });
      } else if (action.type === 'bot') {
        await adapter.performBotAction();
        results.push({ success: true, action });
      }
    } catch (error) {
      results.push({ success: false, action, error: error.message });
    }
  }
  
  return results;
};

export const validateGameState = (state) => {
  const errors = [];
  
  // Check required properties
  const requiredProps = ['players', 'communityCards', 'pot', 'currentBettingRound'];
  requiredProps.forEach(prop => {
    if (!(prop in state)) {
      errors.push(`Missing required property: ${prop}`);
    }
  });
  
  // Validate players
  if (state.players) {
    if (!Array.isArray(state.players)) {
      errors.push('Players must be an array');
    } else {
      state.players.forEach((player, index) => {
        if (!player.id) errors.push(`Player ${index} missing ID`);
        if (typeof player.stack !== 'number') errors.push(`Player ${index} invalid stack`);
        if (player.stack < 0) errors.push(`Player ${index} negative stack`);
      });
    }
  }
  
  // Validate pot
  if (typeof state.pot !== 'number' || state.pot < 0) {
    errors.push('Invalid pot value');
  }
  
  // Validate betting round
  const validRounds = ['WAITING', 'PREFLOP', 'FLOP', 'TURN', 'RIVER', 'SHOWDOWN', 'HAND_OVER'];
  if (!validRounds.includes(state.currentBettingRound)) {
    errors.push(`Invalid betting round: ${state.currentBettingRound}`);
  }
  
  return errors.length === 0 ? { valid: true } : { valid: false, errors };
};

export const mockLocalStorage = () => {
  const store = {};
  
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    get store() {
      return { ...store };
    }
  };
};

// Mock console methods to reduce test noise
export const mockConsole = () => {
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn
  };
  
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
  
  return {
    restore() {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
    },
    getLogs() {
      return {
        log: console.log.mock.calls,
        error: console.error.mock.calls,
        warn: console.warn.mock.calls
      };
    }
  };
};