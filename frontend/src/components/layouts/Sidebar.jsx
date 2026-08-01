import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, Stethoscope, Building2, Calendar, Activity,
  ChevronLeft, ChevronRight, LogOut, ChevronDown, ChevronUp,
  GitBranch, Server, Shield, FileText, Settings, UserCheck,
  Database, Trophy, Cpu, BarChart3, Brain,
  Receipt, UploadCloud, Share2, ShieldCheck, DoorOpen, Bed, Siren, BookOpen, Lock, CreditCard, ClipboardList
} from 'lucide-react';

const workspaces = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    color: 'text-accent-blue',
    items: [
      { name: 'Executive Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: Activity,
    color: 'text-accent-teal',
    items: [
      { name: 'Patients', path: '/patients', icon: Users },
      { name: 'Doctors', path: '/doctors', icon: Stethoscope },
      { name: 'Appointments', path: '/appointments', icon: Calendar },
      { name: 'Clinical Records', path: '/disease-analytics', icon: ClipboardList },
      { name: 'Emergency Command', path: '/emergency-command', icon: Siren },
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    icon: Building2,
    color: 'text-accent-purple',
    items: [
      { name: 'Hospitals', path: '/hospitals', icon: Building2 },
      { name: 'Departments', path: '/departments', icon: DoorOpen },
      { name: 'Wards & Beds', path: '/wards', icon: Bed },
    ],
  },
  {
    id: 'business',
    label: 'Business',
    icon: CreditCard,
    color: 'text-accent-orange',
    items: [
      { name: 'Billing & Invoices', path: '/billing', icon: Receipt },
      { name: 'Insurance Claims', path: '/insurance', icon: Shield },
      { name: 'Reports & Export', path: '/reports', icon: FileText },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    icon: Brain,
    color: 'text-accent-emerald',
    items: [
      { name: 'Data Ingestion', path: '/upload', icon: UploadCloud },
      { name: 'Bronze Layer', path: '/bronze', icon: Database },
      { name: 'Silver Layer', path: '/silver', icon: GitBranch },
      { name: 'Gold Layer', path: '/gold', icon: Trophy },
      { name: 'Metadata Catalog', path: '/catalog', icon: BookOpen },
      { name: 'ETL Pipeline', path: '/etl-pipeline', icon: Cpu },
      { name: 'Data Lineage', path: '/lineage', icon: Share2 },
      { name: 'Airflow Jobs', path: '/airflow-jobs', icon: Activity },
      { name: 'Data Quality', path: '/data-quality', icon: ShieldCheck },
      { name: 'Disease Analytics', path: '/disease-analytics', icon: BarChart3 },
      { name: 'Monitoring', path: '/monitoring', icon: Server },
    ],
  },
  {
    id: 'administration',
    label: 'Administration',
    icon: Lock,
    color: 'text-accent-red',
    items: [
      { name: 'Audit Logs', path: '/audit', icon: Shield },
      { name: 'Settings', path: '/settings', icon: Settings },
      { name: 'Profile', path: '/profile', icon: UserCheck },
    ],
  },
];

export const Sidebar = ({ collapsed, setCollapsed }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [openWorkspaces, setOpenWorkspaces] = useState({
    overview: true,
    operations: true,
    infrastructure: false,
    business: false,
    intelligence: false,
    administration: false,
  });

  const toggleWorkspace = (id) => {
    if (collapsed) {
      setCollapsed(false);
      setOpenWorkspaces(prev => ({ ...prev, [id]: true }));
      return;
    }
    setOpenWorkspaces(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isWorkspaceActive = (ws) =>
    ws.items.some(item => location.pathname === item.path || location.pathname.startsWith(item.path + '/'));

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen flex flex-col transition-all duration-300
        border-r border-white/[0.08] bg-dark-shell
        ${collapsed ? 'w-[72px]' : 'w-64'}`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.08] shrink-0">
        <div
          className="flex items-center gap-3 overflow-hidden cursor-pointer min-w-0"
          onClick={() => navigate('/')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-black text-base shadow-lg shadow-blue-500/25 shrink-0">
            H
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-black text-sm text-txt-primary tracking-tight whitespace-nowrap">
                HealthFlow <span className="text-accent-blue">AI</span>
              </span>
              <span className="text-[9px] tracking-widest font-bold text-txt-muted uppercase whitespace-nowrap">
                Admin Console
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-txt-muted hover:text-txt-primary hover:bg-dark-hover transition-colors shrink-0"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Environment Badge */}
      {!collapsed && (
        <div className="px-4 py-2.5 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse shrink-0" />
            <span className="text-[10px] text-emerald-400 font-bold tracking-wide">Production Environment</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {workspaces.map((ws) => {
          const WsIcon = ws.icon;
          const isActive = isWorkspaceActive(ws);
          const isOpen = openWorkspaces[ws.id];

          return (
            <div key={ws.id}>
              <button
                onClick={() => toggleWorkspace(ws.id)}
                title={collapsed ? ws.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 text-left group
                  ${isActive
                    ? 'bg-dark-section text-txt-primary'
                    : 'text-txt-muted hover:text-txt-primary hover:bg-dark-hover/60'
                  }`}
              >
                <WsIcon className={`w-4 h-4 shrink-0 ${isActive ? ws.color : 'group-hover:text-txt-secondary'}`} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-[11px] font-extrabold tracking-wider uppercase">{ws.label}</span>
                    {isOpen
                      ? <ChevronUp className="w-3.5 h-3.5 text-txt-muted" />
                      : <ChevronDown className="w-3.5 h-3.5 text-txt-muted" />
                    }
                  </>
                )}
              </button>

              {(isOpen || collapsed) && (
                <div className={`${!collapsed ? 'ml-2 pl-3 border-l border-white/[0.06] mt-0.5 mb-1 space-y-0.5' : 'mt-0.5 space-y-0.5'}`}>
                  {ws.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        title={collapsed ? item.name : undefined}
                        className={({ isActive: navActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 text-xs font-semibold group
                          ${navActive
                            ? 'bg-accent-blue text-white shadow-lg shadow-blue-500/20'
                            : 'text-txt-muted hover:text-txt-primary hover:bg-dark-hover'
                          }`
                        }
                      >
                        <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${collapsed ? 'mx-auto' : ''}`} />
                        {!collapsed && <span className="truncate">{item.name}</span>}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User Footer */}
      <div className="border-t border-white/[0.08] p-3 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-dark-section mb-2 border border-white/[0.05]">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {user?.name ? user.name[0] : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-txt-primary truncate">{user?.name || 'Admin'}</div>
              <div className="text-[10px] text-txt-muted truncate">{user?.role || 'Administrator'}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-txt-muted hover:text-accent-red hover:bg-rose-500/10 rounded-xl transition-colors"
        >
          <LogOut className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : ''}`} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
