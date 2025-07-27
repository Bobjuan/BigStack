import React, { useState, useEffect } from 'react';
import { usePokerGameAdapter } from '../../hooks/usePokerGameAdapter';
import Features from '../../config/features';
import { useAuth } from '../../context/AuthContext';

/**
 * Example component showing how to integrate PokerGameAdapter
 * This demonstrates the migration path from PokerGame.jsx to the adapter pattern
 * 
 * This can be used as a template for updating:
 * - Bot9MaxPage.jsx
 * - Bot6MaxPage.jsx 
 * - BotHeadsUpPage.jsx
 * - CashGamePage.jsx
 * - HeadsUpPage.jsx
 * - DeepStackPage.jsx
 */
const PokerGameAdapterExample = ({ 
  initialNumPlayers = 9, 
  vsBot = true,
  gameSettings = {}
}) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [showFeatureStatus, setShowFeatureStatus] = useState(false);

  // Initialize the adapter hook
  const {
    gameState,
    isInitialized,
    isLoading,
    error,
    connectionStatus,
    mode,
    handleFold,
    handleCheck,
    handleCall,
    handleBet,
    handleRaise,
    startNewHand,
    updateSettings,
    adapter
  } = usePokerGameAdapter({
    initialNumPlayers,
    vsBot,
    gameSettings: {
      blinds: { small: 5, big: 10 },
      timeBank: 60,
      allowTimeBank: true,
      ...gameSettings
    },
    onStateUpdate: (newState, actionLog) => {
      // Handle state updates
      if (actionLog?.message) {
        setMessage(actionLog.message);
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      }
    },
    onMessage: (msg) => {
      setMessage(msg);
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (err) => {
      console.error('Poker game error:', err);
      setMessage(`Error: ${err.message}`);
    }
  });

  // Get feature status for debugging
  const featureStatus = Features.getFeatureStatus(user?.id);

  // Action handlers with amounts
  const handleBetWithAmount = (amount) => {
    handleBet(amount);
  };

  const handleRaiseWithAmount = (amount) => {
    handleRaise(amount);
  };

  // Calculate action availability (matching PokerGame.jsx logic)
  const getCurrentPlayer = () => {
    if (!gameState?.players || gameState.currentPlayerIndex < 0) return null;
    return gameState.players[gameState.currentPlayerIndex];
  };

  const isHumanTurn = () => {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) return false;
    
    if (vsBot) {
      // In bot games, human is player with specific ID pattern
      return currentPlayer.id === 'player1' || currentPlayer.id.includes('human');
    }
    
    // In local games, all players are human-controlled
    return true;
  };

  const canCheck = () => {
    const currentPlayer = getCurrentPlayer();
    return currentPlayer && currentPlayer.currentBet >= (gameState?.currentHighestBet || 0);
  };

  const canCall = () => {
    const currentPlayer = getCurrentPlayer();
    return currentPlayer && currentPlayer.currentBet < (gameState?.currentHighestBet || 0);
  };

  const getCallAmount = () => {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) return 0;
    return Math.max(0, (gameState?.currentHighestBet || 0) - currentPlayer.currentBet);
  };

  const getMinBetAmount = () => {
    return gameState?.minRaiseAmount || gameState?.bigBlind || 10;
  };

  const getMaxBetAmount = () => {
    const currentPlayer = getCurrentPlayer();
    return currentPlayer?.stack || 0;
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-800">
        <div className="text-white text-xl">
          Initializing {mode === 'backend' ? 'online' : 'offline'} poker game...
        </div>
      </div>
    );
  }

  // Render error state
  if (error && !isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-900 text-white">
        <h2 className="text-2xl mb-4">Game Error</h2>
        <p className="mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // Render game
  return (
    <div className="min-h-screen bg-green-800 p-4">
      {/* Header with status info */}
      <div className="mb-4 text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Poker Game ({mode === 'backend' ? 'Online' : 'Offline'})
          </h1>
          <div className="flex space-x-4">
            <span className={`px-2 py-1 rounded text-sm ${
              connectionStatus === 'connected' ? 'bg-green-600' : 
              connectionStatus === 'local' ? 'bg-blue-600' : 'bg-red-600'
            }`}>
              {connectionStatus}
            </span>
            <button
              onClick={() => setShowFeatureStatus(!showFeatureStatus)}
              className="bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded text-sm"
            >
              Debug
            </button>
          </div>
        </div>
        
        {/* Feature status debug info */}
        {showFeatureStatus && (
          <div className="mt-2 p-3 bg-black bg-opacity-50 rounded text-sm">
            <pre>{JSON.stringify(featureStatus, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Message display */}
      {message && (
        <div className="mb-4 p-3 bg-blue-600 text-white rounded">
          {message}
        </div>
      )}

      {/* Game state display */}
      {gameState ? (
        <div className="bg-green-700 rounded-lg p-6">
          {/* Basic game info */}
          <div className="text-white mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>Pot: ${gameState.pot}</div>
              <div>Round: {gameState.currentBettingRound}</div>
              <div>Players: {gameState.numPlayers}</div>
              <div>Big Blind: ${gameState.bigBlind}</div>
            </div>
          </div>

          {/* Community cards */}
          {gameState.communityCards && gameState.communityCards.length > 0 && (
            <div className="mb-4">
              <h3 className="text-white mb-2">Community Cards:</h3>
              <div className="flex space-x-2">
                {gameState.communityCards.map((card, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded border-2 border-gray-300 w-12 h-16 flex items-center justify-center font-bold"
                  >
                    {card}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Players */}
          <div className="mb-4">
            <h3 className="text-white mb-2">Players:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {gameState.players?.map((player, index) => (
                <div 
                  key={player.id}
                  className={`p-3 rounded border-2 ${
                    player.isTurn ? 'border-yellow-400 bg-yellow-100' : 
                    player.isFolded ? 'border-gray-400 bg-gray-200' :
                    'border-white bg-gray-100'
                  }`}
                >
                  <div className="font-bold text-black">
                    {player.name} {player.isDealer && '(D)'} {player.isSB && '(SB)'} {player.isBB && '(BB)'}
                  </div>
                  <div className="text-sm text-gray-700">
                    Stack: ${player.stack} | Bet: ${player.currentBet}
                  </div>
                  {player.cards && player.cards.length > 0 && (
                    <div className="mt-2 flex space-x-1">
                      {player.cards.map((card, cardIndex) => (
                        <div 
                          key={cardIndex}
                          className="bg-white border border-gray-400 w-8 h-10 flex items-center justify-center text-xs font-bold"
                        >
                          {card}
                        </div>
                      ))}
                    </div>
                  )}
                  {player.isFolded && <div className="text-red-600 text-sm">FOLDED</div>}
                  {player.isAllIn && <div className="text-red-600 text-sm">ALL-IN</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          {isHumanTurn() && gameState.currentBettingRound !== 'HAND_OVER' && (
            <div className="bg-gray-800 rounded p-4">
              <h3 className="text-white mb-3">Your Actions:</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleFold}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Fold
                </button>
                
                {canCheck() ? (
                  <button
                    onClick={handleCheck}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Check
                  </button>
                ) : canCall() ? (
                  <button
                    onClick={handleCall}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Call ${getCallAmount()}
                  </button>
                ) : null}
                
                <button
                  onClick={() => handleBetWithAmount(getMinBetAmount())}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                >
                  Bet ${getMinBetAmount()}
                </button>
                
                <button
                  onClick={() => handleRaiseWithAmount(Math.floor(gameState.pot * 0.75))}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
                >
                  Raise ${Math.floor(gameState.pot * 0.75)}
                </button>
                
                <button
                  onClick={() => handleBetWithAmount(getMaxBetAmount())}
                  className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
                >
                  All-In ${getMaxBetAmount()}
                </button>
              </div>
            </div>
          )}

          {/* Start new hand button */}
          {gameState.currentBettingRound === 'HAND_OVER' && (
            <div className="mt-4">
              <button
                onClick={startNewHand}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-bold"
              >
                Start New Hand
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-white text-center">
          {isInitialized ? 'Waiting for game state...' : 'Initializing...'}
        </div>
      )}

      {/* Debug controls (only show in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-4 bg-black bg-opacity-50 rounded">
          <h3 className="text-white mb-2">Debug Controls:</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => Features.enableBackendForCurrentUser()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              Force Backend
            </button>
            <button
              onClick={() => Features.disableBackendForCurrentUser()}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Force Local
            </button>
            <button
              onClick={() => Features.clearUserOverride()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
            >
              Clear Override
            </button>
            <button
              onClick={() => Features.enableDebugMode()}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
            >
              Enable Debug
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokerGameAdapterExample;