import React from 'react';

export default function FloatingTechBadge({ text, delay = 0 }) {
  const positions = [
    { top: '20%', left: '10%' },
    { top: '15%', right: '15%' },
    { bottom: '30%', left: '5%' },
    { bottom: '25%', right: '10%' }
  ];

  const position = positions[delay / 2 % positions.length];

  return (
    <div 
      className="absolute animate-float"
      style={{ 
        ...position,
        animationDelay: `${delay}s`,
        animationDuration: '6s'
      }}
    >
      <div className="px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs font-medium text-white/60">
        {text}
      </div>
    </div>
  );
}