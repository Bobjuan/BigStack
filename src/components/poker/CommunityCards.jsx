import React from 'react';

// Helper function to map card notation to SVG filename (copied from PlayerHand)
const getCardSvgFilename = (card) => {
  if (!card || card === '?') {
    // Use the old card back if no modern back is present
    return '/src/assets/back_blue.svg';
  }

  // Modern SVG naming: e.g., 'AS.svg' for Ace of Spades, 'TD.svg' for Ten of Diamonds
  const rankMap = {
    'A': 'A',
    'K': 'K',
    'Q': 'Q',
    'J': 'J',
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
    'h': 'H',
    'd': 'D',
    'c': 'C',
    's': 'S',
  };

  const rank = rankMap[card[0]];
  const suit = suitMap[card[1]];

  if (!rank || !suit) {
    console.error(`Invalid community card string: ${card}`);
    return '/src/assets/Card_back_01.svg';
  }

  const filename = `${rank}${suit}.svg`;
  return `/src/assets/SVG-cards-modern/${filename}`;
};


// Updated Card component for community cards
function Card({ card, cardWidth }) {
  const svgSrc = getCardSvgFilename(card);
  if (!svgSrc) return null; // Don't render if card is invalid

  return (
    <img
      src={svgSrc}
      alt={card}
      className="inline-block mx-0.5 shadow-2xl rounded-sm"
      style={{ width: `${cardWidth}px`, height: 'auto' }}
    />
  );
}

function CommunityCards({ cards = [], cardWidth = 50, ritFirstRun = null, ritSecondRun = null }) { // Default width if not provided
  // If we have RIT runs, display both
  if (ritFirstRun && ritSecondRun) {
    return (
      <div className="community-cards text-center my-2">
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-400 mb-1">First Run</p>
            <div className="flex justify-center items-center">
              {ritFirstRun.map((card, index) => (
                <Card key={`first-${index}`} card={card} cardWidth={cardWidth} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Second Run</p>
            <div className="flex justify-center items-center">
              {ritSecondRun.map((card, index) => (
                <Card key={`second-${index}`} card={card} cardWidth={cardWidth} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal single run display
  return (
    <div className="community-cards text-center my-2">
      <div className="flex justify-center items-center h-full gap-x-4">
        {cards.map((card, index) => (
          <Card key={index} card={card} cardWidth={cardWidth} />
        ))}
      </div>
    </div>
  );
}

export default CommunityCards;
