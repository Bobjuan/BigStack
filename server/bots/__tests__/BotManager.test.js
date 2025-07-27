const { BotManager, BotSocket } = require('../BotManager');

describe('BotManager Tests', () => {
  let botManager;

  beforeEach(() => {
    botManager = new BotManager();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any remaining bots
    for (const [gameId] of botManager.bots) {
      botManager.removeBotsForGame(gameId);
    }
  });

  describe('Bot Creation', () => {
    test('creates correct number of bots for a game', () => {
      const gameId = 'test-game-1';
      const numBots = 5;
      
      const bots = botManager.createBotsForGame(gameId, numBots, 'medium');
      
      expect(bots).toHaveLength(numBots);
      expect(botManager.bots.has(gameId)).toBe(true);
      expect(botManager.bots.get(gameId)).toHaveLength(numBots);
    });

    test('assigns unique IDs to each bot', () => {
      const gameId = 'test-game-2';
      const bots = botManager.createBotsForGame(gameId, 3);
      
      const ids = bots.map(bot => bot.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(3);
      ids.forEach(id => {
        expect(id).toContain('bot_');
        expect(id).toContain(gameId);
      });
    });

    test('assigns custom bot names when provided', () => {
      const gameId = 'test-game-3';
      const customNames = ['AliceBot', 'BobBot', 'CharlieBot'];
      
      const bots = botManager.createBotsForGame(gameId, 3, 'hard', customNames);
      
      expect(bots[0].botName).toBe('AliceBot');
      expect(bots[1].botName).toBe('BobBot');
      expect(bots[2].botName).toBe('CharlieBot');
    });

    test('uses default names when custom names not provided', () => {
      const gameId = 'test-game-4';
      const bots = botManager.createBotsForGame(gameId, 2);
      
      expect(bots[0].botName).toBe('AlphaBot');
      expect(bots[1].botName).toBe('BetaBot');
    });
  });

  describe('Bot Behavior', () => {
    test('bot difficulty affects think time', () => {
      const gameId = 'test-game-5';
      
      const easyBots = botManager.createBotsForGame(gameId, 1, 'easy');
      expect(easyBots[0].thinkTime).toEqual({ min: 200, max: 1000 });
      botManager.removeBotsForGame(gameId);
      
      const mediumBots = botManager.createBotsForGame(gameId, 1, 'medium');
      expect(mediumBots[0].thinkTime).toEqual({ min: 500, max: 2000 });
      botManager.removeBotsForGame(gameId);
      
      const hardBots = botManager.createBotsForGame(gameId, 1, 'hard');
      expect(hardBots[0].thinkTime).toEqual({ min: 800, max: 2500 });
      botManager.removeBotsForGame(gameId);
      
      const gtoBots = botManager.createBotsForGame(gameId, 1, 'gto');
      expect(gtoBots[0].thinkTime).toEqual({ min: 1000, max: 3000 });
    });

    test('bot makes decisions based on game state', () => {
      const gameId = 'test-game-6';
      const bots = botManager.createBotsForGame(gameId, 1, 'medium');
      const bot = bots[0];
      
      const gameState = {
        seats: [
          { isEmpty: false, player: { id: bot.id, currentBet: 0, stack: 1000 } },
          { isEmpty: false, player: { id: 'other', currentBet: 10, stack: 990 } }
        ],
        currentPlayerIndex: 0,
        currentHighestBet: 10,
        pot: 20
      };
      
      const decision = bot.calculateAction(gameState, gameState.seats[0].player);
      
      expect(['fold', 'call', 'raise']).toContain(decision.type);
      if (decision.type === 'raise') {
        expect(decision.details.amount).toBeGreaterThan(10);
      }
    });

    test('bot schedules action only when its their turn', (done) => {
      const gameId = 'test-game-7';
      const bots = botManager.createBotsForGame(gameId, 2);
      const bot1 = bots[0];
      const bot2 = bots[1];
      
      // Set very short think times for testing
      bot1.thinkTime = { min: 10, max: 20 };
      bot2.thinkTime = { min: 10, max: 20 };
      
      // Mock the emit method
      bot1.emit = jest.fn();
      bot2.emit = jest.fn();
      
      const gameState = {
        seats: [
          { isEmpty: false, player: { id: bot1.id } },
          { isEmpty: false, player: { id: bot2.id } },
          { isEmpty: false, player: { id: 'human' } }
        ],
        currentPlayerIndex: 0 // bot1's turn
      };
      
      bot1.scheduleAction(gameState);
      bot2.scheduleAction(gameState);
      
      // Only bot1 should act (wait for maximum think time + buffer)
      setTimeout(() => {
        expect(bot1.emit).toHaveBeenCalledWith('botAction', expect.any(Object));
        expect(bot2.emit).not.toHaveBeenCalled();
        done();
      }, 50);
    });
  });

  describe('Game State Management', () => {
    test('updates all bots when game state changes', () => {
      const gameId = 'test-game-8';
      const bots = botManager.createBotsForGame(gameId, 3);
      
      // Mock scheduleAction for each bot
      bots.forEach(bot => {
        bot.scheduleAction = jest.fn();
      });
      
      const gameState = { test: 'state' };
      botManager.updateGameState(gameId, gameState);
      
      bots.forEach(bot => {
        expect(bot.scheduleAction).toHaveBeenCalledWith(gameState);
      });
    });

    test('handles bot action events', (done) => {
      const actionData = {
        gameId: 'test-game-9',
        action: 'call',
        details: { amount: 10 }
      };
      
      botManager.on('botAction', (data) => {
        expect(data).toEqual(actionData);
        done();
      });
      
      botManager.handleBotAction(actionData);
    });
  });

  describe('Cleanup', () => {
    test('removes all bots for a game', () => {
      const gameId = 'test-game-10';
      const bots = botManager.createBotsForGame(gameId, 3);
      
      // Mock disconnect for each bot
      bots.forEach(bot => {
        bot.disconnect = jest.fn();
      });
      
      botManager.removeBotsForGame(gameId);
      
      expect(botManager.bots.has(gameId)).toBe(false);
      expect(botManager.gameRooms.has(gameId)).toBe(false);
      bots.forEach(bot => {
        expect(bot.disconnect).toHaveBeenCalled();
      });
    });

    test('handles removing non-existent game gracefully', () => {
      expect(() => {
        botManager.removeBotsForGame('non-existent-game');
      }).not.toThrow();
    });
  });

  describe('Bot Retrieval', () => {
    test('gets specific bot by ID', () => {
      const gameId = 'test-game-11';
      const bots = botManager.createBotsForGame(gameId, 2);
      const targetBot = bots[0];
      
      const foundBot = botManager.getBotSocket(gameId, targetBot.id);
      
      expect(foundBot).toBe(targetBot);
    });

    test('returns null for non-existent bot', () => {
      const gameId = 'test-game-12';
      botManager.createBotsForGame(gameId, 1);
      
      const foundBot = botManager.getBotSocket(gameId, 'non-existent-id');
      
      expect(foundBot).toBeNull();
    });

    test('gets all bots for a game', () => {
      const gameId = 'test-game-13';
      const createdBots = botManager.createBotsForGame(gameId, 4);
      
      const retrievedBots = botManager.getAllBotsForGame(gameId);
      
      expect(retrievedBots).toEqual(createdBots);
      expect(retrievedBots).toHaveLength(4);
    });
  });
});

describe('BotSocket Tests', () => {
  let botSocket;

  beforeEach(() => {
    botSocket = new BotSocket('bot-1', 'TestBot', 'game-1', 'medium');
  });

  afterEach(() => {
    botSocket.disconnect();
  });

  test('initializes with correct properties', () => {
    expect(botSocket.id).toBe('bot-1');
    expect(botSocket.botName).toBe('TestBot');
    expect(botSocket.gameId).toBe('game-1');
    expect(botSocket.difficulty).toBe('medium');
    expect(botSocket.isBot).toBe(true);
  });

  test('calculates actions for different scenarios', () => {
    const gameState = {
      currentHighestBet: 50,
      pot: 100
    };
    
    const player = {
      currentBet: 0,
      stack: 500
    };
    
    // Test multiple decisions to ensure variety
    const actions = [];
    for (let i = 0; i < 10; i++) {
      const action = botSocket.calculateAction(gameState, player);
      actions.push(action.type);
    }
    
    // Should have at least some variety in actions
    const uniqueActions = new Set(actions);
    expect(uniqueActions.size).toBeGreaterThan(1);
  });

  test('handles all-in decisions', () => {
    const gameState = {
      currentHighestBet: 500,
      pot: 1000
    };
    
    const player = {
      currentBet: 0,
      stack: 100 // Less than call amount
    };
    
    const action = botSocket.calculateAction(gameState, player);
    expect(['call', 'fold']).toContain(action.type);
  });

  test('clears timer on disconnect', () => {
    botSocket.actionTimer = setTimeout(() => {}, 10000);
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    
    botSocket.disconnect();
    
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(botSocket.actionTimer).toBeNull();
  });

  test('emits bot action after think time', (done) => {
    botSocket.thinkTime = { min: 10, max: 20 }; // Short for testing
    
    const gameState = {
      seats: [{ isEmpty: false, player: { id: 'bot-1' } }],
      currentPlayerIndex: 0,
      currentHighestBet: 0,
      pot: 10
    };
    
    botSocket.on('botAction', (data) => {
      expect(data.gameId).toBe('game-1');
      expect(['check', 'bet']).toContain(data.action);
      done();
    });
    
    botSocket.scheduleAction(gameState);
  });
});