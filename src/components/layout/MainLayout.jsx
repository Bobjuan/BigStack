import React from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 ml-[var(--sidebar-width)]">
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 