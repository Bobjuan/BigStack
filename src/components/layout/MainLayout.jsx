import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  const params = new URLSearchParams(location.search);
  const isStandalone = params.get('standalone') === 'true';

  // Check if current route is a play page that should not have scrolling
  const isPlayPage = () => (
    path.startsWith('/play') ||
    path.startsWith('/cash-game') ||
    path.startsWith('/heads-up') ||
    path.startsWith('/play-bot-heads-up') ||
    path.startsWith('/play-bot-6max') ||
    path.startsWith('/play-bot-9max') ||
    path.startsWith('/deep-stack') ||
    path.startsWith('/tournament') ||
    path.startsWith('/play-with-friends') ||
    path.startsWith('/gto-trainer')
  );

  // Check if current route should not have sidebar
  const shouldHideSidebar = () => (
    path === '/ai-review' ||
    path.startsWith('/ai-review')
  );

  if (isPlayPage()) {
    // Hide sidebar only when URL contains a specific gameId (e.g. /play/friends/abc123)
    const hideSidebarForFriends = /^\/play\/friends\/[^/]+/.test(path);

    if (isStandalone || hideSidebarForFriends) {
      return (
        <div className="play-page flex min-h-screen bg-black text-white">
          <main className="flex-1 flex items-center justify-center bg-black overflow-hidden" style={{ minHeight: '100vh', minWidth: 0 }}>
            <div className="w-full h-full flex-1">{children}</div>
          </main>
        </div>
      );
    }

    if (isStandalone) {
      return (
        <div className="play-page flex min-h-screen bg-black text-white">
          <main className="flex-1 flex items-center justify-center bg-black overflow-hidden" style={{ minHeight: '100vh', minWidth: 0 }}>
            <div className="w-full h-full flex-1">{children}</div>
          </main>
        </div>
      );
    }
    // For play pages, keep the special layout
    return (
      <div className="play-page flex min-h-screen bg-black text-white">
        <Sidebar />
        <main
          className="flex-1 flex items-center justify-center bg-black transition-all duration-300 ml-[var(--sidebar-width)] overflow-hidden"
          style={{ minHeight: '100vh', minWidth: 0 }}
        >
          <div className="w-full h-full flex-1">{children}</div>
        </main>
      </div>
    );
  }

  // For AI review page, use layout without sidebar
  if (shouldHideSidebar()) {
    return (
      <div className="min-h-screen bg-black text-white">
        <main className="w-full" style={{ minHeight: '100vh', minWidth: 0 }}>
          {children}
        </main>
      </div>
    );
  }

  // For all other pages, center content within the remaining space after sidebar
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main
        className="flex-1 transition-all duration-300 ml-[var(--sidebar-width)] flex justify-center"
        style={{ minHeight: '100vh', minWidth: 0 }}
      >
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout; 