import React from 'react';

// Helper function to map card notation to SVG filename
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
    console.warn(`Invalid card string: ${card}, falling back to card back.`);
    return '/src/assets/Card_back_01.svg';
  }

  const filename = `${rank}${suit}.svg`;
  return `/src/assets/SVG-cards-modern/${filename}`;
};

// Updated Card component to display SVG image
function Card({ card, show, showBacks }) {
  let svgSrc;
  if (showBacks) {
    svgSrc = '/src/assets/Card_back_01.svg';
  } else {
    svgSrc = getCardSvgFilename(show ? card : '?');
  }

  return (
    <img
      src={svgSrc}
      alt={showBacks ? 'Card Back' : (show ? card : 'Card Back')}
      className="inline-block mx-[-4px] shadow-5xl rounded-sm"
      style={{ width: '85px', transition: 'transform 0.15s ease-out' }}
    />
  );
}

// Updated PlayerHand component
function PlayerHand({ cards = [], showAll = false, cardContainerStyle = {}, isWinner = false, showBacks = false }) {
  // If showBacks is true, always render two card backs
  const displayCards = showBacks
    ? [null, null]
    : [cards.length > 0 ? cards[0] : null, cards.length > 1 ? cards[1] : null];

  return (
    <div className={`player-hand mt-1 flex justify-center items-end${isWinner ? ' winner-glow-bounce' : ''}`} style={{ pointerEvents: 'none', zIndex: 20, ...cardContainerStyle }}>
      {/* Horizontally overlap cards like real poker, with more spacing and higher position */}
      {displayCards.map((card, index) => (
        <div
          key={index}
          className={index > 0 ? '-ml-3 flex-shrink-0' : 'flex-shrink-0'}
          style={{
            zIndex: 20 + index,
            pointerEvents: 'auto',
            transform: index === 0 ? 'rotate(-6deg)' : 'rotate(6deg)',
            boxShadow: index === 1 ? '-6px 0 12px -4px rgba(76, 76, 76, 0.85)' : 'none',
          }}
        >
          <Card card={card} show={showBacks ? false : showAll} showBacks={showBacks} />
        </div>
      ))}
    </div>
  );
}

export default PlayerHand;
