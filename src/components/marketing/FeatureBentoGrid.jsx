import React, { useState } from 'react';

export default function FeatureBentoGrid() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      id: 'dna',
      title: 'Poker DNA Mapping',
      description: 'Visualize your playing style across 30+ dimensions',
      size: 'large',
      gradient: 'from-indigo-600/20 to-blue-600/20',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      preview: (
        <div className="mt-4 relative">
          <div className="grid grid-cols-4 gap-2">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">VPIP</div>
              <div className="h-20 bg-gradient-to-t from-indigo-500/50 to-transparent rounded" />
              <div className="text-xs font-mono">28%</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500">PFR</div>
              <div className="h-16 bg-gradient-to-t from-fuchsia-500/50 to-transparent rounded" />
              <div className="text-xs font-mono">22%</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500">3-bet</div>
              <div className="h-12 bg-gradient-to-t from-cyan-500/50 to-transparent rounded" />
              <div className="text-xs font-mono">8%</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500">AF</div>
              <div className="h-14 bg-gradient-to-t from-green-500/50 to-transparent rounded" />
              <div className="text-xs font-mono">2.8</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tracking',
      title: 'Auto-Track Everything',
      description: 'Just play. We handle the data.',
      size: 'medium',
      gradient: 'from-fuchsia-600/20 to-pink-600/20',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      stats: ['30+ stats', 'Real-time', 'Position-aware']
    },
    {
      id: 'ai',
      title: 'P.H.I.L. AI Coach',
      description: 'Solver logic in plain English',
      size: 'medium',
      gradient: 'from-cyan-600/20 to-teal-600/20',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      chat: [
        { role: 'user', text: 'Should I have 3-bet here?' },
        { role: 'ai', text: 'Yes, 3-betting QQ from CO vs UTG open is standard. Mix in A5s as a bluff.' }
      ]
    },
    {
      id: 'leaks',
      title: '20+ Leak Detection',
      description: 'Find and fix what\'s costing you',
      size: 'small',
      gradient: 'from-red-600/20 to-orange-600/20',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      leakCount: 5
    },
    {
      id: 'review',
      title: 'Hand Review',
      description: 'Street-by-street breakdowns',
      size: 'small',
      gradient: 'from-green-600/20 to-emerald-600/20',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      streets: ['Pre', 'Flop', 'Turn', 'River']
    },
    {
      id: 'positions',
      title: 'Position Analysis',
      description: 'See how you play from every seat',
      size: 'small',
      gradient: 'from-purple-600/20 to-violet-600/20',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      positions: ['BTN', 'CO', 'MP', 'EP', 'BB', 'SB']
    }
  ];

  const gridPositions = {
    large: 'md:col-span-2 md:row-span-2',
    medium: 'md:col-span-2',
    small: ''
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[200px]">
      {features.map((feature) => (
        <div
          key={feature.id}
          className={`group relative ${gridPositions[feature.size]} cursor-pointer`}
          onMouseEnter={() => setHoveredCard(feature.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`} />
          
          <div className="relative h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 overflow-hidden group-hover:border-white/20 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} text-white`}>
                {feature.icon}
              </div>
              {feature.leakCount && (
                <span className="text-2xl font-bold text-red-400">{feature.leakCount}</span>
              )}
            </div>

            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-400 mb-4">{feature.description}</p>

            {feature.preview && feature.preview}
            
            {feature.stats && (
              <div className="flex gap-2 mt-auto">
                {feature.stats.map((stat, i) => (
                  <span key={i} className="text-xs bg-white/10 rounded-full px-2 py-1">{stat}</span>
                ))}
              </div>
            )}

            {feature.chat && hoveredCard === feature.id && (
              <div className="absolute inset-x-6 bottom-6 space-y-2 animate-fadeIn">
                {feature.chat.map((msg, i) => (
                  <div key={i} className={`text-xs p-2 rounded-lg ${
                    msg.role === 'user' ? 'bg-indigo-600/20 ml-8' : 'bg-white/10 mr-8'
                  }`}>
                    {msg.text}
                  </div>
                ))}
              </div>
            )}

            {feature.streets && (
              <div className="flex gap-1 mt-auto">
                {feature.streets.map((street, i) => (
                  <div key={i} className="text-xs bg-white/10 rounded px-2 py-1">{street}</div>
                ))}
              </div>
            )}

            {feature.positions && (
              <div className="flex flex-wrap gap-1 mt-auto">
                {feature.positions.map((pos, i) => (
                  <div key={i} className="text-xs bg-white/10 rounded px-2 py-1">{pos}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}