import React from 'react';

function PlayerInfo({ position, stack, isTurn }) {
  // Minimalist neo-brutalist style: just position + stack
  return (
    <div
      className={`flex flex-col items-center justify-center px-2 py-1 rounded border border-gray-700 bg-[#0d0d0d] ${
        isTurn ? 'ring-2 ring-yellow-300' : ''
      }`}
      style={{ minWidth: '60px' }}
    >
      <span className="text-[10px] font-bold text-white tracking-wide uppercase">
        {position}
      </span>
      <span className="text-xs font-mono text-gray-300">${stack}</span>
    </div>
  );
}

export default PlayerInfo;
