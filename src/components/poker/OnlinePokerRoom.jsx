import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext'; // Assuming you want to use user info
import OnlinePokerTableDisplay from './OnlinePokerTableDisplay'; // Import the new display component
import ActionButtons from './ActionButtons'; // Import ActionButtons
import GameSettingsModal from './GameSettingsModal'; // Import the new modal component
import RitVoteModal from './RitVoteModal'; // Import RIT vote modal
import HandHistoryTab from './HandHistoryTab';
import dayjs from 'dayjs';
import tableBg from '/src/assets/blacktable.png'; // Import table background
import TableMenu from '../common/TableMenu';

// Connect to your backend server. Make sure the port matches your server.js
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000'; 

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
  const [handRows, setHandRows] = useState([]); // history rows
  const [gameState, setGameState] = useState(null); // To hold the game state from the server
  const [playerName, setPlayerName] = useState(user?.user_metadata?.full_name || user?.email || 'Player');
  const [playerStats, setPlayerStats] = useState({}); // NEW: State for player stats
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
  const [isPlayersPanelVisible, setIsPlayersPanelVisible] = useState(false);

  const SERVER_API = SERVER_URL; // same origin for dev

  // Effect for setting player name from user auth
  useEffect(() => {
    if (user && user.user_metadata && (user.user_metadata.username || user.user_metadata.full_name)) {
      setPlayerName(user.user_metadata.full_name || user.user_metadata.username);
    }
  }, [user]);

  // Establish a singleton socket so navigating between lobby and table does not
  // cause a disconnect that would delete the game on the server.
  const socketSingletonRef = useRef(null);

  useEffect(() => {
    if (!socketSingletonRef.current) {
      socketSingletonRef.current = io(SERVER_URL);
    }

    const newSocket = socketSingletonRef.current;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server with id:', newSocket.id);
    });

    newSocket.on('gameStateUpdate', (data) => {
      console.log('Received gameStateUpdate:', data.newState);
      const newState = data.newState;
      setGameState(newState);
      // Ensure local gameId is always in sync with server state
      if (newState?.id && newState.id !== gameId) {
        setGameId(newState.id);
      }
      
      let logMessage = null;
      if (data.actionLog && data.actionLog.message) {
        logMessage = data.actionLog.message;
      }
      // If hand is over, prioritize the handOverMessage for the log
      if (newState && newState.currentBettingRound === GamePhase.HAND_OVER) {
        logMessage = newState.handOverMessage; 
        if (gameId) fetchHandRows(gameId);
      }

      if (logMessage) {
        setMessages(prev => [...prev, logMessage]);
      }
    });
    
    // NEW: Listener for live stat updates from the server
    newSocket.on('playerStatsUpdate', (data) => {
      console.log('Received playerStatsUpdate:', data.updatedStats);
      setPlayerStats(prevStats => ({
        ...prevStats,
        ...data.updatedStats,
      }));
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

    // Do NOT disconnect on unmount – we want the same connection across
    // route transitions within the poker lobby & table.
    return () => {
      // Clean up listeners we attached in this mount.
      newSocket.off('gameStateUpdate');
      newSocket.off('playerStatsUpdate');
      newSocket.off('playerJoined');
      newSocket.off('playerLeft');
      newSocket.off('message');
      newSocket.off('chatMessage');
      newSocket.off('ritPrompt');
      newSocket.off('gameNotFound');
      newSocket.off('disconnect');
    };
  }, []); // Empty dependency array: runs only on mount and unmount

  // Callbacks for game actions (memoized)
  const handleCreateGame = useCallback((currentSocket, settings) => {
    const sock = currentSocket || socket;
    if (sock) {
      const playerDetails = { 
        name: playerName || `Player_${sock.id.substring(0,5)}`,
        userId: user?.id,
        email: user?.email,
      };
      sock.emit('createGame', { playerInfo: playerDetails, gameSettings: settings || initialGameSettings }, (response) => {
        if (response.status === 'ok') {
          // Store the new gameId locally so subsequent actions (take seat, etc.) work in-tab.
          setGameId(response.gameId);
          // Update the route so MainLayout reacts (hides sidebar) and URL is shareable
          navigate(`/play/friends/${response.gameId}`, { replace: true });
          setError('');
        } else {
          setError(response.message || 'Error creating game.');
        }
      });
    }
  }, [socket, playerName, initialGameSettings, user, navigate]);

  const handleJoinGame = useCallback((currentSocket, gameIdToJoin) => {
    const sock = currentSocket || socket;
    const idToJoin = gameIdToJoin || inputGameId;
    if (sock && idToJoin) {
      const playerDetails = { 
        name: playerName || `Player_${sock.id.substring(0,5)}`,
        userId: user?.id,
        email: user?.email,
      };
      sock.emit('joinGame', { gameId: idToJoin, playerInfo: playerDetails }, (response) => {
        if (response.status === 'ok' || response.status === 'already_joined') {
          // Stay in the same tab – just remember the gameId
          setGameId(idToJoin);
          navigate(`/play/friends/${idToJoin}`, { replace: true });
          // Fetch initial stats for the table now that we are in the room
          sock.emit('fetchStats', idToJoin, null, (statsResponse) => {
            if (statsResponse.status === 'ok') {
              setPlayerStats(statsResponse.stats);
              console.log('Fetched initial stats:', statsResponse.stats);
            } else {
              console.error('Could not fetch stats:', statsResponse.message);
            }
          });
        } else {
          setError(response.message || 'Error joining game.');
        }
      });
    }
  }, [socket, inputGameId, playerName, user, navigate]);

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
      aspectRatio: '1.75',
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

  const fetchHandRows = async (gId) => {
    try {
      const res = await fetch(`${SERVER_API}/api/games/${gId}/hands?limit=20`);
      if (!res.ok) return;
      const data = await res.json();
      setHandRows(data);
    } catch (e) {
      console.error('fetchHandRows error', e);
    }
  };

  useEffect(() => {
    if (gameId) {
      fetchHandRows(gameId);
    }
  }, [gameId]);

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
        
        {/* Game Info - Top Center */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-center select-none">
            {gameState && (
                <div className="px-4 py-1 rounded-full backdrop-blur-sm bg-white/5 border border-white/10 text-sm text-gray-200 flex items-center space-x-2">
                    <span className="font-medium">Table {gameId}</span>
                    <span className="text-xs text-gray-400">{gameState.currentBettingRound}</span>
                </div>
            )}
        </div>

        {/* Table menu (top-left) */}
        <div className="absolute top-4 left-4 z-30">
            <TableMenu align="left"
                onSettings={() => setIsSettingsModalOpen(true)}
                onPlayers={() => setIsPlayersPanelVisible(true)}
                onLedger={() => alert('Ledger coming soon')} // placeholder
                onLeave={() => {
                    if (socketSingletonRef.current) {
                       try { socketSingletonRef.current.disconnect(); } catch(_){}
                       socketSingletonRef.current = null;
                    }
                    navigate('/play');
                }}
            />
        </div>

        {/* Start game button (host only) */}
        {gameState && gameState.hostId === socket?.id && gameState.currentBettingRound === GamePhase.WAITING && (
            <div className="absolute top-4 right-4 z-30">
               {gameState.seats.filter(s=>!s.isEmpty).length >=2 ? (
                  <button
                    onClick={handleStartGame}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-full shadow">
                      Start Game
                  </button>
               ) : (
                  <span className="text-xs text-gray-400">Waiting for players…</span>
               )}
            </div>
        )}

        {/* Players & spectators panel */}
        {isPlayersPanelVisible && gameState && (
            <div className="fixed top-0 right-0 h-full w-64 bg-black/90 backdrop-blur-sm border-l border-white/10 z-40 p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Players</h3>
                  <button onClick={()=>setIsPlayersPanelVisible(false)} className="text-gray-400 hover:text-white">✕</button>
                </div>
                <ul className="space-y-2 text-sm">
                    {gameState.seats.filter(s=>!s.isEmpty).map((s)=> (
                        <li key={s.player.id} className="flex justify-between"><span>{s.player.name}</span><span>${s.player.stack}</span></li>
                    ))}
                </ul>
                {gameState.spectators.length>0 && (
                  <>
                    <h4 className="mt-4 mb-2 text-sm font-semibold text-gray-300">Spectators</h4>
                    <ul className="space-y-1 text-xs text-gray-400">
                       {gameState.spectators.map(sp=>(<li key={sp.id}>{sp.name}</li>))}
                    </ul>
                  </>
                )}
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
                    playerStats={playerStats}
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
                <button
                    onClick={() => {
                      setActiveTab('history');
                      if (!isLogVisible) setIsLogVisible(true);
                    }}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === 'history' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    History
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
                            {gameState?.gameSettings?.allowChat ? (
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
                            ) : (
                                <div className="mt-2 p-2 text-center text-sm text-gray-400 bg-gray-800 rounded-md">
                                    Chat is disabled by the host.
                                </div>
                            )}
                        </>
                    )}
                    {activeTab === 'history' && (
                       <HandHistoryTab
                          rows={handRows}
                          heroId={user?.id}
                          onAnalyze={(handId)=>{
                             console.log('analyze', handId);
                             // Future: open modal or emit socket
                          }}
                       />
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