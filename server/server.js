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
  id: socketId,
  name,
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
const GAME_HAND_DELAY_MS = 7000; // 7 seconds delay before next hand

function scheduleNextHand(gameId) {
    const game = activeGames[gameId];
    if (!game) return;

    console.log(`Hand over for game ${gameId}. Scheduling next hand in ${GAME_HAND_DELAY_MS / 1000}s.`);
    if (game.nextHandTimeout) clearTimeout(game.nextHandTimeout);
    
    game.nextHandTimeout = setTimeout(() => {
      const gameToEndAndRestart = activeGames[gameId];
      if (gameToEndAndRestart) {
          const seatedPlayers = gameEngine.getSeatedPlayers(gameToEndAndRestart);
          if (seatedPlayers.length >= 2) {
              console.log(`Starting next hand for game ${gameId}`);
              gameEngine.startHand(gameToEndAndRestart);
              delete gameToEndAndRestart.nextHandTimeout;
              io.to(gameId).emit('gameStateUpdate', { newState: gameToEndAndRestart });
          } else {
               console.log(`Game ${gameId} no longer has enough players to start next hand automatically.`);
               gameToEndAndRestart.currentBettingRound = gameEngine.GamePhase.WAITING;
               delete gameToEndAndRestart.nextHandTimeout;
               io.to(gameId).emit('gameStateUpdate', { newState: gameToEndAndRestart });
               io.to(gameId).emit('message', {text: 'Not enough players to start next hand. Waiting for more players.'});
          }
      } else {
          console.log(`Game ${gameId} no longer exists, cannot start next hand.`);
      }
    }, GAME_HAND_DELAY_MS);
}

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
    console.log(`Game created by ${playerInfo.name || socket.id} with ID: ${gameId}`);

    const gameState = gameEngine.initGameState(gameSettings);
    const creatorPlayer = initializeServerPlayer(socket.id, playerInfo.name, gameSettings.startingStack);

    // Creator joins as a spectator initially
    gameState.spectators.push(creatorPlayer);

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
      socket.emit('gameNotFound');
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
    
    const newSpectator = initializeServerPlayer(socket.id, playerInfo.name, game.gameSettings.startingStack);
    game.spectators.push(newSpectator);

    socket.join(gameId);
    callback && callback({ status: 'ok', message: `Successfully joined game ${gameId} as spectator` });
    io.to(gameId).emit('gameStateUpdate', { newState: game });
    io.to(gameId).emit('playerJoined', { message: `${playerInfo.name || 'Player'} is now spectating.` });
  });

  socket.on('takeSeat', ({ gameId, seatIndex }, callback) => {
    const game = activeGames[gameId];
    if (!game) return callback && callback({ status: 'error', message: 'Game not found' });

    const spectatorIndex = game.spectators.findIndex(p => p.id === socket.id);
    if (spectatorIndex === -1) return callback && callback({ status: 'error', message: 'You are not a spectator.' });

    if (!game.seats[seatIndex] || !game.seats[seatIndex].isEmpty) {
        return callback && callback({ status: 'error', message: 'Seat is already taken.' });
    }

    const player = game.spectators.splice(spectatorIndex, 1)[0];
    game.seats[seatIndex].isEmpty = false;
    game.seats[seatIndex].player = player;

    callback && callback({ status: 'ok' });
    io.to(gameId).emit('gameStateUpdate', { newState: game });
    io.to(gameId).emit('playerJoined', { message: `${player.name} sat down at seat ${seatIndex + 1}.` });
  });

  socket.on('startGame', (gameId, callback) => {
    const game = activeGames[gameId];
    if (!game) return callback && callback({ status: 'error', message: 'Game not found' });
    if (game.hostId !== socket.id) return callback && callback({ status: 'error', message: 'Only host can start' });
    const seatedPlayers = gameEngine.getSeatedPlayers(game);
    if (seatedPlayers.length < 2) return callback && callback({ status: 'error', message: 'Need at least 2 seated players to start' });
    if (game.currentBettingRound !== gameEngine.GamePhase.WAITING) return callback && callback({ status: 'error', message: 'Game already started' });

    gameEngine.startHand(game);
    io.to(gameId).emit('gameStateUpdate', { newState: game });
    callback && callback({ status: 'ok' });
  });

  socket.on('playerAction', ({ gameId, action, details }) => {
    const game = activeGames[gameId];
    if (!game) return;

    if (game.currentBettingRound === gameEngine.GamePhase.HAND_OVER && game.nextHandTimeout) {
      io.to(socket.id).emit('message', { text: 'Hand is over. Next hand starting soon.' });
      return;
    }

    const result = gameEngine.processAction(game, socket.id, action, details);

    if (result.error) {
      io.to(socket.id).emit('message', { text: result.error });
      return;
    }
    
    const actingPlayer = game.seats.find(s => !s.isEmpty && s.player.id === socket.id)?.player;

    io.to(gameId).emit('gameStateUpdate', {
      newState: game,
      actionLog: {
        player: socket.id,
        playerName: actingPlayer?.name || 'Player',
        action,
        details
      }
    });

    if (game.runItOut) {
        delete game.runItOut; // Consume the flag
        const runItOutDelay = 1500; // ms between card reveals

        const dealNextStage = () => {
            gameEngine.runItOutStep(game); 
            io.to(gameId).emit('gameStateUpdate', { newState: game });
            
            if (game.currentBettingRound === gameEngine.GamePhase.HAND_OVER) {
                scheduleNextHand(gameId);
            } else {
                setTimeout(dealNextStage, runItOutDelay);
            }
        };
        setTimeout(dealNextStage, runItOutDelay);

    } else if (game.currentBettingRound === gameEngine.GamePhase.HAND_OVER) {
      scheduleNextHand(gameId);
    }
  });

  socket.on('chatMessage', ({ gameId, message }) => {
    const game = activeGames[gameId];
    if (!game) return;

    const player = game.seats.find(s => !s.isEmpty && s.player.id === socket.id)?.player || game.spectators.find(p => p.id === socket.id);

    if (player) {
      io.to(gameId).emit('chatMessage', {
        sender: player.name,
        message,
        timestamp: new Date(),
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const gameId in activeGames) {
      const game = activeGames[gameId];
      let playerWasSeated = false;
      let disconnectedPlayerName = 'A player';

      // Check if the disconnected player was in a seat
      const seatIndex = game.seats.findIndex(s => !s.isEmpty && s.player.id === socket.id);
      if (seatIndex !== -1) {
        disconnectedPlayerName = game.seats[seatIndex].player.name;
        game.seats[seatIndex] = { seatIndex, isEmpty: true }; // Vacate the seat
        playerWasSeated = true;
        console.log(`Player ${disconnectedPlayerName} (${socket.id}) removed from seat ${seatIndex} in game ${gameId}`);
      } else {
        // Check if they were a spectator
        const spectatorIndex = game.spectators.findIndex(p => p.id === socket.id);
        if (spectatorIndex !== -1) {
          const spectator = game.spectators.splice(spectatorIndex, 1)[0];
          disconnectedPlayerName = spectator.name;
          console.log(`Spectator ${disconnectedPlayerName} (${socket.id}) removed from game ${gameId}`);
        }
      }

      if (playerWasSeated) {
        // If the game becomes empty, delete it
        const seatedPlayers = gameEngine.getSeatedPlayers(game);
        if (seatedPlayers.length === 0 && game.spectators.length === 0) {
            console.log(`Game ${gameId} is now empty. Deleting.`);
            if (game.nextHandTimeout) clearTimeout(game.nextHandTimeout);
            delete activeGames[gameId];
            continue; // Skip to next game in loop
        }
        
        // Host migration if host left
        if (game.hostId === socket.id) {
            const newHost = seatedPlayers[0] || game.spectators[0];
            if (newHost) {
                game.hostId = newHost.id;
                console.log(`Host disconnected. New host for ${gameId} is ${newHost.name} (${newHost.id})`);
                io.to(gameId).emit('message', { text: `${disconnectedPlayerName} (Host) left. ${newHost.name} is the new host.` });
            } else {
                 console.log(`Game ${gameId} has no one left to be host.`);
            }
        } else {
             io.to(gameId).emit('playerLeft', { message: `${disconnectedPlayerName} left the game.` });
        }

        io.to(gameId).emit('gameStateUpdate', { newState: game });
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on *:${PORT}`);
}); 