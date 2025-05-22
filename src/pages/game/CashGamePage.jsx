import React, { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';
import PokerGame from '../../components/poker/PokerGame';

const CashGamePage = () => {
  const [gameState, setGameState] = useState('setup'); // setup, playing, finished

  const renderSetup = () => (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Game Setup</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Buy-in Amount</label>
          <select className="w-full px-4 py-2 bg-[#2f3542] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="1000">$1000 (100BB)</option>
            <option value="2000">$2000 (200BB)</option>
            <option value="5000">$5000 (500BB)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Position</label>
          <select className="w-full px-4 py-2 bg-[#2f3542] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="random">Random</option>
            <option value="button">Button</option>
            <option value="cutoff">Cut-off</option>
            <option value="hijack">Hijack</option>
            <option value="lojack">Lojack</option>
            <option value="utg">UTG</option>
          </select>
        </div>
        <Button 
          variant="primary" 
          className="w-full py-3"
          onClick={() => setGameState('playing')}
        >
          Start Game
        </Button>
      </div>
    </div>
  );

  const renderGame = () => (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">6-Max Cash Game</h2>
          <p className="text-gray-400">Blinds: $5/$10</p>
        </div>
        <Button 
          variant="danger"
          onClick={() => setGameState('finished')}
        >
          Leave Table
        </Button>
      </div>
      
      <div className="w-full overflow-x-auto">
        <PokerGame />
      </div>
    </div>
  );

  return (
    <PageLayout showNavigation={false}>
      {gameState === 'setup' && renderSetup()}
      {gameState === 'playing' && renderGame()}
      {gameState === 'finished' && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Game Over</h2>
          <p className="text-gray-400 mb-6">You finished with $1,234</p>
          <Button 
            variant="primary"
            onClick={() => setGameState('setup')}
          >
            Play Again
          </Button>
        </div>
      )}
    </PageLayout>
  );
};

export default CashGamePage; 