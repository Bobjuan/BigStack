import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  // Check if current route is a play page that should not have scrolling
  const isPlayPage = () => {
    return (
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
  };

  const shouldAllowScrolling = !isPlayPage();

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main
        className={`flex-1 flex items-center justify-center bg-black transition-all duration-300 ml-[var(--sidebar-width)] ${
          shouldAllowScrolling ? 'overflow-y-auto' : 'overflow-hidden'
        }`}
        style={{ minHeight: '100vh', minWidth: 0 }}
      >
        {/* For play pages, fill the available space with no aspect ratio or centering */}
        {isPlayPage() ? (
          <div className="w-full h-full flex-1">{children}</div>
        ) : (
          <div
            className={`aspect-ratio-keeper flex items-center justify-center bg-black w-full h-full ${
              shouldAllowScrolling ? 'min-h-full' : ''
            }`}
            style={{
              position: 'relative',
              width: '100%',
              height: shouldAllowScrolling ? 'auto' : '100%',
              display: 'flex',
              alignItems: shouldAllowScrolling ? 'flex-start' : 'center',
              justifyContent: 'center',
              background: 'black',
              overflow: shouldAllowScrolling ? 'visible' : 'hidden',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: shouldAllowScrolling ? 'auto' : '100%',
                maxWidth: shouldAllowScrolling ? 'none' : 'calc(100vh * 16 / 9)',
                maxHeight: shouldAllowScrolling ? 'none' : '100%',
                aspectRatio: shouldAllowScrolling ? 'auto' : '16/9',
                margin: 'auto',
                background: 'black',
                display: 'flex',
                alignItems: shouldAllowScrolling ? 'flex-start' : 'center',
                justifyContent: 'center',
                overflow: shouldAllowScrolling ? 'visible' : 'hidden',
              }}
            >
              {children}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MainLayout; 