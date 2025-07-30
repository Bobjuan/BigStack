import React from 'react';
import { usePokerGameScaling } from '../../hooks/usePokerGameScaling';

const ResponsivePokerGame = ({ children }) => {
  const { containerRef, scale, isMobile } = usePokerGameScaling();

  return (
    <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden play-page">
      <div 
        ref={containerRef}
        className="relative w-full h-full"
      >
        <div 
          className={`poker-game-container ${isMobile ? 'poker-game-container-mobile' : ''}`}
          style={{ 
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          {React.cloneElement(children, { isMobile })}
        </div>
      </div>
    </div>
  );
};

export default ResponsivePokerGame; 