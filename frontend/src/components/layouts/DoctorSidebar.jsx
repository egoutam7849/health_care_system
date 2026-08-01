import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, Calendar, FileText, Activity,
  FlaskConical, FolderOpen, CalendarDays, MessageSquare, Bell,
  Sparkles, BarChart3, User, Settings, LogOut,
  ChevronLeft, ChevronRight, Stethoscope, AlertTriangle
} from 'lucide-react';

const navGroups = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    id: 'clinical',
    label: 'Clinical Workload',
    items: [
      { name: 'My Patients', path: '/doctor/patients', icon: Users },
      { name: 'Appointments', path: '/doctor/appointments', icon: Calendar },
      { name: 'Clinical Records', path: '/doctor/records', icon: FileText },
      { name: 'Diagnoses', path: '/doctor/diagnoses', icon: Activity },
      { name: 'Prescriptions', path: '/doctor/prescriptions', icon: Stethoscope },
      { name: 'Laboratory', path: '/doctor/laboratory', icon: FlaskConical },
      { name: 'Medical Documents', path: '/doctor/documents', icon: FolderOpen },
    ]
  },
  {
    id: 'communication',
    label: 'Planning & Comms',
    items: [
      { name: 'Calendar', path: '/doctor/calendar', icon: CalendarDays },
      { name: 'Messages', path: '/doctor/messages', icon: MessageSquare },
      { name: 'Notifications', path: '/doctor/notifications', icon: Bell },
    ]
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    items: [
      { name: 'AI Clinical Assistant', path: '/doctor/ai-assistant', icon: Sparkles },
      { name: 'Performance', path: '/doctor/performance', icon: BarChart3 },
    ]
  },
  {
    id: 'account',
    label: 'Account',
    items: [
      { name: 'Profile', path: '/doctor/profile', icon: User },
      { name: 'Settings', path: '/doctor/settings', icon: Settings },
    ]
  },
];

export const DoctorSidebar = ({ collapsed, setCollapsed }) => {
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
        <div className="flex items-center gap-3 overflow-hidden cursor-pointer min-w-0" onClick={() => navigate('/doctor/dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-black text-base shadow-lg shadow-blue-500/25 shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-black text-sm text-txt-primary tracking-tight whitespace-nowrap">
                Clinical <span className="text-accent-blue">Portal</span>
              </span>
              <span className="text-[9px] tracking-widest font-bold text-txt-muted uppercase whitespace-nowrap">
                Doctor Workspace
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

      {/* Doctor Badge */}
      {!collapsed && (
        <div className="px-4 py-2.5 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse shrink-0" />
            <span className="text-[10px] text-blue-400 font-bold tracking-wide truncate">On Duty — Live Session</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map((group) => (
          <div key={group.id}>
            {!collapsed && (
              <div className="px-3 pb-1 text-[10px] font-extrabold tracking-widest uppercase text-txt-muted/60">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.name : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 text-xs font-semibold
                      ${isActive
                        ? 'bg-accent-blue text-white shadow-lg shadow-blue-500/20'
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
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {user?.name ? user.name[0] : 'D'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-txt-primary truncate">{user?.name || 'Doctor'}</div>
              <div className="text-[10px] text-txt-muted truncate">{user?.specialization || 'Physician'}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-txt-muted hover:text-accent-red hover:bg-rose-500/10 rounded-xl transition-colors"
        >
          <LogOut className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : ''}`} />
          {!collapsed && <span>Exit Portal</span>}
        </button>
      </div>
    </aside>
  );
};
