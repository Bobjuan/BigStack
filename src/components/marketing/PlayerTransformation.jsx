import React, { useState } from 'react';

export default function PlayerTransformation() {
  const [view, setView] = useState('before');

  const transformationData = {
    before: {
      title: 'Day 1: Typical Rec Player',
      stats: {
        'Win Rate': '-5 bb/100',
        'VPIP': '42%',
        'PFR': '8%',
        '3-bet': '2%',
        'Fold vs C-bet': '68%',
        'WTSD': '38%'
      },
      leaks: ['Too loose preflop', 'Passive play', 'Calls too much', 'No 3-bet range'],
      style: 'Calling Station',
      color: 'red'
    },
    after: {
      title: 'Day 30: Solid Winner',
      stats: {
        'Win Rate': '+8 bb/100',
        'VPIP': '24%',
        'PFR': '19%',
        '3-bet': '8%',
        'Fold vs C-bet': '48%',
        'WTSD': '26%'
      },
      leaks: ['All major leaks fixed'],
      style: 'TAG (Tight-Aggressive)',
      color: 'green'
    }
  };

  const currentData = transformationData[view];

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setView('before')}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
            view === 'before' 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
              : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
          }`}
        >
          Before BigStack
        </button>
        <button
          onClick={() => setView('after')}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
            view === 'after' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
          }`}
        >
          After 30 Days
        </button>
      </div>

      <div className={`relative transition-all duration-500 transform ${
        view === 'after' ? 'scale-105' : 'scale-100'
      }`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${
          view === 'before' ? 'from-red-600/20 to-orange-600/20' : 'from-green-600/20 to-emerald-600/20'
        } rounded-3xl blur-2xl opacity-50`} />
        
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">{currentData.title}</h3>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              view === 'before' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
            }`}>
              <span className="text-3xl font-bold">{currentData.stats['Win Rate']}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-300">Key Stats</h4>
              <div className="space-y-3">
                {Object.entries(currentData.stats).slice(1).map(([stat, value]) => (
                  <div key={stat} className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                    <span className="text-sm text-gray-400">{stat}</span>
                    <span className={`font-mono font-semibold ${
                      view === 'before' ? 'text-red-400' : 'text-green-400'
                    }`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-300">Playing Style</h4>
              <div className={`relative h-48 rounded-xl overflow-hidden ${
                view === 'before' ? 'bg-gradient-to-br from-red-900/20 to-orange-900/20' : 'bg-gradient-to-br from-green-900/20 to-emerald-900/20'
              }`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`text-6xl font-bold opacity-10 ${
                    view === 'before' ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {view === 'before' ? '🐟' : '🦈'}
                  </div>
                </div>
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="text-xl font-semibold mb-2">{currentData.style}</div>
                    <div className="text-sm text-gray-400">
                      {view === 'before' 
                        ? 'Plays too many hands, rarely raises, bleeds chips'
                        : 'Selective aggression, positional awareness, consistent winner'
                      }
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentData.leaks.map((leak, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className={view === 'before' ? 'text-red-400' : 'text-green-400'}>
                          {view === 'before' ? '⚠️' : '✓'}
                        </span>
                        {leak}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {view === 'after' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Average improvement after 30 days of using BigStack's AI coaching
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}