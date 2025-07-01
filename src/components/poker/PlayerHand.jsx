import React from 'react';

// Helper function to map card notation to SVG filename
const getCardSvgFilename = (card) => {
  if (!card || card === '?') {
    // Assuming a card back image exists
    return '/src/assets/Card_back_01.svg';
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
    console.warn(`Invalid card string: ${card}, falling back to card back.`);
    return '/src/assets/Card_back_01.svg';
  }

  // Check if the file exists (simple check for demonstration)
  // More robust checking might be needed depending on bundler setup
  const filename = `${rank}_of_${suit}.svg`;
  // NOTE: The file path assumes your assets are served correctly relative to the public path
  return `/src/assets/SVG-cards-1.3/${filename}`;
};

// Updated Card component to display SVG image
function Card({ card, show }) {
  const svgSrc = getCardSvgFilename(show ? card : '?'); // Determine src based on show prop

  return (
    <img
      src={svgSrc}
      alt={show ? card : 'Card Back'}
      className="w-full inline-block mx-[-4px] shadow-md rounded-sm" // Changed w-auto to w-full
      style={{ transition: 'transform 0.15s ease-out' }} // Removed height style
    />
  );
}

// Updated PlayerHand component
function PlayerHand({ cards = [], showAll = false }) {
  // Ensure we always render 2 card slots, even if dealt fewer (e.g., during deal)
  const displayCards = [
      cards.length > 0 ? cards[0] : null, 
      cards.length > 1 ? cards[1] : null
  ];

  return (
    <div className="player-hand mt-1"> {/* Removed h-full */}
      {/* Removed <p>Hand:</p> */}
      <div className="flex justify-center items-center"> {/* Removed h-full */}
        {displayCards.map((card, index) => (
          <div
            key={index}
            style={{ transform: `rotate(${index === 0 ? -8 : 8}deg)` }}
          >
            <Card card={card} show={showAll} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerHand;
