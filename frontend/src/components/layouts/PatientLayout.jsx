import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientSidebar } from './PatientSidebar';
import { useAuth } from '../../context/AuthContext';
import {
  Bell, HeartPulse, Search, RefreshCw, ChevronDown, Activity
} from 'lucide-react';

const PatientNavbar = ({ user, onRefresh }) => {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="h-14 border-b border-white/[0.08] bg-dark-shell/95 backdrop-blur-md sticky top-0 z-30 px-5 flex items-center justify-between gap-4">
      {/* Left: Greeting */}
      <div className="hidden md:flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-txt-muted">
          <Activity className="w-3.5 h-3.5 text-accent-emerald" />
          <span>{greeting()}, </span>
          <span className="font-bold text-txt-primary">{user?.name?.split(' ')[0] || 'Patient'}</span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
          Secure Session
        </div>
      </div>

      {/* Right: Actions */}
      <div className="ml-auto flex items-center gap-2">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 text-txt-muted hover:text-txt-primary rounded-xl hover:bg-dark-hover transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => navigate('/patient/notifications')}
          className="relative p-2 text-txt-muted hover:text-txt-primary rounded-xl hover:bg-dark-hover transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-emerald shadow-lg shadow-emerald-500/50" />
        </button>

        <div className="w-px h-5 bg-white/[0.08]" />

        <div
          className="flex items-center gap-2.5 cursor-pointer hover:bg-dark-hover px-2 py-1.5 rounded-xl transition-colors"
          onClick={() => navigate('/patient/profile')}
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-emerald-500/25">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'P'}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-txt-primary leading-tight">{user?.name || 'Patient'}</div>
            <div className="text-[10px] text-txt-muted">{user?.patient_id || 'PAT-000'}</div>
          </div>
          <ChevronDown className="w-3 h-3 text-txt-muted hidden sm:block" />
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
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'ml-[72px]' : 'ml-[240px]'}`}>
        <PatientNavbar user={user} />
        <main className="flex-1 p-6 overflow-x-hidden bg-dark-canvas">
          {children}
        </main>
      </div>
    </div>
  );
};
