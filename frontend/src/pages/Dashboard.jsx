import React, { useState, useEffect } from 'react';
import { Users, Stethoscope, Building2, Activity, DollarSign, Calendar, Sparkles, Database, FileSpreadsheet, ShieldAlert, ArrowUpRight, TrendingUp, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { dashboardAPI, aiInsightsAPI } from '../services/api';
import { InteractiveHospitalMap } from '../components/dashboard/InteractiveHospitalMap';
import { LiveActivityFeed } from '../components/dashboard/LiveActivityFeed';

const COLORS = ['#0c8de4', '#0d9488', '#f59e0b', '#8b5cf6', '#ec4899'];

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardAPI.getStats(),
      aiInsightsAPI.getSummary()
    ]).then(([statsRes, insightsRes]) => {
      setData(statsRes);
      setInsights(insightsRes);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const { kpis, charts, tables } = data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Executive Healthcare Command Center</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time Medallion ETL & Star Schema Warehouse Analytics</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Warehouse Status: ONLINE</span>
          </span>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full">
            Score: {kpis.data_quality_score}%
          </span>
        </div>
      </div>

      {/* Top 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-5 rounded-2xl hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Patients</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{kpis.total_patients.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-500 font-bold block mt-0.5">+12% vs last month</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Healthcare Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">${(kpis.total_revenue / 1e6).toFixed(1)}M</span>
            <span className="text-[10px] text-emerald-500 font-bold block mt-0.5">+8.4% YTD Growth</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Average Stay Duration</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{kpis.avg_stay_days} Days</span>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Optimal Discharge SLA</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Readmission Rate</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{kpis.readmission_rate}%</span>
            <span className="text-[10px] text-emerald-500 font-bold block mt-0.5">Well Below 10% Threshold</span>
          </div>
        </div>
      </div>

      {/* AI Executive Summaries Widget */}
      <div className="glass-card p-6 rounded-3xl border-l-4 border-l-health-500 space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-health-600 dark:text-health-400" />
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Executive AI Synthesis & Clinical Alerts</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map(item => (
            <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1">
              <span className="text-xs font-bold text-health-600 dark:text-health-400 block">{item.title}</span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Hospital GIS Map & Command Center */}
      <InteractiveHospitalMap />

      {/* Main Charts: Monthly Admissions & Disease Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart: Monthly Admissions & Revenue */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Monthly Inpatient Admissions & Revenue Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthly_admissions}>
                <defs>
                  <linearGradient id="colorAdm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0c8de4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0c8de4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="admissions" stroke="#0c8de4" fillOpacity={1} fill="url(#colorAdm)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Activity Feed */}
        <LiveActivityFeed />
      </div>
    </div>
  );
};
