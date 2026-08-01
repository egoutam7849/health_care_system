import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { PatientSidebar } from './PatientSidebar';
import { useAuth } from '../../context/AuthContext';
import { Bell, HeartPulse, User } from 'lucide-react';

const PatientNavbar = ({ user }) => {
  const navigate = useNavigate();
  return (
    <header className="h-14 border-b border-white/[0.08] bg-dark-canvas/95 backdrop-blur-md sticky top-0 z-30 px-5 flex items-center justify-between">
      {/* Left: Status */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-xl text-[11px] font-bold border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
          Secure Patient Session
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {}}
          className="relative p-2 text-txt-muted hover:text-txt-primary rounded-xl hover:bg-dark-hover transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-emerald shadow-lg shadow-emerald-500/40" />
        </button>

        <div className="w-px h-5 bg-white/[0.08]" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-emerald-500/20">
            {user?.name ? user.name[0].toUpperCase() : 'P'}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-txt-primary leading-tight">{user?.name || 'Patient'}</div>
            <div className="text-[10px] text-txt-muted">{user?.patient_id || 'PAT-000'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export const PatientLayout = ({ children }) => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-dark-canvas text-txt-primary flex">
      <PatientSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'ml-[72px]' : 'ml-60'}`}>
        <PatientNavbar user={user} />
        <main className="flex-1 p-6 overflow-x-hidden bg-dark-canvas">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
