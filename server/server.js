const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors'); // Import cors
const { createClient } = require('@supabase/supabase-js');
// TEMPORARY – toggle new engine via env
const gameEngine = require('./newGameEngine');
const { GamePhase, SocketEvents } = require('./constants');
const statsTracker = require('./game/statsTracker'); // CORRECT PATH
const handHistory = require('./game/handHistory');
const { BotManager } = require('./bots/BotManager');

// Load environment variables and initialize Supabase
require('dotenv').config();
let supabase; // make accessible for routes
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseKey) {
    console.error("FATAL: Supabase URL or Service Key is missing. Please check your .env file in the /server directory.");
    process.exit(1); // Exit if Supabase isn't configured, as stats are a core feature.
} else {
    supabase = createClient(supabaseUrl, supabaseKey);
    statsTracker.init(supabase); // Initialize the stats tracker with the client
    handHistory.init(supabase);
    console.log("Supabase client initialized and passed to statsTracker.");
}

const app = express();
const server = http.createServer(app);

// Configure CORS
// Adjust the origin to your frontend's URL. 
// For development with Vite default, it's usually http://localhost:3000 or http://localhost:5173
// For production, you'll want to restrict this to your actual frontend domain.
const corsOptions = {
  origin: [process.env.CORS_ORIGIN, "http://localhost:3000", "http://localhost:5173"].filter(Boolean), // Add your frontend dev port
  methods: ["GET", "POST"]
};

console.log('Configuring CORS for origins:', corsOptions.origin);

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions
});

const PORT = process.env.PORT || 4000; // Ensure this is different from your frontend port

// --- Game Logic Helpers (simplified and adapted from PokerGame.jsx) ---
const BIG_BLIND_AMOUNT = 10; // Example, will come from gameSettings
const SMALL_BLIND_AMOUNT = 5; // Example

// Simplified player initialization for the server
const initializeServerPlayer = (socketId, playerInfo, stack) => ({
  id: socketId, // The temporary, session-based ID
  userId: playerInfo.userId, // The permanent, account-based ID for stats
  name: playerInfo.name,
  cards: [],
  stack,
  currentBet: 0,
  totalBetInHand: 0,
  isFolded: false,
  isAllIn: false,
  isDealer: false,
  isSB: false,
  isBB: false,
  hasActedThisRound: false,
  positionName: '',
});

// --- End Game Logic Helpers ---

const activeGames = {}; // To store state of all active games
const GAME_HAND_DELAY_MS = 3000; // 3 seconds delay before next hand

// Initialize Bot Manager
const botManager = new BotManager();

// Handle bot actions
botManager.on('botAction', (actionData) => {
    const { gameId, action, details } = actionData;
    const game = activeGames[gameId];
    
    if (!game) {
        console.error(`[BotManager] Bot action for non-existent game: ${gameId}`);
        return;
    }
    
    console.log(`[BotManager] Processing bot action: ${action} for game ${gameId}`);
    
    // Process the bot action using existing game logic
    try {
        const result = gameEngine.processActionWrapper(game, actionData.botId || actionData.socketId, action, details);
        
        if (result.error) {
            console.error(`[BotManager] Bot action failed: ${result.error}`);
            return;
        }
        
        // Broadcast updated game state
        io.to(gameId).emit(SocketEvents.GAME_STATE_UPDATE, {
            newState: getSanitizedGameStateForClient(game),
            actionLog: { message: `Bot ${action}s` }
        });
        
        // Update bots with new game state
        botManager.updateGameState(gameId, game);
        
        // Check if hand is over
        if (game.currentBettingRound === GamePhase.HAND_OVER) {
            scheduleNextHand(gameId);
        } else {
            startActionTimer(gameId);
        }
        
    } catch (error) {
        console.error(`[BotManager] Error processing bot action:`, error);
    }
});

function getSanitizedGameStateForClient(game) {
    if (!game) return null;
    if (typeof game.getPublicState === 'function') {
        return game.getPublicState();
    }
    
    // First, create a shallow copy and remove non-serializable properties
    const gameForSerialization = { ...game };
    delete gameForSerialization.actionTimer;
    delete gameForSerialization.nextHandTimeout;
    
    // Now create a deep copy of the cleaned object
    const stateForClient = JSON.parse(JSON.stringify(gameForSerialization));
    
    // Remove server-side only properties that shouldn't be sent to client
    delete stateForClient.deck; // Client doesn't need the full deck
    
    return stateForClient;
}

