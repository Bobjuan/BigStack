import React, { useState, useEffect } from 'react';

const PlayerTimer = ({ turnStartTime, timeBank, isTurn }) => {
  const [timeLeft, setTimeLeft] = useState(timeBank);

  useEffect(() => {
    if (!isTurn || !turnStartTime) {
      setTimeLeft(timeBank); // Reset timer when it's not our turn
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = (now - turnStartTime) / 1000;
      const remaining = Math.max(0, timeBank - elapsedSeconds);
      setTimeLeft(remaining);
    }, 250); // Update 4 times a second for smoother progress bar

    return () => clearInterval(interval);
  }, [isTurn, turnStartTime, timeBank]);

  if (!isTurn) return null;

  const percentage = (timeLeft / timeBank) * 100;

  let progressColorClass = 'bg-green-500';
  if (percentage < 50) progressColorClass = 'bg-yellow-500';
  if (percentage < 25) progressColorClass = 'bg-red-500';

  return (
    <div className="absolute -bottom-2 left-0 w-full h-1.5 bg-gray-700 rounded-b-md overflow-hidden">
      <div 
        className={`h-full transition-all duration-200 ease-linear ${progressColorClass}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default PlayerTimer; 