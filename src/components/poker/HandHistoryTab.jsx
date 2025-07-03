import React from 'react';
import dayjs from 'dayjs';

export default function HandHistoryTab({ rows, onAnalyze, heroId }) {
  if (!rows || rows.length === 0) {
    return <div className="text-gray-400 text-sm">No hands yet.</div>;
  }
  return (
    <div className="space-y-1 h-full overflow-y-auto pr-1">
      {rows.map(r => {
        const hero = r.heroCards?.length ? r.heroCards.join(' ') : '--';
        return (
          <div key={r.handId} className="flex items-center justify-between text-sm bg-gray-800 bg-opacity-70 px-2 py-1 rounded hover:bg-gray-700">
            <div>
              <span className="font-mono mr-2">#{r.handNumber}</span>
              <span className="text-gray-400 text-xs">{dayjs(r.startedAt).format('HH:mm')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{hero}</span>
              <button onClick={() => onAnalyze(r.handId)} className="text-blue-400 hover:text-blue-200 text-xs underline">Analyze</button>
            </div>
          </div>
        );
      })}
    </div>
  );
} 