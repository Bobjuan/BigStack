import React from 'react';
import PokerGame from '../../components/poker/PokerGame';

const HeadsUpPage = () => {
  // Directly render PokerGame, making it the entire page content
  // The PokerGame component itself now handles full-screen display
  return <PokerGame initialNumPlayers={2} showPlayerCountControls={false} />;
};

export default HeadsUpPage; 