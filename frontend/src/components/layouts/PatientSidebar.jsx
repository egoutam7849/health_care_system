import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Calendar, FileText, Pill, CreditCard,
  User, Settings, LogOut, ChevronLeft, ChevronRight, Activity, HeartPulse
} from 'lucide-react';

const navGroups = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    id: 'care',
    label: 'Care Management',
    items: [
      { name: 'Appointments', path: '/patient/appointments', icon: Calendar },
      { name: 'Medical Records', path: '/patient/records', icon: FileText },
      { name: 'Prescriptions', path: '/patient/prescriptions', icon: Pill },
    ]
  },
  {
    id: 'financial',
    label: 'Financial',
    items: [
      { name: 'Billing & Insurance', path: '/patient/billing', icon: CreditCard },
    ]
  },
  {
    id: 'account',
    label: 'Account',
    items: [
      { name: 'Profile', path: '/patient/profile', icon: User },
      { name: 'Settings', path: '/patient/settings', icon: Settings },
    ]
  },
];

export const PatientSidebar = ({ collapsed, setCollapsed }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/portals');
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen flex flex-col transition-all duration-300
        border-r border-white/[0.08] bg-dark-shell
        ${collapsed ? 'w-[72px]' : 'w-60'}`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.08] shrink-0">
        <div className="flex items-center gap-3 overflow-hidden cursor-pointer min-w-0" onClick={() => navigate('/patient/dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-base shadow-lg shadow-emerald-500/25 shrink-0">
            <HeartPulse className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-black text-sm text-txt-primary tracking-tight whitespace-nowrap">
                MyHealth <span className="text-accent-emerald">Portal</span>
              </span>
              <span className="text-[9px] tracking-widest font-bold text-txt-muted uppercase whitespace-nowrap">
                Patient Workspace
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-txt-muted hover:text-txt-primary hover:bg-dark-hover transition-colors shrink-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-5 px-2 space-y-6">
        {navGroups.map((group) => (
          <div key={group.id}>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-extrabold tracking-widest uppercase text-txt-muted/60">
                {group.label}
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.name : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-xs font-semibold
                      ${isActive
                        ? 'bg-accent-emerald text-white shadow-lg shadow-emerald-500/20'
                        : 'text-txt-muted hover:text-txt-primary hover:bg-dark-hover'
                      }`
                    }
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : ''}`} />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Footer */}
      <div className="border-t border-white/[0.08] p-3 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-dark-section mb-2 border border-white/[0.05]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name ? user.name[0] : 'P'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-txt-primary truncate">{user?.name || 'Patient'}</div>
              <div className="text-[10px] text-txt-muted truncate">ID: {user?.patient_id || 'PAT-000'}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-txt-muted hover:text-accent-red hover:bg-rose-500/10 rounded-xl transition-colors"
        >
          <LogOut className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : ''}`} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
