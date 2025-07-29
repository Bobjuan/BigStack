import React, { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';

const TournamentPage = () => {
  const [gameState, setGameState] = useState('setup'); // setup, playing, finished

  const renderSetup = () => (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Tournament Setup</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tournament Type</label>
          <select className="w-full px-4 py-2 bg-[#2f3542] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="sng">Sit & Go (9 players)</option>
            <option value="mtt">Multi-Table Tournament</option>
            <option value="turbo">Turbo SNG</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Buy-in Level</label>
          <select className="w-full px-4 py-2 bg-[#2f3542] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="low">$10 + $1</option>
            <option value="medium">$50 + $5</option>
            <option value="high">$100 + $10</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Starting Stack</label>
          <select className="w-full px-4 py-2 bg-[#2f3542] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="1500">1,500 chips</option>
            <option value="3000">3,000 chips</option>
            <option value="5000">5,000 chips</option>
          </select>
        </div>
        <Button 
          variant="primary" 
          className="w-full py-3"
          onClick={() => setGameState('playing')}
        >
          Register & Start
        </Button>
      </div>
    </div>
  );

  const renderGame = () => (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Tournament Table</h2>
            <p className="text-gray-400">Level 1 - Blinds: 10/20</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Players Left: 9/9</p>
            <p className="text-sm text-gray-400">Average Stack: 3,000</p>
          </div>
        </div>
        <div className="h-2 bg-[#2f3542] rounded-full">
          <div className="h-2 bg-blue-600 rounded-full" style={{ width: '20%' }} />
        </div>
      </div>
      
      <div className="aspect-[1.75] bg-[#2f3542] rounded-lg mb-6 flex items-center justify-center">
        <p className="text-gray-400">Tournament table will be rendered here</p>
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
          <h2 className="text-2xl font-bold mb-4">Tournament Complete</h2>
          <p className="text-gray-400 mb-2">Final Position: 3rd</p>
          <p className="text-gray-400 mb-6">Prize: $25</p>
          <Button 
            variant="primary"
            onClick={() => setGameState('setup')}
          >
            Play Another Tournament
          </Button>
        </div>
      )}
    </PageLayout>
  );
};

export default TournamentPage; 