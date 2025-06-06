import React from 'react';

const RitVoteModal = ({ isOpen, onVote, isEligible }) => {
  if (!isOpen || !isEligible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm relative border border-gray-600 shadow-xl">
        <h3 className="text-2xl font-semibold text-white mb-4 text-center">Run It Twice?</h3>
        <p className="text-gray-300 mb-6 text-center">
          All players are all-in. Would you like to run the remaining cards twice?
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => onVote(true)}
            className="flex-1 px-6 py-3 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500"
          >
            Yes, Run It Twice
          </button>
          <button
            onClick={() => onVote(false)}
            className="flex-1 px-6 py-3 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
          >
            No, Run It Once
          </button>
        </div>
      </div>
    </div>
  );
};

export default RitVoteModal; 