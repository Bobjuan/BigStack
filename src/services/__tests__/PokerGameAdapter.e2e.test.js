import PokerGameAdapter from '../PokerGameAdapter';
import Features from '../../config/features';
import { 
  createMockSocket, 
  simulateGameFlow,
  waitForCondition,
  validateGameState 
} from './test-helpers';

// E2E tests that simulate real game scenarios
describe('PokerGameAdapter E2E Tests', () => {
  let adapter;
  
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (adapter) {
      adapter.destroy();
    }
  });

  describe('Complete 6-Max Bot Game', () => {
    test('plays full hand from preflop to showdown', async () => {
      adapter = new PokerGameAdapter('local');
      
      // Initialize 6-max game
      await adapter.initialize({
        maxPlayers: 6,
        startingStack: 1000,
        blinds: { small: 5, big: 10 }
      }, {
        userId: 'test-user',
        name: 'Hero'
      }, true);

      // Start hand
      await adapter.startNewHand();
      
      let state = adapter.transformBackendToClient(adapter.getState());
      expect(state.currentBettingRound).toBe('PREFLOP');
      expect(state.players).toHaveLength(6);
      
      // Track game progression
      const gameStates = [state];
      
      // Play through preflop
      const preflopActions = [
        { type: 'action', action: 'call', details: {} }, // Hero calls
        { type: 'bot' }, // Bot 1
        { type: 'bot' }, // Bot 2
        { type: 'bot' }, // Bot 3
        { type: 'bot' }, // Bot 4 (SB)
        { type: 'bot' }  // Bot 5 (BB)
      ];
      
      const preflopResults = await simulateGameFlow(adapter, preflopActions);
      
      state = adapter.transformBackendToClient(adapter.getState());
      gameStates.push(state);
      
      // Should advance to flop if no one went all-in
      if (state.currentBettingRound === 'FLOP') {
        expect(state.communityCards).toHaveLength(3);
        
        // Play through flop
        const flopActions = [];
        for (let i = 0; i < state.players.filter(p => !p.isFolded && !p.isAllIn).length; i++) {
          flopActions.push({ type: 'bot' });
        }
        
        await simulateGameFlow(adapter, flopActions);
        
        state = adapter.transformBackendToClient(adapter.getState());
        gameStates.push(state);
      }
      
      // Validate final state
      const validation = validateGameState(state);
      expect(validation.valid).toBe(true);
      
      // Verify chip conservation
      const totalChips = state.players.reduce((sum, p) => sum + p.stack, 0) + state.pot;
      expect(totalChips).toBe(6000); // 6 players * 1000 starting stack
    });
  });

  describe('Heads-Up Bot Game', () => {
    test('plays heads-up match with Slumbot integration', async () => {
      adapter = new PokerGameAdapter('local');
      
      await adapter.initialize({
        maxPlayers: 2,
        startingStack: 1500,
        blinds: { small: 25, big: 50 }
      }, {
        userId: 'test-user',
        name: 'Hero'
      }, true);

      // Play multiple hands
      const handsToPlay = 3;
      const handResults = [];
      
      for (let handNum = 0; handNum < handsToPlay; handNum++) {
        await adapter.startNewHand();
        
        const handStart = adapter.transformBackendToClient(adapter.getState());
        const startingStacks = handStart.players.map(p => p.stack);
        
        // Play hand to completion
        let roundsPlayed = 0;
        const maxRounds = 10; // Prevent infinite loops
        
        while (adapter.getState().currentBettingRound !== 'HAND_OVER' && roundsPlayed < maxRounds) {
          const state = adapter.getState();
          const currentPlayer = state.seats[state.currentPlayerIndex]?.player;
          
          if (currentPlayer) {
            if (adapter.isBot(currentPlayer.id)) {
              await adapter.performBotAction();
            } else {
              // Human plays conservatively
              try {
                if (state.currentHighestBet > currentPlayer.currentBet) {
                  await adapter.performAction('call');
                } else {
                  await adapter.performAction('check');
                }
              } catch (e) {
                await adapter.performAction('fold');
              }
            }
          }
          
          roundsPlayed++;
        }
        
        const handEnd = adapter.transformBackendToClient(adapter.getState());
        handResults.push({
          handNum,
          startingStacks,
          endingStacks: handEnd.players.map(p => p.stack),
          winner: handEnd.players.find(p => p.stack > startingStacks[handEnd.players.indexOf(p)])
        });
      }
      
      // Verify hands were played
      expect(handResults).toHaveLength(handsToPlay);
      
      // Check chip conservation across all hands
      const finalState = adapter.transformBackendToClient(adapter.getState());
      const totalChips = finalState.players.reduce((sum, p) => sum + p.stack, 0);
      expect(totalChips).toBe(3000); // 2 players * 1500 starting
    });
  });

  describe('Backend Mode Integration', () => {
    test('simulates backend mode with mock socket', async () => {
      const mockSocket = createMockSocket();
      jest.doMock('socket.io-client', () => ({
        io: () => mockSocket
      }));
      
      // Force backend mode
      Features.enableBackendForCurrentUser();
      adapter = new PokerGameAdapter('backend');
      
      // Initialize connection
      const initPromise = adapter.initialize({
        maxPlayers: 9,
        startingStack: 2000,
        blinds: { small: 10, big: 20 }
      }, {
        userId: 'backend-test',
        name: 'BackendHero'
      }, true);
      
      // Simulate connection
      mockSocket.triggerEvent('connect');
      
      const gameId = await initPromise;
      expect(gameId).toBe('test-game-123');
      
      // Simulate game state update from server
      const mockState = {
        seats: Array(9).fill(null).map((_, i) => ({
          seatIndex: i,
          isEmpty: i > 2,
          player: i <= 2 ? {
            id: `player${i}`,
            name: i === 0 ? 'BackendHero' : `Bot${i}`,
            stack: 2000,
            cards: ['Xx', 'Xx'],
            currentBet: 0,
            isBot: i > 0
          } : undefined
        })),
        communityCards: [],
        pot: 30,
        currentBettingRound: 'PREFLOP',
        currentPlayerIndex: 0,
        bigBlind: 20,
        smallBlind: 10
      };
      
      mockSocket.triggerEvent('GAME_STATE_UPDATE', { 
        newState: mockState 
      });
      
      // Verify state was transformed correctly
      await waitForCondition(() => adapter.serverState !== null);
      
      const clientState = adapter.transformBackendToClient(adapter.serverState);
      expect(clientState.players).toHaveLength(3);
      expect(clientState.players[0].name).toBe('BackendHero');
      expect(clientState.pot).toBe(30);
      
      // Test action sending
      await adapter.performAction('raise', { amount: 60 });
      
      const raiseCalls = mockSocket.emitCalls.filter(c => c.event === 'PLAYER_ACTION');
      expect(raiseCalls).toHaveLength(1);
      expect(raiseCalls[0].data).toMatchObject({
        action: 'RAISE',
        details: { amount: 60 }
      });
      
      // Simulate disconnect and fallback
      mockSocket.triggerEvent('disconnect', 'io server disconnect');
      
      expect(adapter.mode).toBe('local');
    });
  });

  describe('Error Recovery Scenarios', () => {
    test('recovers from multiple bot failures', async () => {
      adapter = new PokerGameAdapter('local');
      
      // Mock bot to fail intermittently
      let failureCount = 0;
      adapter.getBotDecision = jest.fn().mockImplementation(() => {
        failureCount++;
        if (failureCount % 2 === 0) {
          throw new Error('Bot decision failed');
        }
        return { action: 'check' };
      });
      
      await adapter.initialize({
        maxPlayers: 3,
        startingStack: 1000
      }, {
        userId: 'test-user',
        name: 'Hero'
      }, true);
      
      await adapter.startNewHand();
      
      // Play several bot actions
      for (let i = 0; i < 5; i++) {
        // Set up bot turn
        adapter.localState.currentPlayerIndex = 1;
        adapter.localState.currentHighestBet = 0;
        
        await adapter.performBotAction();
        
        // Game should continue despite failures
        const state = adapter.transformBackendToClient(adapter.getState());
        expect(state).toBeTruthy();
      }
    });

    test('handles rapid state changes', async () => {
      adapter = new PokerGameAdapter('local');
      
      await adapter.initialize({
        maxPlayers: 2,
        startingStack: 1000
      }, {
        userId: 'test-user',
        name: 'Hero'
      }, true);
      
      await adapter.startNewHand();
      
      // Simulate rapid actions
      const actions = [];
      for (let i = 0; i < 10; i++) {
        actions.push(
          adapter.performAction('check')
            .catch(() => adapter.performAction('fold'))
            .catch(() => {})
        );
      }
      
      await Promise.all(actions);
      
      // State should remain consistent
      const finalState = adapter.transformBackendToClient(adapter.getState());
      const validation = validateGameState(finalState);
      expect(validation.valid).toBe(true);
    });
  });

  describe('Performance Tests', () => {
    test('handles large number of actions efficiently', async () => {
      adapter = new PokerGameAdapter('local');
      
      await adapter.initialize({
        maxPlayers: 9,
        startingStack: 5000
      }, {
        userId: 'test-user',
        name: 'Hero'
      }, true);
      
      const startTime = Date.now();
      
      // Play multiple hands quickly
      for (let hand = 0; hand < 10; hand++) {
        await adapter.startNewHand();
        
        // Fast-forward through hand
        let actions = 0;
        while (adapter.getState().currentBettingRound !== 'HAND_OVER' && actions < 50) {
          try {
            if (adapter.localState.currentPlayerIndex === 0) {
              await adapter.performAction('check');
            } else {
              await adapter.performBotAction();
            }
          } catch (e) {
            // Move to next action
          }
          actions++;
        }
      }
      
      const duration = Date.now() - startTime;
      console.log(`Played 10 hands in ${duration}ms`);
      
      // Should complete reasonably quickly
      expect(duration).toBeLessThan(5000); // 5 seconds for 10 hands
    });

    test('memory usage remains stable', async () => {
      adapter = new PokerGameAdapter('local');
      
      await adapter.initialize({
        maxPlayers: 6,
        startingStack: 2000
      }, {
        userId: 'test-user',
        name: 'Hero'
      }, true);
      
      // Track initial memory state
      const initialTimers = adapter.botTimers.size;
      const initialCallbacks = adapter.stateUpdateCallbacks.length;
      
      // Play many hands
      for (let i = 0; i < 20; i++) {
        await adapter.startNewHand();
        
        // Quick fold to end hand
        adapter.localState.currentPlayerIndex = 0;
        await adapter.performAction('fold');
      }
      
      // Memory should not leak
      expect(adapter.botTimers.size).toBeLessThanOrEqual(initialTimers + 10);
      expect(adapter.stateUpdateCallbacks.length).toBe(initialCallbacks);
    });
  });

  describe('Feature Flag Integration', () => {
    test('respects feature flag settings', async () => {
      // Test with backend disabled
      Features.disableBackendForCurrentUser();
      const localAdapter = new PokerGameAdapter(
        Features.shouldUseBackendForBots('test-user') ? 'backend' : 'local'
      );
      expect(localAdapter.mode).toBe('local');
      localAdapter.destroy();
      
      // Test with backend enabled
      Features.enableBackendForCurrentUser();
      const backendAdapter = new PokerGameAdapter(
        Features.shouldUseBackendForBots('test-user') ? 'backend' : 'local'
      );
      expect(backendAdapter.mode).toBe('backend');
      backendAdapter.destroy();
      
      // Clear override
      Features.clearUserOverride();
    });

    test('rollout percentage works correctly', () => {
      Features.setRolloutPercentage(50);
      
      // Test multiple users
      let backendUsers = 0;
      const testUsers = 100;
      
      for (let i = 0; i < testUsers; i++) {
        if (Features.shouldUseBackendForBots(`user-${i}`)) {
          backendUsers++;
        }
      }
      
      // Should be roughly 50% (with some variance)
      expect(backendUsers).toBeGreaterThan(30);
      expect(backendUsers).toBeLessThan(70);
    });
  });
});