import React from 'react';

export default function PlayerRoster({ players = [] }) {
  if (!players.length) return null;
  return (
    <div className="flex gap-2 flex-wrap mb-3">
      {players.map(p => (
        <div key={p.playerId} className="bg-gray-700/60 text-gray-200 rounded px-2 py-1 text-xs font-mono">
          {p.cards ? p.cards.join(' ') : '-- --'}
          <span className="ml-1 text-gray-400">{p.name}</span>
        </div>
      ))}
    </div>
  );
}
