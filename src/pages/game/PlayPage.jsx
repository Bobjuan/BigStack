import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PlayPage = () => {
  const [gameType, setGameType] = useState(null);

  const cashGames = [
    {
      title: '6-Max Cash',
      description: 'Fast-paced 6-player table. Great for practicing range reading and aggression.',
      href: '/cash-game'
    },
    {
      title: 'Heads-Up Cash',
      description: 'One-on-one matches to sharpen your postflop tactics and reads.',
      href: '/heads-up'
    },
    {
      title: 'Deep Stack',
      description: 'Play with 200bb and focus on deep strategic play and multi-street planning.',
      href: '/deep-stack'
    }
  ];

  const tournamentGames = [
    {
      title: 'Turbo Tournament',
      description: 'High blinds and quick action. Perfect for ICM and shove/fold training.',
      href: '/tournament'
    },
    {
      title: 'Sit & Go',
      description: 'Single table tournaments. Great for practicing final table play.',
      href: '/sng'
    },
    {
      title: 'MTT',
      description: 'Multi-table tournaments with varying stack depths.',
      href: '/mtt'
    }
  ];

  const renderGameOptions = (games) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {games.map((game, index) => (
        <Link 
          key={index}
          to={game.href}
          className="bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-all duration-200 hover:-translate-y-1 shadow-lg text-center"
        >
          <h2 className="text-2xl font-bold mb-3">{game.title}</h2>
          <p className="text-gray-300">{game.description}</p>
        </Link>
      ))}
      <div className="lg:col-start-2">
        <button 
          onClick={() => setGameType(null)}
          className="w-full bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-2xl p-8 transition-all duration-200 hover:-translate-y-1 hover:from-indigo-600 hover:to-indigo-800 shadow-lg flex items-center justify-center"
        >
          <span className="text-2xl font-bold">Back to Game Types</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F1115] text-white font-inter">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0F1115]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 md:px-12 h-20">
          <div className="flex gap-8">
            <Link 
              to="/play"
              className="text-xl font-semibold tracking-tight hover:text-indigo-400 transition-colors duration-200"
            >
              Play Now
            </Link>
            <Link 
              to="/learn"
              className="text-xl font-semibold tracking-tight text-gray-400 hover:text-white transition-colors duration-200"
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
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Game Type Selection */}
          {!gameType ? (
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-center mb-12">Choose Your Game Type</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
                <button
                  onClick={() => setGameType('cash')}
                  className="bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-all duration-200 hover:-translate-y-1 shadow-lg text-center"
                >
                  <h2 className="text-2xl font-bold mb-3">Cash Games</h2>
                  <p className="text-gray-300">Practice with play money in various cash game formats</p>
                </button>
                <button
                  onClick={() => setGameType('tournament')}
                  className="bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-all duration-200 hover:-translate-y-1 shadow-lg text-center"
                >
                  <h2 className="text-2xl font-bold mb-3">Tournaments</h2>
                  <p className="text-gray-300">Compete in various tournament formats and structures</p>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-center mb-12">
                {gameType === 'cash' ? 'Choose Your Cash Game Format' : 'Choose Your Tournament Format'}
              </h1>
              {gameType === 'cash' ? renderGameOptions(cashGames) : renderGameOptions(tournamentGames)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PlayPage; 