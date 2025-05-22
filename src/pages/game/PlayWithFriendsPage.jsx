import React from 'react';
import { Link } from 'react-router-dom';

const PlayWithFriendsPage = () => {
  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-extrabold">Play With Friends</h1>
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

        {/* Coming Soon Message */}
        <div className="text-center py-20">
          <div className="text-6xl mb-6">🎮</div>
          <h2 className="text-3xl font-bold mb-4">Coming Soon!</h2>
          <p className="text-gray-400 text-lg mb-8">
            Play poker with your friends in private games. Create your own table, set your own rules.
          </p>
          <Link 
            to="/dashboard"
            className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all duration-200"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlayWithFriendsPage; 