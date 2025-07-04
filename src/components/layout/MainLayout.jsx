import React from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main
        className="flex-1 flex items-center justify-center overflow-hidden bg-black transition-all duration-300 ml-[var(--sidebar-width)]"
        style={{ minHeight: '100vh', minWidth: 0 }}
      >
        <div
          className="aspect-ratio-keeper flex items-center justify-center bg-black w-full h-full"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'black',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              maxWidth: 'calc(100vh * 16 / 9)',
              maxHeight: '100%',
              aspectRatio: '16/9',
              margin: 'auto',
              background: 'black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout; 