import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-center mb-8">Create Private Game</h1>
          
          {/* Game Settings */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 mb-8 border border-white/10 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-center">Game Settings</h2>
            
            {/* Game Type */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-3">Game Type</label>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleSettingChange('gameType', 'cash')}
                  className={`px-6 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    gameSettings.gameType === 'cash'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Cash Game
                </button>
                <button
                  onClick={() => handleSettingChange('gameType', 'tournament')}
                  className={`px-6 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    gameSettings.gameType === 'tournament'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Tournament
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Starting Stack */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Starting Stack (BB)</label>
                  <input
                    type="number"
                    value={gameSettings.startingStack}
                    onChange={(e) => handleSettingChange('startingStack', parseInt(e.target.value))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    min="20"
                    max="1000"
                  />
                </div>

                {/* Blinds */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Blinds</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Small Blind</label>
                      <input
                        type="number"
                        value={gameSettings.blinds.small}
                        onChange={(e) => handleBlindChange('small', parseFloat(e.target.value))}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        step="0.5"
                        min="0.5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Big Blind</label>
                      <input
                        type="number"
                        value={gameSettings.blinds.big}
                        onChange={(e) => handleBlindChange('big', parseFloat(e.target.value))}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        step="1"
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                {/* Max Players */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Players</label>
                  <select
                    value={gameSettings.maxPlayers}
                    onChange={(e) => handleSettingChange('maxPlayers', parseInt(e.target.value))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="2">Heads Up (2)</option>
                    <option value="6">6-Max</option>
                    <option value="9">9-Max</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Game Options */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Game Options</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <label className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <input
                        type="checkbox"
                        checked={gameSettings.autoRebuy}
                        onChange={(e) => handleSettingChange('autoRebuy', e.target.checked)}
                        className="form-checkbox h-5 w-5 text-indigo-600 rounded border-white/20 bg-white/10"
                      />
                      <span className="text-sm text-gray-300">Auto Rebuy</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <input
                        type="checkbox"
                        checked={gameSettings.allowStraddle}
                        onChange={(e) => handleSettingChange('allowStraddle', e.target.checked)}
                        className="form-checkbox h-5 w-5 text-indigo-600 rounded border-white/20 bg-white/10"
                      />
                      <span className="text-sm text-gray-300">Allow Straddle</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <input
                        type="checkbox"
                        checked={gameSettings.allowRunItTwice}
                        onChange={(e) => handleSettingChange('allowRunItTwice', e.target.checked)}
                        className="form-checkbox h-5 w-5 text-indigo-600 rounded border-white/20 bg-white/10"
                      />
                      <span className="text-sm text-gray-300">Allow Run It Twice</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <input
                        type="checkbox"
                        checked={gameSettings.allowInsurance}
                        onChange={(e) => handleSettingChange('allowInsurance', e.target.checked)}
                        className="form-checkbox h-5 w-5 text-indigo-600 rounded border-white/20 bg-white/10"
                      />
                      <span className="text-sm text-gray-300">Allow Insurance</span>
                    </label>
                  </div>
                </div>

                {/* Social Options */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Social Options</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <label className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <input
                        type="checkbox"
                        checked={gameSettings.allowChat}
                        onChange={(e) => handleSettingChange('allowChat', e.target.checked)}
                        className="form-checkbox h-5 w-5 text-indigo-600 rounded border-white/20 bg-white/10"
                      />
                      <span className="text-sm text-gray-300">Allow Chat</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <input
                        type="checkbox"
                        checked={gameSettings.allowEmotes}
                        onChange={(e) => handleSettingChange('allowEmotes', e.target.checked)}
                        className="form-checkbox h-5 w-5 text-indigo-600 rounded border-white/20 bg-white/10"
                      />
                      <span className="text-sm text-gray-300">Allow Emotes</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <input
                        type="checkbox"
                        checked={gameSettings.allowShowOne}
                        onChange={(e) => handleSettingChange('allowShowOne', e.target.checked)}
                        className="form-checkbox h-5 w-5 text-indigo-600 rounded border-white/20 bg-white/10"
                      />
                      <span className="text-sm text-gray-300">Allow Show One</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Create Game Button */}
          <div className="text-center">
            <button
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Create Game
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlayWithFriendsPage; 