import React, { useState, useEffect } from 'react';

function ActionButtons({ 
  onCheck, 
  onCall, 
  onBet, 
  onFold, 
  canCheck, 
  canCall, 
  callAmount, 
  canBet,
  minBetAmount, // Minimum total bet required
  maxBetAmount, // Usually player's stack
  potSize,
  isPreflop,
  preflopOptions, // e.g., [{label: "3x", amount: 30}]
  currentHighestBet, // <--- Add this prop
}) {
  const [isRaiseMode, setIsRaiseMode] = useState(false);
  const [betAmount, setBetAmount] = useState('');
  const [sliderValue, setSliderValue] = useState(0); // For slider position (0-100)
  const [betError, setBetError] = useState('');

  // Clamp function to keep value within range
  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

  // Update bet amount when slider changes
  useEffect(() => {
    if (isRaiseMode) {
      const range = maxBetAmount - minBetAmount;
      const calculatedAmount = Math.round(minBetAmount + (range * sliderValue) / 100);
      const clampedAmount = clamp(calculatedAmount, minBetAmount, maxBetAmount);
      setBetAmount(clampedAmount.toString());
      setBetError('');
    }
  }, [sliderValue, isRaiseMode, minBetAmount, maxBetAmount]);

  // Reset state when switching modes or allowed actions change
  useEffect(() => {
    setIsRaiseMode(false); // Default to main actions
    setBetAmount('');
    setSliderValue(0);
    setBetError('');
  }, [canCheck, canCall, canBet]);

  // Set initial bet amount and slider when entering raise mode
  useEffect(() => {
    if (isRaiseMode) {
      setBetAmount(minBetAmount.toString());
      // Set initial slider position based on min bet
      const range = maxBetAmount - minBetAmount;
      if (range > 0) {
         const initialSliderPos = clamp(((minBetAmount - minBetAmount) / range) * 100, 0, 100);
         setSliderValue(initialSliderPos);
      } else {
          setSliderValue(0);
      }
    } else {
      setBetAmount(''); // Clear amount when leaving raise mode
    }
  }, [isRaiseMode, minBetAmount, maxBetAmount]);

  const handleSliderChange = (e) => {
    setSliderValue(parseInt(e.target.value, 10));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setBetAmount(value);
    // Update slider position based on input
    if (value !== '' && !isNaN(value)) {
        const numValue = parseInt(value, 10);
        const range = maxBetAmount - minBetAmount;
        if (range > 0) {
            const sliderPos = clamp(((numValue - minBetAmount) / range) * 100, 0, 100);
            setSliderValue(Math.round(sliderPos));
        } else {
            setSliderValue(0);
        }
    }
    setBetError('');
  };

  const handleFinalRaiseClick = () => {
    const amount = parseInt(betAmount, 10);
    setBetError('');

    if (isNaN(amount) || amount < minBetAmount || amount > maxBetAmount) {
      setBetError(`Bet must be between ${minBetAmount} and ${maxBetAmount}`);
      return;
    }
    
    onBet(amount);
    setIsRaiseMode(false); // Exit raise mode after betting
  };
  
  const calculatePotBet = (fraction) => {
    const minValidBet = Math.max(1, minBetAmount);
    // Calculate based on *additional* amount needed on top of current highest bet
    // Pot size for calculation usually includes current round bets + existing pot
    // This calculation might need refinement based on exact pot definition
    const effectivePot = potSize + (minBetAmount > 0 ? (minBetAmount * 2) : 0); // Simplified example
    const targetAmount = Math.floor(effectivePot * fraction);
    
    const finalAmount = clamp(targetAmount, minValidBet, maxBetAmount);
    setBetAmount(finalAmount.toString());
    // Update slider
    const range = maxBetAmount - minBetAmount;
     if (range > 0) {
         const sliderPos = clamp(((finalAmount - minBetAmount) / range) * 100, 0, 100);
         setSliderValue(Math.round(sliderPos));
     } else {
         setSliderValue(0);
     }
    setBetError('');
  };

  const setExactBetAmount = (amount) => {
    const finalAmount = clamp(amount, minBetAmount, maxBetAmount);
    setBetAmount(finalAmount.toString());
    // Update slider
    const range = maxBetAmount - minBetAmount;
     if (range > 0) {
         const sliderPos = clamp(((finalAmount - minBetAmount) / range) * 100, 0, 100);
         setSliderValue(Math.round(sliderPos));
     } else {
         setSliderValue(0);
     }
    setBetError('');
  };

  // --- Styling --- (Adapt colors and structure from screenshots)
  const baseButtonClass = "flex items-center justify-center h-12 px-4 rounded-md font-semibold text-sm border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-30 disabled:cursor-not-allowed";
  const checkCallClass = `${baseButtonClass} bg-gray-700 border-green-500 text-green-300 hover:bg-gray-600 focus:ring-green-400`;
  const raiseClass = `${baseButtonClass} bg-gray-700 border-green-500 text-green-300 hover:bg-gray-600 focus:ring-green-400`;
  // Style for the Check button when it IS the valid action: Muted green border/text
  const checkEnabledClass = `${baseButtonClass} bg-gray-700 border-green-700 text-green-500 hover:bg-gray-600 focus:ring-green-600`;
  const foldClass = `${baseButtonClass} bg-gray-700 border-red-500 text-red-400 hover:bg-gray-600 focus:ring-red-400`;

  const betSizeButtonClass = "py-1 px-2.5 rounded bg-gray-600 hover:bg-gray-500 text-xs text-white disabled:opacity-50";
  const raiseConfirmButtonClass = `${baseButtonClass} w-28 bg-green-600 border-green-500 text-white hover:bg-green-500 focus:ring-green-400`;
  const backButtonClass = `${baseButtonClass} w-28 bg-gray-700 border-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400`;
  const inputClass = "bg-gray-900 border border-gray-600 rounded p-2 text-center text-xl font-bold text-white w-24 focus:outline-none focus:ring-2 focus:ring-green-500";
  const sliderClass = "w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-500 disabled:opacity-30 disabled:cursor-not-allowed";

  return (
    <div className="action-buttons-container inline-flex"> {/* Container to manage layout */}
      {!isRaiseMode ? (
        // Default Action View
        <div className="flex space-x-2">
          {canCheck ? (
            <button onClick={onCheck} className={checkCallClass} disabled={!canCheck}>CHECK</button>
          ) : (
            <button onClick={onCall} className={checkCallClass} disabled={!canCall}>
              CALL {callAmount > 0 ? `$${callAmount}` : ''}
            </button>
          )}
          <button onClick={() => setIsRaiseMode(true)} className={raiseClass} disabled={!canBet}>
            {/* Use 'Bet' if not preflop and currentHighestBet is 0, otherwise 'Raise' */}
            {(!isPreflop && currentHighestBet === 0) ? 'BET' : 'RAISE'}
          </button>
          <button onClick={onFold} className={foldClass}>FOLD</button>
        </div>
      ) : (
        // Raise/Bet Sizing View
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 space-y-3">
          {/* Top row: Sizing buttons */}
          <div className="flex justify-between space-x-1">
            {isPreflop ? (
              <>
                {preflopOptions && preflopOptions.map(opt => (
                  <button 
                    key={opt.label}
                    onClick={() => setExactBetAmount(opt.amount)} 
                    className={betSizeButtonClass}
                    disabled={!canBet || opt.amount < minBetAmount || opt.amount > maxBetAmount}
                  >
                    {opt.label}
                  </button>
                ))}
                <button onClick={() => setExactBetAmount(maxBetAmount)} className={betSizeButtonClass} disabled={!canBet || maxBetAmount <= 0}>All In</button>
              </>
            ) : (
              <>
                <button onClick={() => setExactBetAmount(minBetAmount)} className={betSizeButtonClass} disabled={!canBet || minBetAmount > maxBetAmount}>Min</button>
                <button onClick={() => calculatePotBet(0.5)} className={betSizeButtonClass} disabled={!canBet}>½ Pot</button>
                <button onClick={() => calculatePotBet(2/3)} className={betSizeButtonClass} disabled={!canBet}>⅔ Pot</button>
                <button onClick={() => calculatePotBet(0.75)} className={betSizeButtonClass} disabled={!canBet}>¾ Pot</button>
                <button onClick={() => calculatePotBet(1)} className={betSizeButtonClass} disabled={!canBet}>Pot</button>
                <button onClick={() => setExactBetAmount(maxBetAmount)} className={betSizeButtonClass} disabled={!canBet || maxBetAmount <= 0}>All In</button>
              </>
            )}
          </div>
          {/* Middle row: Input, Slider */}
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-center">
                <label htmlFor="betAmountInput" className="text-xs text-gray-400 mb-1">Your bet</label>
                <input 
                    id="betAmountInput"
                    type="number"
                    value={betAmount}
                    onChange={handleInputChange}
                    // Add min/max directly? Browser validation might interfere
                    className={inputClass}
                    disabled={!canBet}
                />
                 <p className="text-red-500 text-xs h-4 mt-1">{betError || ''}</p>
            </div>
            <div className="flex-grow flex flex-col items-center px-2">
                 <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={sliderValue}
                    onChange={handleSliderChange} 
                    className={sliderClass}
                    disabled={!canBet || minBetAmount >= maxBetAmount}
                 />
                 <div className="flex justify-between w-full text-xs text-gray-400 mt-1">
                     <span>${minBetAmount}</span>
                     <span>${maxBetAmount}</span>
                 </div>
            </div>
          </div>
          {/* Bottom row: Back / Raise Confirmation */}
          <div className="flex justify-end space-x-2 pt-2 border-t border-gray-700">
             <button onClick={() => setIsRaiseMode(false)} className={backButtonClass}>BACK</button>
             <button onClick={handleFinalRaiseClick} className={raiseConfirmButtonClass} disabled={!canBet || !betAmount || parseInt(betAmount, 10) < minBetAmount || parseInt(betAmount, 10) > maxBetAmount}>
               {/* Use 'Bet' if not preflop and currentHighestBet is 0, otherwise 'Raise' */}
               {(!isPreflop && currentHighestBet === 0) ? 'BET' : 'RAISE'}
             </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActionButtons;
