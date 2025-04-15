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
}) {
  const [betAmount, setBetAmount] = useState('');
  const [betError, setBetError] = useState('');

  useEffect(() => {
    setBetAmount('');
    setBetError('');
  }, [canCheck, canCall, callAmount, minBetAmount, maxBetAmount]);

  const handleBetClick = () => {
    const amount = parseInt(betAmount, 10);
    setBetError('');

    if (isNaN(amount) || amount <= 0) {
      setBetError("Invalid amount.");
      return;
    }

    const currentBet = 0; // TODO: Calculate player's current bet accurately if needed
    const minRaiseTotal = minBetAmount;
    const minAmountToAdd = Math.max(1, minBetAmount);
    const maxAmountToAdd = maxBetAmount;

    if (amount < minAmountToAdd && amount < maxAmountToAdd) {
      setBetError(`Min bet: ${minAmountToAdd}`);
      return;
    }
    if (amount > maxAmountToAdd) {
      setBetError(`Max bet: ${maxAmountToAdd}`);
      return;
    }

    onBet(amount);
    setBetAmount('');
  };
  
  const calculatePotBet = (fraction) => {
    const targetAmount = Math.max(1, Math.floor(potSize * fraction));
    const minValidBet = Math.max(1, minBetAmount);
    const finalAmount = Math.min(maxBetAmount, Math.max(minValidBet, targetAmount));
    setBetAmount(finalAmount.toString());
    setBetError('');
  };

  const setExactBetAmount = (amount) => {
    const finalAmount = Math.min(maxBetAmount, Math.max(1, amount));
    setBetAmount(finalAmount.toString());
    setBetError('');
  };

  const buttonStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-1 disabled:opacity-50 disabled:cursor-not-allowed";
  const betButtonStyle = "bg-gray-600 hover:bg-gray-500 text-white text-xs py-1 px-2 rounded mx-1 disabled:opacity-50 disabled:cursor-not-allowed";
  const inputStyle = "bg-gray-700 text-white px-2 py-1 rounded mx-1 w-24 border border-transparent focus:outline-none focus:ring-2 focus:ring-green-500";
  const errorStyle = "text-red-500 text-xs mt-1 h-4";

  return (
    <div className="action-buttons text-center mt-6">
      <button onClick={onCheck} className={buttonStyle} disabled={!canCheck}>Check</button>
      <button onClick={onCall} className={buttonStyle} disabled={!canCall}>
        {`Call ${callAmount > 0 ? `$${callAmount}` : ''}`}
      </button>
      
      <div className="inline-block ml-4 align-top border border-gray-600 p-2 rounded">
        <div className="mb-2 flex space-x-1 justify-center">
          <button onClick={() => calculatePotBet(1/3)} className={betButtonStyle} disabled={!canBet}>⅓ Pot</button>
          <button onClick={() => calculatePotBet(1/2)} className={betButtonStyle} disabled={!canBet}>½ Pot</button>
          <button onClick={() => calculatePotBet(3/4)} className={betButtonStyle} disabled={!canBet}>¾ Pot</button>
          <button onClick={() => calculatePotBet(1)}   className={betButtonStyle} disabled={!canBet}>Pot</button> 
          <button onClick={() => setExactBetAmount(maxBetAmount)} className={`${betButtonStyle} bg-orange-600 hover:bg-orange-500`} disabled={!canBet || maxBetAmount <= 0}>All In</button> 
        </div>
        <div>
          <input 
            type="number"
            value={betAmount}
            onChange={(e) => { 
                setBetAmount(e.target.value);
                setBetError('');
            }}
            placeholder="Amount"
            className={`${inputStyle} ${betError ? 'border-red-500' : ''}`}
            min={minBetAmount}
            max={maxBetAmount}
            disabled={!canBet}
          />
          <button 
            onClick={handleBetClick} 
            className={`${buttonStyle} bg-green-500 hover:bg-green-700`} 
            disabled={!canBet || !betAmount}
          >
            Bet/Raise
          </button>
        </div>
        <p className={errorStyle}>{betError || ''}</p>
      </div>
      
      <button onClick={onFold} className={`${buttonStyle} bg-red-500 hover:bg-red-700 ml-4`}>Fold</button>
    </div>
  );
}

export default ActionButtons;
