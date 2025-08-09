import React from 'react';

export default function LeakTeaserRow({ title, severity = 'Medium', description, why, fix }) {
  const color = severity === 'High' ? 'text-red-400' : severity === 'Low' ? 'text-green-400' : 'text-amber-400';
  const border = severity === 'High' ? 'border-red-900/40' : severity === 'Low' ? 'border-emerald-900/40' : 'border-amber-900/40';
  return (
    <div className={`bg-white/5 rounded-xl border ${border} p-4`}> 
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-white font-semibold text-base">{title}</h4>
        <span className={`text-xs font-semibold ${color}`}>{severity}</span>
      </div>
      {description && <p className="text-gray-300 text-sm mb-2">{description}</p>}
      {why && <p className="text-gray-400 text-xs mb-1">Why it matters: {why}</p>}
      {fix && <p className="text-gray-400 text-xs">Fix: {fix}</p>}
    </div>
  );
}

