import React from 'react';
import PokerGame from '../../components/poker/PokerGame';
import ResponsivePokerGame from '../../components/poker/ResponsivePokerGame';

const BotHeadsUpPage = () => {
  return (
    <ResponsivePokerGame>
      <PokerGame 
        initialNumPlayers={2} 
        showPlayerCountControls={false}
        vsBot={true}
        botPlayerIndex={0} // Bot is player 1 (index 0), human is player 2 (index 1)
      />
    </ResponsivePokerGame>
  );
};

export default BotHeadsUpPage; 