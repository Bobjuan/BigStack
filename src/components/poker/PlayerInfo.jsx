import React from 'react';

function PlayerInfo({ position, stack, name, email, isTurn, handDescription }) {
  return (
    <div
      className={`flex flex-col items-center px-3 py-2 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 shadow-sm transition-all duration-150 ${
        isTurn ? 'ring-2 ring-emerald-400' : ''
      } relative select-none`}
      style={{ minWidth: '100px' }}
    >
      <span className="text-xs uppercase tracking-wider text-gray-300 mb-1">{position}</span>
      {name && (
        <span className="text-sm font-medium text-white max-w-[120px] truncate mb-1">{name}</span>
      )}
      {email && (
        <span className="text-xs text-gray-400 max-w-[120px] truncate">{email}</span>
      )}
      <span className="mt-1 bg-white/10 text-amber-200 text-xs font-semibold rounded-full px-2 py-0.5">${stack}</span>

      {handDescription && (
        <div
          className="px-2 py-0.5 rounded bg-red-500 text-white text-[10px] font-semibold shadow whitespace-nowrap absolute left-1/2 -translate-x-1/2 translate-y-full mt-1"
          style={{ bottom: '-0.6em' }}
        >
          {handDescription}
        </div>
      )}
    </div>
  );
}

export default PlayerInfo;
