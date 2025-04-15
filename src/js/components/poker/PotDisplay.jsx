import React from 'react';

function PotDisplay({ amount }) {
  return (
    <div className="pot-display text-center my-4">
      <p className="text-xl font-bold text-green-300">Pot: ${amount}</p>
    </div>
  );
}

export default PotDisplay;
