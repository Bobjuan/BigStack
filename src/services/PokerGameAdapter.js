import { io } from 'socket.io-client';
import PokerBot from './pokerBot';
import SlumbotAPI from './slumbotAPI';

/**
 * PokerGameAdapter - Unified interface for local and backend poker games
 * 
 * This adapter provides a seamless transition between client-side poker logic
 * and server-side game management, ensuring backward compatibility while
 * enabling gradual migration to the backend architecture.
 */
class PokerGameAdapter {
  constructor(mode = 'local') {
    this.mode = mode; // 'local' | 'backend'
    this.socket = null;
    this.gameId = null;
    this.localState = null;
    this.serverState = null;
    this.pendingActions = new Map();
    this.stateVersion = 0;
    this.botTimers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.isConnected = false;
    this.stateUpdateCallbacks = [];
    this.messageCallbacks = [];
    this.errorCallbacks = [];
    
    // Bot-specific properties
    this.pokerBot = null;
    this.slumbotSession = null;
    this.humanPlayerId = null;
    this.botPlayerIds = new Set();
    
    // Logging configuration
    this.debugMode = localStorage.getItem('pokerAdapterDebug') === 'true';
    this.logPrefix = '[PokerAdapter]';
  }

  /**
   * Initialize the adapter with game settings
   * @param {Object} gameSettings - Game configuration
   * @param {Object} playerInfo - Player information
   * @param {boolean} vsBot - Whether playing against bots
   * @returns {Promise<string>} Game ID
   */
  async initialize(gameSettings, playerInfo, vsBot = false) {
    this.log('Initializing adapter', { mode: this.mode, vsBot, gameSettings });
    
    try {
      if (this.mode === 'backend') {
        return await this.initializeBackend(gameSettings, playerInfo, vsBot);
      }
      return await this.initializeLocal(gameSettings, playerInfo, vsBot);
    } catch (error) {
      this.logError('Initialization failed', error);
      throw error;
    }
  }

  /**
   * Initialize local game mode
   */
  async initializeLocal(gameSettings, playerInfo, vsBot) {
    this.log('Initializing local game');
    
    // Generate a local game ID
    this.gameId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Initialize local state structure matching backend format
    this.localState = {
      id: this.gameId,
      seats: Array(gameSettings.maxPlayers || 9).fill(null).map((_, i) => ({
        seatIndex: i,
        isEmpty: true,
      })),
      spectators: [],
      pot: 0,
      totalPot: 0,
      pots: [],
      communityCards: [],
      currentBettingRound: 'WAITING',
      currentPlayerIndex: -1,
      dealerIndex: -1,
      currentHighestBet: 0,
      minRaiseAmount: gameSettings.blinds?.big || 10,
      bigBlind: gameSettings.blinds?.big || 10,
      smallBlind: gameSettings.blinds?.small || 5,
      gameSettings: gameSettings,
      turnStartTime: null,
      timeBank: gameSettings.timeBank || 60,
      winners: [],
      handOverMessage: '',
      vsBot: vsBot,
      localPlayerInfo: playerInfo
    };

    // Initialize bots for local mode if needed
    if (vsBot) {
      this.initializeLocalBots(gameSettings, playerInfo);
    }

    this.log('Local game initialized', { gameId: this.gameId });
    return this.gameId;
  }

