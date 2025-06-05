const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors'); // Import cors
const gameEngine = require('./gameEngine'); // NEW import

const app = express();
const server = http.createServer(app);

// Configure CORS
// Adjust the origin to your frontend's URL. 
// For development with Vite default, it's usually http://localhost:3000 or http://localhost:5173
// For production, you'll want to restrict this to your actual frontend domain.
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"], // Add your frontend dev port
  methods: ["GET", "POST"]
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions
});

const PORT = process.env.PORT || 4000; // Ensure this is different from your frontend port

// --- Game Logic Helpers (simplified and adapted from PokerGame.jsx) ---
const SUITS = ['h', 'd', 'c', 's'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const BIG_BLIND_AMOUNT = 10; // Example, will come from gameSettings
const SMALL_BLIND_AMOUNT = 5; // Example

const GamePhase = {
  PREFLOP: 'PREFLOP',
  FLOP: 'FLOP',
  TURN: 'TURN',
  RIVER: 'RIVER',
  SHOWDOWN: 'SHOWDOWN',
  HAND_OVER: 'HAND_OVER',
  WAITING: 'WAITING' // New phase for before game starts
};

const createDeck = () => {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push(rank + suit);
    }
  }
  return deck;
};

const shuffleDeck = (deck) => {
  let shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
};

// Simplified player initialization for the server
const initializeServerPlayer = (socketId, name, stack) => ({
  id: socketId, // Use socket.id as player ID for server tracking
  name,
  cards: [],
  stack,
  currentBet: 0,
  totalBetInHand: 0, // Added for clarity
  isFolded: false,
  isAllIn: false,
  isDealer: false,
  isSB: false,
  isBB: false,
  hasActedThisRound: false,
  positionName: '', // Will be assigned
});

// --- End Game Logic Helpers ---

const activeGames = {}; // To store state of all active games
const GAME_HAND_DELAY_MS = 7000; // 7 seconds delay before next hand

