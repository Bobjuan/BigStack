import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis } from 'recharts';

// This component visualizes a player's style on a 2D graph.
// Y-Axis (VPIP): Represents how "loose" or "tight" a player is.
// X-Axis (Aggression): Represents how "passive" or "aggressive" a player is.

const PlayerStyleGraph = ({ vpip, aggression, hands }) => {
  // We need a minimum number of hands to make the data meaningful.
  const hasEnoughData = hands >= 50;

  // Map stats to a 0-100 coordinate system for the graph.
  // Y-axis (Tightness): We invert the axis. Higher y-value means tighter. VPIP 0-50% maps to 100-0.
  const y = 100 - Math.min((vpip || 0) * 2, 100); 

  // X-axis (Aggression): An aggression factor of 4.0 is very aggressive. We map 0-4.0 to our 0-100 scale.
  const x = Math.min(((aggression || 0) / 4) * 100, 100);

  const data = hasEnoughData ? [{ x, y }] : [];

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 relative border border-gray-700/50">
      {/* Correctly positioned labels for axes */}
      <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-400 tracking-widest">TIGHT</span>
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-400 tracking-widest">LOOSE</span>
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 tracking-widest">PASSIVE</span>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 tracking-widest">AGGRESSIVE</span>

      {/* Gradient background from bottom-left (bad) to top-right (good) */}
      <div className="absolute inset-12 rounded-lg bg-gradient-to-tr from-orange-600/20 to-green-500/20"></div>

      {/* Axis lines */}
      <div className="absolute left-1/2 top-12 bottom-12 w-px bg-white/10"></div> {/* Vertical Line */}
      <div className="absolute top-1/2 left-12 right-12 h-px bg-white/10"></div> {/* Horizontal Line */}

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
        >
          <XAxis type="number" dataKey="x" domain={[0, 100]} tick={false} axisLine={false} />
          <YAxis type="number" dataKey="y" domain={[0, 100]} tick={false} axisLine={false} />
          <ZAxis type="number" range={[100, 101]} />
          
          <Scatter data={data} fill="#FFFFFF" legendType="none">
            {/* Custom dot with animation */}
            {data.map((entry, index) => (
              <circle
                key={`circle-${index}`}
                cx={entry.cx}
                cy={entry.cy}
                r={6}
                fill="white"
                stroke="#0F1115"
                strokeWidth={2}
              >
                <animateTransform
                  attributeName="transform"
                  type="scale"
                  from="1"
                  to="1.2"
                  begin="0s"
                  dur="1.5s"
                  repeatCount="indefinite"
                  additive="sum"
                />
                <animate
                  attributeName="opacity"
                  from="1"
                  to="0.8"
                  begin="0s"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      {!hasEnoughData && (
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center text-center rounded-2xl">
          <p className="text-gray-300 font-semibold max-w-xs">
            Play at least {50 - (hands || 0)} more hands to unlock your Poker DNA graph.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlayerStyleGraph; 