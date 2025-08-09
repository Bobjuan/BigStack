import React, { useState } from 'react';

export default function InteractiveLeakCard({ 
  title, 
  severity, 
  stat, 
  description, 
  why, 
  fix, 
  impact 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const severityColors = {
    High: 'border-red-500/30 bg-red-500/5',
    Medium: 'border-orange-500/30 bg-orange-500/5',
    Low: 'border-yellow-500/30 bg-yellow-500/5'
  };

  const severityTextColors = {
    High: 'text-red-400',
    Medium: 'text-orange-400',
    Low: 'text-yellow-400'
  };

  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-300 ${
        isExpanded ? 'col-span-full' : ''
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${
        severity === 'High' ? 'from-red-600/20 to-transparent' :
        severity === 'Medium' ? 'from-orange-600/20 to-transparent' :
        'from-yellow-600/20 to-transparent'
      } opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`} />
      
      <div className={`relative rounded-2xl border ${severityColors[severity]} backdrop-blur-sm p-4 h-full transition-all duration-300 group-hover:border-white/20`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-semibold">{title}</h3>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${severityColors[severity]} ${severityTextColors[severity]}`}>
            {severity}
          </span>
        </div>

        <div className="mb-2">
          <div className="text-xl font-mono font-bold text-white/90 mb-1">{stat}</div>
          <p className="text-xs text-gray-400">{description}</p>
        </div>

        {!isExpanded && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Click to see fix</span>
          </div>
        )}

        {isExpanded && (
          <div className="mt-4 space-y-3 animate-fadeIn">
            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-red-400 mb-1">Why this is killing your win rate:</h4>
              <p className="text-xs text-gray-300">{why}</p>
            </div>
            
            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-green-400 mb-1">How to fix it:</h4>
              <p className="text-xs text-gray-300">{fix}</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-blue-400 mb-1">What you'll learn:</h4>
              <p className="text-xs text-gray-300">Master the fundamentals of this concept to make better decisions at the table.</p>
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className={`w-5 h-5 ${isExpanded ? 'rotate-180' : ''} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}