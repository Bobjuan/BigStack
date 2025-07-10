import React from 'react';
import PokerGame from '../../components/poker/PokerGame';

const Bot9MaxPage = () => {
  return (
    <PokerGame 
      initialNumPlayers={9}
      showPlayerCountControls={false}
      vsBot={true}
      botPlayerIndex={0}
    />
  );
};

export default Bot9MaxPage; 