import React from 'react';
import PokerGame from '../../components/poker/PokerGame';

const Bot6MaxPage = () => {
  return (
    <PokerGame 
      initialNumPlayers={6}
      showPlayerCountControls={false}
      vsBot={true}
      botPlayerIndex={0}
    />
  );
};

export default Bot6MaxPage; 