app.get('/', (req, res) => {
  res.send('Poker server is running!');
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Example: Listen for a message from the client
  socket.on('clientMessage', (data) => {
    console.log('Message from client', socket.id, ':', data);
    // Example: Broadcast a message to all clients
    io.emit('serverMessage', { sender: socket.id, message: data });
  });

  socket.on('createGame', (data, callback) => {
    const { playerInfo, gameSettings } = data;
    const gameId = `game_${Math.random().toString(36).substr(2, 9)}`;
    console.log('Game created by', playerInfo.name || socket.id, 'with ID:', gameId, 'and settings:', gameSettings);

    const creatorPlayer = initializeServerPlayer(socket.id, playerInfo.name, gameSettings.startingStack);
    const gameState = gameEngine.initGameState([creatorPlayer], gameSettings);
    gameState.id = gameId;
    gameState.gameSettings = gameSettings;
    gameState.hostId = socket.id;

    activeGames[gameId] = gameState;

    socket.join(gameId);
    callback && callback({ status: 'ok', gameId });
    io.to(gameId).emit('gameStateUpdate', { newState: gameState });
  });

  socket.on('joinGame', (data, callback) => {
    const { gameId, playerInfo } = data;
    const game = activeGames[gameId];
    if (!game) {
       return callback && callback({ status:'error', message:'Game not found' });
    }
    if (game.players.length >= (game.gameSettings.maxPlayers || 9)) {
       return callback && callback({ status:'error', message:'Game full' });
    }
    if (game.players.find(p=>p.id === socket.id)) {
       socket.join(gameId);
       return callback && callback({ status:'already_joined', message:'Already in game'});
    }
    const newPlayer = initializeServerPlayer(socket.id, playerInfo.name, game.gameSettings.startingStack);
    game.players.push(newPlayer);
    socket.join(gameId);
    callback && callback({ status:'ok', message:`Successfully joined game ${gameId}` });
    io.to(gameId).emit('gameStateUpdate', { newState: game });
    io.to(gameId).emit('playerJoined', { message:`${playerInfo.name || 'Player'} joined.` });
  });

  socket.on('startGame', (gameId, callback) => {
    const game = activeGames[gameId];
    if (!game) return callback && callback({ status:'error', message:'Game not found' });
    if (game.hostId !== socket.id) return callback && callback({ status:'error', message:'Only host can start' });
    if (game.players.length < 2) return callback && callback({ status:'error', message:'Need 2 players' });
    if (game.currentBettingRound !== gameEngine.GamePhase.WAITING) return callback && callback({ status:'error', message:'Game already started' });

    gameEngine.startHand(game);
    io.to(gameId).emit('gameStateUpdate', { newState: game });
    callback && callback({ status:'ok' });
  });

  socket.on('playerAction', ({ gameId, action, details }) => {
    const game = activeGames[gameId];
    if (!game) return;

    // Prevent actions if hand is already over and waiting for restart
    if (game.currentBettingRound === gameEngine.GamePhase.HAND_OVER && game.nextHandTimeout) {
        console.log(`Action blocked for game ${gameId}, hand over, waiting for timer.`);
        io.to(socket.id).emit('message', { text: 'Hand is over. Next hand starting soon.' });
        return;
    }

    const result = gameEngine.processAction(game, socket.id, action, details);

    if (result.error) {
        io.to(socket.id).emit('message', { text: result.error });
        // Optionally send an unchanged gameStateUpdate if you want client to re-sync even on error
        // io.to(socket.id).emit('gameStateUpdate', { newState: game }); 
        return;
    }

    // Successfully processed action, broadcast the new state
    io.to(gameId).emit('gameStateUpdate', { 
        newState: game, 
        actionLog: { 
            player: socket.id, 
            playerName: game.players.find(p=>p.id === socket.id)?.name || 'Player',
            action, 
            details 
        }
    });

    // If hand is now over, schedule the next hand
    if (game.currentBettingRound === gameEngine.GamePhase.HAND_OVER) {
        console.log(`Hand over for game ${gameId}. Scheduling next hand in ${GAME_HAND_DELAY_MS / 1000}s.`);
        // Clear any existing timeout for this game (e.g., if multiple actions ended hand simultaneously - unlikely but safe)
        if (game.nextHandTimeout) {
            clearTimeout(game.nextHandTimeout);
        }
        game.nextHandTimeout = setTimeout(() => {
            const gameToEndAndRestart = activeGames[gameId]; // Re-fetch, in case game was deleted
            if (gameToEndAndRestart && gameToEndAndRestart.players.length >= 2) {
                console.log(`Starting next hand for game ${gameId}`);
                gameEngine.startHand(gameToEndAndRestart); // Modifies gameToEndAndRestart in place
                delete gameToEndAndRestart.nextHandTimeout; // Clear the timeout ID from game state
                io.to(gameId).emit('gameStateUpdate', { newState: gameToEndAndRestart });
            } else if (gameToEndAndRestart) {
                 console.log(`Game ${gameId} no longer has enough players to start next hand automatically.`);
                 // Optionally inform remaining player they need more players
                 gameToEndAndRestart.currentBettingRound = gameEngine.GamePhase.WAITING; // Set to waiting
                 delete gameToEndAndRestart.nextHandTimeout;
                 io.to(gameId).emit('gameStateUpdate', { newState: gameToEndAndRestart });
                 io.to(gameId).emit('message', {text: 'Not enough players to start next hand. Waiting for more players.'});
            } else {
                console.log(`Game ${gameId} no longer exists, cannot start next hand.`);
            }
        }, GAME_HAND_DELAY_MS);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const gameId in activeGames) {
      const game = activeGames[gameId];
      const playerIndex = game.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        const disconnectedPlayer = game.players.splice(playerIndex, 1)[0];
        console.log(`Player ${disconnectedPlayer.name} (${socket.id}) removed from game ${gameId}`);
        
        // Clear next hand timeout if player was in a game that had one scheduled
        if (game.nextHandTimeout) {
            clearTimeout(game.nextHandTimeout);
            delete game.nextHandTimeout;
            console.log(`Cleared nextHandTimeout for game ${gameId} due to player disconnect.`);
        }

        if (game.players.length < 2 && game.currentBettingRound !== gameEngine.GamePhase.WAITING) {
            console.log(`Game ${gameId} has less than 2 players, setting to WAITING.`);
            game.currentBettingRound = gameEngine.GamePhase.WAITING; 
            // Optionally inform remaining player
             io.to(gameId).emit('message', {text: `${disconnectedPlayer.name} left. Waiting for more players to continue.`});
        }

        if (game.hostId === socket.id) {
            if (game.players.length > 0) {
                game.hostId = game.players[0].id;
                io.to(gameId).emit('message', { text: `${disconnectedPlayer.name} (host) disconnected. ${game.players[0].name} is new host.` });
            } else {
                console.log(`Game ${gameId} empty, deleting.`);
                delete activeGames[gameId];
                return; 
            }
        }
        io.to(gameId).emit('gameStateUpdate', { newState: game });
        io.to(gameId).emit('playerLeft', { playerId: socket.id, name: disconnectedPlayer.name });
        break; 
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on *:${PORT}`);
}); 