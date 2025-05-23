import React from 'react';
import PokerGame from '../../components/poker/PokerGame';

const DeepStackPage = () => {
  // Directly render PokerGame. For Deep Stack, we might allow player count selection,
  // or default to 6 or 9. For now, let's default to 6 and allow controls.
  // We'd also need to pass stack size information if the PokerGame supports it.
  return <PokerGame initialNumPlayers={6} showPlayerCountControls={true} />;
  // TODO: Add prop to PokerGame to set initial stack sizes for deep stack play.
};

export default DeepStackPage; 