import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext'; // Assuming you want to use user info
import OnlinePokerTableDisplay from './OnlinePokerTableDisplay'; // Import the new display component
import ActionButtons from './ActionButtons'; // Import ActionButtons
import tableBg from '/src/assets/blacktable.png'; // Import table background

// Connect to your backend server. Make sure the port matches your server.js
const SERVER_URL = 'http://localhost:4000'; 

// Define GamePhase on client to match server
const GamePhase = {
  PREFLOP: 'PREFLOP',
  FLOP: 'FLOP',
  TURN: 'TURN',
  RIVER: 'RIVER',
  SHOWDOWN: 'SHOWDOWN',
  HAND_OVER: 'HAND_OVER',
  WAITING: 'WAITING'
};

function OnlinePokerRoom({ initialGameSettings, joinWithGameId }) {
  const { user } = useAuth(); // Get user info if needed for player details
  const [socket, setSocket] = useState(null);
  const [gameId, setGameId] = useState('');
  const [inputGameId, setInputGameId] = useState(joinWithGameId || ''); // Initialize if provided
  const [messages, setMessages] = useState([]);
  const [gameState, setGameState] = useState(null); // To hold the game state from the server
  const [playerName, setPlayerName] = useState(user?.user_metadata?.full_name || user?.email || 'Player');
  const [hasAutoActionTriggered, setHasAutoActionTriggered] = useState(false); // Prevent re-triggering
  const [error, setError] = useState('');

  // Effect for setting player name from user auth
  useEffect(() => {
    if (user && user.user_metadata && (user.user_metadata.username || user.user_metadata.full_name)) {
      setPlayerName(user.user_metadata.full_name || user.user_metadata.username);
    }
  }, [user]);

  // Effect for WebSocket connection and listeners setup (runs once)
  useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server with id:', newSocket.id);
    });

    newSocket.on('gameStateUpdate', (data) => {
      console.log('Received gameStateUpdate:', data.newState);
      const newState = data.newState;
      setGameState(newState);
      
      let logMessage = null;
      if (data.actionLog && data.actionLog.message) {
        logMessage = data.actionLog.message;
      }
      // If hand is over, prioritize the handOverMessage for the log
      if (newState && newState.currentBettingRound === GamePhase.HAND_OVER && newState.handOverMessage) {
        logMessage = newState.handOverMessage; 
      }

      if (logMessage) {
        setMessages(prev => [...prev, logMessage]);
      }
    });
    newSocket.on('playerJoined', (data) => setMessages(prev => [...prev, data.message]));
    newSocket.on('playerLeft', (data) => setMessages(prev => [...prev, data.message]));
    newSocket.on('message', (data) => setMessages(prev => [...prev, data.text]));
    newSocket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        setMessages(prev => [...prev, 'Disconnected from server.']);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []); // Empty dependency array: runs only on mount and unmount

  // Callbacks for game actions (memoized)
  const handleCreateGame = useCallback((currentSocket, settings) => {
    const sock = currentSocket || socket;
    if (sock) {
      const playerDetails = { name: playerName || `Player_${sock.id.substring(0,5)}` };
      sock.emit('createGame', { playerInfo: playerDetails, gameSettings: settings || initialGameSettings }, (response) => {
        if (response.status === 'ok') {
          setGameId(response.gameId);
          setInputGameId(response.gameId);
          setMessages(prev => [...prev, `Game room ${response.gameId} created! Share ID.`]);
          setError('');
        } else {
          setError(response.message || 'Error creating game.');
        }
      });
    }
  }, [socket, playerName, initialGameSettings]);

  const handleJoinGame = useCallback((currentSocket, gameIdToJoin) => {
    const sock = currentSocket || socket;
    const idToJoin = gameIdToJoin || inputGameId;
    if (sock && idToJoin) {
      const playerDetails = { name: playerName || `Player_${sock.id.substring(0,5)}` };
      sock.emit('joinGame', { gameId: idToJoin, playerInfo: playerDetails }, (response) => {
        if (response.status === 'ok' || response.status === 'already_joined') {
          setGameId(idToJoin);
          setMessages(prev => [...prev, response.message || `Joined ${idToJoin}!`]);
          setError('');
        } else {
          setError(response.message || 'Error joining game.');
        }
      });
    }
  }, [socket, inputGameId, playerName]);

  // Effect for auto-triggering create or join game (runs when socket or relevant props change)
  useEffect(() => {
    if (socket && !hasAutoActionTriggered) {
      if (initialGameSettings) {
        handleCreateGame(socket, initialGameSettings);
        setHasAutoActionTriggered(true);
      } else if (joinWithGameId) {
        handleJoinGame(socket, joinWithGameId);
        setHasAutoActionTriggered(true);
      }
    }
  }, [socket, initialGameSettings, joinWithGameId, handleCreateGame, handleJoinGame, hasAutoActionTriggered]);

  const handleStartGame = useCallback(() => {
    if (socket && gameId && gameState && gameState.hostId === socket.id) {
      socket.emit('startGame', gameId, (response) => {
        if (response.status === 'ok') {
          setMessages(prev => [...prev, 'Game started!']);
          setError('');
        } else {
          setError(response.message || 'Error starting game.');
        }
      });
    }
  }, [socket, gameId, gameState]);
  
  const handlePlayerAction = useCallback((action, details = {}) => {
    if (socket && gameId && gameState && gameState.players && typeof gameState.currentPlayerIndex !== 'undefined') {
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        if (currentPlayer && currentPlayer.id === socket.id) {
            socket.emit('playerAction', { gameId, action, details });
        } else {
            console.warn("Not your turn or current player info is missing.");
            setMessages(prev => [...prev, "It's not your turn!"]);
        }
    }
  }, [socket, gameId, gameState]);

  // ---- Action Button Props Calculation ----
  let isMyTurn = false;
  let canCheck = false;
  let canCall = false;
  let callAmount = 0;
  let minBetAmount = 0;
  let maxBetAmount = 0;
  let canBet = false;
  const bigBlind = gameState?.gameSettings?.blinds?.big || 10;

  if (socket && gameState && gameState.players && typeof gameState.currentPlayerIndex === 'number' && gameState.currentPlayerIndex >= 0) {
    const currentPlayerFromServer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayerFromServer) {
        isMyTurn = currentPlayerFromServer.id === socket.id;
        if (isMyTurn) {
            const me = currentPlayerFromServer;
            const currentBetNum = Number(me.currentBet) || 0;
            const highestBetNum = Number(gameState.currentHighestBet) || 0;
            const myStackNum = Number(me.stack) || 0;

            canCheck = currentBetNum === highestBetNum;
            callAmount = highestBetNum - currentBetNum;
            canCall = callAmount > 0 && myStackNum > 0 && !me.isAllIn;
            
            const minRaise = gameState.minRaiseAmount || bigBlind;
            let calculatedMinBet = Math.max(1, (highestBetNum + minRaise) - currentBetNum);
            minBetAmount = Math.min(calculatedMinBet, myStackNum > 0 ? myStackNum : calculatedMinBet);
            maxBetAmount = myStackNum;
            canBet = myStackNum > 0 && !me.isAllIn;
            // Ensure if betting is possible, minBetAmount is at least 1 if stack allows
            if (canBet && minBetAmount <= 0 && myStackNum > 0) minBetAmount = 1; 
            if (canBet && minBetAmount > maxBetAmount) minBetAmount = maxBetAmount; // Cannot bet less than all-in if minBet > stack
        }
    }
  }
  // ---- End Action Button Prop Calculation ----

  // Render create/join buttons only if no auto-action is triggered and not in a game
  const showManualControls = !initialGameSettings && !joinWithGameId && !gameId;

  // Basic UI for creating/joining and displaying messages/game state
  if (!socket) {
    return <div className="p-4 text-white">Connecting to server...</div>;
  }

  // If not in a game yet (no gameId from server response or auto-join), show create/join UI
  // This happens if initialGameSettings and joinWithGameId are not provided, or if creation/join failed initially.
  if (!gameId && !initialGameSettings && !joinWithGameId) {
    return (
      <div className="p-4 bg-gray-800 text-white min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-6">Online Poker Room</h2>
        {error && <p className="text-red-500 bg-red-100 border border-red-500 p-3 rounded mb-4">Error: {error}</p>}
        <div className="mb-4 p-4 border border-gray-700 rounded bg-gray-750">
          <h3 className="text-xl mb-2">Create New Game (Manual)</h3>
          <button onClick={() => handleCreateGame(socket, { startingStack: 100, blinds: {small: 1, big: 2}, maxPlayers: 6})} 
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Create Generic Game
          </button>
        </div>
        <div className="p-4 border border-gray-700 rounded bg-gray-750">
          <h3 className="text-xl mb-2">Join Game (Manual)</h3>
          <input 
            type="text" 
            value={inputGameId} 
            onChange={(e) => setInputGameId(e.target.value)} 
            placeholder="Enter Game ID" 
            className="p-2 rounded border border-gray-600 bg-gray-800 text-white mr-2"
          />
          <button onClick={() => handleJoinGame(socket, inputGameId)} 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Join Game with ID
          </button>
        </div>
        <div className="mt-6 w-full max-w-md">
          <h4 className="text-lg mb-2">Log:</h4>
          <div className="h-32 overflow-y-auto bg-gray-900 p-2 rounded border border-gray-600">
            {messages.map((msg, index) => <div key={index} className="text-sm">{msg}</div>)}
          </div>
        </div>
      </div>
    );
  }
  
  // If gameId is set (meaning in a room) or gameState is available
  return (
    <div className="p-4 bg-gray-800 text-white min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">Game Room: {gameId}</h2>
      {error && <p className="text-red-500 bg-red-100 border border-red-500 p-3 rounded mb-4">Error: {error}</p>}

      {gameState && (
        <div className="w-full max-w-6xl mb-4">
            <div className="bg-gray-700 p-3 rounded mb-3">
                <p className="text-lg">Status: <span className="font-semibold">{gameState.currentBettingRound}</span></p>
                 {gameState.hostId === socket?.id && gameState.currentBettingRound === GamePhase.WAITING && gameState.players.length >= 2 && (
                    <button 
                        onClick={handleStartGame} 
                        className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out">
                        Start Game ({gameState.players.length}/{gameState.gameSettings.maxPlayers || 'N/A'} players)
                    </button>
                )}
                 {gameState.hostId === socket?.id && gameState.currentBettingRound === GamePhase.WAITING && gameState.players.length < 2 && (
                    <p className="text-yellow-400 mt-2">Waiting for at least 2 players to start...</p>
                 )}
            </div>

            <h3 className="text-xl mb-2">Players:</h3>
            <ul className="list-disc list-inside bg-gray-750 p-3 rounded mb-3">
              {gameState.players.map(player => (
                <li key={player.id} className={`${player.id === socket?.id ? 'font-bold text-yellow-300' : ''}`}>
                  {player.name} (Stack: {player.stack})
                  {player.isDealer && ' (D)'}
                  {player.isSB && ' (SB)'}
                  {player.isBB && ' (BB)'}
                  {player.id === gameState.hostId && ' (Host)'}
                  {/* Safely check current player for turn indicator */}
                  {gameState.players[gameState.currentPlayerIndex]?.id === player.id && ' (Turn)'}
                </li>
              ))}
            </ul>

            {/* Poker Table Area - Awaiting GameState Integration */}
            {/* This is where you'd integrate your visual poker table based on gameState */}
            <div className="my-4 poker-table-container relative" style={{ backgroundImage: `url(${tableBg})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                {/* OnlinePokerTableDisplay will fill this container if styled correctly */} 
                <OnlinePokerTableDisplay 
                    gameState={gameState} 
                    currentSocketId={socket?.id} 
                    GamePhase={GamePhase} // Pass GamePhase here
                />
            </div>
            
            {isMyTurn && gameState.currentBettingRound !== GamePhase.WAITING && gameState.currentBettingRound !== GamePhase.HAND_OVER && (
                <div className="mt-4 p-3 bg-gray-700 rounded shadow-md w-full max-w-4xl flex justify-center">
                    <ActionButtons 
                        onCheck={() => handlePlayerAction('check')}
                        onCall={() => handlePlayerAction('call', { amount: callAmount })}
                        onBet={(betAmount) => handlePlayerAction('bet', { amount: betAmount })}
                        onFold={() => handlePlayerAction('fold')}
                        canCheck={canCheck}
                        canCall={canCall}
                        callAmount={callAmount}
                        canBet={canBet}
                        minBetAmount={minBetAmount}
                        maxBetAmount={maxBetAmount}
                        potSize={gameState.pot || 0}
                    />
                </div>
            )}
            {!isMyTurn && gameState.currentBettingRound !== GamePhase.WAITING && gameState.currentBettingRound !== GamePhase.HAND_OVER && gameState.players[gameState.currentPlayerIndex] && (
                <div className="mt-4 p-3 bg-gray-700 rounded shadow-md w-full max-w-4xl text-center">
                    <p className="text-yellow-300">Waiting for {gameState.players[gameState.currentPlayerIndex].name}'s action...</p>
                </div>
            )}
        </div>
      )}
      {!gameState && gameId && (
          <p className="text-xl">Loading game state for {gameId}...</p>
      )}

      <div className="mt-6 w-full max-w-md">
        <h4 className="text-lg mb-2">Game Log:</h4>
        <div className="h-40 overflow-y-auto bg-gray-900 p-2 rounded border border-gray-600">
          {messages.map((msg, index) => <div key={index} className="text-sm">{msg}</div>)}
        </div>
      </div>
    </div>
  );
}

export default OnlinePokerRoom; 