  /**
   * Initialize backend game mode with socket connection
   */
  async initializeBackend(gameSettings, playerInfo, vsBot) {
    this.log('Initializing backend game');
    
    // Establish socket connection
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';
    this.socket = io(serverUrl, {
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 10000);
      
      // Setup socket event listeners
      this.setupSocketListeners();
      
      // Wait for connection
      this.socket.on('connect', () => {
        clearTimeout(timeout);
        this.isConnected = true;
        this.log('Socket connected');
        
        // Create game on backend
        this.socket.emit('CREATE_GAME', {
          playerInfo,
          gameSettings: {
            ...gameSettings,
            gameType: vsBot ? 'bot' : 'local',
            vsBot,
            botConfig: vsBot ? {
              numBots: (gameSettings.maxPlayers || 9) - 1,
              difficulty: gameSettings.botDifficulty || 'medium',
              thinkTime: { min: 500, max: 2500 }
            } : undefined
          }
        }, (response) => {
          if (response.status === 'ok') {
            this.gameId = response.gameId;
            this.log('Game created', { gameId: this.gameId });
            
            // Auto-join and take seat for creator
            this.autoJoinAndSeat(playerInfo, gameSettings.humanSeatIndex || 0)
              .then(() => {
                // Auto-start for bot games
                if (vsBot) {
                  this.socket.emit('START_GAME', this.gameId, (startResponse) => {
                    if (startResponse?.status === 'ok') {
                      this.log('Game started');
                      resolve(this.gameId);
                    } else {
                      reject(new Error('Failed to start game'));
                    }
                  });
                } else {
                  resolve(this.gameId);
                }
              })
              .catch(reject);
          } else {
            reject(new Error(response.message || 'Failed to create game'));
          }
        });
      });
      
      // Handle connection errors
      this.socket.on('connect_error', (error) => {
        clearTimeout(timeout);
        this.logError('Connection error', error);
        reject(error);
      });
    });
  }

  /**
   * Auto-join game and take seat
   */
  async autoJoinAndSeat(playerInfo, seatIndex) {
    return new Promise((resolve, reject) => {
      // First join as spectator
      this.socket.emit('JOIN_GAME', {
        gameId: this.gameId,
        playerInfo
      }, (joinResponse) => {
        if (joinResponse?.status === 'ok') {
          // Then take seat
          this.socket.emit('TAKE_SEAT', {
            gameId: this.gameId,
            seatIndex
          }, (seatResponse) => {
            if (seatResponse?.status === 'ok') {
              this.log('Joined and seated', { seatIndex });
              resolve();
            } else {
              reject(new Error('Failed to take seat'));
            }
          });
        } else {
          reject(new Error('Failed to join game'));
        }
      });
    });
  }

  /**
   * Setup socket event listeners
   */
  setupSocketListeners() {
    if (!this.socket) return;
    
    // Game state updates
    this.socket.on('GAME_STATE_UPDATE', (data) => {
      this.handleGameStateUpdate(data);
    });
    
    // Messages
    this.socket.on('MESSAGE', (data) => {
      this.handleMessage(data);
    });
    
    // Player events
    this.socket.on('PLAYER_JOINED', (data) => {
      this.log('Player joined', data);
    });
    
    this.socket.on('PLAYER_LEFT', (data) => {
      this.log('Player left', data);
    });
    
    // Connection events
    this.socket.on('disconnect', (reason) => {
      this.handleDisconnect(reason);
    });
    
    this.socket.on('reconnect', (attemptNumber) => {
      this.handleReconnect(attemptNumber);
    });
    
    // Error events
    this.socket.on('error', (error) => {
      this.handleError(error);
    });
    
    this.socket.on('GAME_NOT_FOUND', () => {
      this.handleError(new Error('Game not found'));
    });
  }

  /**
   * Handle game state update from server
   */
  handleGameStateUpdate(data) {
    const { newState, actionLog } = data;
    this.log('Game state update received', { 
      round: newState.currentBettingRound,
      currentPlayer: newState.currentPlayerIndex 
    });
    
    this.serverState = newState;
    this.stateVersion++;
    
    // Notify all state update callbacks
    this.stateUpdateCallbacks.forEach(callback => {
      try {
        callback(newState, actionLog);
      } catch (error) {
        this.logError('State update callback error', error);
      }
    });
  }

  /**
   * Handle messages from server
   */
  handleMessage(data) {
    this.log('Message received', data);
    this.messageCallbacks.forEach(callback => {
      try {
        callback(data.text || data.message || data);
      } catch (error) {
        this.logError('Message callback error', error);
      }
    });
  }

  /**
   * Handle disconnection
   */
  handleDisconnect(reason) {
    this.isConnected = false;
    this.logError('Disconnected', { reason });
    
    if (reason === 'io server disconnect') {
      // Server disconnected us, don't auto-reconnect
      this.switchToLocalMode('Server disconnected');
    }
  }

  /**
   * Handle reconnection
   */
  handleReconnect(attemptNumber) {
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.log('Reconnected', { attemptNumber });
    
    // Re-join game if we have a game ID
    if (this.gameId && this.localState?.localPlayerInfo) {
      this.autoJoinAndSeat(
        this.localState.localPlayerInfo,
        this.localState.localPlayerInfo.seatIndex || 0
      ).catch(error => {
        this.logError('Failed to rejoin after reconnect', error);
        this.switchToLocalMode('Failed to rejoin game');
      });
    }
  }

  /**
   * Handle errors
   */
  handleError(error) {
    this.logError('Socket error', error);
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (err) {
        console.error('Error callback failed', err);
      }
    });
  }

  /**
   * Switch to local mode as fallback
   */
  switchToLocalMode(reason = 'Connection lost') {
    if (this.mode === 'local') return; // Already in local mode
    
    this.log('Switching to local mode', { reason });
    this.mode = 'local';
    
    // Convert server state to local state if available
    if (this.serverState) {
      this.localState = { ...this.serverState };
    }
    
    // Notify about mode switch
    this.messageCallbacks.forEach(callback => {
      callback(`${reason}. Continuing in offline mode.`);
    });
    
    // Clean up socket
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Register callback for state updates
   */
  onStateUpdate(callback) {
    this.stateUpdateCallbacks.push(callback);
    return () => {
      this.stateUpdateCallbacks = this.stateUpdateCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Register callback for messages
   */
  onMessage(callback) {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Register callback for errors
   */
  onError(callback) {
    this.errorCallbacks.push(callback);
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Get current game state
   */
  getState() {
    if (this.mode === 'backend') {
      return this.serverState;
    }
    return this.localState;
  }

  /**
   * Perform a game action (fold, check, call, bet, raise)
   * @param {string} action - Action type
   * @param {Object} details - Action details (amount for bet/raise)
   * @returns {Promise<void>}
   */
  async performAction(action, details = {}) {
    this.log('Performing action', { action, details, mode: this.mode });
    
    try {
      if (this.mode === 'backend') {
        return await this.performBackendAction(action, details);
      }
      return await this.performLocalAction(action, details);
    } catch (error) {
      this.logError('Action failed', error);
      throw error;
    }
  }

  /**
   * Perform action in backend mode
   */
  async performBackendAction(action, details) {
    if (!this.socket || !this.isConnected) {
      this.logError('Cannot perform action - not connected');
      this.switchToLocalMode('Connection lost');
      return this.performLocalAction(action, details);
    }
    
    return new Promise((resolve, reject) => {
      const actionId = `${Date.now()}_${action}`;
      
      // Store pending action for tracking
      this.pendingActions.set(actionId, {
        action,
        details,
        timestamp: Date.now(),
        resolve,
        reject
      });
      
      // Send action to server
      this.socket.emit('PLAYER_ACTION', {
        gameId: this.gameId,
        action: action.toUpperCase(),
        details
      });
      
      // Set timeout for action response
      setTimeout(() => {
        if (this.pendingActions.has(actionId)) {
          this.pendingActions.delete(actionId);
          reject(new Error(`Action timeout: ${action}`));
        }
      }, 5000);
    });
  }

  /**
   * Perform action in local mode
   * This simulates the backend behavior for offline play
   */
  async performLocalAction(action, details) {
    if (!this.localState) {
      throw new Error('No local game state');
    }
    
    // Get current player
    const currentPlayerIndex = this.localState.currentPlayerIndex;
    if (currentPlayerIndex < 0) {
      throw new Error('No current player');
    }
    
    const seats = this.localState.seats;
    const currentSeat = seats[currentPlayerIndex];
    if (!currentSeat || currentSeat.isEmpty) {
      throw new Error('Invalid current player seat');
    }
    
    const player = currentSeat.player;
    
    // Simulate action processing
    switch (action.toUpperCase()) {
      case 'FOLD':
        player.isFolded = true;
        player.hasActedThisRound = true;
        break;
        
      case 'CHECK':
        if (player.currentBet < this.localState.currentHighestBet) {
          throw new Error('Cannot check - must call or fold');
        }
        player.hasActedThisRound = true;
        break;
        
      case 'CALL':
        const callAmount = this.localState.currentHighestBet - player.currentBet;
        if (callAmount > player.stack) {
          // All-in
          player.currentBet += player.stack;
          player.totalBetInHand += player.stack;
          player.stack = 0;
          player.isAllIn = true;
        } else {
          player.currentBet = this.localState.currentHighestBet;
          player.totalBetInHand += callAmount;
          player.stack -= callAmount;
        }
        player.hasActedThisRound = true;
        break;
        
      case 'BET':
      case 'RAISE':
        const betAmount = details.amount || this.localState.minRaiseAmount;
        if (betAmount > player.stack) {
          // All-in
          this.localState.currentHighestBet = player.currentBet + player.stack;
          player.totalBetInHand += player.stack;
          player.currentBet += player.stack;
          player.stack = 0;
          player.isAllIn = true;
        } else {
          const raiseBy = betAmount - player.currentBet;
          this.localState.currentHighestBet = betAmount;
          player.currentBet = betAmount;
          player.totalBetInHand += raiseBy;
          player.stack -= raiseBy;
        }
        player.hasActedThisRound = true;
        this.localState.minRaiseAmount = betAmount + (betAmount - this.localState.currentHighestBet);
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    // Update pot
    this.updateLocalPot();
    
    // Advance to next player or round
    this.advanceLocalGame();
    
    // Notify state update callbacks
    const clientState = this.transformBackendToClient(this.localState);
    this.stateUpdateCallbacks.forEach(callback => {
      callback(clientState, { message: `${player.name} ${action}s` });
    });
    
    // If it's now a bot's turn, schedule bot action
    if (this.localState.vsBot) {
      this.scheduleBotAction();
    }
  }

  /**
   * Update pot in local mode
   */
  updateLocalPot() {
    let totalPot = 0;
    this.localState.seats.forEach(seat => {
      if (!seat.isEmpty) {
        totalPot += seat.player.totalBetInHand;
      }
    });
    this.localState.pot = totalPot;
    this.localState.totalPot = totalPot;
  }

  /**
   * Advance game in local mode
   */
  advanceLocalGame() {
    // Check if betting round is complete
    const activePlayers = this.localState.seats.filter(s => 
      !s.isEmpty && !s.player.isFolded && !s.player.isAllIn
    );
    
    const allActed = activePlayers.every(s => s.player.hasActedThisRound);
    const betsEqual = activePlayers.every(s => 
      s.player.currentBet === this.localState.currentHighestBet
    );
    
    if (allActed && betsEqual) {
      // Advance to next betting round
      this.advanceToNextRound();
    } else {
      // Find next player
      this.moveToNextPlayer();
    }
  }

  /**
   * Move to next player in local mode
   */
  moveToNextPlayer() {
    const seats = this.localState.seats;
    let nextIndex = (this.localState.currentPlayerIndex + 1) % seats.length;
    let attempts = 0;
    
    while (attempts < seats.length) {
      const seat = seats[nextIndex];
      if (!seat.isEmpty && !seat.player.isFolded && !seat.player.isAllIn) {
        this.localState.currentPlayerIndex = nextIndex;
        return;
      }
      nextIndex = (nextIndex + 1) % seats.length;
      attempts++;
    }
    
    // No valid next player - advance round
    this.advanceToNextRound();
  }

  /**
   * Advance to next betting round in local mode
   */
  advanceToNextRound() {
    // Reset player states for new round
    this.localState.seats.forEach(seat => {
      if (!seat.isEmpty) {
        seat.player.currentBet = 0;
        seat.player.hasActedThisRound = false;
      }
    });
    
    this.localState.currentHighestBet = 0;
    this.localState.minRaiseAmount = this.localState.bigBlind;
    
    // Advance betting round
    const rounds = ['PREFLOP', 'FLOP', 'TURN', 'RIVER', 'SHOWDOWN'];
    const currentIndex = rounds.indexOf(this.localState.currentBettingRound);
    
    if (currentIndex >= 0 && currentIndex < rounds.length - 1) {
      this.localState.currentBettingRound = rounds[currentIndex + 1];
      
      // Deal community cards
      if (this.localState.currentBettingRound === 'FLOP') {
        this.dealCommunityCards(3);
      } else if (this.localState.currentBettingRound === 'TURN' || 
                 this.localState.currentBettingRound === 'RIVER') {
        this.dealCommunityCards(1);
      }
      
      // Set first player to act
      this.setFirstPlayerToAct();
    } else {
      // Hand is over
      this.localState.currentBettingRound = 'HAND_OVER';
      this.localState.currentPlayerIndex = -1;
      // Award pot logic would go here
    }
  }

  /**
   * Deal community cards in local mode
   */
  dealCommunityCards(count) {
    // This is a simplified version - real implementation would use proper deck
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const suits = ['h', 'd', 'c', 's'];
    
    for (let i = 0; i < count; i++) {
      const rank = ranks[Math.floor(Math.random() * ranks.length)];
      const suit = suits[Math.floor(Math.random() * suits.length)];
      this.localState.communityCards.push(rank + suit);
    }
  }

  /**
   * Set first player to act in local mode
   */
  setFirstPlayerToAct() {
    const dealerIndex = this.localState.dealerIndex;
    const seats = this.localState.seats;
    let startIndex = (dealerIndex + 1) % seats.length;
    
    // For preflop, start from small blind; otherwise from dealer + 1
    if (this.localState.currentBettingRound !== 'PREFLOP') {
      for (let i = 0; i < seats.length; i++) {
        const index = (startIndex + i) % seats.length;
        const seat = seats[index];
        if (!seat.isEmpty && !seat.player.isFolded && !seat.player.isAllIn) {
          this.localState.currentPlayerIndex = index;
          return;
        }
      }
    }
  }

  /**
   * Schedule bot action in local mode
   */
  scheduleBotAction() {
    if (!this.localState.vsBot) return;
    
    const currentSeat = this.localState.seats[this.localState.currentPlayerIndex];
    if (!currentSeat || currentSeat.isEmpty) return;
    
    // Check if current player is a bot
    const isHuman = currentSeat.player.id === this.getHumanPlayerId();
    if (isHuman) return;
    
    // Schedule bot action with random delay
    const delay = Math.random() * 2000 + 500; // 500-2500ms
    const timerId = setTimeout(() => {
      this.performBotAction();
      this.botTimers.delete(timerId);
    }, delay);
    
    this.botTimers.set(timerId, true);
  }

  /**
   * Perform bot action in local mode
   */
  async performBotAction() {
    if (!this.localState) return;
    
    const currentSeat = this.localState.seats[this.localState.currentPlayerIndex];
    if (!currentSeat || currentSeat.isEmpty) return;
    
    const currentPlayer = currentSeat.player;
    if (!this.isBot(currentPlayer.id)) return;
    
    try {
      // Get bot decision using appropriate bot logic
      const decision = await this.getBotDecision(this.localState, currentPlayer.id);
      
      if (decision && decision.action) {
        this.log(`Bot ${currentPlayer.name} decided: ${decision.action}`, decision);
        
        // Perform the bot's action
        const details = decision.amount ? { amount: decision.amount } : {};
        await this.performLocalAction(decision.action, details);
      } else {
        this.logError('Bot decision was invalid', decision);
        // Fallback to check/fold
        await this.performLocalAction('check').catch(() => 
          this.performLocalAction('fold')
        );
      }
    } catch (error) {
      this.logError('Bot action failed', error);
      
      // Emergency fallback
      try {
        await this.performLocalAction('check');
      } catch (checkError) {
        await this.performLocalAction('fold');
      }
    }
  }

  /**
   * Initialize bots for local mode
   */
  initializeLocalBots(gameSettings, playerInfo) {
    const maxPlayers = gameSettings.maxPlayers || 9;
    const numBots = maxPlayers - 1; // Human + bots = maxPlayers
    
    // Initialize poker bot for 6/9-max games
    if (maxPlayers > 2) {
      this.pokerBot = new PokerBot();
      this.log('Initialized PokerBot for local game');
    }
    
    // Set human player ID
    this.humanPlayerId = `player1`;
    
    // Create players in seats
    for (let i = 0; i < maxPlayers; i++) {
      const playerId = `player${i + 1}`;
      const isHuman = i === 0; // First player is human
      const playerName = isHuman ? (playerInfo.name || 'You') : `Bot${i}`;
      
      const player = {
        id: playerId,
        userId: isHuman ? playerInfo.userId : playerId,
        name: playerName,
        cards: [],
        stack: gameSettings.startingStack || 1000,
        currentBet: 0,
        totalBetInHand: 0,
        isFolded: false,
        isAllIn: false,
        isDealer: false,
        isSB: false,
        isBB: false,
        hasActedThisRound: false,
        positionName: '',
        isBot: !isHuman
      };
      
      // Seat the player
      this.localState.seats[i] = {
        seatIndex: i,
        isEmpty: false,
        player: player
      };
      
      if (!isHuman) {
        this.botPlayerIds.add(playerId);
      }
    }
    
    this.log(`Initialized ${numBots} bots for local game`);
  }

  /**
   * Get human player ID for bot games
   */
  getHumanPlayerId() {
    return this.humanPlayerId || 'player1';
  }

  /**
   * Check if a player is a bot
   */
  isBot(playerId) {
    if (this.mode === 'backend') {
      // In backend mode, check player properties
      const seats = this.serverState?.seats || [];
      const seat = seats.find(s => !s.isEmpty && s.player.id === playerId);
      return seat?.player?.isBot || false;
    }
    
    // In local mode, check our bot set
    return this.botPlayerIds.has(playerId);
  }

  /**
   * Get bot decision for local mode
   */
  async getBotDecision(gameState, playerId) {
    if (!this.isBot(playerId)) {
      throw new Error(`${playerId} is not a bot`);
    }
    
    const clientState = this.transformBackendToClient(gameState);
    const currentPlayer = clientState.players.find(p => p.id === playerId);
    
    if (!currentPlayer) {
      throw new Error(`Bot player ${playerId} not found`);
    }
    
    // Use different bot logic based on game size
    if (clientState.numPlayers === 2) {
      // Heads-up: Use Slumbot
      return this.getSlumbotDecision(clientState, currentPlayer);
    } else {
      // Multi-player: Use PokerBot
      return this.getPokerBotDecision(clientState, currentPlayer);
    }
  }

  /**
   * Get Slumbot decision for heads-up games
   */
  async getSlumbotDecision(gameState, player) {
    try {
      if (!this.slumbotSession) {
        await SlumbotAPI.resetSession();
        this.slumbotSession = true;
      }
      
      const action = await SlumbotAPI.getAction(
        gameState,
        player.cards,
        gameState.communityCards,
        gameState.currentBettingRound,
        gameState.pot,
        player.stack,
        gameState.currentHighestBet - player.currentBet
      );
      
      return action;
    } catch (error) {
      this.logError('Slumbot API error, falling back to simple logic', error);
      return this.getSimpleBotDecision(gameState, player);
    }
  }

  /**
   * Get PokerBot decision for multi-player games
   */
  getPokerBotDecision(gameState, player) {
    if (!this.pokerBot) {
      return this.getSimpleBotDecision(gameState, player);
    }
    
    try {
      const action = this.pokerBot.getAction({
        gameState: gameState,
        player: player,
        communityCards: gameState.communityCards,
        currentBettingRound: gameState.currentBettingRound,
        pot: gameState.pot,
        currentHighestBet: gameState.currentHighestBet,
        minRaiseAmount: gameState.minRaiseAmount
      });
      
      return action;
    } catch (error) {
      this.logError('PokerBot error, falling back to simple logic', error);
      return this.getSimpleBotDecision(gameState, player);
    }
  }

  /**
   * Simple fallback bot logic
   */
  getSimpleBotDecision(gameState, player) {
    const callAmount = Math.max(0, gameState.currentHighestBet - player.currentBet);
    const random = Math.random();
    
    if (callAmount === 0) {
      // No bet to face
      return random < 0.7 ? { action: 'check' } : { 
        action: 'bet', 
        amount: Math.min(Math.floor(gameState.pot * 0.5), player.stack)
      };
    } else {
      // Facing a bet
      if (callAmount >= player.stack) {
        // All-in decision
        return random < 0.3 ? { action: 'call' } : { action: 'fold' };
      }
      
      if (random < 0.2) {
        return { action: 'fold' };
      } else if (random < 0.8) {
        return { action: 'call' };
      } else {
        return { 
          action: 'raise', 
          amount: Math.min(gameState.currentHighestBet * 2, player.stack)
        };
      }
    }
  }

  /**
   * Start a new hand
   * @returns {Promise<void>}
   */
  async startNewHand() {
    this.log('Starting new hand', { mode: this.mode });
    
    if (this.mode === 'backend') {
      return this.startNewHandBackend();
    }
    return this.startNewHandLocal();
  }

  /**
   * Start new hand in backend mode
   */
  async startNewHandBackend() {
    if (!this.socket || !this.isConnected) {
      throw new Error('Not connected to backend');
    }
    
    return new Promise((resolve, reject) => {
      this.socket.emit('START_HAND', this.gameId, (response) => {
        if (response?.status === 'ok') {
          resolve();
        } else {
          reject(new Error(response?.message || 'Failed to start hand'));
        }
      });
    });
  }

  /**
   * Start new hand in local mode
   */
  async startNewHandLocal() {
    if (!this.localState) {
      throw new Error('No local game state');
    }
    
    // Reset for new hand
    this.localState.currentBettingRound = 'PREFLOP';
    this.localState.communityCards = [];
    this.localState.pot = 0;
    this.localState.totalPot = 0;
    this.localState.currentHighestBet = this.localState.bigBlind;
    this.localState.minRaiseAmount = this.localState.bigBlind;
    
    // Reset players
    this.localState.seats.forEach(seat => {
      if (!seat.isEmpty) {
        seat.player.cards = this.dealHoleCards();
        seat.player.currentBet = 0;
        seat.player.totalBetInHand = 0;
        seat.player.isFolded = false;
        seat.player.isAllIn = false;
        seat.player.hasActedThisRound = false;
      }
    });
    
    // Move dealer button
    this.moveButton();
    
    // Post blinds
    this.postBlinds();
    
    // Set first player to act
    this.setFirstPlayerToAct();
    
    // Notify state update
    const clientState = this.transformBackendToClient(this.localState);
    this.stateUpdateCallbacks.forEach(callback => {
      callback(clientState, { message: 'New hand started' });
    });
    
    // Schedule first bot action if needed
    if (this.localState.vsBot) {
      this.scheduleBotAction();
    }
  }

  /**
   * Deal hole cards for a player
   */
  dealHoleCards() {
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const suits = ['h', 'd', 'c', 's'];
    const cards = [];
    
    // Simple random cards - real implementation would use proper deck
    for (let i = 0; i < 2; i++) {
      const rank = ranks[Math.floor(Math.random() * ranks.length)];
      const suit = suits[Math.floor(Math.random() * suits.length)];
      cards.push(rank + suit);
    }
    
    return cards;
  }

  /**
   * Move dealer button
   */
  moveButton() {
    const seats = this.localState.seats;
    const nonEmptySeats = seats.map((s, i) => ({ seat: s, index: i }))
      .filter(s => !s.seat.isEmpty);
    
    if (nonEmptySeats.length < 2) return;
    
    // Find current dealer
    let currentDealerIndex = nonEmptySeats.findIndex(s => s.seat.player.isDealer);
    if (currentDealerIndex === -1) currentDealerIndex = 0;
    
    // Move to next player
    const nextDealerIndex = (currentDealerIndex + 1) % nonEmptySeats.length;
    
    // Clear all position flags
    seats.forEach(seat => {
      if (!seat.isEmpty) {
        seat.player.isDealer = false;
        seat.player.isSB = false;
        seat.player.isBB = false;
      }
    });
    
    // Set new positions
    const dealerSeat = nonEmptySeats[nextDealerIndex];
    dealerSeat.seat.player.isDealer = true;
    this.localState.dealerIndex = dealerSeat.index;
    
    // Set blinds
    if (nonEmptySeats.length === 2) {
      // Heads up - dealer is SB
      dealerSeat.seat.player.isSB = true;
      nonEmptySeats[(nextDealerIndex + 1) % 2].seat.player.isBB = true;
    } else {
      // 3+ players
      nonEmptySeats[(nextDealerIndex + 1) % nonEmptySeats.length].seat.player.isSB = true;
      nonEmptySeats[(nextDealerIndex + 2) % nonEmptySeats.length].seat.player.isBB = true;
    }
  }

  /**
   * Post blinds
   */
  postBlinds() {
    this.localState.seats.forEach(seat => {
      if (!seat.isEmpty) {
        if (seat.player.isSB) {
          const sbAmount = Math.min(this.localState.smallBlind, seat.player.stack);
          seat.player.currentBet = sbAmount;
          seat.player.totalBetInHand = sbAmount;
          seat.player.stack -= sbAmount;
          if (seat.player.stack === 0) seat.player.isAllIn = true;
        } else if (seat.player.isBB) {
          const bbAmount = Math.min(this.localState.bigBlind, seat.player.stack);
          seat.player.currentBet = bbAmount;
          seat.player.totalBetInHand = bbAmount;
          seat.player.stack -= bbAmount;
          if (seat.player.stack === 0) seat.player.isAllIn = true;
        }
      }
    });
    
    this.updateLocalPot();
  }

  /**
   * Update game settings
   */
  async updateSettings(newSettings) {
    this.log('Updating settings', newSettings);
    
    if (this.mode === 'backend') {
      return this.updateSettingsBackend(newSettings);
    }
    return this.updateSettingsLocal(newSettings);
  }

  /**
   * Update settings in backend mode
   */
  async updateSettingsBackend(newSettings) {
    if (!this.socket || !this.isConnected) {
      throw new Error('Not connected to backend');
    }
    
    return new Promise((resolve, reject) => {
      this.socket.emit('UPDATE_GAME_SETTINGS', {
        gameId: this.gameId,
        newSettings
      }, (response) => {
        if (response?.status === 'ok') {
          resolve();
        } else {
          reject(new Error(response?.message || 'Failed to update settings'));
        }
      });
    });
  }

  /**
   * Update settings in local mode
   */
  async updateSettingsLocal(newSettings) {
    if (!this.localState) {
      throw new Error('No local game state');
    }
    
    // Update game settings
    this.localState.gameSettings = {
      ...this.localState.gameSettings,
      ...newSettings
    };
    
    // Update specific properties if provided
    if (newSettings.blinds) {
      if (newSettings.blinds.small) this.localState.smallBlind = newSettings.blinds.small;
      if (newSettings.blinds.big) this.localState.bigBlind = newSettings.blinds.big;
    }
    
    if (newSettings.timeBank !== undefined) {
      this.localState.timeBank = newSettings.timeBank;
    }
    
    // Notify state update
    const clientState = this.transformBackendToClient(this.localState);
    this.stateUpdateCallbacks.forEach(callback => {
      callback(clientState, { message: 'Settings updated' });
    });
  }

  /**
   * Cleanup and destroy adapter
   */
  destroy() {
    this.log('Destroying adapter');
    
    // Clear all timers
    this.botTimers.forEach(timer => clearTimeout(timer));
    this.botTimers.clear();
    
    // Clear callbacks
    this.stateUpdateCallbacks = [];
    this.messageCallbacks = [];
    this.errorCallbacks = [];
    
    // Disconnect socket
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    // Clean up bot resources
    if (this.slumbotSession) {
      try {
        SlumbotAPI.resetSession();
      } catch (error) {
        this.logError('Error resetting Slumbot session', error);
      }
      this.slumbotSession = null;
    }
    
    this.pokerBot = null;
    this.botPlayerIds.clear();
    this.humanPlayerId = null;
    
    // Clear state
    this.localState = null;
    this.serverState = null;
    this.pendingActions.clear();
  }

  /**
   * Logging utilities
   */
  log(...args) {
    if (this.debugMode) {
      console.log(this.logPrefix, ...args);
    }
  }

  logError(...args) {
    console.error(this.logPrefix, ...args);
  }

  /**
   * Transform backend state to client format
   * Maps backend game state structure to match PokerGame.jsx expectations
   */
  transformBackendToClient(backendState) {
    if (!backendState) return null;
    
    // Extract players from seats array
    const players = backendState.seats
      .filter(seat => !seat.isEmpty)
      .map((seat, index) => ({
        // Core properties
        id: seat.player.id,
        name: seat.player.name,
        cards: seat.player.cards || [],
        stack: seat.player.stack,
        currentBet: seat.player.currentBet || 0,
        totalBetInHand: seat.player.totalBetInHand || 0,
        isFolded: seat.player.isFolded || false,
        isAllIn: seat.player.isAllIn || false,
        
        // Position properties
        isDealer: seat.player.isDealer || false,
        isSB: seat.player.isSB || false,
        isBB: seat.player.isBB || false,
        positionName: seat.player.positionName || '',
        
        // Turn state
        isTurn: false, // Will be set below
        hasActedThisRound: seat.player.hasActedThisRound || false,
        
        // Additional properties for compatibility
        seatIndex: seat.seatIndex,
        originalIndex: index // Track position in filtered array
      }));
    
    // Set current player's turn
    if (backendState.currentPlayerIndex >= 0) {
      // Backend provides seat index, need to find in players array
      const currentSeat = backendState.seats[backendState.currentPlayerIndex];
      if (currentSeat && !currentSeat.isEmpty) {
        const playerIndex = players.findIndex(p => p.id === currentSeat.player.id);
        if (playerIndex >= 0) {
          players[playerIndex].isTurn = true;
        }
      }
    }
    
    // Transform pots
    const calculatedPots = (backendState.pots || []).map(pot => ({
      amount: pot.amount,
      eligiblePlayerIds: pot.eligiblePlayerIds || [],
      winnerIds: pot.winnerIds || [],
      winnerHandDescr: pot.winnerHandDescr || ''
    }));
    
    // Build client state matching PokerGame.jsx structure
    return {
      // Player data
      players,
      numPlayers: players.length,
      
      // Cards and deck
      communityCards: backendState.communityCards || [],
      deck: [], // Client doesn't need deck
      
      // Pot information
      pot: backendState.pot || 0,
      totalPot: backendState.totalPot || backendState.pot || 0,
      calculatedPots,
      
      // Game flow
      currentBettingRound: backendState.currentBettingRound || 'WAITING',
      currentPlayerIndex: players.findIndex(p => p.isTurn),
      dealerIndex: this.findDealerIndex(players),
      
      // Betting state
      currentHighestBet: backendState.currentHighestBet || 0,
      minRaiseAmount: backendState.minRaiseAmount || backendState.bigBlind || 10,
      
      // Game settings
      bigBlind: backendState.bigBlind || 10,
      smallBlind: backendState.smallBlind || 5,
      gameSettings: backendState.gameSettings || {},
      
      // Client-specific properties
      lastAggressorIndex: -1,
      actionClosingPlayerIndex: -1,
      handHistory: [],
      message: '',
      
      // Hand over state
      winners: backendState.winners || [],
      handOverMessage: backendState.handOverMessage || '',
      justAwardedPot: false,
      pendingPotAward: false,
      
      // Run it twice (if applicable)
      ritFirstRun: backendState.ritFirstRun || null,
      ritSecondRun: backendState.ritSecondRun || null,
      
      // Timer information
      turnStartTime: backendState.turnStartTime || null,
      timeBank: backendState.timeBank || 60
    };
  }
  
  /**
   * Transform client state to backend format
   * Used when switching from local to backend mode
   */
  transformClientToBackend(clientState) {
    if (!clientState) return null;
    
    // Create seats array from players
    const maxSeats = clientState.gameSettings?.maxPlayers || 9;
    const seats = Array(maxSeats).fill(null).map((_, index) => ({
      seatIndex: index,
      isEmpty: true
    }));
    
    // Place players in seats
    clientState.players.forEach(player => {
      const seatIndex = player.seatIndex || seats.findIndex(s => s.isEmpty);
      if (seatIndex >= 0 && seatIndex < seats.length) {
        seats[seatIndex] = {
          seatIndex,
          isEmpty: false,
          player: {
            id: player.id,
            userId: player.userId || player.id,
            name: player.name,
            cards: player.cards || [],
            stack: player.stack,
            currentBet: player.currentBet || 0,
            totalBetInHand: player.totalBetInHand || 0,
            isFolded: player.isFolded || false,
            isAllIn: player.isAllIn || false,
            isDealer: player.isDealer || false,
            isSB: player.isSB || false,
            isBB: player.isBB || false,
            hasActedThisRound: player.hasActedThisRound || false,
            positionName: player.positionName || ''
          }
        };
      }
    });
    
    // Transform pots
    const pots = (clientState.calculatedPots || []).map(pot => ({
      amount: pot.amount,
      eligiblePlayerIds: pot.eligiblePlayerIds || [],
      size: pot.amount // Backend uses 'size' property
    }));
    
    return {
      id: clientState.id || this.gameId,
      seats,
      spectators: [],
      hostId: null,
      pot: clientState.pot || 0,
      totalPot: clientState.totalPot || clientState.pot || 0,
      pots,
      communityCards: clientState.communityCards || [],
      currentBettingRound: clientState.currentBettingRound || 'WAITING',
      currentPlayerIndex: this.findCurrentSeatIndex(clientState, seats),
      dealerIndex: this.findDealerSeatIndex(seats),
      currentHighestBet: clientState.currentHighestBet || 0,
      minRaiseAmount: clientState.minRaiseAmount || clientState.bigBlind || 10,
      bigBlind: clientState.bigBlind || 10,
      smallBlind: clientState.smallBlind || 5,
      gameSettings: clientState.gameSettings || {},
      turnStartTime: clientState.turnStartTime || null,
      timeBank: clientState.timeBank || 60,
      winners: clientState.winners || [],
      handOverMessage: clientState.handOverMessage || ''
    };
  }
  
  /**
   * Helper to find dealer index in players array
   */
  findDealerIndex(players) {
    const dealerIndex = players.findIndex(p => p.isDealer);
    return dealerIndex >= 0 ? dealerIndex : 0;
  }
  
  /**
   * Helper to find current seat index from client state
   */
  findCurrentSeatIndex(clientState, seats) {
    if (clientState.currentPlayerIndex < 0) return -1;
    
    const currentPlayer = clientState.players[clientState.currentPlayerIndex];
    if (!currentPlayer) return -1;
    
    const seat = seats.find(s => !s.isEmpty && s.player.id === currentPlayer.id);
    return seat ? seat.seatIndex : -1;
  }
  
  /**
   * Helper to find dealer seat index
   */
  findDealerSeatIndex(seats) {
    const dealerSeat = seats.find(s => !s.isEmpty && s.player.isDealer);
    return dealerSeat ? dealerSeat.seatIndex : -1;
  }
}

export default PokerGameAdapter;