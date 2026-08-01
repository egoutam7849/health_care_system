import React, { useState, useEffect } from 'react';
import { BarChart3, Database, Sparkles, LogOut, Download, Table } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { portalsAPI, aiInsightsAPI } from '../services/api';

export const AnalystDashboard = () => {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    portalsAPI.getAnalystData().then(res => setData(res));
    aiInsightsAPI.getSummary().then(res => setInsights(res));
  }, []);

  if (!data) {
    return <div className="p-8 text-center text-slate-400">Loading Healthcare Analytics Workspace...</div>;
  }

  const { gold_tables = [], warehouse_metrics = {}, analytics = {} } = data;
  const diseaseDist = analytics.disease_distribution || [];
  const hospPerf = analytics.hospital_performance || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-6 space-y-6">
      {/* Top Analyst Header */}
      <div className="glass-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-amber-500">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center font-bold text-xl shadow-inner">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold">Healthcare Business Intelligence Console</h1>
            <p className="text-xs text-slate-400 mt-1">
              Live Analytical Access to <span className="font-bold text-slate-700 dark:text-slate-200">PostgreSQL Data Warehouse</span> & <span className="font-bold text-slate-700 dark:text-slate-200">Medallion Pipeline</span>
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-rose-500 hover:text-white transition-colors self-start md:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold block">Total Patients</span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">{(warehouse_metrics.total_patients || 0).toLocaleString()}</span>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold block">Registered Doctors</span>
          <span className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1 block">{(warehouse_metrics.total_doctors || 0).toLocaleString()}</span>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold block">Scheduled Appointments</span>
          <span className="text-2xl font-black text-teal-600 mt-1 block">{(warehouse_metrics.total_appointments || 0).toLocaleString()}</span>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold block">Network Total Revenue</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">${(warehouse_metrics.total_revenue || 0).toLocaleString()}</span>
        </div>
      </div>

      {/* Gold Layer & AI Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Disease Distribution from Live DB */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base">Live Disease Prevalence Distribution</h3>
          </div>
          <div className="space-y-3">
            {diseaseDist.length === 0 ? (
              <div className="text-xs text-slate-400">No disease distribution records found.</div>
            ) : (
              diseaseDist.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.disease}</span>
                  <span className="font-mono font-bold text-amber-600">{item.count} Patients</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Executive AI Insights */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base">Executive AI Insights</h3>
          </div>
          <div className="space-y-3">
            {insights.map(item => (
              <div key={item.id} className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
                <span className="font-bold text-amber-600 dark:text-amber-400 block">{item.title}</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
