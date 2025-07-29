import { useEffect, useRef, useState } from 'react';

export const usePokerGameScaling = () => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // Fixed ideal dimensions of the poker game
      const idealWidth = 1400;
      const idealHeight = 800;
      
      // Calculate scale factors for both dimensions - EXACT SAME LOGIC AS ORIGINAL
      const scaleX = containerWidth / idealWidth;
      const scaleY = containerHeight / idealHeight;
      
      // Use the smaller scale to ensure everything fits - EXACT SAME LOGIC AS ORIGINAL
      const finalScale = Math.min(scaleX, scaleY);
      
      setScale(finalScale);
    };

    calculateScale();
    
    // Recalculate on window resize
    const handleResize = () => {
      calculateScale();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { containerRef, scale };
}; 