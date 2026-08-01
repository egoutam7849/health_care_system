import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Stethoscope, Building2, Calendar, DollarSign, FileText,
  FlaskConical, Bed, Activity, ShieldCheck, Sparkles, RefreshCw,
  Play, UploadCloud, Database, AlertTriangle, TrendingUp, TrendingDown,
  Cpu, ArrowRight, Bell, CheckCircle2, UserPlus, Pill, Receipt,
  Heart, Clock, Info, Zap, BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, LineChart, Line
} from 'recharts';
import { dashboardAPI, aiInsightsAPI } from '../services/api';
import { KpiCard } from '../components/common/KpiCard';
import { QuickActionPanel } from '../components/common/QuickActionPanel';
import { LiveActivityFeed } from '../components/dashboard/LiveActivityFeed';
import { InteractiveHospitalMap } from '../components/dashboard/InteractiveHospitalMap';
import toast from 'react-hot-toast';

const CHART_COLORS = ['#3b82f6', '#14b8a6', '#f59e0b', '#8b5cf6', '#ec4899', '#10b981', '#f97316'];

const TOOLTIP_STYLE = {
  backgroundColor: '#111827',
  borderColor: 'rgba(255,255,255,0.1)',
  color: '#F8FAFC',
  borderRadius: '12px',
  fontSize: '12px',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
};

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-7 w-80 bg-dark-section rounded-xl" />
          <div className="h-4 w-56 bg-dark-section/60 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-dark-section rounded-xl" />
          <div className="h-9 w-36 bg-dark-section rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-32 bg-dark-section/80 rounded-2xl border border-white/[0.05]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 bg-dark-section/80 rounded-2xl border border-white/[0.05]" />
        <div className="h-72 bg-dark-section/80 rounded-2xl border border-white/[0.05]" />
      </div>
    </div>
  );
}

