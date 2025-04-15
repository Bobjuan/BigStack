import React from 'react';

function PlayerInfo({ name, stack, currentBet, isTurn, isDealer, isSB, isBB }) {
  const positionIndicator = 
    isDealer ? '(D)' : 
    isSB ? '(SB)' : 
    isBB ? '(BB)' : '';

  return (
    <div className={`player-info text-center ${isTurn ? 'font-bold' : ''}`}>
      <p className="text-lg">{name} <span className="text-xs text-gray-400">{positionIndicator}</span></p>
      <p className="text-sm text-gray-300">Stack: ${stack}</p>
      {currentBet > 0 && (
        <p className="text-sm text-yellow-300">Bet: ${currentBet}</p>
      )}
      {isTurn && <p className="text-xs text-yellow-400">(Turn)</p>}
    </div>
  );
}

export default PlayerInfo;
