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
    <div className="pot-display text-center my-1">
      <p className="text-lg font-semibold text-green-300">{label}: ${amount}</p>
      {subtext && (
        <p className="text-xs text-gray-400">{subtext}</p>
      )}
    </div>
  );
}

export default PotDisplay;
