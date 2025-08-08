import React from 'react';

export default function PlayerRoster({ players = [], heroId }) {
  if (!players.length) return null;
  return (
    <div className="flex gap-2 flex-wrap mb-2">
      {players.map(p => {
        const isHero = p.playerId === heroId;
        return (
          <div
            key={p.playerId}
            className={`flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-mono border ${isHero ? 'bg-blue-950/40 border-blue-700' : 'bg-slate-800/60 border-slate-700'}`}
            title={p.position}
          >
            <span className={`text-[10px] ${isHero ? 'text-blue-300' : 'text-gray-400'}`}>{p.position}</span>
            <span className={`text-gray-200 ${isHero ? 'font-semibold text-blue-200' : ''}`}>{p.name}</span>
            {p.cards && p.cards.length > 0 ? (
              <span className="text-emerald-300 bg-emerald-900/30 border border-emerald-700 rounded px-1 py-0.5">{p.cards.join(' ')}</span>
            ) : (
              <span className="text-gray-500">-- --</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