function startActionTimer(gameId) {
    const game = activeGames[gameId];
    if (!game || !game.gameSettings.allowTimeBank) return;

    if (game.actionTimer) clearTimeout(game.actionTimer);

    const currentPlayerIndex = game.currentPlayerIndex;
    if (currentPlayerIndex === -1) return; // No one to time out

    const seatedPlayers = gameEngine.getSeatedPlayers(game);
    const currentPlayer = seatedPlayers[currentPlayerIndex];
    if (!currentPlayer) return;

    // Capture the playerId instead of relying on array index.  The seating array
    // can change (players bust, leave, etc.) between now and the timeout, which
    // previously caused the wrong player to be folded.
    const playerIdAtTimerStart = currentPlayer.id;

    const timeForAction = (game.timeBank + 1) * 1000; // Give 1 extra second buffer

    game.actionTimer = setTimeout(() => {
        const gameAtTimeout = activeGames[gameId];
        if (!gameAtTimeout) return;

        // Re-evaluate who is currently supposed to act.
        const seatedAtTimeout = gameEngine.getSeatedPlayers(gameAtTimeout);
        const idxAtTimeout = gameAtTimeout.currentPlayerIndex;
        if (idxAtTimeout === -1) return; // hand might be over

        const activePlayer = seatedAtTimeout[idxAtTimeout];

        // Abort if the player to act has changed (player acted in time, seat order
        // shifted, etc.)
        if (!activePlayer || activePlayer.id !== playerIdAtTimerStart) {
            return;
        }

        console.log(`Player ${activePlayer.name} timed out in game ${gameId}. Executing auto-action.`);

        // Determine whether a check is legal; otherwise fold.
        let actionToTake = 'fold';
        try {
          const legal = gameEngine.legalActions(gameAtTimeout);
          if (legal && Array.isArray(legal.actions) && legal.actions.includes('check')) {
            actionToTake = 'check';
          }
        } catch(_) {
          const canCheckLegacy = activePlayer.currentBet === gameAtTimeout.currentHighestBet;
          actionToTake = canCheckLegacy ? 'check' : 'fold';
        }

        const result = gameEngine.processAction(gameAtTimeout, activePlayer.id, actionToTake, {});

        if (result.error) {
             io.to(activePlayer.id).emit(SocketEvents.MESSAGE, { text: result.error });
        } else {
            // Ensure game advances if the timeout ended the hand.
            gameEngine.checkGameAndProceed(gameAtTimeout);
        }

        io.to(gameId).emit(SocketEvents.GAME_STATE_UPDATE, { newState: getSanitizedGameStateForClient(gameAtTimeout), actionLog: { message: `${activePlayer.name} timed out and was auto-${actionToTake}ed.` } });

        if (gameAtTimeout.currentBettingRound === gameEngine.GamePhase.HAND_OVER) {
            scheduleNextHand(gameId);
        } else {
            startActionTimer(gameId);
        }
    }, timeForAction);
}

function scheduleNextHand(gameId) {
    const game = activeGames[gameId];
    if (!game) return;

    console.log(`Hand over for game ${gameId}. Scheduling next hand in ${GAME_HAND_DELAY_MS / 1000}s.`);
    if (game.nextHandTimeout) clearTimeout(game.nextHandTimeout);
    if (game.actionTimer) clearTimeout(game.actionTimer);
    
    // NEW: Broadcast updated stats to the room at the end of the hand.
    const playerIds = gameEngine.getSeatedPlayers(game).map(p => p.userId).filter(Boolean);
    if (playerIds.length > 0) {
        statsTracker.getStatsForPlayers(playerIds, null) // null = All Stats
            .then(({ data, error }) => {
                if (error) {
                    console.error(`Error fetching stats for broadcast in game ${gameId}:`, error);
                } else if (data) {
                    io.to(gameId).emit('playerStatsUpdate', { updatedStats: data });
                    console.log(`Broadcasted stats update for game ${gameId}`);
                }
            })
            .catch(e => console.error(`Exception while fetching stats for broadcast in game ${gameId}:`, e));
    }

    game.nextHandTimeout = setTimeout(() => {
      const gameToEndAndRestart = activeGames[gameId];
      if (gameToEndAndRestart) {
          const seatedPlayers = gameEngine.getSeatedPlayers(gameToEndAndRestart);
          if (seatedPlayers.length >= 2) {
              console.log(`Starting next hand for game ${gameId}`);
              gameEngine.startHand(gameToEndAndRestart);
              delete gameToEndAndRestart.nextHandTimeout;
              io.to(gameId).emit(SocketEvents.GAME_STATE_UPDATE, { newState: getSanitizedGameStateForClient(gameToEndAndRestart) });
              startActionTimer(gameId);
          } else {
               console.log(`Game ${gameId} no longer has enough players to start next hand automatically.`);
               gameToEndAndRestart.currentBettingRound = gameEngine.GamePhase.WAITING;
               delete gameToEndAndRestart.nextHandTimeout;
               io.to(gameId).emit(SocketEvents.GAME_STATE_UPDATE, { newState: getSanitizedGameStateForClient(gameToEndAndRestart) });
               io.to(gameId).emit(SocketEvents.MESSAGE, {text: 'Not enough players to start next hand. Waiting for more players.'});
          }
      } else {
          console.log(`Game ${gameId} no longer exists, cannot start next hand.`);
      }
    }, GAME_HAND_DELAY_MS);
}

