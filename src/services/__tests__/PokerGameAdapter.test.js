import PokerGameAdapter from '../PokerGameAdapter';
import Features from '../../config/features';

// Mock dependencies
jest.mock('../pokerBot');
jest.mock('../slumbotAPI');
jest.mock('socket.io-client');

describe('PokerGameAdapter', () => {
  let adapter;
  
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    adapter = new PokerGameAdapter('local');
  });
  
  afterEach(() => {
    if (adapter) {
      adapter.destroy();
    }
  });

  describe('State Transformations', () => {
    test('transformBackendToClient - converts backend state correctly', () => {
      const backendState = {
        id: 'test-game',
        seats: [
          {
            seatIndex: 0,
            isEmpty: false,
            player: {
              id: 'player1',
              name: 'Human',
              cards: ['Ah', 'Kd'],
              stack: 1000,
              currentBet: 10,
              totalBetInHand: 10,
              isFolded: false,
              isAllIn: false,
              isDealer: true,
              isSB: false,
              isBB: false,
              hasActedThisRound: true,
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
              currentBet: 20,
              totalBetInHand: 20,
              isFolded: false,
              isAllIn: false,
              isDealer: false,
              isSB: true,
              isBB: false,
              hasActedThisRound: true,
              positionName: 'SB'
            }
          },
          {
            seatIndex: 2,
            isEmpty: true
          }
        ],
        communityCards: ['Qh', 'Js', '9c'],
        pot: 30,
        totalPot: 30,
        currentBettingRound: 'FLOP',
        currentPlayerIndex: 1,
        dealerIndex: 0,
        currentHighestBet: 20,
        minRaiseAmount: 40,
        bigBlind: 10,
        smallBlind: 5,
        gameSettings: { maxPlayers: 6 }
      };

      const clientState = adapter.transformBackendToClient(backendState);

      expect(clientState).toMatchObject({
        players: expect.arrayContaining([
          expect.objectContaining({
            id: 'player1',
            name: 'Human',
            cards: ['Ah', 'Kd'],
            stack: 1000,
            isDealer: true,
            isTurn: false
          }),
          expect.objectContaining({
            id: 'bot1',
            name: 'Bot1',
            cards: ['2h', '3d'],
            stack: 990,
            isSB: true,
            isTurn: true
          })
        ]),
        numPlayers: 2,
        communityCards: ['Qh', 'Js', '9c'],
        pot: 30,
        currentBettingRound: 'FLOP',
        currentPlayerIndex: 1,
        dealerIndex: 0
      });
    });

    test('transformClientToBackend - converts client state correctly', () => {
      const clientState = {
        id: 'test-game',
        players: [
          {
            id: 'player1',
            name: 'Human',
            cards: ['Ah', 'Kd'],
            stack: 1000,
            currentBet: 10,
            seatIndex: 0
          },
          {
            id: 'bot1',
            name: 'Bot1',
            cards: ['2h', '3d'],
            stack: 990,
            currentBet: 20,
            seatIndex: 1
          }
        ],
        communityCards: ['Qh', 'Js', '9c'],
        pot: 30,
        currentBettingRound: 'FLOP',
        currentPlayerIndex: 1,
        gameSettings: { maxPlayers: 6 }
      };

      const backendState = adapter.transformClientToBackend(clientState);

      expect(backendState.seats).toHaveLength(6);
      expect(backendState.seats[0]).toMatchObject({
        seatIndex: 0,
        isEmpty: false,
        player: expect.objectContaining({
          id: 'player1',
          name: 'Human'
        })
      });
      expect(backendState.seats[2].isEmpty).toBe(true);
    });

    test('handles empty/null states gracefully', () => {
      expect(adapter.transformBackendToClient(null)).toBeNull();
      expect(adapter.transformClientToBackend(null)).toBeNull();
      
      const emptyBackend = { seats: [], communityCards: [] };
      const result = adapter.transformBackendToClient(emptyBackend);
      expect(result.players).toEqual([]);
      expect(result.numPlayers).toBe(0);
    });
  });

  describe('Mode Detection', () => {
    test('creates adapter in local mode by default', () => {
      const localAdapter = new PokerGameAdapter();
      expect(localAdapter.mode).toBe('local');
      localAdapter.destroy();
    });

    test('creates adapter in backend mode when specified', () => {
      const backendAdapter = new PokerGameAdapter('backend');
      expect(backendAdapter.mode).toBe('backend');
      backendAdapter.destroy();
    });
  });

  describe('Bot Management', () => {
    test('initializes bots correctly in local mode', async () => {
      const gameSettings = {
        maxPlayers: 6,
        startingStack: 1000,
        blinds: { small: 5, big: 10 }
      };
      const playerInfo = {
        userId: 'user123',
        name: 'TestPlayer'
      };

      await adapter.initialize(gameSettings, playerInfo, true);

      expect(adapter.humanPlayerId).toBe('player1');
      expect(adapter.botPlayerIds.size).toBe(5);
      expect(adapter.isBot('player1')).toBe(false);
      expect(adapter.isBot('player2')).toBe(true);
    });

    test('getHumanPlayerId returns correct ID', () => {
      adapter.humanPlayerId = 'test-human';
      expect(adapter.getHumanPlayerId()).toBe('test-human');
    });

    test('isBot correctly identifies bots and humans', () => {
      adapter.botPlayerIds.add('bot1');
      adapter.botPlayerIds.add('bot2');
      
      expect(adapter.isBot('bot1')).toBe(true);
      expect(adapter.isBot('human1')).toBe(false);
    });
  });

  describe('Action Handling', () => {
    beforeEach(async () => {
      const gameSettings = {
        maxPlayers: 3,
        startingStack: 1000,
        blinds: { small: 5, big: 10 }
      };
      const playerInfo = { userId: 'user123', name: 'TestPlayer' };
      
      await adapter.initialize(gameSettings, playerInfo, true);
    });

    test('performLocalAction updates game state correctly', async () => {
      // Set up a basic game state
      adapter.localState.currentPlayerIndex = 0;
      adapter.localState.currentHighestBet = 0;
      
      const initialStack = adapter.localState.seats[0].player.stack;
      
      // Perform a bet action
      await adapter.performLocalAction('bet', { amount: 50 });
      
      const player = adapter.localState.seats[0].player;
      expect(player.currentBet).toBe(50);
      expect(player.stack).toBe(initialStack - 50);
      expect(player.hasActedThisRound).toBe(true);
    });

    test('handles invalid actions gracefully', async () => {
      adapter.localState.currentPlayerIndex = 0;
      adapter.localState.currentHighestBet = 100;
      
      // Try to check when facing a bet
      await expect(adapter.performLocalAction('check')).rejects.toThrow();
    });
  });

  describe('Feature Flags Integration', () => {
    test('Features.shouldUseBackendForBots returns boolean', () => {
      const result = Features.shouldUseBackendForBots('test-user');
      expect(typeof result).toBe('boolean');
    });

    test('feature flag override works', () => {
      Features.enableBackendForCurrentUser();
      expect(localStorage.getItem('useBackendForBots')).toBe('true');
      
      Features.disableBackendForCurrentUser();
      expect(localStorage.getItem('useBackendForBots')).toBe('false');
      
      Features.clearUserOverride();
      expect(localStorage.getItem('useBackendForBots')).toBeNull();
    });
  });

  describe('Error Handling', () => {
    test('handles connection failures gracefully', () => {
      const errorCallback = jest.fn();
      adapter.onError(errorCallback);
      
      adapter.handleError(new Error('Test error'));
      
      expect(errorCallback).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Test error' })
      );
    });

    test('switchToLocalMode updates mode correctly', () => {
      const backendAdapter = new PokerGameAdapter('backend');
      const messageCallback = jest.fn();
      backendAdapter.onMessage(messageCallback);
      
      backendAdapter.switchToLocalMode('Test reason');
      
      expect(backendAdapter.mode).toBe('local');
      expect(messageCallback).toHaveBeenCalledWith(
        'Test reason. Continuing in offline mode.'
      );
      
      backendAdapter.destroy();
    });
  });

  describe('Cleanup', () => {
    test('destroy cleans up all resources', () => {
      adapter.botTimers.set(1, true);
      adapter.stateUpdateCallbacks.push(() => {});
      adapter.botPlayerIds.add('bot1');
      
      adapter.destroy();
      
      expect(adapter.botTimers.size).toBe(0);
      expect(adapter.stateUpdateCallbacks).toEqual([]);
      expect(adapter.botPlayerIds.size).toBe(0);
      expect(adapter.localState).toBeNull();
    });
  });

  describe('Game Flow', () => {
    beforeEach(async () => {
      const gameSettings = {
        maxPlayers: 3,
        startingStack: 1000,
        blinds: { small: 5, big: 10 }
      };
      const playerInfo = { userId: 'user123', name: 'TestPlayer' };
      
      await adapter.initialize(gameSettings, playerInfo, true);
    });

    test('startNewHandLocal sets up game correctly', async () => {
      await adapter.startNewHandLocal();
      
      expect(adapter.localState.currentBettingRound).toBe('PREFLOP');
      expect(adapter.localState.communityCards).toEqual([]);
      expect(adapter.localState.currentHighestBet).toBe(10); // Big blind
      
      // Check that players have cards
      const players = adapter.localState.seats.filter(s => !s.isEmpty);
      players.forEach(seat => {
        expect(seat.player.cards).toHaveLength(2);
      });
    });

    test('moveButton rotates dealer correctly', () => {
      // Set initial dealer
      adapter.localState.seats[0].player.isDealer = true;
      adapter.localState.dealerIndex = 0;
      
      adapter.moveButton();
      
      expect(adapter.localState.seats[0].player.isDealer).toBe(false);
      expect(adapter.localState.seats[1].player.isDealer).toBe(true);
      expect(adapter.localState.dealerIndex).toBe(1);
    });
  });

  describe('Callbacks', () => {
    test('state update callbacks work correctly', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      const unsubscribe1 = adapter.onStateUpdate(callback1);
      adapter.onStateUpdate(callback2);
      
      // Trigger state update
      adapter.stateUpdateCallbacks.forEach(cb => cb('testState', 'testLog'));
      
      expect(callback1).toHaveBeenCalledWith('testState', 'testLog');
      expect(callback2).toHaveBeenCalledWith('testState', 'testLog');
      
      // Unsubscribe and test
      unsubscribe1();
      adapter.stateUpdateCallbacks.forEach(cb => cb('testState2', 'testLog2'));
      
      expect(callback1).toHaveBeenCalledTimes(1); // Not called again
      expect(callback2).toHaveBeenCalledTimes(2); // Called again
    });
  });
});

describe('Features Configuration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('rollout percentage calculation works', () => {
    // Test deterministic user hash
    const user1 = 'user123';
    const user2 = 'user456';
    
    Features.setRolloutPercentage(50);
    
    const result1a = Features.shouldUseBackendForBots(user1);
    const result1b = Features.shouldUseBackendForBots(user1);
    const result2 = Features.shouldUseBackendForBots(user2);
    
    // Same user should get same result
    expect(result1a).toBe(result1b);
    
    // Results should be boolean
    expect(typeof result1a).toBe('boolean');
    expect(typeof result2).toBe('boolean');
  });

  test('rollout percentage boundaries work', () => {
    Features.setRolloutPercentage(0);
    expect(Features.shouldUseBackendForBots('any-user')).toBe(false);
    
    Features.setRolloutPercentage(100);
    expect(Features.shouldUseBackendForBots('any-user')).toBe(true);
  });

  test('feature status provides debugging info', () => {
    Features.setRolloutPercentage(25);
    const status = Features.getFeatureStatus('test-user');
    
    expect(status).toMatchObject({
      userId: 'test-user',
      rolloutPercentage: '25',
      shouldUseBackend: expect.any(Boolean),
      userHash: expect.any(Number)
    });
  });
});