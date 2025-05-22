import React, { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';

const HeadsUpPage = () => {
  const [gameState, setGameState] = useState('setup'); // setup, playing, finished

  const renderSetup = () => (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Heads Up Game Setup</h2>
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
            <option value="button">Button/Small Blind</option>
            <option value="bb">Big Blind</option>
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
          <h2 className="text-2xl font-bold">Heads Up Game</h2>
          <p className="text-gray-400">Blinds: $5/$10</p>
        </div>
        <Button 
          variant="danger"
          onClick={() => setGameState('finished')}
        >
          Leave Table
        </Button>
      </div>
      
      <div className="aspect-video bg-[#2f3542] rounded-lg mb-6 flex items-center justify-center">
        <p className="text-gray-400">Game interface will be rendered here</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="primary">Call</Button>
        <Button variant="primary">Raise</Button>
        <Button variant="secondary">Fold</Button>
        <Button variant="secondary">Check</Button>
      </div>
    </div>
  );

  return (
    <PageLayout>
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

export default HeadsUpPage; 