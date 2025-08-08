import React, { useMemo } from 'react';
import { STREET_ORDER, splitActionsByStreet } from '../../utils/handHistory';

export default function TextHandReplayer({ history, streetIndex, setStreetIndex, heroId }) {
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

  const heroNameById = useMemo(() => {
    const map = new Map();
    (history.players || []).forEach(p => { map.set(p.playerId, p.name); });
    return map;
  }, [history.players]);

  // keyboard navigation
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setStreetIndex(Math.max(0, streetIndex - 1));
      if (e.key === 'ArrowRight') setStreetIndex(Math.min(STREET_ORDER.length - 1, streetIndex + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [streetIndex, setStreetIndex]);

  return (
    <div className="flex flex-col gap-4">

      {/* Stepper */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {STREET_ORDER.map((s, idx) => (
            <button
              key={s}
              onClick={() => setStreetIndex(idx)}
              className={`relative flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${idx === streetIndex ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-slate-800'}`}
            >
              <span className={`h-2 w-2 rounded-full ${idx <= streetIndex ? 'bg-blue-400' : 'bg-slate-600'}`} />
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Actions timeline (fixed height) */}
      <div className="overflow-y-auto bg-slate-950/40 rounded-xl border border-slate-800 p-4 text-sm text-gray-200 h-[260px] md:h-[320px] lg:h-[360px]">
        {boardCards.length > 0 && (
          <div className="mb-3 text-amber-300 font-semibold">Board: {boardCards.join(' ')}</div>
        )}
        {actions.length === 0 ? (
          <div className="text-gray-400">No actions</div>
        ) : (
          <ul className="space-y-2">
            {actions.map((a, i) => {
              const isHero = a.actorId && a.actorId === heroId;
              return (
                <li key={i} className={`flex items-center justify-between rounded-lg px-3 py-2 border ${isHero ? 'border-blue-600 bg-blue-950/30' : 'border-slate-800 bg-slate-900/40'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${isHero ? 'text-blue-300' : 'text-gray-400'}`}>{a.position || ''}</span>
                    <span className={`font-semibold ${isHero ? 'text-blue-400' : 'text-gray-200'}`}>{a.actorName}</span>
                    {/* inline cards when available for hero */}
                    {isHero && (() => {
                      const hero = (history.players || []).find(p => p.playerId === heroId);
                      return hero?.cards?.length ? (
                        <span className="ml-1 text-emerald-300 text-xs font-mono bg-emerald-900/30 border border-emerald-700 rounded px-1 py-0.5">
                          {hero.cards.join(' ')}
                        </span>
                      ) : null;
                    })()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="uppercase tracking-wide text-gray-300">{a.action}</span>
                    {a.amount != null && <span className="text-gray-400">${a.amount}</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {currentStreetKey === 'RIVER' && history.winners && history.winners.length > 0 && (
          <div className="mt-4 text-green-400 text-sm font-semibold">
            Winner: {history.winners[0].name} (+{history.winners[0].amountWon})
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex justify-end gap-2 mt-2">
        <button onClick={() => setStreetIndex(Math.max(0, streetIndex-1))} disabled={streetIndex===0} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-700">⇠ Prev</button>
        <button onClick={() => setStreetIndex(Math.min(STREET_ORDER.length-1, streetIndex+1))} disabled={streetIndex===STREET_ORDER.length-1} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-700">Next ⇢</button>
      </div>
    </div>
  );
}
