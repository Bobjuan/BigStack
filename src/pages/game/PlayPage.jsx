import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PlayPage = () => {
  const [gameType, setGameType] = useState(null);

  const cashGames = [
    {
      title: '6-Max Cash',
      description: 'Fast-paced 6-player table. Great for practicing range reading and aggression.',
      href: '/cash-game',
      icon: '♠️'
    },
    {
      title: 'Heads-Up Cash',
      description: 'One-on-one matches to sharpen your postflop tactics and reads.',
      href: '/heads-up',
      icon: '🃏'
    },
    {
      title: 'Deep Stack',
      description: 'Play with 200bb and focus on deep strategic play and multi-street planning.',
      href: '/deep-stack',
      icon: '💰'
    }
  ];

  const tournamentGames = [
    {
      title: 'Turbo Tournament',
      description: 'High blinds and quick action. Perfect for ICM and shove/fold training.',
      href: '/tournament',
      icon: '⚡'
    },
    {
      title: 'Sit & Go',
      description: 'Single table tournaments. Great for practicing final table play.',
      href: '/sng',
      icon: '🎯'
    },
    {
      title: 'MTT',
      description: 'Multi-table tournaments with varying stack depths.',
      href: '/mtt',
      icon: '🏆'
    }
  ];

  const renderGameOptions = (games) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {games.map((game, index) => (
        <Link 
          key={index}
          to={game.href}
          className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-8 transform transition-all duration-200 hover:scale-105 hover:from-gray-600 hover:to-gray-700 shadow-lg text-center"
        >
          <h2 className="text-2xl font-bold mb-3">{game.title}</h2>
          <p className="text-gray-300">{game.description}</p>
        </Link>
      ))}
      <div className="lg:col-start-2">
        <button 
          onClick={() => setGameType(null)}
          className="w-full bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-xl p-8 transform transition-all duration-200 hover:scale-105 hover:from-indigo-600 hover:to-indigo-800 shadow-lg flex items-center justify-center"
        >
          <span className="text-2xl font-bold">Back to Game Types</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex gap-8">
            <Link 
              to="/play"
              className="text-2xl font-bold hover:text-indigo-400 transition-colors duration-200"
            >
              Play Now
            </Link>
            <Link 
              to="/learn"
              className="text-2xl font-bold text-gray-400 hover:text-white transition-colors duration-200"
            >
              Learn
            </Link>
          </div>
          <div className="flex gap-4">
            <Link 
              to="/dashboard"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold hover:from-indigo-600 hover:to-indigo-800 transition-all duration-200"
            >
              Home
            </Link>
            <Link 
              to="/profile"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold hover:from-indigo-600 hover:to-indigo-800 transition-all duration-200"
            >
              Profile
            </Link>
          </div>
        </div>

        {/* Game Type Selection */}
        {!gameType ? (
          <div>
            <h1 className="text-4xl font-extrabold text-center mb-12">Choose Your Game Type</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <button
                onClick={() => setGameType('cash')}
                className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-8 transform transition-all duration-200 hover:scale-105 hover:from-gray-600 hover:to-gray-700 shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-3">Cash Games</h2>
                <p className="text-gray-300">Practice with play money in various cash game formats</p>
              </button>
              <button
                onClick={() => setGameType('tournament')}
                className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-8 transform transition-all duration-200 hover:scale-105 hover:from-gray-600 hover:to-gray-700 shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-3">Tournaments</h2>
                <p className="text-gray-300">Compete in various tournament formats and structures</p>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-4xl font-extrabold text-center mb-12">
              {gameType === 'cash' ? 'Choose Your Cash Game Format' : 'Choose Your Tournament Format'}
            </h1>
            {gameType === 'cash' ? renderGameOptions(cashGames) : renderGameOptions(tournamentGames)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayPage; 