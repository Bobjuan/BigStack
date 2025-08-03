import React from 'react';
import { STREET_ORDER, splitActionsByStreet } from '../../utils/handHistory';
import PlayerRoster from './PlayerRoster';

export default function TextHandReplayer({ history, streetIndex, setStreetIndex }) {
  if (!history) return null;
  const actionsByStreet = splitActionsByStreet(history);

  const currentStreetKey = STREET_ORDER[streetIndex];
  const actions = actionsByStreet[currentStreetKey] || [];

  // Determine board cards shown for this street
  let boardCards = [];
  const all = history.communityCards || [];
  if (currentStreetKey === 'FLOP') boardCards = all.slice(0, 3);
  if (currentStreetKey === 'TURN') boardCards = all.slice(0, 4);
  if (currentStreetKey === 'RIVER') boardCards = all.slice(0, 5);

  return (
    <>
      {/* Roster */}
      <PlayerRoster players={history.players || []} />

      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-4">
        {STREET_ORDER.map((s, idx) => (
          <div key={s} className="flex-1 text-center">
            <button
              onClick={() => setStreetIndex(idx)}
              className={`text-xs font-semibold px-2 py-1 rounded ${idx === streetIndex ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          </div>
        ))}
      </div>

      {/* Actions list */}
      <div className="flex-1 overflow-y-auto bg-black/20 rounded p-3 text-sm text-gray-200 whitespace-pre-wrap">
        {boardCards.length > 0 && (
          <div className="mb-2 text-amber-300 font-semibold">Board: {boardCards.join(' ')}</div>
        )}
        {actions.length === 0 ? 'No actions' : actions.map((a, i) => (
          <div key={i} className="mb-1">
            <span className="text-blue-400 mr-2">{a.actorName}</span>
            <span className="mr-1">{a.action.toUpperCase()}</span>
            {a.amount != null && <span>${a.amount}</span>}
            {a.position && <span className="ml-2 text-gray-400 text-xs">({a.position})</span>}
          </div>
        ))}
        {currentStreetKey === 'RIVER' && history.winners && history.winners.length > 0 && (
          <div className="mt-3 text-green-400 text-sm font-semibold">
            Winner: {history.winners[0].name} (+{history.winners[0].amountWon})
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex justify-between mt-4">
        <button onClick={() => setStreetIndex(Math.max(0, streetIndex-1))} disabled={streetIndex===0} className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-40">⇠ Prev</button>
        <button onClick={() => setStreetIndex(Math.min(STREET_ORDER.length-1, streetIndex+1))} disabled={streetIndex===STREET_ORDER.length-1} className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-40">Next ⇢</button>
      </div>
    </>
  );
}
