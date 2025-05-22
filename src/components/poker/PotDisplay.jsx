import React from 'react';

function PotDisplay({ amount, label = 'Pot', subtext = null }) {
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
