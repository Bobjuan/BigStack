import React, { useState, useEffect } from 'react';

export default function HandReplayPreview() {
  const [currentStreet, setCurrentStreet] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const streets = [
    {
      name: 'Preflop',
      action: 'Hero (BTN): Raises to $6',
      cards: ['A♠', 'K♦'],
      analysis: '3-betting AKo from BTN vs CO open is standard. Your range should be ~10% here.',
      highlight: 'Correct 3-bet'
    },
    {
      name: 'Flop',
      action: 'Hero: Bets $18 into $27',
      board: ['K♠', '7♦', '2♣'],
      analysis: 'Great flop for your range. C-betting 67% pot with TPTK is standard.',
      highlight: 'Perfect sizing'
    },
    {
      name: 'Turn',
      action: 'Hero: Checks',
      board: ['K♠', '7♦', '2♣', '9♥'],
      analysis: 'Checking to induce on this blank protects your checking range.',
      highlight: 'Deceptive line'
    },
    {
      name: 'River',
      action: 'Hero: Calls $45',
      board: ['K♠', '7♦', '2♣', '9♥', '3♦'],
      analysis: 'Easy call with TPTK on this runout. Villain has enough bluffs here.',
      highlight: '+EV call'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStreet((prev) => (prev + 1) % streets.length);
      setShowAnalysis(false);
      setTimeout(() => setShowAnalysis(true), 500);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const currentData = streets[currentStreet];

  return (
    <div className="relative bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
      <div className="absolute top-4 right-4 flex gap-1">
        {streets.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentStreet ? 'bg-white w-6' : 'bg-white/30'
            }`}
            onClick={() => {
              setCurrentStreet(i);
              setShowAnalysis(false);
              setTimeout(() => setShowAnalysis(true), 100);
            }}
          />
        ))}
      </div>

      <div className="mb-6">
        <div className="text-sm text-gray-400 mb-2">{currentData.name}</div>
        
        {currentData.cards && (
          <div className="flex gap-2 mb-4">
            {currentData.cards.map((card, i) => (
              <div key={i} className="w-12 h-16 bg-white rounded-lg flex items-center justify-center text-black font-bold text-lg shadow-lg">
                {card}
              </div>
            ))}
          </div>
        )}

        {currentData.board && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Board</div>
            <div className="flex gap-2">
              {currentData.board.map((card, i) => (
                <div 
                  key={i} 
                  className={`w-10 h-14 bg-white/90 rounded flex items-center justify-center text-black font-semibold text-sm shadow transition-all duration-300 ${
                    i === currentData.board.length - 1 && currentStreet > 0 ? 'scale-110 ring-2 ring-yellow-400' : ''
                  }`}
                >
                  {card}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-black/30 rounded-lg p-3 mb-4">
          <div className="text-sm font-mono text-white/90">{currentData.action}</div>
        </div>

        <div className={`transition-all duration-500 ${showAnalysis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-green-400 mb-1">{currentData.highlight}</div>
              <p className="text-sm text-gray-300">{currentData.analysis}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>P.H.I.L. Analysis</span>
        <span>Solver-backed</span>
      </div>
    </div>
  );
}