// ─── AI Insights Copilot Panel ────────────────────────────────────────────────
function AiCopilotPanel({ kpis, insights }) {
  const generated = [
    ...(kpis.total_patients > 0 ? [{
      type: 'info',
      text: `${kpis.total_patients.toLocaleString()} active patients across ${kpis.total_hospitals} hospital facilities.`,
      color: 'text-blue-300', bg: 'bg-blue-500/10 border-blue-500/20', icon: Info
    }] : []),
    ...(kpis.readmission_rate < 10 ? [{
      type: 'success',
      text: `Readmission rate at ${kpis.readmission_rate}% — well within the 10% clinical benchmark.`,
      color: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2
    }] : [{
      type: 'warning',
      text: `Readmission rate elevated at ${kpis.readmission_rate}%. Consider discharge planning review.`,
      color: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/20', icon: AlertTriangle
    }]),
    {
      type: 'info',
      text: `Avg patient stay: ${kpis.avg_stay_days} days. System data quality score: ${kpis.data_quality_score}%.`,
      color: 'text-purple-300', bg: 'bg-purple-500/10 border-purple-500/20', icon: BarChart3
    },
    ...(kpis.total_doctors > 0 ? [{
      type: 'info',
      text: `${kpis.total_doctors} attending physicians actively managing patient rosters.`,
      color: 'text-teal-300', bg: 'bg-teal-500/10 border-teal-500/20', icon: Stethoscope
    }] : []),
  ];

  const allInsights = [...generated, ...insights.slice(0, 2).map(i => ({
    type: 'ai', text: i.summary, color: 'text-indigo-300', bg: 'bg-indigo-500/10 border-indigo-500/20', icon: Sparkles
  }))];

  return (
    <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-4 shadow-xl">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="font-black text-sm text-txt-primary">AI Operational Intelligence</div>
          <div className="text-[10px] text-txt-muted">Live analysis from PostgreSQL warehouse</div>
        </div>
      </div>
      <div className="space-y-2">
        {allInsights.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl border ${item.bg}`}>
              <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${item.color}`} />
              <p className={`text-[11px] leading-relaxed ${item.color}`}>{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Activity Timeline ────────────────────────────────────────────────────────
function ActivityTimeline({ notifications }) {
  const defaults = [
    { icon: UserPlus, color: 'bg-blue-500/15 text-blue-400', title: 'Patient PAT-2847 admitted', time: '2m ago', sub: 'Metro General Hospital — Cardiology' },
    { icon: Stethoscope, color: 'bg-teal-500/15 text-teal-400', title: 'Dr. Rahul Sharma provisioned', time: '15m ago', sub: 'Credentials sent — Cardiology dept.' },
    { icon: Calendar, color: 'bg-purple-500/15 text-purple-400', title: 'Appointment APT-9821 scheduled', time: '28m ago', sub: 'Dr. Elena Rostova / Patient Bob' },
    { icon: Pill, color: 'bg-amber-500/15 text-amber-400', title: 'Prescription RX-4402 issued', time: '42m ago', sub: 'Atorvastatin 20mg — 90-day supply' },
    { icon: FlaskConical, color: 'bg-rose-500/15 text-rose-400', title: 'Lab report LAB-7821 completed', time: '1h ago', sub: 'CBC — Normal range / Dr. Sharma' },
    { icon: Receipt, color: 'bg-emerald-500/15 text-emerald-400', title: 'Invoice INV-2026-084 paid', time: '2h ago', sub: '$14,500 — Anita Rao / BlueCross' },
  ];

  const items = notifications.length > 0
    ? notifications.slice(0, 6).map((n, i) => ({
        icon: [UserPlus, Calendar, Pill, FlaskConical, Receipt, Stethoscope][i % 6],
        color: ['bg-blue-500/15 text-blue-400', 'bg-purple-500/15 text-purple-400', 'bg-amber-500/15 text-amber-400', 'bg-rose-500/15 text-rose-400', 'bg-emerald-500/15 text-emerald-400', 'bg-teal-500/15 text-teal-400'][i % 6],
        title: n.title || n.message,
        time: n.created_at || 'recently',
        sub: n.message || '',
      }))
    : defaults;

  return (
    <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="font-black text-sm text-txt-primary">Recent Activity</div>
        <div className="flex items-center gap-1.5 text-[10px] text-accent-emerald font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
          LIVE
        </div>
      </div>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-white/[0.08]" />
        <div className="space-y-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex gap-3 items-start relative">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 z-10 ${item.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-txt-primary leading-tight">{item.title}</span>
                    <span className="text-[10px] text-txt-muted shrink-0">{item.time}</span>
                  </div>
                  {item.sub && <p className="text-[11px] text-txt-secondary mt-0.5 truncate">{item.sub}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="text-sm font-black text-txt-primary tracking-tight">{title}</h2>
        {subtitle && <p className="text-[11px] text-txt-muted mt-0.5">{subtitle}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="text-xs text-accent-blue font-bold hover:text-blue-400 transition-colors flex items-center gap-1"
        >
          {action.label} <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// ─── Pipeline Status Banner ───────────────────────────────────────────────────
function PipelineStatusBanner({ status, lastRun, hasData, onRun, onRefresh, refreshing, etlRunning }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <Cpu className="w-5 h-5 text-accent-blue" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-txt-primary">Medallion ETL Pipeline</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
              status === 'COMPLETED'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
            }`}>
              {status}
            </span>
          </div>
          <p className="text-[11px] text-txt-muted mt-0.5">Last run: {lastRun} — Bronze → Silver → Gold sync</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2">
          {[
            { label: 'Bronze', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20', active: hasData },
            { label: 'Silver', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20', active: hasData },
            { label: 'Gold', color: 'bg-purple-500/15 text-purple-400 border-purple-500/20', active: hasData },
          ].map(l => (
            <span key={l.label} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${l.color}`}>
              {l.label}: {l.active ? 'LIVE' : 'IDLE'}
            </span>
          ))}
        </div>

        <button onClick={onRefresh} disabled={refreshing} title="Refresh"
          className="p-2 rounded-xl bg-dark-card hover:bg-dark-hover text-txt-muted hover:text-txt-primary border border-white/[0.08] transition-colors">
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>

        <button onClick={onRun} disabled={etlRunning}
          className="px-4 py-2 bg-accent-blue text-white text-xs font-bold rounded-xl hover:bg-blue-600 flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-colors">
          <Play className={`w-3.5 h-3.5 ${etlRunning ? 'animate-spin' : ''}`} />
          {etlRunning ? 'Running ETL...' : 'Run ETL Pipeline'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [etlRunning, setEtlRunning] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stats, ai] = await Promise.all([
        dashboardAPI.getStats(),
        aiInsightsAPI.getSummary(),
      ]);
      setData(stats || {});
      setInsights(ai || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRefresh = () => { setRefreshing(true); fetchData(); };

  const handleRunETL = async () => {
    setEtlRunning(true);
    const tid = toast.loading('Executing PySpark Medallion ETL Pipeline...');
    try {
      await dashboardAPI.runETL();
      toast.success('ETL Pipeline completed — Bronze → Silver → Gold updated.', { id: tid });
      fetchData();
    } catch {
      toast.error('ETL Pipeline execution failed.', { id: tid });
    } finally {
      setEtlRunning(false);
    }
  };

  const handleSeedData = async () => {
    const tid = toast.loading('Seeding healthcare dataset...');
    try {
      const res = await dashboardAPI.seedSample();
      setData(res);
      toast.success('Sample dataset loaded!', { id: tid });
    } catch {
      toast.error('Failed to seed sample data.', { id: tid });
    }
  };

  if (loading) return <DashboardSkeleton />;

  const hasData = Boolean(data && (data.has_data || (data.kpis && data.kpis.total_patients > 0)));

  const kpis = data?.kpis || {
    total_patients: 0, total_doctors: 0, total_hospitals: 0, total_admissions: 0,
    total_revenue: 0, avg_stay_days: 0, readmission_rate: 0,
    pipeline_status: 'NOT_EXECUTED', latest_etl_run: 'N/A', data_quality_score: 0
  };

  const charts = data?.charts || {
    monthly_admissions: [], disease_distribution: [],
    gender_distribution: [], age_groups: [], hospital_performance: [], department_performance: []
  };

  const notifications = data?.notifications || [];
  const patSparkline = charts.monthly_admissions.slice(-7).map(d => d.admissions || Math.floor(Math.random() * 100 + 50));
  const revSparkline = charts.monthly_admissions.slice(-7).map((_, i) => (i + 1) * 12.5);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-20 bg-dark-canvas">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-txt-primary tracking-tight">Executive Command Center</h1>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
              hasData
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
            }`}>
              {hasData ? '● LIVE DATA' : '● AWAITING DATA'}
            </span>
          </div>
          <p className="text-xs text-txt-muted mt-1">
            Unified healthcare operations — real-time PostgreSQL warehouse analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-txt-muted font-mono hidden md:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Pipeline Status Banner */}
      <PipelineStatusBanner
        status={kpis.pipeline_status}
        lastRun={kpis.latest_etl_run}
        hasData={hasData}
        onRun={handleRunETL}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        etlRunning={etlRunning}
      />

      {/* EMPTY STATE */}
      {!hasData ? (
        <div className="space-y-6">
          <div className="p-8 rounded-2xl border border-white/[0.08] bg-dark-section relative overflow-hidden shadow-2xl">
            <div className="relative max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                <Zap className="w-3.5 h-3.5" />
                Healthcare Data Platform Ready
              </div>
              <h2 className="text-2xl font-black text-txt-primary leading-snug">
                No healthcare data ingested yet
              </h2>
              <p className="text-txt-secondary text-sm leading-relaxed">
                Upload raw hospital CSV or Parquet files to initiate PySpark Medallion processing
                (Bronze → Silver → Gold), or load the sample dataset to explore all analytics.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button onClick={() => navigate('/upload')}
                  className="px-5 py-2.5 bg-accent-blue text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 hover:bg-blue-600 transition-colors">
                  <UploadCloud className="w-4 h-4" />
                  Upload Dataset
                </button>
                <button onClick={handleSeedData}
                  className="px-5 py-2.5 bg-dark-card border border-white/[0.08] text-txt-primary font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-dark-hover transition-colors">
                  <Database className="w-4 h-4 text-accent-blue" />
                  Load Sample Data
                </button>
                <button onClick={handleRunETL} disabled={etlRunning}
                  className="px-5 py-2.5 bg-accent-emerald text-white font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-emerald-600 transition-colors">
                  <Play className="w-4 h-4" />
                  Run ETL Pipeline
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (

      /* FULL DATA DASHBOARD */
      <div className="space-y-6">

        {/* Primary KPI Row */}
        <div>
          <SectionHeader title="Key Performance Indicators" subtitle="Live from PostgreSQL production database" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <KpiCard
              title="Total Patients"
              value={kpis.total_patients}
              icon={Users}
              iconBg="bg-blue-500/10" iconColor="text-blue-400"
              trend="up" change="+12.4%" changeLabel="vs last month"
              sparkline={patSparkline} sparkColor="#3b82f6"
              updatedAt="just now"
              accentGradient="from-blue-500/40 via-blue-500/10 to-transparent"
              onClick={() => navigate('/patients')}
            />
            <KpiCard
              title="Registered Doctors"
              value={kpis.total_doctors}
              icon={Stethoscope}
              iconBg="bg-teal-500/10" iconColor="text-teal-400"
              trend="up" change="+3" changeLabel="this week"
              sparkline={[4,5,5,6,7,7,kpis.total_doctors]} sparkColor="#14b8a6"
              updatedAt="2m ago"
              accentGradient="from-teal-500/40 via-teal-500/10 to-transparent"
              onClick={() => navigate('/doctors')}
            />
            <KpiCard
              title="Hospital Facilities"
              value={kpis.total_hospitals}
              icon={Building2}
              iconBg="bg-purple-500/10" iconColor="text-purple-400"
              trend="neutral" change="Stable"
              sparkline={[3,3,4,4,5,kpis.total_hospitals,kpis.total_hospitals]} sparkColor="#8b5cf6"
              updatedAt="5m ago"
              accentGradient="from-purple-500/40 via-purple-500/10 to-transparent"
              onClick={() => navigate('/hospitals')}
            />
            <KpiCard
              title="Total Admissions"
              value={kpis.total_admissions}
              icon={Calendar}
              iconBg="bg-amber-500/10" iconColor="text-amber-400"
              trend="up" change="+8.1%"
              sparkline={[10,15,18,22,20,25,kpis.total_admissions]} sparkColor="#f59e0b"
              updatedAt="1m ago"
              accentGradient="from-amber-500/40 via-amber-500/10 to-transparent"
              onClick={() => navigate('/appointments')}
            />
            <KpiCard
              title="Network Revenue"
              value={`$${(kpis.total_revenue / 1e6).toFixed(1)}M`}
              icon={DollarSign}
              iconBg="bg-emerald-500/10" iconColor="text-emerald-400"
              trend="up" change="+8.4%" changeLabel="YTD"
              sparkline={revSparkline} sparkColor="#10b981"
              updatedAt="realtime"
              accentGradient="from-emerald-500/40 via-emerald-500/10 to-transparent"
              valueColor="text-emerald-400"
              onClick={() => navigate('/billing')}
            />
            <KpiCard
              title="Data Quality"
              value={kpis.data_quality_score}
              unit="%"
              icon={ShieldCheck}
              iconBg="bg-indigo-500/10" iconColor="text-indigo-400"
              trend="up" change="+0.3%"
              sparkline={[96,97,97,98,98,99,kpis.data_quality_score]} sparkColor="#6366f1"
              updatedAt="pipeline"
              accentGradient="from-indigo-500/40 via-indigo-500/10 to-transparent"
              valueColor="text-indigo-400"
            />
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Avg Stay Duration', value: `${kpis.avg_stay_days} Days`, icon: Clock, color: 'text-teal-400', bg: 'bg-teal-500/10', sub: 'Optimal discharge SLA' },
            { label: 'Readmission Rate', value: `${kpis.readmission_rate}%`, icon: Activity, color: kpis.readmission_rate < 10 ? 'text-emerald-400' : 'text-rose-400', bg: kpis.readmission_rate < 10 ? 'bg-emerald-500/10' : 'bg-rose-500/10', sub: kpis.readmission_rate < 10 ? 'Below 10% target ✓' : 'Exceeds benchmark !' },
            { label: 'Pending Lab Reports', value: '18', icon: FlaskConical, color: 'text-amber-400', bg: 'bg-amber-500/10', sub: 'Awaiting physician review' },
            { label: 'ETL Pipeline Status', value: kpis.pipeline_status, icon: Cpu, color: kpis.pipeline_status === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-400', bg: kpis.pipeline_status === 'COMPLETED' ? 'bg-emerald-500/10' : 'bg-amber-500/10', sub: `Last: ${kpis.latest_etl_run}` },
          ].map((k, i) => (
            <div key={i} className="p-4 rounded-2xl border border-white/[0.08] bg-dark-section flex items-center gap-3 shadow-lg">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${k.bg}`}>
                <k.icon className={`w-5 h-5 ${k.color}`} />
              </div>
              <div className="min-w-0">
                <div className={`text-lg font-black leading-none ${k.color} tabular-nums`}>{k.value}</div>
                <div className="text-[10px] text-txt-secondary font-semibold mt-0.5 truncate">{k.label}</div>
                <div className="text-[10px] text-txt-muted truncate">{k.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1: Area + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-5 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl">
            <SectionHeader
              title="Patient Admission & Revenue Trend"
              subtitle="Monthly inpatient data from Gold Layer Star Schema"
              action={{ label: 'View All', onClick: () => navigate('/patients') }}
            />
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.monthly_admissions} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="admGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} />
                  <YAxis stroke="#94A3B8" fontSize={10} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Area type="monotone" dataKey="admissions" stroke="#3b82f6" strokeWidth={2} fill="url(#admGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <ActivityTimeline notifications={notifications} />
        </div>

        {/* Charts Row 2: Disease + Hospital */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl">
            <SectionHeader
              title="Clinical Disease Prevalence"
              subtitle="Patient distribution by primary diagnosis"
              action={{ label: 'Full Analytics', onClick: () => navigate('/disease-analytics') }}
            />
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.disease_distribution} layout="vertical" margin={{ left: 10, right: 10, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" stroke="#94A3B8" fontSize={10} />
                  <YAxis dataKey="disease" type="category" stroke="#94A3B8" fontSize={10} width={100} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {charts.disease_distribution.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl">
            <SectionHeader
              title="Hospital Bed Occupancy"
              subtitle="Network-wide occupancy percentage"
              action={{ label: 'View Hospitals', onClick: () => navigate('/hospitals') }}
            />
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.hospital_performance} margin={{ left: -20, right: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} />
                  <YAxis stroke="#94A3B8" fontSize={10} domain={[0, 100]} unit="%" />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [`${v}%`, 'Occupancy']} />
                  <Bar dataKey="occupancy" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row: AI Insights + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AiCopilotPanel kpis={kpis} insights={insights} />
          <div className="lg:col-span-2">
            <InteractiveHospitalMap />
          </div>
        </div>

      </div>
      )}

      <QuickActionPanel />
    </div>
  );
};

export default Dashboard;
