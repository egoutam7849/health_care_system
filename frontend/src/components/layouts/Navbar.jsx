import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, ShieldCheck, Activity } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { GlobalSearchModal } from '../common/GlobalSearchModal';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between transition-colors">
        {/* Global Search Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center space-x-3 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 px-4 py-2 rounded-xl transition-colors w-72 justify-between"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search Patients, Doctors, Datasets...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-200 dark:bg-slate-700 rounded">
            Ctrl+K
          </kbd>
        </button>

        {/* Right Tools & Profile */}
        <div className="flex items-center space-x-4">
          {/* Pipeline Live Signal Badge */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>PySpark Engine Active</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Info */}
          <div className="flex items-center space-x-3 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-health-600 to-tealAccent-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-health-500/20">
              {user?.name ? user.name[0] : 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="font-bold text-xs text-slate-900 dark:text-white block leading-tight">
                {user?.name || 'Dr. Sarah Jenkins'}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block">
                {user?.role || 'Admin & Lead Data Engineer'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
