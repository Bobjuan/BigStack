import React, { useState } from 'react';

function TabButton({ isActive, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
        isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}

export default function ScreenshotTabsCard({ tabs = [], initialTabId }) {
  const initial = initialTabId || (tabs[0] && tabs[0].id);
  const [active, setActive] = useState(initial);
  const activeTab = tabs.find(t => t.id === active) || tabs[0] || {};

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur p-4 md:p-6">
      <div className="flex gap-2 mb-4">
        {tabs.map(t => (
          <TabButton key={t.id} isActive={t.id === active} onClick={() => setActive(t.id)}>
            {t.label}
          </TabButton>
        ))}
      </div>
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40">
        {activeTab.imageSrc ? (
          <img src={activeTab.imageSrc} alt={activeTab.alt || ''} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Screenshot</div>
        )}
      </div>
      {(activeTab.caption || (activeTab.highlights && activeTab.highlights.length > 0)) && (
        <div className="mt-4 flex flex-col gap-3">
          {activeTab.caption && <p className="text-gray-300 text-sm">{activeTab.caption}</p>}
          {Array.isArray(activeTab.highlights) && activeTab.highlights.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeTab.highlights.map((h, i) => (
                <span key={i} className="text-xs text-white/90 bg-white/10 border border-white/10 rounded-full px-2 py-1">{h}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

