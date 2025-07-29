import React from 'react';
import { usePokerGameScaling } from '../../hooks/usePokerGameScaling';

const ResponsivePokerGame = ({ children }) => {
  const { containerRef, scale } = usePokerGameScaling();

  return (
    <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden play-page">
      <div 
        ref={containerRef}
        className="relative w-full h-full"
      >
        <div 
          className="poker-game-container"
          style={{ 
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ResponsivePokerGame; 