import React from 'react';

function PotDisplay({ amount, label = 'Pot', subtext = null, pots = [] }) {
  // If we have side pots, display them
  if (pots && pots.length > 1) {
    return (
      <div className="pot-display text-center my-1">
        <p className="text-lg font-semibold text-green-300">Total Pot: ${amount}</p>
        <div className="text-sm mt-1">
          {pots.map((pot, index) => (
            <p key={index} className="text-gray-300">
              {index === 0 ? 'Main' : `Side ${index}`} pot: ${pot.amount}
            </p>
          ))}
        </div>
        {subtext && (
          <p className="text-xs text-gray-400 mt-1">{subtext}</p>
        )}
      </div>
    );
  }
  
  // Single pot display
  return (
    <div className="pot-display flex flex-col items-center my-1">
      <span className="bg-gray-800 text-yellow-300 text-base font-bold rounded-full px-5 py-2 shadow-md border-2 border-yellow-400 drop-shadow-xl">
        {label}: ${amount}
      </span>
      {subtext && (
        <p className="text-xs text-gray-400 mt-1">{subtext}</p>
      )}
    </div>
  );
}

export default PotDisplay;
