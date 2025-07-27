/**
 * Bot Manager for server-side bot players
 * 
 * Creates virtual socket connections for bot players and manages their actions
 * Integrates with existing game engine without requiring changes to core logic
 */

const { EventEmitter } = require('events');
const { randomUUID } = require('crypto');

class BotSocket extends EventEmitter {
  constructor(botId, botName, gameId, difficulty = 'medium') {
    super();
    this.id = botId;
    this.botName = botName;
    this.gameId = gameId;
    this.difficulty = difficulty;
    this.isBot = true;
    this.thinkTime = { min: 500, max: 2500 };
    this.actionTimer = null;
    this.gameState = null;
    
    // Set difficulty-based behavior
    this.setBehaviorFromDifficulty(difficulty);
  }

  setBehaviorFromDifficulty(difficulty) {
    switch (difficulty) {
      case 'easy':
        this.thinkTime = { min: 200, max: 1000 };
        this.aggression = 0.3;
        this.bluffFrequency = 0.1;
        break;
      case 'medium':
        this.thinkTime = { min: 500, max: 2000 };
        this.aggression = 0.5;
        this.bluffFrequency = 0.2;
        break;
      case 'hard':
        this.thinkTime = { min: 800, max: 2500 };
        this.aggression = 0.7;
        this.bluffFrequency = 0.3;
        break;
      case 'gto':
        this.thinkTime = { min: 1000, max: 3000 };
        this.aggression = 0.6;
        this.bluffFrequency = 0.25;
        break;
      default:
        this.setBehaviorFromDifficulty('medium');
    }
  }

  // Simulate socket.join for room management
  join(room) {
    // This is handled by the BotManager
    return this;
  }

  // Simulate socket.leave
  leave(room) {
    // This is handled by the BotManager
    return this;
  }

  // Schedule bot action based on game state
  scheduleAction(gameState) {
    if (this.actionTimer) {
      clearTimeout(this.actionTimer);
    }

    this.gameState = gameState;
    
    // Check if it's this bot's turn
    const currentPlayer = this.getCurrentPlayer(gameState);
    if (!currentPlayer || currentPlayer.id !== this.id) {
      return;
    }

    // Random think time
    const thinkTime = Math.random() * (this.thinkTime.max - this.thinkTime.min) + this.thinkTime.min;
    
    this.actionTimer = setTimeout(() => {
      this.makeDecision(gameState);
    }, thinkTime);
  }

  getCurrentPlayer(gameState) {
    if (!gameState.seats || gameState.currentPlayerIndex < 0) return null;
    const currentSeat = gameState.seats[gameState.currentPlayerIndex];
    return currentSeat && !currentSeat.isEmpty ? currentSeat.player : null;
  }

  makeDecision(gameState) {
    const currentPlayer = this.getCurrentPlayer(gameState);
    if (!currentPlayer || currentPlayer.id !== this.id) {
      return;
    }

    // Get available actions and decide
    const action = this.calculateAction(gameState, currentPlayer);
    
    // Emit the action (this will be picked up by the game engine)
    this.emit('botAction', {
      gameId: this.gameId,
      action: action.type,
      details: action.details
    });
  }

  calculateAction(gameState, player) {
    const currentBet = gameState.currentHighestBet || 0;
    const playerBet = player.currentBet || 0;
    const callAmount = currentBet - playerBet;
    const pot = gameState.pot || 0;
    const stack = player.stack || 0;

    // Simple decision tree (can be enhanced with actual poker logic)
    const random = Math.random();
    
    // If facing no bet
    if (callAmount <= 0) {
      if (random < 0.6) {
        return { type: 'check' };
      } else {
        // Bet sizing based on pot
        const betSize = Math.floor(pot * (0.5 + random * 0.5));
        return { 
          type: 'bet', 
          details: { amount: Math.min(betSize, stack) }
        };
      }
    }
    
    // Facing a bet
    const potOdds = callAmount / (pot + callAmount);
    const shouldCall = random < (1 - potOdds) * this.aggression;
    
    if (callAmount >= stack) {
      // All-in decision
      return random < 0.3 ? { type: 'call' } : { type: 'fold' };
    }
    
    if (shouldCall) {
      if (random < 0.7) {
        return { type: 'call' };
      } else {
        // Raise
        const raiseSize = Math.floor(currentBet * (1.5 + random * 2));
        return { 
          type: 'raise', 
          details: { amount: Math.min(raiseSize, stack) }
        };
      }
    } else {
      return { type: 'fold' };
    }
  }

  disconnect() {
    if (this.actionTimer) {
      clearTimeout(this.actionTimer);
      this.actionTimer = null;
    }
    this.removeAllListeners();
  }
}

class BotManager {
  constructor() {
    this.bots = new Map(); // gameId -> bot sockets array
    this.gameRooms = new Map(); // gameId -> room info
  }

  createBotsForGame(gameId, numBots, difficulty = 'medium', botNames = null) {
    console.log(`[BotManager] Creating ${numBots} bots for game ${gameId}`);
    
    const botSockets = [];
    const defaultNames = [
      'AlphaBot', 'BetaBot', 'GammaBot', 'DeltaBot', 
      'EpsilonBot', 'ZetaBot', 'EtaBot', 'ThetaBot'
    ];
    
    for (let i = 0; i < numBots; i++) {
      const botId = `bot_${gameId}_${i}_${randomUUID().substr(0, 8)}`;
      const botName = (botNames && botNames[i]) || defaultNames[i] || `Bot${i + 1}`;
      
      const botSocket = new BotSocket(botId, botName, gameId, difficulty);
      
      // Set up bot action handling
      botSocket.on('botAction', (actionData) => {
        this.handleBotAction(actionData);
      });
      
      botSockets.push(botSocket);
    }
    
    this.bots.set(gameId, botSockets);
    return botSockets;
  }

  handleBotAction(actionData) {
    // This will be connected to the main server's action handler
    console.log(`[BotManager] Bot action:`, actionData);
    
    // Emit to the main server (will be connected in server.js)
    this.emit('botAction', actionData);
  }

  scheduleBotsForGame(gameId, gameState) {
    const bots = this.bots.get(gameId);
    if (!bots) return;
    
    bots.forEach(bot => {
      bot.scheduleAction(gameState);
    });
  }

  getBotSocket(gameId, botId) {
    const bots = this.bots.get(gameId);
    if (!bots) return null;
    
    return bots.find(bot => bot.id === botId) || null;
  }

  getAllBotsForGame(gameId) {
    return this.bots.get(gameId) || [];
  }

  removeBotsForGame(gameId) {
    const bots = this.bots.get(gameId);
    if (bots) {
      bots.forEach(bot => bot.disconnect());
      this.bots.delete(gameId);
    }
    this.gameRooms.delete(gameId);
    console.log(`[BotManager] Removed bots for game ${gameId}`);
  }

  updateGameState(gameId, gameState) {
    // Notify all bots of state change
    this.scheduleBotsForGame(gameId, gameState);
  }

  // Join bot to room (simulates socket.join)
  joinBotToRoom(gameId, botId, roomName) {
    const roomInfo = this.gameRooms.get(gameId) || { rooms: new Set() };
    roomInfo.rooms.add(roomName);
    this.gameRooms.set(gameId, roomInfo);
  }

  // Get room info for debugging
  getRoomInfo(gameId) {
    return this.gameRooms.get(gameId);
  }
}

// Make BotManager an EventEmitter to communicate with main server
Object.setPrototypeOf(BotManager.prototype, EventEmitter.prototype);

module.exports = { BotManager, BotSocket };