import PokerGameAdapter from '../PokerGameAdapter';
import { io } from 'socket.io-client';
import PokerBot from '../pokerBot';
import SlumbotAPI from '../slumbotAPI';

// Mock socket.io-client
jest.mock('socket.io-client');
jest.mock('../pokerBot');
jest.mock('../slumbotAPI');

describe('PokerGameAdapter Integration Tests', () => {
  let adapter;
  let mockSocket;
  let mockPokerBot;

  beforeEach(() => {
    // Setup mock socket
    mockSocket = {
      on: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
      connected: true,
      id: 'test-socket-id'
    };
    io.mockReturnValue(mockSocket);

    // Setup mock PokerBot
    mockPokerBot = {
      getAction: jest.fn().mockReturnValue({
        action: 'call',
        amount: 0
      })
    };
    PokerBot.mockImplementation(() => mockPokerBot);

    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    if (adapter) {
      adapter.destroy();
    }
    jest.clearAllMocks();
  });

  describe('Full Game Flow - Local Mode', () => {
    test('complete hand from start to finish with bots', async () => {
      adapter = new PokerGameAdapter('local');
      
      const gameSettings = {
        maxPlayers: 3,
        startingStack: 1000,
        blinds: { small: 5, big: 10 }
      };
      
      const playerInfo = {
        userId: 'test-user',
        name: 'TestPlayer'
      };

      // Initialize game
      const gameId = await adapter.initialize(gameSettings, playerInfo, true);
      expect(gameId).toBeTruthy();
      expect(adapter.localState.seats.filter(s => !s.isEmpty)).toHaveLength(3);

      // Start new hand
      await adapter.startNewHand();
      
      // Verify initial state
      const state1 = adapter.transformBackendToClient(adapter.localState);
      expect(state1.currentBettingRound).toBe('PREFLOP');
      expect(state1.players.every(p => p.cards.length === 2)).toBe(true);
      
      // Verify blinds posted
      const sbPlayer = state1.players.find(p => p.isSB);
      const bbPlayer = state1.players.find(p => p.isBB);
      expect(sbPlayer.currentBet).toBe(5);
      expect(bbPlayer.currentBet).toBe(10);

      // Simulate human action
      adapter.localState.currentPlayerIndex = 0; // Human's turn
      await adapter.performAction('call');
      
      // Verify action processed
      const state2 = adapter.transformBackendToClient(adapter.localState);
      expect(state2.players[0].currentBet).toBe(10);
      expect(state2.players[0].stack).toBe(990);

      // Simulate bot actions
      for (let i = 0; i < 2; i++) {
        if (adapter.localState.currentBettingRound === 'PREFLOP') {
          await adapter.performBotAction();
        }
      }

      // Verify round advanced
      const state3 = adapter.transformBackendToClient(adapter.localState);
      expect(['FLOP', 'HAND_OVER']).toContain(state3.currentBettingRound);
      
      if (state3.currentBettingRound === 'FLOP') {
        expect(state3.communityCards.length).toBe(3);
      }
    });

    test('handles all-in scenarios correctly', async () => {
      adapter = new PokerGameAdapter('local');
      
      // Initialize with low stacks
      const gameSettings = {
        maxPlayers: 2,
        startingStack: 100,
        blinds: { small: 10, big: 20 }
      };
      
      await adapter.initialize(gameSettings, { userId: 'test', name: 'Test' }, true);
      await adapter.startNewHand();

      // Force all-in situation
      adapter.localState.currentPlayerIndex = 0;
      adapter.localState.seats[0].player.stack = 50;
      
      await adapter.performAction('raise', { amount: 100 });
      
      const state = adapter.transformBackendToClient(adapter.localState);
      expect(state.players[0].isAllIn).toBe(true);
      expect(state.players[0].stack).toBe(0);
    });

    test('handles folding correctly', async () => {
      adapter = new PokerGameAdapter('local');
      
      await adapter.initialize(
        { maxPlayers: 3, startingStack: 1000 },
        { userId: 'test', name: 'Test' },
        true
      );
      await adapter.startNewHand();

      // Human folds
      adapter.localState.currentPlayerIndex = 0;
      await adapter.performAction('fold');
      
      const state = adapter.transformBackendToClient(adapter.localState);
      expect(state.players[0].isFolded).toBe(true);
      
      // Game should continue with remaining players
      expect(state.currentBettingRound).not.toBe('HAND_OVER');
    });
  });

  describe('Full Game Flow - Backend Mode', () => {
    beforeEach(() => {
      // Setup socket event handlers
      mockSocket.on.mockImplementation((event, handler) => {
        if (event === 'connect') {
          setTimeout(() => handler(), 0);
        }
      });
      
      mockSocket.emit.mockImplementation((event, data, callback) => {
        if (event === 'CREATE_GAME' && callback) {
          callback({ status: 'ok', gameId: 'test-game-123' });
        }
        if (event === 'JOIN_GAME' && callback) {
          callback({ status: 'ok' });
        }
        if (event === 'TAKE_SEAT' && callback) {
          callback({ status: 'ok' });
        }
        if (event === 'START_GAME' && callback) {
          callback({ status: 'ok' });
        }
      });
    });

    test('initializes backend connection and creates game', async () => {
      adapter = new PokerGameAdapter('backend');
      
      const gameSettings = {
        maxPlayers: 6,
        startingStack: 1000,
        blinds: { small: 5, big: 10 },
        botDifficulty: 'medium'
      };
      
      const playerInfo = {
        userId: 'backend-test-user',
        name: 'BackendPlayer'
      };

      const gameId = await adapter.initialize(gameSettings, playerInfo, true);
      
      expect(gameId).toBe('test-game-123');
      expect(mockSocket.emit).toHaveBeenCalledWith(
        'CREATE_GAME',
        expect.objectContaining({
          playerInfo,
          gameSettings: expect.objectContaining({
            vsBot: true,
            botConfig: expect.objectContaining({
              numBots: 5,
              difficulty: 'medium'
            })
          })
        }),
        expect.any(Function)
      );
    });

    test('handles backend state updates', async () => {
      adapter = new PokerGameAdapter('backend');
      const stateCallback = jest.fn();
      adapter.onStateUpdate(stateCallback);

      // Simulate state update from server
      const mockBackendState = {
        seats: [
          {
            seatIndex: 0,
            isEmpty: false,
            player: {
              id: 'player1',
              name: 'Test',
              stack: 1000,
              cards: ['Ah', 'Kd']
            }
          }
        ],
        communityCards: ['Qh', 'Js', 'Tc'],
        pot: 100,
        currentBettingRound: 'FLOP'
      };

      // Trigger state update handler
      const stateHandler = mockSocket.on.mock.calls.find(
        call => call[0] === 'GAME_STATE_UPDATE'
      )[1];
      
      stateHandler({ newState: mockBackendState });

      expect(stateCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          players: expect.arrayContaining([
            expect.objectContaining({
              id: 'player1',
              name: 'Test',
              stack: 1000
            })
          ]),
          communityCards: ['Qh', 'Js', 'Tc'],
          pot: 100
        }),
        expect.any(Object)
      );
    });

    test('falls back to local mode on connection failure', async () => {
      adapter = new PokerGameAdapter('backend');
      const messageCallback = jest.fn();
      adapter.onMessage(messageCallback);

      // Simulate disconnect
      const disconnectHandler = mockSocket.on.mock.calls.find(
        call => call[0] === 'disconnect'
      )[1];
      
      disconnectHandler('io server disconnect');

      expect(adapter.mode).toBe('local');
      expect(messageCallback).toHaveBeenCalledWith(
        expect.stringContaining('offline mode')
      );
    });
  });

  describe('Bot Decision Making', () => {
    test('uses PokerBot for 6-max games', async () => {
      adapter = new PokerGameAdapter('local');
      
      await adapter.initialize(
        { maxPlayers: 6, startingStack: 1000 },
        { userId: 'test', name: 'Test' },
        true
      );

      const mockGameState = {
        players: [
          { id: 'player1', name: 'Human', stack: 1000 },
          { id: 'player2', name: 'Bot1', stack: 1000 }
        ],
        currentHighestBet: 10,
        pot: 20,
        communityCards: ['Ah', 'Kd', 'Qc'],
        currentBettingRound: 'FLOP'
      };

      const decision = await adapter.getBotDecision(mockGameState, 'player2');
      
      expect(mockPokerBot.getAction).toHaveBeenCalledWith(
        expect.objectContaining({
          gameState: mockGameState,
          player: expect.objectContaining({ id: 'player2' })
        })
      );
      expect(decision).toEqual({ action: 'call', amount: 0 });
    });

    test('uses Slumbot for heads-up games', async () => {
      SlumbotAPI.getAction = jest.fn().mockResolvedValue({
        action: 'raise',
        amount: 20
      });

      adapter = new PokerGameAdapter('local');
      
      await adapter.initialize(
        { maxPlayers: 2, startingStack: 1000 },
        { userId: 'test', name: 'Test' },
        true
      );

      const mockGameState = {
        players: [
          { id: 'player1', name: 'Human', stack: 1000 },
          { id: 'player2', name: 'Bot', stack: 1000 }
        ],
        numPlayers: 2,
        currentHighestBet: 10,
        pot: 20
      };

      const decision = await adapter.getBotDecision(mockGameState, 'player2');
      
      expect(SlumbotAPI.getAction).toHaveBeenCalled();
      expect(decision).toEqual({ action: 'raise', amount: 20 });
    });

    test('falls back to simple logic on bot error', async () => {
      mockPokerBot.getAction.mockImplementation(() => {
        throw new Error('Bot error');
      });

      adapter = new PokerGameAdapter('local');
      
      await adapter.initialize(
        { maxPlayers: 6, startingStack: 1000 },
        { userId: 'test', name: 'Test' },
        true
      );

      const mockGameState = {
        players: [{ id: 'player2', name: 'Bot', stack: 1000 }],
        currentHighestBet: 0,
        pot: 10
      };

      const decision = await adapter.getBotDecision(mockGameState, 'player2');
      
      expect(['check', 'bet']).toContain(decision.action);
    });
  });

  describe('State Consistency', () => {
    test('maintains consistent state through multiple actions', async () => {
      adapter = new PokerGameAdapter('local');
      
      await adapter.initialize(
        { maxPlayers: 3, startingStack: 1000, blinds: { small: 5, big: 10 } },
        { userId: 'test', name: 'Test' },
        true
      );
      
      await adapter.startNewHand();
      
      const initialPot = adapter.localState.pot;
      const initialStacks = adapter.localState.seats.map(s => 
        s.isEmpty ? null : s.player.stack
      ).filter(s => s !== null);
      
      // Perform several actions
      const actions = ['call', 'call', 'check'];
      for (let i = 0; i < actions.length; i++) {
        if (adapter.localState.currentPlayerIndex >= 0) {
          try {
            await adapter.performAction(actions[i]);
          } catch (e) {
            // Some actions might be invalid, that's ok
          }
        }
      }
      
      // Verify conservation of chips
      const finalStacks = adapter.localState.seats.map(s => 
        s.isEmpty ? null : s.player.stack
      ).filter(s => s !== null);
      
      const totalChips = finalStacks.reduce((sum, stack) => sum + stack, 0) + 
                        adapter.localState.pot;
      const expectedTotal = initialStacks.reduce((sum, stack) => sum + stack, 0);
      
      expect(totalChips).toBe(expectedTotal);
    });

    test('handles rapid actions without race conditions', async () => {
      adapter = new PokerGameAdapter('local');
      
      await adapter.initialize(
        { maxPlayers: 2, startingStack: 1000 },
        { userId: 'test', name: 'Test' },
        true
      );
      
      await adapter.startNewHand();
      
      // Try multiple rapid actions
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          adapter.performAction('check').catch(() => {})
        );
      }
      
      await Promise.all(promises);
      
      // State should still be consistent
      expect(adapter.localState).toBeTruthy();
      expect(adapter.localState.currentPlayerIndex).toBeGreaterThanOrEqual(-1);
    });
  });

  describe('Error Recovery', () => {
    test('recovers from invalid actions', async () => {
      adapter = new PokerGameAdapter('local');
      
      await adapter.initialize(
        { maxPlayers: 2, startingStack: 1000 },
        { userId: 'test', name: 'Test' },
        true
      );
      
      await adapter.startNewHand();
      
      // Try invalid action (check when facing bet)
      adapter.localState.currentHighestBet = 100;
      adapter.localState.seats[0].player.currentBet = 0;
      
      await expect(adapter.performAction('check')).rejects.toThrow();
      
      // Game should still be playable
      await adapter.performAction('call');
      expect(adapter.localState.seats[0].player.currentBet).toBe(100);
    });

    test('handles bot action failures gracefully', async () => {
      adapter = new PokerGameAdapter('local');
      
      // Mock bot to throw error
      adapter.getBotDecision = jest.fn().mockRejectedValue(new Error('Bot failed'));
      
      await adapter.initialize(
        { maxPlayers: 2, startingStack: 1000 },
        { userId: 'test', name: 'Test' },
        true
      );
      
      // Bot action should fall back to fold
      adapter.localState.currentPlayerIndex = 1; // Bot's turn
      adapter.localState.seats[1].player.id = 'player2'; // Bot
      adapter.botPlayerIds.add('player2');
      
      await adapter.performBotAction();
      
      // Should have folded as emergency fallback
      expect(adapter.localState.seats[1].player.isFolded).toBe(true);
    });
  });

  describe('Memory Management', () => {
    test('cleans up resources on destroy', async () => {
      adapter = new PokerGameAdapter('backend');
      
      // Add various resources
      const timer1 = setTimeout(() => {}, 10000);
      const timer2 = setTimeout(() => {}, 10000);
      adapter.botTimers.set('timer1', timer1);
      adapter.botTimers.set('timer2', timer2);
      
      adapter.stateUpdateCallbacks.push(() => {});
      adapter.messageCallbacks.push(() => {});
      adapter.errorCallbacks.push(() => {});
      
      adapter.botPlayerIds.add('bot1');
      adapter.botPlayerIds.add('bot2');
      
      // Destroy
      adapter.destroy();
      
      // Verify cleanup
      expect(adapter.botTimers.size).toBe(0);
      expect(adapter.stateUpdateCallbacks.length).toBe(0);
      expect(adapter.messageCallbacks.length).toBe(0);
      expect(adapter.errorCallbacks.length).toBe(0);
      expect(adapter.botPlayerIds.size).toBe(0);
      expect(adapter.localState).toBeNull();
      expect(adapter.serverState).toBeNull();
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });
  });
});