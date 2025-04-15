import React from 'react';

// Basic card representation (could be improved with images/styling)
function Card({ card }) {
  // Simple styling for hidden cards
  const style = card === '?' 
    ? { backgroundColor: '#555', color: '#555', border: '1px solid #888' }
    : {};
  return (
    <span className="inline-block border rounded px-2 py-1 m-1 text-lg bg-white text-black" style={style}>
      {card}
    </span>
  );
}

function PlayerHand({ cards = [], showAll = false }) {
  return (
    <div className="player-hand mt-2">
      <p className="text-sm text-gray-400">Hand:</p>
      <div>
        {cards.map((card, index) => (
          <Card key={index} card={showAll ? card : (card !== '?' ? card : '?')} />
        ))}
      </div>
    </div>
  );
}

export default PlayerHand;