app.get('/', (req, res) => {
  res.send('Poker server is running!');
});

io.on(SocketEvents.CONNECT, (socket) => {
  console.log('A user connected:', socket.id);

  // Example: Listen for a message from the client
  socket.on('clientMessage', (data) => {
    console.log('Message from client', socket.id, ':', data);
    // Example: Broadcast a message to all clients
    io.emit('serverMessage', { sender: socket.id, message: data });
  });

  // Update: fetchStats now accepts sessionId (optional)
  socket.on('fetchStats', async (gameId, sessionId, callback) => {
    const game = activeGames[gameId];
    if (!game) return callback && callback({ status: 'error', message: 'Game not found' });
  
    const userIds = gameEngine.getSeatedPlayers(game)
                              .map(p => p.userId)
                              .filter(Boolean); // Filter out any null/undefined userIds
  
    if (userIds.length === 0) {
      return callback && callback({ status: 'ok', stats: {} });
    }
  
    try {
      const { data, error } = await statsTracker.getStatsForPlayers(userIds, sessionId || null);
      if (error) {
        throw error;
      }
      callback && callback({ status: 'ok', stats: data });
    } catch (error) {
      console.error('Error fetching player stats:', error);
      callback && callback({ status: 'error', message: 'Could not fetch stats' });
    }
  });

  socket.on(SocketEvents.CREATE_GAME, (data, callback) => {
    const { playerInfo, gameSettings } = data;
    const gameId = `game_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`Game created by ${playerInfo.name || socket.id} with ID: ${gameId}`, 
      { gameType: gameSettings.gameType, vsBot: gameSettings.vsBot });

    const gameState = gameEngine.initGameState(gameSettings);
    const creatorPlayer = initializeServerPlayer(socket.id, playerInfo, gameSettings.startingStack);

    // Creator joins as a spectator initially
    gameState.spectators.push(creatorPlayer);

    gameState.id = gameId;
    gameState.gameSettings = gameSettings;
    gameState.hostId = socket.id;
    activeGames[gameId] = gameState;

    // Create bots if this is a bot game
    if (gameSettings.vsBot && gameSettings.botConfig) {
      console.log(`[CreateGame] Creating bots for game ${gameId}`);
      const { numBots, difficulty, botNames } = gameSettings.botConfig;
      
      try {
        const bots = botManager.createBotsForGame(gameId, numBots, difficulty, botNames);
        
        // Add bots to the game as seated players
        bots.forEach((bot, index) => {
          const botPlayerInfo = {
            userId: bot.id,
            name: bot.botName,
            isBot: true
          };
          
          // Find an empty seat for the bot
          const seatIndex = gameEngine.getSeatedPlayers(gameState).length + index;
          if (seatIndex < gameSettings.maxPlayers) {
            const result = gameEngine.sitDownWrapper(
              gameState, 
              bot.id, 
              botPlayerInfo, 
              seatIndex, 
              gameSettings.startingStack || 1000
            );
            
            if (result.error) {
              console.error(`[CreateGame] Failed to seat bot ${bot.botName}:`, result.error);
            } else {
              console.log(`[CreateGame] Bot ${bot.botName} seated at position ${seatIndex}`);
              
              // Make the bot join the room (simulated)
              botManager.joinBotToRoom(gameId, bot.id, gameId);
            }
          }
        });
        
        console.log(`[CreateGame] Created ${bots.length} bots for game ${gameId}`);
      } catch (error) {
        console.error(`[CreateGame] Failed to create bots:`, error);
        // Continue without bots rather than failing the game creation
      }
    }

    socket.join(gameId);
    callback && callback({ status: 'ok', gameId });
    io.to(gameId).emit(SocketEvents.GAME_STATE_UPDATE, { newState: getSanitizedGameStateForClient(gameState) });
  });

  socket.on(SocketEvents.JOIN_GAME, (data, callback) => {
    const { gameId, playerInfo } = data;
    const game = activeGames[gameId];
    if (!game) {
      socket.emit(SocketEvents.GAME_NOT_FOUND);
      return callback && callback({ status: 'error', message: 'Game not found' });
    }
    // Check if player is already seated or spectating
    const isSeated = game.seats.some(s => !s.isEmpty && s.player.id === socket.id);
    const isSpectating = game.spectators.some(p => p.id === socket.id);
    if (isSeated || isSpectating) {
      socket.join(gameId);
      return callback && callback({ status: 'already_joined', message: 'Already in game' });
    }

    // For now, let's not allow spectators if all seats are full
    const seatedPlayers = gameEngine.getSeatedPlayers(game);
    if (seatedPlayers.length >= game.gameSettings.maxPlayers) {
        return callback && callback({ status: 'error', message: 'Game is full' });
    }
    
    const newSpectator = initializeServerPlayer(socket.id, playerInfo, game.gameSettings.startingStack);
    game.spectators.push(newSpectator);

    socket.join(gameId);
    callback && callback({ status: 'ok', message: `Successfully joined game ${gameId} as spectator` });
    io.to(gameId).emit(SocketEvents.GAME_STATE_UPDATE, { newState: getSanitizedGameStateForClient(game) });
    io.to(gameId).emit(SocketEvents.PLAYER_JOINED, { message: `${playerInfo.name || 'Player'} is now spectating.` });
  });

  socket.on(SocketEvents.TAKE_SEAT, ({ gameId, seatIndex }, callback) => {
    const game = activeGames[gameId];
    if (!game) return callback && callback({ status: 'error', message: 'Game not found' });

    // Prevent taking a seat if a hand is in progress
    if (game.currentBettingRound !== gameEngine.GamePhase.WAITING && game.currentBettingRound !== gameEngine.GamePhase.HAND_OVER) {
        return callback && callback({ status: 'error', message: 'Cannot take a seat while a hand is in progress.' });
    }

    const spectatorIndex = game.spectators.findIndex(p => p.id === socket.id);
    if (spectatorIndex === -1) return callback && callback({ status: 'error', message: 'You are not a spectator.' });

    if (!game.seats[seatIndex] || !game.seats[seatIndex].isEmpty) {
        return callback && callback({ status: 'error', message: 'Seat is already taken.' });
    }

    const player = game.spectators.splice(spectatorIndex, 1)[0];

    // Inform poker-ts engine & let the wrapper update game.seats[]
    gameEngine.sitDown(game, player.id, player, seatIndex, player.stack);

    callback && callback({ status: 'ok' });
    io.to(gameId).emit(SocketEvents.GAME_STATE_UPDATE, { newState: getSanitizedGameStateForClient(game) });
    io.to(gameId).emit(SocketEvents.PLAYER_JOINED, { message: `${player.name} sat down at seat ${seatIndex + 1}.` });
  });

  socket.on(SocketEvents.START_GAME, (gameId, callback) => {
    const game = activeGames[gameId];
    if (!game) return callback && callback({ status: 'error', message: 'Game not found' });
    if (game.hostId !== socket.id) return callback && callback({ status: 'error', message: 'Only host can start' });
    const seatedPlayers = gameEngine.getSeatedPlayers(game);
    if (seatedPlayers.length < 2) return callback && callback({ status: 'error', message: 'Need at least 2 seated players to start' });
    if (game.currentBettingRound !== gameEngine.GamePhase.WAITING) return callback && callback({ status: 'error', message: 'Game already started' });

    gameEngine.startHand(game);
    
    // Notify bots of game start if this is a bot game
    if (game.gameSettings?.vsBot) {
      console.log(`[StartGame] Notifying bots for game ${gameId}`);
      botManager.updateGameState(gameId, game);
    }
    
    io.to(gameId).emit(SocketEvents.GAME_STATE_UPDATE, { newState: getSanitizedGameStateForClient(game) });
    startActionTimer(gameId);
    callback && callback({ status: 'ok' });
  });

  socket.on(SocketEvents.PLAYER_ACTION, (data) => {
    const { gameId, action, details } = data;
    const game = activeGames[gameId];
    if (!game) return;

    if (game.currentBettingRound === gameEngine.GamePhase.HAND_OVER && game.nextHandTimeout) {
       socket.emit(SocketEvents.MESSAGE, { text: 'Hand is over. Next hand starting soon.' });
       return;
    }

    const result = gameEngine.processAction(game, socket.id, action, details);

    if (result.error) {
        // Emit error back to the specific player
        socket.emit(SocketEvents.MESSAGE, { text: result.error });
        return;
    }
    
    // The action was successful, find the player to create a log message
    const allPlayers = [...gameEngine.getSeatedPlayers(game), ...game.spectators];
    const actingPlayer = allPlayers.find(p => p.id === socket.id);
    let actionLog = 'action';
    if(actingPlayer) {
      actionLog = `${actingPlayer.name} ${action}s${details.amount ? ` ${details.amount}` : ''}.`
    }

    // Clear the main action timer since an action was taken
    if (game.actionTimer) clearTimeout(game.actionTimer);

    io.to(gameId).emit(SocketEvents.GAME_STATE_UPDATE, {
      newState: getSanitizedGameStateForClient(game),
      actionLog: {
        player: socket.id,
        playerName: actingPlayer?.name || 'Player',
        action,
        details
      }
    });
    
    // Notify bots of state change if this is a bot game
    if (game.gameSettings?.vsBot) {
      botManager.updateGameState(gameId, game);
    }

    // Check if RIT vote is needed
    if (game.ritPending) {
        io.to(gameId).emit(SocketEvents.RIT_PROMPT, { 
            message: 'All players are all-in. Vote to run it twice?',
            eligiblePlayers: game.ritRequired 
        });
        return; // Don't proceed with run out yet
    }

    if (game.runItOut) {
        delete game.runItOut; // Consume the flag
        const runItOutDelay = 1500; // ms between card reveals

        const dealNextStage = () => {
            gameEngine.runItOutStep(game); 
            io.to(gameId).emit(SocketEvents.GAME_STATE_UPDATE, { newState: getSanitizedGameStateForClient(game) });
            
            if (game.currentBettingRound === gameEngine.GamePhase.HAND_OVER) {
                scheduleNextHand(gameId);
            } else {
                setTimeout(dealNextStage, runItOutDelay);
            }
        };
        setTimeout(dealNextStage, runItOutDelay);

    } else if (game.currentBettingRound === gameEngine.GamePhase.HAND_OVER) {
      scheduleNextHand(gameId);
    } else {
        startActionTimer(gameId);
    }

    // If hand not over, restart the action timer for the next player
    if (game.currentBettingRound !== gameEngine.GamePhase.HAND_OVER){
        startActionTimer(gameId);
    } else {
        scheduleNextHand(gameId);
    }
  });

  socket.on(SocketEvents.UPDATE_GAME_SETTINGS, (data, callback) => {
    const { gameId, newSettings } = data;
    const game = activeGames[gameId];
    if (!game) return callback && callback({ status: 'error', message: 'Game not found.' });
    if (game.hostId !== socket.id) return callback && callback({ status: 'error', message: 'Only the host can change settings.' });

    // Validate and sanitize settings before applying
    const oldSettings = game.gameSettings;
    const newTimeBank = Math.max(10, Math.min(180, Number(newSettings.timeBank) || 60));
    
    game.gameSettings = {
        ...oldSettings,
        allowTimeBank: !!newSettings.allowTimeBank,
        timeBank: newTimeBank,
        autoRebuy: !!newSettings.autoRebuy,
        allowStraddle: !!newSettings.allowStraddle,
        allowRunItTwice: !!newSettings.allowRunItTwice,
        allowInsurance: !!newSettings.allowInsurance,
        allowChat: !!newSettings.allowChat,
        allowEmotes: !!newSettings.allowEmotes,
        allowShowOne: !!newSettings.allowShowOne,
    };
    // Also update the root timeBank property for the server's timer logic
    game.timeBank = newTimeBank;

    console.log(`Game settings for ${gameId} updated by host ${socket.id}.`);
    
    io.to(gameId).emit(SocketEvents.GAME_STATE_UPDATE, { newState: getSanitizedGameStateForClient(game), actionLog: { message: 'Game settings have been updated for the next hand.' } });
    callback && callback({ status: 'ok' });
  });

  socket.on(SocketEvents.RIT_VOTE, (data) => {
    const { gameId, vote } = data;
    const game = activeGames[gameId];
    if (!game) return;

    const result = gameEngine.processRitVote(game, socket.id, vote);
    
    if (result.error) {
      io.to(socket.id).emit(SocketEvents.MESSAGE, { text: result.error });
      return;
    }

    // Get player name for log message
    const voter = game.seats.find(s => !s.isEmpty && s.player.id === socket.id)?.player || 
                  game.spectators.find(p => p.id === socket.id);
    const voteText = vote ? 'YES' : 'NO';
    
    io.to(gameId).emit(SocketEvents.GAME_STATE_UPDATE, { 
        newState: getSanitizedGameStateForClient(game),
        actionLog: { message: `${voter?.name || 'Player'} voted ${voteText} for run it twice` }
    });

    // Check if voting is complete and we should run it out
    if (result.shouldRunOut) {
        const ritMessage = game.runItTwice ? 'Running it twice!' : 'Running it once (not all players agreed).';
        io.to(gameId).emit(SocketEvents.MESSAGE, { text: ritMessage });
        
        if (game.runItTwice) {
            // RIT is resolved instantly on the backend, then the result is sent.
            gameEngine.resolveShowdownRIT(game);
            io.to(gameId).emit(SocketEvents.GAME_STATE_UPDATE, { newState: getSanitizedGameStateForClient(game) });
            scheduleNextHand(gameId);
        } else {
            // For a single run, deal out the remaining cards one by one.
            const runItOutDelay = 1500;
            const dealNextStage = () => {
                gameEngine.runItOutStep(game); 
                io.to(gameId).emit(SocketEvents.GAME_STATE_UPDATE, { newState: getSanitizedGameStateForClient(game) });
                
                if (game.currentBettingRound === gameEngine.GamePhase.HAND_OVER) {
                    scheduleNextHand(gameId);
                } else {
                    setTimeout(dealNextStage, runItOutDelay);
                }
            };
            
            setTimeout(dealNextStage, runItOutDelay);
        }
    }
  });

  socket.on(SocketEvents.CHAT_MESSAGE, (data) => {
    const { gameId, message } = data;
    const game = activeGames[gameId];
    if (!game) return;

    // Enforce the 'allowChat' setting
    if (!game.gameSettings.allowChat) {
      // Optionally notify the sender that chat is disabled
      socket.emit(SocketEvents.MESSAGE, { text: 'Chat is currently disabled by the host.' });
      return;
    }

    // Find the player or spectator who sent the message to get their name
    const allPlayers = [...gameEngine.getSeatedPlayers(game), ...game.spectators];
    const player = allPlayers.find(p => p.id === socket.id);

    if (player) {
      io.to(gameId).emit(SocketEvents.CHAT_MESSAGE, {
        sender: player.name,
        message,
        timestamp: new Date(),
      });
    }
  });

  socket.on(SocketEvents.DISCONNECT, () => {
    console.log('User disconnected:', socket.id);
    for (const gameId in activeGames) {
      const game = activeGames[gameId];
      let playerWasInGame = false;
      let disconnectedPlayerName = 'A player';
      
      // Check if this was the last human player in a bot game
      let wasLastHuman = false;
      if (game.gameSettings?.vsBot) {
        const humanPlayers = game.seats.filter(s => 
          !s.isEmpty && s.player.id === socket.id
        );
        wasLastHuman = humanPlayers.length === 1;
      }

      // Check if the disconnected player was in a seat
      const seatIndex = game.seats.findIndex(s => !s.isEmpty && s.player.id === socket.id);
      if (seatIndex !== -1) {
        disconnectedPlayerName = game.seats[seatIndex].player.name;
        game.seats[seatIndex] = { seatIndex, isEmpty: true }; // Vacate the seat
        playerWasInGame = true;
        console.log(`Player ${disconnectedPlayerName} (${socket.id}) removed from seat ${seatIndex} in game ${gameId}`);
      } else {
        // Check if they were a spectator
        const spectatorIndex = game.spectators.findIndex(p => p.id === socket.id);
        if (spectatorIndex !== -1) {
          const spectator = game.spectators.splice(spectatorIndex, 1)[0];
          disconnectedPlayerName = spectator.name;
          playerWasInGame = true; // Still counts as being in the game
          console.log(`Spectator ${disconnectedPlayerName} (${socket.id}) removed from game ${gameId}`);
        }
      }

      if (playerWasInGame) {
        const seatedPlayers = gameEngine.getSeatedPlayers(game);

        // If host left, assign a new one
        if (game.hostId === socket.id) {
            const newHost = seatedPlayers[0] || game.spectators[0];
            if (newHost) {
                game.hostId = newHost.id;
                console.log(`Host disconnected. New host for ${gameId} is ${newHost.name} (${newHost.id})`);
                io.to(gameId).emit(SocketEvents.MESSAGE, { text: `${disconnectedPlayerName} (Host) left. ${newHost.name} is the new host.` });
            }
        } else {
             io.to(gameId).emit(SocketEvents.PLAYER_LEFT, { message: `${disconnectedPlayerName} left the game.` });
        }

        // If the game becomes empty, clear timers and delete it.
        if (seatedPlayers.length === 0 && game.spectators.length === 0) {
            console.log(`Game ${gameId} is now empty. Deleting.`);
            if (game.nextHandTimeout) clearTimeout(game.nextHandTimeout);
            if (game.actionTimer) clearTimeout(game.actionTimer);
            delete activeGames[gameId];
            continue; // Skip to next game in loop
        }
        
        // Before sending state, clear any active timers on the game object to prevent circular JSON error
        if (game.nextHandTimeout) clearTimeout(game.nextHandTimeout);
        if (game.actionTimer) clearTimeout(game.actionTimer);
        delete game.nextHandTimeout;
        delete game.actionTimer;

        // If the disconnected player was the current player, advance the turn
        const currentPlayer = game.currentPlayerIndex !== -1 ? gameEngine.getSeatedPlayers(game)[game.currentPlayerIndex] : null;
        if(currentPlayer && currentPlayer.id === socket.id) {
            // Handle turn advancement or hand ending logic here if needed
            // For now, let's just log it. A more robust solution might auto-fold.
            console.log(`Current player ${disconnectedPlayerName} disconnected. Turn needs to be handled.`);
        }

        io.to(gameId).emit(SocketEvents.GAME_STATE_UPDATE, { newState: getSanitizedGameStateForClient(game) });
        
        // Clean up bots if this was the last human player
        if (wasLastHuman) {
          console.log(`[Disconnect] Last human left bot game ${gameId}, cleaning up bots`);
          botManager.removeBotsForGame(gameId);
          
          // Mark game for cleanup if no human players remain
          setTimeout(() => {
            const currentGame = activeGames[gameId];
            if (currentGame && currentGame.gameSettings?.vsBot) {
              const remainingHumans = currentGame.seats.filter(s => 
                !s.isEmpty && !s.player.isBot
              );
              
              if (remainingHumans.length === 0) {
                console.log(`[Cleanup] Removing empty bot game ${gameId}`);
                delete activeGames[gameId];
              }
            }
          }, 30000); // 30 second grace period for reconnection
        }
      }
    }
  });
});

// ---------------- REST endpoints for hand history ----------------

// List recent hands for a table
app.get('/api/games/:gameId/hands', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'DB not ready' });
  const { gameId } = req.params;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);

  const { data, error } = await supabase
    .from('hand_histories')
    .select('hand_id, hand_number, played_at, history')
    .eq('game_id', gameId)
    .order('hand_number', { ascending: false })
    .limit(limit);

  if (error) return res.status(500).json({ error: error.message });

  const rows = (data || []).map(row => ({
    handId: row.hand_id,
    handNumber: row.hand_number,
    startedAt: row.played_at,
    potSize: row.history?.potSize ?? null,
  }));

  res.json(rows);
});

// Fetch full history for a specific hand
app.get('/api/hands/:handId', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'DB not ready' });
  const { handId } = req.params;

  const { data, error } = await supabase
    .from('hand_histories')
    .select('history')
    .eq('hand_id', handId)
    .single();

  if (error) return res.status(404).json({ error: 'Hand not found' });

  res.json(data.history);
});
// -----------------------------------------------------------------

server.listen(PORT, () => {
  console.log(`Server listening on *:${PORT}`);
}); 