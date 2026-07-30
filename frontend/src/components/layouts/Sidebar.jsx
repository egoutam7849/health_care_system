import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, UploadCloud, Database, Sparkles, Trophy,
  Users, Stethoscope, Building2, Calendar, Activity,
  GitBranch, Cpu, ShieldCheck, FileText, Settings,
  UserCheck, LogOut, ChevronLeft, ChevronRight, Share2, Server, Shield, Siren, Layers
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Data Ingestion', path: '/upload', icon: UploadCloud },
  { name: 'Bronze Layer', path: '/bronze', icon: Database },
  { name: 'Silver Layer', path: '/silver', icon: Sparkles },
  { name: 'Gold Layer', path: '/gold', icon: Trophy },
  { name: 'Metadata Catalog', path: '/catalog', icon: Layers },
  { name: 'Emergency Command', path: '/emergency-command', icon: Siren },
  { name: 'Patients', path: '/patients', icon: Users },
  { name: 'Doctors', path: '/doctors', icon: Stethoscope },
  { name: 'Hospitals', path: '/hospitals', icon: Building2 },
  { name: 'Appointments', path: '/appointments', icon: Calendar },
  { name: 'Disease Analytics', path: '/disease-analytics', icon: Activity },
  { name: 'ETL Pipeline', path: '/etl-pipeline', icon: GitBranch },
  { name: 'Data Lineage', path: '/lineage', icon: Share2 },
  { name: 'Airflow Jobs', path: '/airflow-jobs', icon: Cpu },
  { name: 'Data Quality', path: '/data-quality', icon: ShieldCheck },
  { name: 'Monitoring', path: '/monitoring', icon: Server },
  { name: 'Audit Logs', path: '/audit', icon: Shield },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'Profile', path: '/profile', icon: UserCheck },
];

export const Sidebar = ({ collapsed, setCollapsed }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3 overflow-hidden cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-health-600 to-tealAccent-500 flex items-center justify-center text-white font-bold shadow-md shadow-health-500/20 shrink-0">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          {!collapsed && (
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-bold text-lg bg-gradient-to-r from-health-600 to-tealAccent-600 bg-clip-text text-transparent">
                HealthFlow AI
              </span>
              <span className="text-[10px] tracking-wider font-semibold text-slate-400 dark:text-slate-500 uppercase">
                Enterprise Platform
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <div className="h-[calc(100vh-8rem)] overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-xl transition-all duration-200 font-medium text-xs group ${
                  isActive
                    ? 'bg-health-500 text-white shadow-md shadow-health-500/30 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-health-50 dark:hover:bg-slate-800 hover:text-health-600 dark:hover:text-white'
                }`
              }
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
        >
          <LogOut className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
          {!collapsed && <span>Logout to Portals</span>}
        </button>
      </div>
    </aside>
  );
};
