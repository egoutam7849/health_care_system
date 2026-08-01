import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-dark-canvas text-txt-primary flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'ml-[72px]' : 'ml-64'}`}>
        <Navbar />
        <main className="flex-1 p-6 overflow-x-hidden bg-dark-canvas">
          {children || <Outlet />}
        </main>
        <Footer />
      </div>
    </div>
  );
};
