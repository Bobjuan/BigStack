import React from 'react';

export default function HandReviewExample() {
  return (
    <div className="relative bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-semibold">BTN vs BB 3-bet Pot</h4>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
            +EV Decision
          </span>
        </div>
        <div className="text-sm text-gray-400">$1/$2 • 100bb effective</div>
      </div>

      {/* Hand situation */}
      <div className="bg-black/30 rounded-xl p-4 mb-6">
        <div className="text-sm text-gray-300 mb-3">
          <strong>Preflop:</strong> Hero (BTN) opens $6, BB 3-bets to $18, Hero calls
        </div>
        
        {/* Your cards */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-500">Your hand:</span>
          <div className="flex gap-1">
            <div className="w-8 h-11 bg-white rounded text-black text-xs flex items-center justify-center font-bold">A♠</div>
            <div className="w-8 h-11 bg-white rounded text-black text-xs flex items-center justify-center font-bold">Q♦</div>
          </div>
        </div>

        {/* Board */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Flop:</span>
          <div className="flex gap-1">
            <div className="w-8 h-11 bg-white rounded text-black text-xs flex items-center justify-center font-bold">A♦</div>
            <div className="w-8 h-11 bg-white rounded text-black text-xs flex items-center justify-center font-bold">7♣</div>
            <div className="w-8 h-11 bg-white rounded text-black text-xs flex items-center justify-center font-bold">3♠</div>
          </div>
        </div>

        <div className="text-sm text-gray-300 mt-3">
          <strong>Flop:</strong> BB checks, Hero bets $12 (33% pot), BB calls
        </div>
      </div>

      {/* AI Analysis */}
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-green-500/10 to-transparent border-l-4 border-green-500 pl-4 py-3">
          <h5 className="text-sm font-semibold text-green-400 mb-2">P.H.I.L. Analysis</h5>
          <p className="text-sm text-gray-300 mb-3">
            Excellent c-bet sizing with TPTK. This flop hits your range harder than BB's 3-bet range. 
            Your 33% bet builds the pot while staying balanced.
          </p>
          
          <div className="text-xs text-gray-400">
            <div className="mb-1"><strong>Range advantage:</strong> Strong on A-high boards</div>
            <div className="mb-1"><strong>Hand strength:</strong> TPTK with decent kicker</div>
            <div><strong>Position:</strong> In position vs aggressive opponent</div>
          </div>
        </div>

        {/* Follow-up options */}
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-2">Ask P.H.I.L.:</div>
          <div className="flex flex-wrap gap-1">
            <button className="text-xs bg-white/10 hover:bg-white/20 rounded-full px-2 py-1 transition-colors">
              "What if BB raises?"
            </button>
            <button className="text-xs bg-white/10 hover:bg-white/20 rounded-full px-2 py-1 transition-colors">
              "Turn strategy?"
            </button>
            <button className="text-xs bg-white/10 hover:bg-white/20 rounded-full px-2 py-1 transition-colors">
              "Why not check?"
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
        <div className="text-xs text-gray-500">Hand #47,291</div>
        <div className="text-xs text-gray-500">Solver-backed • High confidence</div>
      </div>
    </div>
  );
}