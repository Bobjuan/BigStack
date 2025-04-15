import React from 'react';

// Placeholder avatar image URL - replace with actual path or dynamic source
const defaultAvatar = '/src/assets/default-avatar.png';

function PlayerInfo({ name, stack, currentBet, isTurn, avatar }) {
  // Removed unused props: isDealer, isSB, isBB

  // Use provided avatar or default
  const playerAvatar = avatar || defaultAvatar;

  return (
    // Container for the info box (avatar + text)
    // Removed outer margin, added padding and background
    <div className={`player-info flex items-center w-full p-1 rounded bg-gray-800 bg-opacity-70`}>
      {/* Avatar - Increased size */}
      <img
        src={playerAvatar}
        alt={`${name} avatar`}
        // Increased size, maintain aspect ratio and cover
        className="w-12 h-12 rounded-full mr-2 border-2 border-gray-500 object-cover flex-shrink-0"
      />
      {/* Text Info */}
      <div className="text-left flex-grow min-w-0"> {/* Added min-w-0 for better truncation */}
        {/* Player Name */}
        <p 
          className={`text-sm font-semibold text-white truncate ${isTurn ? 'text-yellow-300' : ''}`}
          title={name} // Add title attribute for full name on hover
        >
          {name}
        </p>
        {/* Stack */}
        <p className="text-xs text-gray-300">${stack}</p>
        {/* Current Bet */}
        {currentBet > 0 && (
          <p className="text-xs text-yellow-400 font-bold">Bet: ${currentBet}</p>
        )}
      </div>
    </div>
  );
}

export default PlayerInfo;
