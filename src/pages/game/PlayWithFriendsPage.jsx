import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OnlinePokerRoom from '../../components/poker/OnlinePokerRoom';

const PlayWithFriendsPage = () => {
  const [gameSettings, setGameSettings] = useState({
    gameType: 'cash', // 'cash' or 'tournament'
    startingStack: 100,
    blinds: {
      small: 0.5,
      big: 1
    },
    maxPlayers: 9,
    timeBank: 30, // seconds
    autoRebuy: true,
    allowStraddle: true,
    allowRunItTwice: true,
    allowInsurance: false,
    allowChat: true,
    allowEmotes: true,
    allowTimeBank: true,
    allowShowOne: true
  });
  
  const [mode, setMode] = useState('idle'); // 'idle', 'creatingRoom', 'joiningRoom'
  const [joinGameIdInput, setJoinGameIdInput] = useState('');

  const handleSettingChange = (setting, value) => {
    setGameSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleBlindChange = (blind, value) => {
    setGameSettings(prev => ({
      ...prev,
      blinds: {
        ...prev.blinds,
        [blind]: value
      }
    }));
  };

  const handleStartCreateRoom = () => {
    setMode('creatingRoom');
  };

  const handleStartJoinRoom = () => {
    if (joinGameIdInput.trim() === '') {
      alert('Please enter a Game ID to join.'); // Simple validation
      return;
    }
    setMode('joiningRoom');
  };

  if (mode === 'creatingRoom') {
    return <OnlinePokerRoom initialGameSettings={gameSettings} />;
  }

  if (mode === 'joiningRoom') {
    return <OnlinePokerRoom joinWithGameId={joinGameIdInput} />;
  }

  // Idle mode: show create/join options
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-center mb-12">Play With Friends</h1>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Create Private Game Section */}
            <section className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 border border-white/10 shadow-xl">
              <h2 className="text-3xl font-semibold mb-6 text-center">Create Private Game</h2>
              
              {/* Game Settings Form (copied from existing, can be componentized later) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Game Type</label>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => handleSettingChange('gameType', 'cash')}
                    className={`w-full px-6 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                      gameSettings.gameType === 'cash'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    Cash Game
                  </button>
                  <button
                    onClick={() => handleSettingChange('gameType', 'tournament')}
                    className={`w-full px-6 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                      gameSettings.gameType === 'tournament'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    Tournament
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Starting Stack (BB)</label>
                  <input type="number" value={gameSettings.startingStack} onChange={(e) => handleSettingChange('startingStack', parseInt(e.target.value))} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" min="20" max="1000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Players</label>
                  <select value={gameSettings.maxPlayers} onChange={(e) => handleSettingChange('maxPlayers', parseInt(e.target.value))} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="2">Heads Up (2)</option>
                    <option value="6">6-Max</option>
                    <option value="9">9-Max</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Blinds</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Small Blind</label>
                    <input type="number" value={gameSettings.blinds.small} onChange={(e) => handleBlindChange('small', parseFloat(e.target.value))} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" step="0.5" min="0.5" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Big Blind</label>
                    <input type="number" value={gameSettings.blinds.big} onChange={(e) => handleBlindChange('big', parseFloat(e.target.value))} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" step="1" min="1" />
                  </div>
                </div>
              </div>

              {/* Collapsible Advanced Settings (Optional Refinement) */}
              {/* For brevity, advanced toggles are kept visible for now */}
              <h3 className="text-lg font-medium text-gray-300 mb-3 mt-6">Advanced Options</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {[ 'autoRebuy', 'allowStraddle', 'allowRunItTwice', 'allowInsurance', 'allowChat', 'allowEmotes', 'allowTimeBank', 'allowShowOne'].map(opt => (
                  <label key={opt} className="flex items-center space-x-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
                    <input type="checkbox" checked={gameSettings[opt]} onChange={(e) => handleSettingChange(opt, e.target.checked)} className="form-checkbox h-5 w-5 text-indigo-600 rounded border-white/20 bg-white/10" />
                    <span className="text-sm text-gray-300">{opt.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  </label>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <button 
                  onClick={handleStartCreateRoom}
                  className="w-full px-10 py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-700 text-white text-lg font-semibold hover:from-green-600 hover:to-green-800 transition-all duration-200 shadow-lg shadow-green-500/30 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50 transform hover:scale-105"
                >
                  Configure & Create Game
                </button>
              </div>
            </section>

            {/* Join Private Game Section */}
            <section className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 border border-white/10 shadow-xl flex flex-col justify-center">
              <h2 className="text-3xl font-semibold mb-8 text-center">Join Private Game</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="joinGameId" className="block text-sm font-medium text-gray-300 mb-2">Enter Game ID</label>
                  <input 
                    type="text" 
                    id="joinGameId"
                    value={joinGameIdInput}
                    onChange={(e) => setJoinGameIdInput(e.target.value.trim())}
                    placeholder="e.g., game_abc123xyz"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
                  />
                </div>
                <button 
                  onClick={handleStartJoinRoom}
                  className="w-full px-10 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-semibold hover:from-blue-600 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 transform hover:scale-105"
                >
                  Join Game with ID
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlayWithFriendsPage; 