import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Mail, Shield, Building2, Clock, Key } from 'lucide-react';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user } = useAuth();

  const handleChangePassword = (e) => {
    e.preventDefault();
    toast.success('Security password updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">User Profile & Access Control</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage Account Role, Security Credentials & Activity History</p>
      </div>

      <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-health-500 to-tealAccent-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
          {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'SJ'}
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name || 'Dr. Sarah Jenkins'}</h2>
          <p className="text-xs text-health-600 dark:text-health-400 font-semibold">{user?.role || 'Admin & Lead Data Engineer'}</p>
          <p className="text-xs text-slate-400">{user?.email || 'admin@healthflow.ai'}</p>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
          <Key className="w-5 h-5 text-health-500" />
          <span>Security Credentials & Password Update</span>
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-health-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-health-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-health-500 hover:bg-health-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};
