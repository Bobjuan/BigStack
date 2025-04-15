import React from 'react';

function Card({ card }) {
  return (
    <span className="inline-block border rounded px-2 py-1 m-1 text-lg bg-white text-black">
      {card}
    </span>
  );
}

function CommunityCards({ cards = [] }) {
  return (
    <div className="community-cards text-center my-4">
      <h3 className="text-lg font-semibold mb-2">Community Cards</h3>
      <div>
        {cards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
    </div>
  );
}

export default CommunityCards;
