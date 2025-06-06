import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext'; // Assuming you want to use user info
import OnlinePokerTableDisplay from './OnlinePokerTableDisplay'; // Import the new display component
import ActionButtons from './ActionButtons'; // Import ActionButtons
import GameSettingsModal from './GameSettingsModal'; // Import the new modal component
import RitVoteModal from './RitVoteModal'; // Import RIT vote modal
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
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user info if needed for player details
  const [socket, setSocket] = useState(null);
  const [gameId, setGameId] = useState('');
  const [inputGameId, setInputGameId] = useState(joinWithGameId || ''); // Initialize if provided
  const [messages, setMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [gameState, setGameState] = useState(null); // To hold the game state from the server
  const [playerName, setPlayerName] = useState(user?.user_metadata?.full_name || user?.email || 'Player');
  const [hasAutoActionTriggered, setHasAutoActionTriggered] = useState(false); // Prevent re-triggering
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('log'); // 'log' or 'chat'
  const [chatInput, setChatInput] = useState('');
  const [isLogVisible, setIsLogVisible] = useState(true);
  const [hasNewChatMessage, setHasNewChatMessage] = useState(false);
  const tableRef = useRef(null); // Add table ref for sizing
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [ritVoteOpen, setRitVoteOpen] = useState(false);
  const [isEligibleForRit, setIsEligibleForRit] = useState(false);

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

    newSocket.on('chatMessage', (data) => {
        setChatMessages(prev => [...prev, data]);
        if (activeTab !== 'chat' || !isLogVisible) {
            setHasNewChatMessage(true);
        }
    });

    newSocket.on('ritPrompt', (data) => {
        setRitVoteOpen(true);
        setIsEligibleForRit(data.eligiblePlayers.includes(newSocket.id));
        setMessages(prev => [...prev, data.message]);
    });

    newSocket.on('gameNotFound', () => {
        setError('The game you tried to join does not exist. Redirecting...');
        setTimeout(() => {
            navigate('/play-with-friends');
        }, 3000);
    });

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
          // Update the URL to include the new game ID
          navigate(`/play-with-friends/${response.gameId}`, { replace: true });
        } else {
          setError(response.message || 'Error creating game.');
        }
      });
    }
  }, [socket, playerName, initialGameSettings, navigate]);

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
  
  const handleTakeSeat = useCallback((seatIndex) => {
    if (socket && gameId) {
      socket.emit('takeSeat', { gameId, seatIndex }, (response) => {
        if (response && response.status === 'error') {
          setError(response.message || 'Could not take seat.');
        } else {
          setError('');
        }
      });
    }
  }, [socket, gameId]);

  const handlePlayerAction = useCallback((action, details = {}) => {
    if (!socket || !gameId || !gameState) return;
    const seatedPlayers = gameState.seats.filter(s => !s.isEmpty).map(s => s.player);
    if (typeof gameState.currentPlayerIndex === 'undefined') return;

    const currentPlayer = seatedPlayers[gameState.currentPlayerIndex];
    if (currentPlayer && currentPlayer.id === socket.id) {
        socket.emit('playerAction', { gameId, action, details });
    } else {
        console.warn("Not your turn or current player info is missing.");
        setMessages(prev => [...prev, "It's not your turn!"]);
    }
  }, [socket, gameId, gameState]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (socket && gameId && chatInput.trim()) {
      socket.emit('chatMessage', { gameId, message: chatInput.trim() });
      setChatInput('');
    }
  };

  const handleSaveSettings = useCallback((newSettings) => {
    if (socket && gameId && gameState?.hostId === socket.id) {
        socket.emit('updateGameSettings', { gameId, newSettings }, (response) => {
            if (response.status === 'ok') {
                setMessages(prev => [...prev, 'Game settings have been updated for the next hand.']);
            } else {
                setError(response.message || 'Error updating settings.');
            }
        });
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
  const isPreflop = gameState?.currentBettingRound === GamePhase.PREFLOP;
  let preflopOptions = [];

  const seatedPlayers = gameState?.seats ? gameState.seats.filter(s => !s.isEmpty).map(s => s.player) : [];
  const currentPlayerFromServer = gameState?.currentPlayerIndex >= 0 ? seatedPlayers[gameState.currentPlayerIndex] : null;

  if (socket && currentPlayerFromServer) {
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
          // The total bet must be at least the highest bet plus the minimum raise amount.
          const calculatedMinBet = highestBetNum + minRaise;
          // The maximum total bet is the player's stack plus what they've already bet.
          const calculatedMaxBet = myStackNum + currentBetNum;

          minBetAmount = Math.min(calculatedMinBet, calculatedMaxBet);
          maxBetAmount = calculatedMaxBet;
          
          canBet = myStackNum > 0 && !me.isAllIn;
          // Ensure if betting is possible, the minBet is at least the call amount (or BB if no bet)
          if(canBet && highestBetNum > 0) {
            minBetAmount = Math.max(minBetAmount, highestBetNum);
          } else if (canBet) {
            minBetAmount = Math.max(minBetAmount, bigBlind);
          }
     
          if (isPreflop) {
              preflopOptions = [2, 3, 4].map(multiplier => ({
                  label: `${multiplier}x`,
                  amount: multiplier * bigBlind
              }));
          }
      }
  }
  // ---- End Action Button Prop Calculation ----

  const tableStyle = {
      width: '180vmin',
      aspectRatio: '16/9',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
      overflow: 'visible',
      backgroundImage: `url(${tableBg})`,
      backgroundColor: 'transparent',
  };

  // Render create/join buttons only if no auto-action is triggered and not in a game
  const showManualControls = !initialGameSettings && !joinWithGameId && !gameId;

  let hostName = '';
  if (gameState && gameState.hostId) {
    const allPlayers = [
        ...gameState.seats.filter(s => !s.isEmpty).map(s => s.player),
        ...gameState.spectators
    ];
    const host = allPlayers.find(p => p.id === gameState.hostId);
    if (host) {
        hostName = host.name;
    }
  }

  const handleRitVote = useCallback((vote) => {
    if (socket && gameId) {
        socket.emit('ritVote', { gameId, vote });
        setRitVoteOpen(false);
    }
  }, [socket, gameId]);

  // Basic UI for creating/joining and displaying messages/game state
  if (!socket) {
    return (
        <div className="poker-wrapper w-full h-full fixed inset-0" style={{backgroundColor:'#111111',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div className="text-white">Connecting to server...</div>
        </div>
    );
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
  
  // Main Game View - If gameId is set (meaning in a room) or gameState is available
  return (
    <div className="poker-wrapper w-full h-full fixed inset-0" style={{backgroundColor:'#111111',display:'flex',alignItems:'center',justifyContent:'center'}}>
        
        {/* Game Info - Top Left */}
        <div className="absolute top-4 left-4 z-20 text-left max-w-xs text-white">
            <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold">Game: {gameId}</h2>
                <button 
                    onClick={() => setIsSettingsModalOpen(true)} 
                    className="text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center bg-gray-800 bg-opacity-50 hover:bg-gray-700 hover:bg-opacity-70 rounded-md transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0L8 7.48a1 1 0 01-1.41 1.41l-4.31-1.51c-1.56-.38-2.38 1.24-1.25 2.38l3.17 3.17a1 1 0 010 1.41l-3.17 3.17c-1.13 1.13.31 2.75 1.87 2.37l4.31-1.51a1 1 0 011.41 1.41l-1.51 4.31c-.38 1.56 1.24 2.38 2.38 1.25l3.17-3.17a1 1 0 011.41 0l3.17 3.17c1.13 1.13 2.75-.31 2.37-1.87l-1.51-4.31a1 1 0 011.41-1.41l4.31 1.51c1.56.38 2.38-1.24 1.25-2.38l-3.17-3.17a1 1 0 010-1.41l3.17-3.17c1.13-1.13-.31-2.75-1.87-2.37l-4.31 1.51a1 1 0 01-1.41-1.41l1.51-4.31zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            {error && <p className="text-red-500 bg-red-100 border border-red-500 p-2 rounded my-1 text-sm">Error: {error}</p>}
             {gameState && (
                 <>
                    {hostName && <p className="text-sm text-gray-400">Host: {hostName}</p>}
                    <p className="text-md">Status: <span className="font-semibold">{gameState.currentBettingRound}</span></p>
                    {gameState.hostId === socket?.id && gameState.currentBettingRound === GamePhase.WAITING && gameState.seats.filter(s => !s.isEmpty).length >= 2 && (
                        <button 
                            onClick={handleStartGame} 
                            className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out text-sm">
                            Start Game ({gameState.seats.filter(s => !s.isEmpty).length}/{gameState.gameSettings.maxPlayers || 'N/A'})
                        </button>
                    )}
                    {gameState.hostId === socket?.id && gameState.currentBettingRound === GamePhase.WAITING && gameState.seats.filter(s => !s.isEmpty).length < 2 && (
                        <p className="text-yellow-400 mt-1 text-sm">Waiting for at least 2 players...</p>
                    )}
                 </>
             )}
        </div>

        {/* Player List - Top Right */}
        {gameState && (
             <div className="absolute top-4 right-4 z-20 text-right max-w-xs text-white bg-black bg-opacity-40 p-2 rounded">
                <h3 className="text-md font-bold mb-1">Players & Spectators:</h3>
                <ul className="text-sm">
                  {gameState.seats.filter(s => !s.isEmpty).map((s, index) => (
                    <li key={s.player.id} className={`${s.player.id === socket?.id ? 'font-bold text-yellow-300' : ''}`}>
                      {s.player.name} (Stack: {s.player.stack})
                      {gameState.currentPlayerIndex === index && ' (Turn)'}
                    </li>
                  ))}
                  {gameState.spectators.map(spectator => (
                     <li key={spectator.id} className={`italic text-gray-400 ${spectator.id === socket?.id ? 'font-bold' : ''}`}>
                        {spectator.name} (Spectating)
                     </li>
                  ))}
                </ul>
            </div>
        )}

        {isSettingsModalOpen && (
            <GameSettingsModal 
                gameSettings={gameState?.gameSettings} 
                onClose={() => setIsSettingsModalOpen(false)} 
                isHost={gameState?.hostId === socket?.id}
                onSave={handleSaveSettings}
            />
        )}

        <RitVoteModal 
            isOpen={ritVoteOpen}
            onVote={handleRitVote}
            isEligible={isEligibleForRit}
        />

        {/* Poker Table Area */}
        <div
            ref={tableRef}
            className="poker-table relative"
            style={tableStyle}
        >
             {gameState ? (
                <OnlinePokerTableDisplay 
                    gameState={gameState} 
                    currentSocketId={socket?.id} 
                    GamePhase={GamePhase}
                    onTakeSeat={handleTakeSeat}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <p className="text-2xl text-gray-400">Loading game state for {gameId}...</p>
                </div>
            )}
        </div>

        {/* Game Log & Chat - Bottom Left */}
        <div className="absolute bottom-4 left-4 z-20 w-full max-w-md">
            {/* Tab Buttons */}
            <div className="flex border-b border-gray-700 bg-gray-900 bg-opacity-80 rounded-t-md pr-2">
                <button 
                    onClick={() => {
                        setActiveTab('log');
                        if (!isLogVisible) setIsLogVisible(true);
                    }}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === 'log' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    Game Log
                </button>
                <button 
                    onClick={() => {
                        setActiveTab('chat');
                        setHasNewChatMessage(false);
                        if (!isLogVisible) setIsLogVisible(true);
                    }}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === 'chat' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    Chat
                    {hasNewChatMessage && (
                        <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-900"></span>
                    )}
                </button>
                <div className="flex-grow"></div>
                <button onClick={() => setIsLogVisible(!isLogVisible)} className="p-2 text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${isLogVisible ? 'rotate-0' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Tab Content */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isLogVisible ? 'max-h-96' : 'max-h-0'}`}>
                <div className="h-48 bg-gray-900 bg-opacity-80 p-2 border border-t-0 border-gray-600 rounded-b-md text-white flex flex-col">
                    {activeTab === 'log' && (
                        <div className="h-full overflow-y-auto">
                            {messages.slice().reverse().map((msg, index) => <div key={index} className="text-sm">{msg}</div>)}
                        </div>
                    )}
                    {activeTab === 'chat' && (
                        <>
                            <div className="flex-grow overflow-y-auto">
                               {chatMessages.map((msg, index) => (
                                    <div key={index} className="text-sm mb-1">
                                        <span className="font-bold text-yellow-300">{msg.sender}: </span>
                                        <span>{msg.message}</span>
                                    </div>
                               ))}
                            </div>
                            <form onSubmit={handleSendMessage} className="mt-2 flex">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Say something..."
                                    className="flex-grow p-2 rounded-l-md border border-gray-600 bg-gray-800 text-white text-sm"
                                />
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md text-sm">
                                    Send
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
        
        {/* Action Buttons - Bottom Right */}
        <div className="absolute bottom-4 right-4 z-20">
            <div className="flex flex-col items-end">
                {isMyTurn && gameState?.currentBettingRound !== GamePhase.WAITING && gameState?.currentBettingRound !== GamePhase.HAND_OVER && (
                    <div className="p-3 bg-gray-800 bg-opacity-90 rounded shadow-md flex justify-end border border-gray-600">
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
                            isPreflop={isPreflop}
                            preflopOptions={preflopOptions}
                        />
                    </div>
                )}
                {!isMyTurn && gameState?.currentBettingRound !== GamePhase.WAITING && gameState?.currentBettingRound !== GamePhase.HAND_OVER && currentPlayerFromServer && (
                    <div className="p-3 bg-gray-800 bg-opacity-90 rounded shadow-md text-center border border-gray-600">
                        <p className="text-yellow-300">Waiting for {currentPlayerFromServer.name}'s action...</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}

export default OnlinePokerRoom; 