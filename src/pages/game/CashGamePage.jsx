import React from 'react';
import PokerGame from '../../components/poker/PokerGame';

const CashGamePage = () => {
  // Directly render PokerGame, making it the entire page content
  return <PokerGame initialNumPlayers={6} showPlayerCountControls={false} />;
};

export default CashGamePage; 