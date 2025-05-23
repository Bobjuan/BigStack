import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PlayPage = () => {
  const [gameType, setGameType] = useState('cash'); // Default to cash games

  const cashGames = [
    {
      title: 'Heads Up',
      description: 'One-on-one matches to sharpen your postflop tactics and reads.',
      href: '/heads-up'
    },
    {
      title: '6-Max',
      description: 'Fast-paced 6-player table. Great for practicing range reading and aggression.',
      href: '/cash-game'
    },
    {
      title: '9-Max',
      description: 'Full ring games with more players and complex dynamics.',
      href: '/nine-max'
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {games.map((game, index) => (
        <Link 
          key={index}
          to={game.href}
          className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-200 hover:-translate-y-1 shadow-lg"
        >
          <h2 className="text-xl font-bold mb-2">{game.title}</h2>
          <p className="text-sm text-gray-300">{game.description}</p>
        </Link>
      ))}
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
              Play
            </Link>
            <Link 
              to="/learn"
              className="text-xl font-semibold tracking-tight text-gray-400 hover:text-white transition-colors duration-200"
            >
              Learn
            </Link>
            <Link 
              to="/quiz"
              className="text-xl font-semibold tracking-tight text-gray-400 hover:text-white transition-colors duration-200"
            >
              Quiz
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
          {/* Game Type Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/5 rounded-full p-1 inline-flex">
              <button
                onClick={() => setGameType('cash')}
                className={`px-6 py-2 rounded-full text-base font-semibold transition-all duration-200 ${
                  gameType === 'cash'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Cash Games
              </button>
              <button
                onClick={() => setGameType('tournament')}
                className={`px-6 py-2 rounded-full text-base font-semibold transition-all duration-200 ${
                  gameType === 'tournament'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Tournaments
              </button>
              <Link
                to="/play-with-friends"
                className="px-6 py-2 rounded-full text-base font-semibold text-gray-400 hover:text-white transition-all duration-200"
              >
                Play with Friends
              </Link>
            </div>
          </div>

          {/* Game Options */}
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-center mb-8">
              {gameType === 'cash' ? 'Choose Your Cash Game Format' : 'Choose Your Tournament Format'}
            </h1>
            {gameType === 'cash' ? renderGameOptions(cashGames) : renderGameOptions(tournamentGames)}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlayPage; 