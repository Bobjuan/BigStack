import { useEffect, useRef, useState } from 'react';

export const usePokerGameScaling = () => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // Determine if we should use mobile layout
      // Use mobile layout when width is less than 768px AND aspect ratio is portrait-like
      const mobileBreakpoint = 768;
      const aspectRatio = containerWidth / containerHeight;
      const isPortrait = aspectRatio < 1; // Width is less than 80% of height
      const shouldUseMobile = containerWidth < mobileBreakpoint && isPortrait;
      
      setIsMobile(shouldUseMobile);
      
      // Fixed ideal dimensions - switch between landscape and portrait
      const idealWidth = shouldUseMobile ? 800 : 1400;  // Portrait vs Landscape
      const idealHeight = shouldUseMobile ? 1400 : 800;  // Portrait vs Landscape
      
      // Add padding to ensure the game never gets too close to the edges
      const padding = 0; // 20px padding on all sides
      const availableWidth = containerWidth - (padding * 2);
      const availableHeight = containerHeight - (padding * 2);
      
      // Calculate scale factors for both dimensions with padding
      const scaleX = availableWidth / idealWidth;
      const scaleY = availableHeight / idealHeight;
      
      // Use the smaller scale to ensure everything fits and stays within bounds
      const finalScale = Math.min(scaleX, scaleY, 1); // Never scale up beyond 100%
      
      setScale(finalScale);
    };

    calculateScale();
    
    // Create ResizeObserver for the container itself
    const resizeObserver = new ResizeObserver(() => {
      calculateScale();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    // Also recalculate on window resize as backup
    const handleResize = () => {
      calculateScale();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  return { containerRef, scale, isMobile };
}; 