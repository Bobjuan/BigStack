import React from 'react';
import PokerGame from '../../components/poker/PokerGame';
import ResponsivePokerGame from '../../components/poker/ResponsivePokerGame';

const Bot6MaxPage = () => {
  return (
    <ResponsivePokerGame>
      <PokerGame 
        initialNumPlayers={6}
        showPlayerCountControls={false}
        vsBot={true}
        botPlayerIndex={0}
      />
    </ResponsivePokerGame>
  );
};

export default Bot6MaxPage; 