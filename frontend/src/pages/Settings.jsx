import React, { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Bell, Mail, Server, Cpu, Database, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [airflowUrl, setAirflowUrl] = useState('http://localhost:8080');
  const [sparkMaster, setSparkMaster] = useState('spark://localhost:7077');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('System configuration preferences updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Platform Settings & Engine Configuration</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure Dark Mode, Notification Alerts, PySpark Cluster & Airflow Endpoints</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Appearance Section */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <Sun className="w-5 h-5 text-amber-500" />
            <span>Theme & Appearance</span>
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Dark Mode Interface</p>
              <p className="text-xs text-slate-400">Toggle between Light and Enterprise Dark Theme</p>
            </div>
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${darkMode ? 'bg-health-600' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Notifications & Email Alerts */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <Bell className="w-5 h-5 text-health-500" />
            <span>Alerts & Notifications</span>
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">ETL Pipeline Alerts</p>
              <p className="text-xs text-slate-400">Receive in-app toast alerts on Medallion stage completions</p>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-5 h-5 accent-health-600 rounded"
            />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Email Digest Notifications</p>
              <p className="text-xs text-slate-400">Send daily Data Quality health reports to admin email</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-5 h-5 accent-health-600 rounded"
            />
          </div>
        </div>

        {/* Distributed Computing Infrastructure */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-tealAccent-500" />
            <span>PySpark & Airflow Infrastructure</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">PySpark Master Cluster URL</label>
              <input
                type="text"
                value={sparkMaster}
                onChange={(e) => setSparkMaster(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-health-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Airflow Webserver Endpoint</label>
              <input
                type="text"
                value={airflowUrl}
                onChange={(e) => setAirflowUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-health-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-health-600 to-tealAccent-600 text-white font-bold text-xs rounded-xl hover:opacity-95 shadow-md shadow-health-500/20"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </form>
    </div>
  );
};
