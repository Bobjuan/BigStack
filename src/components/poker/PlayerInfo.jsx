import React from 'react';

function PlayerInfo({ position, stack, isTurn, handDescription }) {
  // Minimalist neo-brutalist style: just position + stack
  return (
    <div
      className={`flex flex-col items-center justify-center px-2 py-1 rounded border border-gray-700 bg-[#0d0d0d] ${
        isTurn ? 'ring-2 ring-yellow-300' : ''
      } relative`}
      style={{ minWidth: '60px' }}
    >
      <div className="flex flex-row items-center justify-center w-full">
        <span className="text-lg font-extrabold text-white tracking-wide uppercase mr-4 flex items-center" style={{lineHeight: 1}}>
          {position}
        </span>
        <span className="text-base font-mono text-white font-normal flex items-center" style={{lineHeight: 1.1, marginTop: '1px'}}>${stack}</span>
      </div>
      {handDescription && (
        <div
          className="px-2 py-0.5 rounded bg-red-500 text-white text-[10px] font-semibold shadow whitespace-nowrap"
          style={{
            letterSpacing: '0.03em',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%) translateY(65%)',
            bottom: '-0.6em',
            zIndex: 30,
            pointerEvents: 'none',
            minWidth: '80px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          {handDescription}
        </div>
      )}
    </div>
  );
}

export default PlayerInfo;
