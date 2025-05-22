import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="w-full px-6 py-4 flex items-center justify-between">
        <div className="w-32">{/* Spacer */}</div>
        <h1 className="text-3xl font-bold text-center">BigStack Dashboard</h1>
        <div className="flex items-center gap-4">
          <Link 
            to="/profile"
            className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold hover:from-indigo-600 hover:to-indigo-800 transition-all duration-200"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition-all duration-200"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8 py-8 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Left Panel - Actions */}
        <div className="w-full md:w-1/3 space-y-4">
          <h2 className="text-2xl font-bold mb-6">Actions</h2>
          <Link 
            to="/play" 
            className="flex items-center justify-center w-full py-4 px-6 bg-white text-black hover:bg-gray-100 rounded-full font-semibold transform transition-all duration-200 hover:-translate-y-1"
          >
            Live Play
          </Link>
          <Link 
            to="/friends" 
            className="flex items-center justify-center w-full py-4 px-6 bg-white text-black hover:bg-gray-100 rounded-full font-semibold transform transition-all duration-200 hover:-translate-y-1"
          >
            Play with Friends
          </Link>
          <Link 
            to="/learn" 
            className="flex items-center justify-center w-full py-4 px-6 bg-white text-black hover:bg-gray-100 rounded-full font-semibold transform transition-all duration-200 hover:-translate-y-1"
          >
            Learn
          </Link>
          <Link 
            to="/quiz" 
            className="flex items-center justify-center w-full py-4 px-6 bg-white text-black hover:bg-gray-100 rounded-full font-semibold transform transition-all duration-200 hover:-translate-y-1"
          >
            Quiz
          </Link>
        </div>

        {/* Right Panel - Stats */}
        <div className="w-full md:w-2/3 space-y-6">
          <h2 className="text-2xl font-bold mb-6">Stats</h2>
          
          {/* ELO Tracker Card */}
          <div className="w-full bg-black rounded-xl p-6 border border-gray-800">
            <div className="text-xl font-bold mb-4">
              ELO: <span id="elo-value" className="text-white">1200</span>
            </div>
            <div className="w-full h-36 rounded-lg bg-gray-800 p-4">
              <canvas 
                id="elo-chart" 
                className="w-full h-full"
              ></canvas>
            </div>
          </div>

          {/* Bankroll Tracker Card */}
          <div className="w-full bg-black rounded-xl p-6 border border-gray-800">
            <div className="text-xl font-bold mb-4">
              Bankroll: $<span id="bankroll-value" className="text-white">0</span>
            </div>
            <div className="w-full h-36 rounded-lg bg-gray-800 p-4">
              <canvas 
                id="bankroll-chart" 
                className="w-full h-full"
              ></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 