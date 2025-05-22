import React, { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';
import PokerGame from '../../components/poker/PokerGame';

const CashGamePage = () => {
  const [gameState, setGameState] = useState('setup'); // setup, playing, finished

  const renderSetup = () => (
    <div className="max-w-md mx-auto text-center">
      <h2 className="text-4xl font-bold mb-8 text-gray-900">6-Max Cash Game Setup</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-medium mb-3 text-gray-700">Select Buy-in Amount</label>
          <select className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 text-center font-medium">
            <option value="1000">$1000 (100BB)</option>
            <option value="2000">$2000 (200BB)</option>
            <option value="5000">$5000 (500BB)</option>
          </select>
        </div>
        <Button 
          variant="primary" 
          className="w-full py-4 mt-6 bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 rounded-xl text-lg font-semibold text-white"
          onClick={() => setGameState('playing')}
        >
          Start Game
        </Button>
      </div>
    </div>
  );

  const renderGame = () => (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">6-Max Cash Game</h2>
        <p className="text-gray-600">Blinds: $5/$10</p>
      </div>
      
      <div className="w-full overflow-x-auto">
        <PokerGame />
      </div>

      <div className="mt-8 flex justify-center">
        <Button 
          variant="danger"
          className="px-8 py-3 bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 rounded-xl text-white"
          onClick={() => setGameState('finished')}
        >
          Leave Table
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {gameState === 'setup' && renderSetup()}
        {gameState === 'playing' && renderGame()}
        {gameState === 'finished' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Game Over</h2>
            <p className="text-gray-600 text-lg mb-8">You finished with $1,234</p>
            <Button 
              variant="primary"
              className="px-8 py-3 bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 rounded-xl text-white"
              onClick={() => setGameState('setup')}
            >
              Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashGamePage; 