import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Calendar, FileText, Pill, CreditCard, User,
  Settings, LogOut, ChevronLeft, ChevronRight, HeartPulse,
  FlaskConical, Activity, Bell, MessageSquare, Bot, FolderOpen,
  Heart, Stethoscope, TrendingUp, Shield
} from 'lucide-react';

const navGroups = [
  {
    id: 'overview',
    label: 'Health Overview',
    items: [
      { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard, badge: null },
      { name: 'My Health', path: '/patient/my-health', icon: Heart, badge: null },
    ]
  },
  {
    id: 'care',
    label: 'Care Management',
    items: [
      { name: 'Appointments', path: '/patient/appointments', icon: Calendar, badge: '2' },
      { name: 'Medical Records', path: '/patient/records', icon: FileText, badge: null },
      { name: 'Prescriptions', path: '/patient/prescriptions', icon: Pill, badge: '3' },
      { name: 'Lab Reports', path: '/patient/lab-reports', icon: FlaskConical, badge: '1' },
      { name: 'Health Metrics', path: '/patient/metrics', icon: TrendingUp, badge: null },
    ]
  },
  {
    id: 'financial',
    label: 'Financial',
    items: [
      { name: 'Billing & Insurance', path: '/patient/billing', icon: CreditCard, badge: null },
    ]
  },
  {
    id: 'communication',
    label: 'Communication',
    items: [
      { name: 'Messages', path: '/patient/messages', icon: MessageSquare, badge: '4' },
      { name: 'Notifications', path: '/patient/notifications', icon: Bell, badge: '6' },
      { name: 'AI Health Assistant', path: '/patient/ai-assistant', icon: Bot, badge: null },
    ]
  },
  {
    id: 'account',
    label: 'Documents & Account',
    items: [
      { name: 'Documents', path: '/patient/documents', icon: FolderOpen, badge: null },
      { name: 'Profile', path: '/patient/profile', icon: User, badge: null },
      { name: 'Settings', path: '/patient/settings', icon: Settings, badge: null },
    ]
  },
];

export const PatientSidebar = ({ collapsed, setCollapsed }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/portals');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'P';

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen flex flex-col transition-all duration-300
        border-r border-white/[0.08] bg-dark-shell
        ${collapsed ? 'w-[72px]' : 'w-[240px]'}`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.08] shrink-0">
        <div
          className="flex items-center gap-3 overflow-hidden cursor-pointer min-w-0"
          onClick={() => navigate('/patient/dashboard')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 shrink-0">
            <HeartPulse className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-black text-sm text-txt-primary tracking-tight whitespace-nowrap">
                My<span className="text-accent-emerald">Health</span>
              </span>
              <span className="text-[9px] tracking-widest font-bold text-txt-muted uppercase whitespace-nowrap">
                Patient Portal
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-txt-muted hover:text-txt-primary hover:bg-dark-hover transition-colors shrink-0"
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <ChevronLeft className="w-4 h-4" />
          }
        </button>
      </div>

      {/* Patient Quick Card */}
      {!collapsed && (
        <div className="mx-3 mt-4 p-3 rounded-xl bg-gradient-to-br from-emerald-600/20 to-teal-600/10 border border-emerald-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md shadow-emerald-500/30">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-txt-primary truncate">{user?.name || 'Patient'}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
                <span className="text-[10px] text-accent-emerald font-bold truncate">
                  {user?.patient_id || 'PAT-000'}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-lg">
            <Shield className="w-3 h-3 text-accent-emerald" />
            <span className="text-[9px] text-accent-emerald font-bold tracking-wide">SECURE SESSION ACTIVE</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-5 mt-1">
        {navGroups.map((group) => (
          <div key={group.id}>
            {!collapsed && (
              <div className="px-3 pb-1.5 text-[9px] font-extrabold tracking-widest uppercase text-txt-muted/50">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.name : undefined}
                    className={() =>
                      `relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-xs font-semibold group
                      ${isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                        : 'text-txt-muted hover:text-txt-primary hover:bg-dark-hover'
                      }`
                    }
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${collapsed ? 'mx-auto' : ''}`} />
                    {!collapsed && (
                      <>
                        <span className="truncate flex-1">{item.name}</span>
                        {item.badge && (
                          <span className={`px-1.5 py-0.5 text-[9px] font-black rounded-full shrink-0
                            ${isActive ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-accent-emerald'}`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-emerald" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Footer */}
      <div className="border-t border-white/[0.08] p-3 shrink-0">
        <button
          onClick={handleLogout}
          title={collapsed ? 'Sign Out' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-txt-muted hover:text-red-400 hover:bg-rose-500/10 rounded-xl transition-all duration-150"
        >
          <LogOut className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : ''}`} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
