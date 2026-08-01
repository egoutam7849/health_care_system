import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Sun, Moon, Settings, X, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { useNavigate } from 'react-router-dom';

const mockNotifications = [
  { id: 1, type: 'critical', icon: AlertCircle, title: 'Bed Occupancy Critical', msg: 'Metro General at 94% capacity — ICU beds critically low.', time: '2m ago', color: 'text-accent-red', bg: 'bg-rose-500/10' },
  { id: 2, type: 'warning', icon: AlertTriangle, title: 'Medicine Stock Alert', msg: 'Amoxicillin 500mg inventory below reorder threshold.', time: '8m ago', color: 'text-accent-orange', bg: 'bg-amber-500/10' },
  { id: 3, type: 'info', icon: Info, title: 'ETL Pipeline Completed', msg: 'Bronze → Silver → Gold sync: 12,430 records processed.', time: '15m ago', color: 'text-accent-blue', bg: 'bg-blue-500/10' },
  { id: 4, type: 'success', icon: CheckCircle2, title: 'New Doctor Provisioned', msg: 'Dr. Rahul Sharma onboarded — credentials dispatched.', time: '22m ago', color: 'text-accent-emerald', bg: 'bg-emerald-500/10' },
  { id: 5, type: 'info', icon: Info, title: 'Insurance Claim Approved', msg: 'Claim #INS-4421 approved — $14,500 cleared.', time: '1h ago', color: 'text-accent-blue', bg: 'bg-blue-500/10' },
];

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const unreadCount = 3;

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <header className="h-16 border-b border-white/[0.08] bg-dark-canvas/95 backdrop-blur-md sticky top-0 z-30 px-5 flex items-center justify-between">
        {/* Left: Global Search Trigger & Pipeline Badge */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-3 text-xs text-txt-muted bg-dark-shell hover:bg-dark-section border border-white/[0.08] px-4 py-2 rounded-xl transition-colors w-64 justify-between"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-txt-muted" />
              <span>Search patients, doctors, records...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-txt-muted bg-dark-section rounded border border-white/[0.08]">
              ⌘K
            </kbd>
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-xl text-[11px] font-bold border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
            PySpark Engine Active
          </div>
        </div>

        {/* Right: Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 text-txt-muted hover:text-txt-primary rounded-xl hover:bg-dark-hover transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="p-2.5 text-txt-muted hover:text-txt-primary rounded-xl hover:bg-dark-hover transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2.5 text-txt-muted hover:text-txt-primary rounded-xl hover:bg-dark-hover transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-accent-red text-white text-[9px] font-black flex items-center justify-center shadow-lg shadow-rose-500/40">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 top-12 w-96 rounded-2xl border border-white/[0.08] bg-dark-section shadow-2xl shadow-black/80 overflow-hidden z-50">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-dark-shell">
                  <div>
                    <h3 className="font-black text-sm text-txt-primary">Notification Center</h3>
                    <p className="text-[10px] text-txt-muted mt-0.5">{unreadCount} unread alerts</p>
                  </div>
                  <button onClick={() => setIsNotifOpen(false)} className="p-1.5 rounded-lg text-txt-muted hover:text-txt-primary hover:bg-dark-hover">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="divide-y divide-white/[0.05] max-h-80 overflow-y-auto bg-dark-section">
                  {mockNotifications.map(n => {
                    const NIcon = n.icon;
                    return (
                      <div key={n.id} className="flex gap-3 px-5 py-3.5 hover:bg-dark-hover transition-colors cursor-pointer">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${n.bg}`}>
                          <NIcon className={`w-4 h-4 ${n.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-txt-primary">{n.title}</span>
                            <span className="text-[10px] text-txt-muted shrink-0">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-txt-secondary leading-relaxed mt-0.5">{n.msg}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="px-5 py-3 border-t border-white/[0.08] bg-dark-shell">
                  <button className="text-xs text-accent-blue font-bold hover:text-blue-400 transition-colors">
                    View all notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-white/[0.08] mx-1" />

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-blue-500/20">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-txt-primary leading-tight">{user?.name || 'Administrator'}</div>
              <div className="text-[10px] text-txt-muted">{user?.role || 'Admin'}</div>
            </div>
          </div>
        </div>
      </header>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
