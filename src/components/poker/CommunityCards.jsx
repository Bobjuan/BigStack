import React from 'react';

// Helper function to map card notation to SVG filename (copied from PlayerHand)
const getCardSvgFilename = (card) => {
  if (!card || card === '?') {
    // Community cards should ideally never be '?'
    return ''; // Or a placeholder? Error?
  }

  const rankMap = {
    'A': 'ace',
    'K': 'king',
    'Q': 'queen',
    'J': 'jack',
    'T': '10',
    '9': '9',
    '8': '8',
    '7': '7',
    '6': '6',
    '5': '5',
    '4': '4',
    '3': '3',
    '2': '2',
  };
  const suitMap = {
    'h': 'hearts',
    'd': 'diamonds',
    'c': 'clubs',
    's': 'spades',
  };

  const rank = rankMap[card[0]];
  const suit = suitMap[card[1]];

  if (!rank || !suit) {
    console.error(`Invalid community card string: ${card}`);
    return ''; // Return empty or handle error appropriately
  }

  const filename = `${rank}_of_${suit}.svg`;
  return `/src/assets/SVG-cards-1.3/${filename}`;
};


// Updated Card component for community cards
function Card({ card }) {
  const svgSrc = getCardSvgFilename(card);
  if (!svgSrc) return null; // Don't render if card is invalid

  return (
    <img
      src={svgSrc}
      alt={card}
      className="inline-block mx-0.5 shadow-md rounded-sm"
      style={{ height: '70px', width: 'auto' }}
    />
  );
}

function CommunityCards({ cards = [] }) {
  return (
    <div className="community-cards text-center my-2">
      <div className="flex justify-center items-center h-full">
        {cards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
    </div>
  );
}

export default CommunityCards;
