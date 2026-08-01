import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { DoctorSidebar } from './DoctorSidebar';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, AlertTriangle, Stethoscope } from 'lucide-react';

const DoctorNavbar = ({ user }) => {
  const navigate = useNavigate();
  return (
    <header className="h-14 border-b border-white/[0.08] bg-dark-canvas/95 backdrop-blur-md sticky top-0 z-30 px-5 flex items-center justify-between">
      {/* Left: Status */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-xl text-[11px] font-bold border border-blue-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
          Clinical Session Active
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-dark-section text-txt-muted rounded-xl text-[11px] font-mono border border-white/[0.06]">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/doctor/ai-assistant')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-xl text-[11px] font-bold border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
        >
          <Stethoscope className="w-3.5 h-3.5" />
          AI Assistant
        </button>

        <button
          onClick={() => navigate('/doctor/notifications')}
          className="relative p-2 text-txt-muted hover:text-txt-primary rounded-xl hover:bg-dark-hover transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-red shadow-lg shadow-red-500/40" />
        </button>

        <div className="w-px h-5 bg-white/[0.08]" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-blue-500/20">
            {user?.name ? user.name[0].toUpperCase() : 'D'}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-txt-primary leading-tight">{user?.name || 'Doctor'}</div>
            <div className="text-[10px] text-txt-muted">{user?.specialization || 'Physician'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export const DoctorLayout = ({ children }) => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-dark-canvas text-txt-primary flex">
      <DoctorSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'ml-[72px]' : 'ml-60'}`}>
        <DoctorNavbar user={user} />
        <main className="flex-1 p-6 overflow-x-hidden bg-dark-canvas">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
