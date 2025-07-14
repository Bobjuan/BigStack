import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 ml-[var(--sidebar-width)] overflow-y-scroll">
        {/* The Outlet will render the current page's content, and the main tag will handle scrolling if the content is too long. */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout; 