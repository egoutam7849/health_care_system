import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Stethoscope, User, BarChart3, Database, ArrowRight, Activity,
  Sparkles, Server, Lock, Layers, ChevronDown, Play, ExternalLink, Check,
  Brain, TrendingUp, Heart, Zap, Globe, Clock, Users, Building2,
  FileText, TestTube, Pill, CreditCard, Bell, Settings, LineChart,
  Shield, Eye, X, Menu, ArrowUpRight, Cpu, Network, Box,
  FlaskConical, DollarSign, CalendarCheck, AlertTriangle, CheckCircle2
} from 'lucide-react';

// ─── Animated Counter Hook ────────────────────────────────────────────────────
function useAnimatedCounter(target, duration = 2000, startOnVisible = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnVisible) { setStarted(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

// ─── Stat Counter Card ────────────────────────────────────────────────────────
function StatCard({ value, label, suffix = '', prefix = '', color = 'text-blue-400', delay = 0 }) {
  const numericTarget = parseFloat(value.toString().replace(/[^0-9.]/g, ''));
  const { count, ref } = useAnimatedCounter(numericTarget, 2000 + delay);
  const display = prefix + (Number.isInteger(numericTarget) ? count.toLocaleString() : count.toFixed(1)) + suffix;

  return (
    <div ref={ref} className="text-center group">
      <div className={`text-3xl md:text-4xl font-black ${color} tabular-nums`}>{display}</div>
      <div className="text-xs text-slate-400 font-semibold mt-1 tracking-wide">{label}</div>
    </div>
  );
}

// ─── Section Badge ────────────────────────────────────────────────────────────
function SectionBadge({ children }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-bold tracking-widest uppercase">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
      {children}
    </div>
  );
}

// ─── Feature Capability Card ──────────────────────────────────────────────────
function CapabilityCard({ icon: Icon, title, description, accent = 'blue' }) {
  const accents = {
    blue: 'group-hover:border-blue-500/60 group-hover:shadow-blue-500/10',
    teal: 'group-hover:border-teal-500/60 group-hover:shadow-teal-500/10',
    emerald: 'group-hover:border-emerald-500/60 group-hover:shadow-emerald-500/10',
    purple: 'group-hover:border-purple-500/60 group-hover:shadow-purple-500/10',
    amber: 'group-hover:border-amber-500/60 group-hover:shadow-amber-500/10',
    rose: 'group-hover:border-rose-500/60 group-hover:shadow-rose-500/10',
  };
  const iconColors = {
    blue: 'text-blue-400 bg-blue-500/10',
    teal: 'text-teal-400 bg-teal-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    rose: 'text-rose-400 bg-rose-500/10',
  };
  return (
    <div className={`group p-5 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl cursor-default ${accents[accent]}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${iconColors[accent]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-bold text-sm text-white mb-1.5">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

// ─── Interactive Hero Dashboard Widget ───────────────────────────────────────
function HeroDashboardWidget() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 2000);
    return () => clearInterval(t);
  }, []);

  const activities = [
    { icon: '🔵', text: 'ETL pipeline completed — 12,430 records processed', time: 'now' },
    { icon: '🟢', text: 'New patient PAT-2847 admitted at Metro General', time: '2m' },
    { icon: '🟡', text: 'Lab report LAB-9821 ready for Dr. Sharma review', time: '5m' },
    { icon: '🔵', text: 'PySpark Silver layer deduplication — 0 duplicates', time: '8m' },
    { icon: '🟢', text: 'Appointment scheduled — Dr. Elena Rostova / Bob', time: '11m' },
    { icon: '🔴', text: 'Anomaly detected — Bed occupancy threshold at 94%', time: '14m' },
  ];

  const kpis = [
    { label: 'Total Patients', value: '10,247', delta: '+2.4%', color: 'text-blue-400' },
    { label: 'Today Revenue', value: '$84,310', delta: '+5.1%', color: 'text-emerald-400' },
    { label: 'Active Beds', value: '486 / 520', delta: '93.5%', color: 'text-amber-400' },
    { label: 'AI Accuracy', value: '99.8%', delta: '+0.2%', color: 'text-purple-400' },
  ];

  return (
    <div className="relative w-full h-full rounded-2xl border border-slate-700/60 bg-slate-900/90 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/50">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/60 bg-slate-800/60">
        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        <span className="ml-3 text-xs text-slate-400 font-mono">HealthFlow AI — Admin Command Center</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400 font-bold">LIVE</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-2 p-3">
        {kpis.map((k, i) => (
          <div key={i} className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/40">
            <div className="text-[10px] text-slate-400 font-semibold">{k.label}</div>
            <div className={`text-base font-black ${k.color} tabular-nums`}>{k.value}</div>
            <div className="text-[9px] text-emerald-400 font-bold">{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Sparkline visualization */}
      <div className="px-3 pb-2">
        <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-300 font-bold">Patient Admission Trend (7d)</span>
            <span className="text-[9px] text-blue-400 font-bold">LIVE</span>
          </div>
          <svg viewBox="0 0 200 40" className="w-full h-8">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,32 L28,25 L56,18 L84,22 L112,10 L140,14 L168,8 L200,4" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
            <path d="M0,32 L28,25 L56,18 L84,22 L112,10 L140,14 L168,8 L200,4 L200,40 L0,40 Z" fill="url(#lineGrad)" />
          </svg>
        </div>
      </div>

      {/* Activity feed */}
      <div className="px-3 pb-3 space-y-1 overflow-hidden">
        {activities.slice(tick % 2, (tick % 2) + 3).map((a, i) => (
          <div key={i} className={`flex items-start gap-2 px-2 py-1.5 rounded-lg text-[10px] transition-all duration-500 ${i === 0 ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-slate-800/40'}`}>
            <span className="mt-0.5 text-xs">{a.icon}</span>
            <span className="text-slate-300 flex-1 leading-relaxed">{a.text}</span>
            <span className="text-slate-500 shrink-0 ml-1">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Pipeline Visual ──────────────────────────────────────────────────────────
function PipelineSection() {
  const steps = [
    {
      id: 'source', label: 'Hospital EHR', sublabel: 'Source Systems',
      icon: '🏥', color: 'border-slate-600 bg-slate-800/80',
      badge: 'RAW', badgeColor: 'bg-slate-700 text-slate-300',
      desc: 'Raw hospital files, HL7, FHIR, CSV exports from EHR systems ingested via automated drops.',
    },
    {
      id: 'bronze', label: 'Bronze Layer', sublabel: 'Immutable Raw Storage',
      icon: '🥉', color: 'border-amber-700/60 bg-amber-950/30',
      badge: 'PARQUET', badgeColor: 'bg-amber-900/60 text-amber-300',
      desc: 'All raw data stored as immutable Parquet files. Zero transformation. Full audit trail.',
    },
    {
      id: 'silver', label: 'Silver Layer', sublabel: 'PySpark Processing',
      icon: '⚡', color: 'border-blue-700/60 bg-blue-950/30',
      badge: 'SPARK', badgeColor: 'bg-blue-900/60 text-blue-300',
      desc: 'PySpark deduplication, median imputation, ISO-8601 casting, and invalid record quarantine.',
    },
    {
      id: 'gold', label: 'Gold Layer', sublabel: 'Star Schema Warehouse',
      icon: '🥇', color: 'border-emerald-700/60 bg-emerald-950/30',
      badge: 'WAREHOUSE', badgeColor: 'bg-emerald-900/60 text-emerald-300',
      desc: 'Aggregated business Parquet models populating Star Schema Fact and Dimension tables.',
    },
    {
      id: 'ai', label: 'AI & Analytics', sublabel: 'Intelligence & Insights',
      icon: '🤖', color: 'border-purple-700/60 bg-purple-950/30',
      badge: 'ML ENGINE', badgeColor: 'bg-purple-900/60 text-purple-300',
      desc: 'Clinical AI predictions, Power BI dashboards, and executive reporting layer.',
    },
  ];

  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % steps.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="pipeline" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <SectionBadge>Healthcare Data Pipeline</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-black text-white">Bronze → Silver → Gold</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            End-to-end Medallion Architecture transforming raw hospital EHR data into production-grade analytical intelligence through automated Airflow-orchestrated PySpark pipelines.
          </p>
        </div>

        {/* Horizontal pipeline steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-700 via-blue-500/50 to-purple-500/50 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
            {steps.map((s, i) => (
              <button key={s.id} onClick={() => setActive(i)}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 cursor-pointer ${s.color} ${active === i ? 'scale-105 shadow-lg shadow-black/30' : 'opacity-60 hover:opacity-80'}`}>
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-block mb-2 ${s.badgeColor}`}>{s.badge}</div>
                <div className="font-bold text-sm text-white">{s.label}</div>
                <div className="text-[10px] text-slate-400">{s.sublabel}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail box */}
        <div className="p-6 rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-sm transition-all duration-500">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{steps[active].icon}</span>
            <div>
              <div className="font-black text-xl text-white">{steps[active].label}</div>
              <div className="text-sm text-slate-400 mt-1">{steps[active].desc}</div>
            </div>
            <div className="ml-auto">
              <span className={`text-xs font-black px-3 py-1.5 rounded-full ${steps[active].badgeColor}`}>{steps[active].badge}</span>
            </div>
          </div>

          {/* Mini pipeline indicators */}
          <div className="flex gap-2 mt-4">
            {steps.map((_, i) => (
              <div key={i} onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === active ? 'bg-blue-400 flex-1' : 'bg-slate-700 w-6 hover:bg-slate-500'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Architecture Explorer ────────────────────────────────────────────────────
function ArchitectureSection() {
  const [selectedNode, setSelectedNode] = useState(null);
  const nodes = [
    { id: 'frontend', label: 'React Frontend', sub: 'Vite + Tailwind', icon: Globe, color: 'bg-blue-500/20 border-blue-500/40 text-blue-300', detail: 'Modern React SPA with Vite, Tailwind CSS, Recharts, and role-based dynamic route guards.' },
    { id: 'api', label: 'FastAPI Backend', sub: 'Python + JWT', icon: Server, color: 'bg-teal-500/20 border-teal-500/40 text-teal-300', detail: 'FastAPI REST layer with JWT authentication, RBAC middleware, SQLAlchemy ORM, and Pydantic validation schemas.' },
    { id: 'postgres', label: 'PostgreSQL', sub: 'Primary Database', icon: Database, color: 'bg-amber-500/20 border-amber-500/40 text-amber-300', detail: 'Normalized PostgreSQL schema with 20+ tables: patients, doctors, hospitals, appointments, prescriptions, lab_reports, and billing.' },
    { id: 'spark', label: 'Apache Spark', sub: 'PySpark Engine', icon: Zap, color: 'bg-orange-500/20 border-orange-500/40 text-orange-300', detail: 'PySpark distributed processing for Bronze → Silver → Gold Medallion transformations at scale.' },
    { id: 'airflow', label: 'Apache Airflow', sub: 'DAG Orchestration', icon: Network, color: 'bg-green-500/20 border-green-500/40 text-green-300', detail: 'Airflow DAG orchestration scheduling ETL jobs, data quality checks, anomaly detection, and alert pipelines.' },
    { id: 'warehouse', label: 'Data Warehouse', sub: 'Star Schema', icon: Layers, color: 'bg-purple-500/20 border-purple-500/40 text-purple-300', detail: 'Star Schema dimensional model with FactAdmissions, FactRevenue, DimPatient, DimDoctor, DimHospital, and DimDate.' },
    { id: 'ai', label: 'AI Engine', sub: 'Clinical Intelligence', icon: Brain, color: 'bg-rose-500/20 border-rose-500/40 text-rose-300', detail: 'ML models for disease prediction, patient risk scoring, readmission probability, revenue forecasting, and hospital load prediction.' },
    { id: 'powerbi', label: 'Analytics Layer', sub: 'BI & Reporting', icon: BarChart3, color: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300', detail: 'Embedded analytics dashboards with interactive disease distribution, revenue trends, department performance, and AI insight summaries.' },
  ];

  const connections = ['Frontend → FastAPI', 'FastAPI → PostgreSQL', 'PostgreSQL → Spark', 'Spark → Airflow', 'Spark → Warehouse', 'Warehouse → AI Engine', 'Warehouse → Analytics'];

  return (
    <section id="architecture" className="py-24 px-6 relative border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <SectionBadge>System Architecture</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-black text-white">Enterprise System Architecture</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">Click any component to explore its role in the data engineering pipeline.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {nodes.map((n) => (
            <button key={n.id} onClick={() => setSelectedNode(selectedNode?.id === n.id ? null : n)}
              className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 ${n.color} ${selectedNode?.id === n.id ? 'scale-105 shadow-lg shadow-black/30' : 'hover:scale-102 opacity-80 hover:opacity-100'}`}>
              <n.icon className="w-6 h-6 mb-3 opacity-80" />
              <div className="font-bold text-sm">{n.label}</div>
              <div className="text-[10px] opacity-60 mt-0.5">{n.sub}</div>
            </button>
          ))}
        </div>

        {selectedNode && (
          <div className="p-6 rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-sm animate-pulse-once">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-black text-lg text-white">{selectedNode.label}</div>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">{selectedNode.detail}</p>
              </div>
              <button onClick={() => setSelectedNode(null)} className="text-slate-500 hover:text-slate-300 transition-colors"><X className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-center">
          {connections.map((c, i) => (
            <div key={i} className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40 text-[11px] text-slate-400 font-mono">
              {c}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Analytics Showcase ───────────────────────────────────────────────────────
function AnalyticsSection() {
  const [activeTab, setActiveTab] = useState('demographics');

  const tabs = [
    { id: 'demographics', label: 'Demographics' },
    { id: 'disease', label: 'Disease Trends' },
    { id: 'revenue', label: 'Revenue' },
    { id: 'hospital', label: 'Hospital Performance' },
  ];

  const barData = {
    demographics: {
      title: 'Patient Age Distribution', color: '#3b82f6',
      bars: [
        { label: '0-18', pct: 12 }, { label: '19-35', pct: 24 }, { label: '36-50', pct: 35 },
        { label: '51-65', pct: 42 }, { label: '65+', pct: 58 },
      ]
    },
    disease: {
      title: 'Disease Frequency (Top 5)', color: '#10b981',
      bars: [
        { label: 'Hypertension', pct: 72 }, { label: 'Diabetes', pct: 65 }, { label: 'Cardiac', pct: 48 },
        { label: 'Respiratory', pct: 37 }, { label: 'Neurological', pct: 28 },
      ]
    },
    revenue: {
      title: 'Monthly Revenue ($ Million)', color: '#f59e0b',
      bars: [
        { label: 'Jan', pct: 55 }, { label: 'Mar', pct: 68 }, { label: 'May', pct: 74 },
        { label: 'Jul', pct: 82 }, { label: 'Sep', pct: 91 },
      ]
    },
    hospital: {
      title: 'Hospital Bed Occupancy %', color: '#a855f7',
      bars: [
        { label: 'Metro Gen', pct: 94 }, { label: 'City Med', pct: 78 }, { label: 'Sunrise', pct: 66 },
        { label: 'Westside', pct: 85 }, { label: 'Central', pct: 72 },
      ]
    },
  };

  const active = barData[activeTab];

  return (
    <section id="analytics" className="py-24 px-6 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <SectionBadge>Analytics Showcase</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-black text-white">Healthcare Business Intelligence</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">Interactive analytics dashboards serving operational intelligence across all healthcare dimensions.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KPI summary side */}
          <div className="space-y-4">
            {[
              { label: 'Total Patients', value: '10,247', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Network Revenue', value: '$128.5M', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'Avg Bed Occupancy', value: '79%', icon: Building2, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'Readmission Rate', value: '6.2%', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
              { label: 'Appointments', value: '44,021', icon: CalendarCheck, color: 'text-teal-400', bg: 'bg-teal-500/10' },
            ].map((kpi, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-slate-700/50 bg-slate-900/60 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${kpi.bg}`}>
                  <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <div>
                  <div className={`text-base font-black ${kpi.color} tabular-nums`}>{kpi.value}</div>
                  <div className="text-[10px] text-slate-400 font-semibold">{kpi.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Main chart area */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-700/60 bg-slate-900/60 space-y-5">
            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${activeTab === t.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="font-bold text-sm text-slate-300">{active.title}</div>

            {/* Bar chart visualization */}
            <div className="space-y-3">
              {active.bars.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-20 shrink-0 text-right">{b.label}</span>
                  <div className="flex-1 h-5 bg-slate-800/60 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${b.pct}%`, backgroundColor: active.color, opacity: 0.85 }}
                    />
                  </div>
                  <span className="text-xs font-bold tabular-nums" style={{ color: active.color }}>{b.pct}%</span>
                </div>
              ))}
            </div>

            {/* Sparkline bottom mini */}
            <div className="pt-2 border-t border-slate-700/40">
              <div className="text-[10px] text-slate-500 mb-2">7-day trend</div>
              <svg viewBox="0 0 300 30" className="w-full h-8">
                <path d="M0,25 L50,20 L100,15 L150,18 L200,8 L250,5 L300,3" fill="none" stroke={active.color} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                {[0, 50, 100, 150, 200, 250, 300].map((x, i) => {
                  const ys = [25, 20, 15, 18, 8, 5, 3];
                  return <circle key={i} cx={x} cy={ys[i]} r="3" fill={active.color} opacity="0.9" />;
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── AI Intelligence Section ─────────────────────────────────────────────────
function AISection() {
  const aiCards = [
    { icon: '🧬', title: 'Disease Prediction', desc: 'ML classification predicts likelihood of chronic diseases based on patient vitals, demographics, and history.', accuracy: '97.3%', model: 'XGBoost Classifier' },
    { icon: '⚠️', title: 'Patient Risk Score', desc: 'Real-time risk stratification scoring identifies high-risk patients for priority clinical intervention.', accuracy: '95.8%', model: 'Random Forest' },
    { icon: '🏥', title: 'Hospital Load Forecast', desc: 'Time-series LSTM model predicts bed demand, ICU requirements, and staffing needs 14 days ahead.', accuracy: '92.1%', model: 'LSTM Neural Net' },
    { icon: '🔄', title: 'Readmission Prediction', desc: 'Predicts 30-day readmission risk at discharge enabling targeted post-care intervention plans.', accuracy: '88.9%', model: 'Logistic Regression' },
    { icon: '📈', title: 'Revenue Forecasting', desc: 'Ensemble model forecasts departmental revenue, billing cycles, and insurance claim approvals monthly.', accuracy: '94.5%', model: 'Gradient Boosting' },
    { icon: '🩺', title: 'Clinical Decision Support', desc: 'Evidence-based drug interaction checks, dosage recommendations, and differential diagnosis assistance.', accuracy: '99.1%', model: 'Rule + ML Hybrid' },
  ];

  return (
    <section id="ai" className="py-24 px-6 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <SectionBadge>AI Intelligence Engine</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-black text-white">Clinical AI Intelligence</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">Production-grade machine learning models powering clinical decision support, patient risk stratification, and operational forecasting.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {aiCards.map((c, i) => (
            <div key={i} className="p-5 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-3xl">{c.icon}</span>
                <div className="text-right">
                  <div className="text-emerald-400 font-black text-sm">{c.accuracy}</div>
                  <div className="text-[10px] text-slate-500">accuracy</div>
                </div>
              </div>
              <h3 className="font-bold text-white">{c.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
              <div className="flex items-center gap-2">
                <Cpu className="w-3 h-3 text-purple-400" />
                <span className="text-[10px] text-purple-400 font-bold font-mono">{c.model}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Role Portals Section ─────────────────────────────────────────────────────
function RolesSection({ navigate }) {
  const [activeRole, setActiveRole] = useState(null);

  const roles = [
    {
      id: 'admin', icon: ShieldCheck, label: 'Admin & Data Engineer', color: 'border-blue-500/60 hover:shadow-blue-500/20',
      iconColor: 'text-blue-400 bg-blue-500/10', loginPath: '/admin/login',
      capabilities: ['Full Medallion ETL Pipeline Control', 'Hospital & Department Management', 'User Provisioning & Role Assignment', 'System Audit Logs & Monitoring', 'Revenue & Financial Analytics', 'Reports & Export Management'],
      badge: 'ADMINISTRATOR',
    },
    {
      id: 'doctor', icon: Stethoscope, label: 'Doctor Portal', color: 'border-teal-500/60 hover:shadow-teal-500/20',
      iconColor: 'text-teal-400 bg-teal-500/10', loginPath: '/doctor/login',
      capabilities: ['Assigned Patient Roster (JWT-Isolated)', 'Clinical Appointment Scheduling', 'Diagnosis & Prescription Management', 'Lab Test Orders & Results', 'Patient Medical History Access', 'Secure Messaging & Notifications'],
      badge: 'DOCTOR',
    },
    {
      id: 'physician', icon: Heart, label: 'Physician Portal', color: 'border-rose-500/60 hover:shadow-rose-500/20',
      iconColor: 'text-rose-400 bg-rose-500/10', loginPath: '/doctor/login',
      capabilities: ['Consultation Queue Management', 'Clinical Notes & SOAP Documentation', 'Patient Referral System', 'Follow-up Scheduling', 'Treatment Plan Builder', 'Inter-department Coordination'],
      badge: 'PHYSICIAN',
    },
    {
      id: 'patient', icon: User, label: 'Patient Portal', color: 'border-purple-500/60 hover:shadow-purple-500/20',
      iconColor: 'text-purple-400 bg-purple-500/10', loginPath: '/patient/login',
      capabilities: ['Personal Medical History & Records', 'Upcoming Appointment Visibility', 'Active Prescriptions & Lab Reports', 'Billing Statements & Insurance', 'Health Metrics Trend (BMI, BP, Sugar)', 'Secure Doctor Messaging'],
      badge: 'PATIENT',
    },
    {
      id: 'analyst', icon: BarChart3, label: 'Healthcare Analyst Portal', color: 'border-amber-500/60 hover:shadow-amber-500/20',
      iconColor: 'text-amber-400 bg-amber-500/10', loginPath: '/analyst/login',
      capabilities: ['Gold Layer Data Warehouse Queries', 'Disease & Population Analytics', 'Revenue & Financial Intelligence', 'Hospital & Department Performance', 'Predictive Analytics & Forecasting', 'Export Reports & BI Dashboards'],
      badge: 'ANALYST',
    },
  ];

  const active = roles.find(r => r.id === activeRole);

  return (
    <section id="portals" className="py-24 px-6 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <SectionBadge>Role-Based Access Control</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-black text-white">Tailored Portals for Every Role</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">JWT-encoded identity ensures strict data isolation. Each portal surfaces only the data relevant to that user's clinical or administrative function.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {roles.map(r => (
            <button key={r.id} onClick={() => setActiveRole(activeRole === r.id ? null : r.id)}
              className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 bg-slate-900/60 backdrop-blur-sm hover:shadow-xl ${r.color} ${activeRole === r.id ? 'scale-105' : 'border-slate-700/50 opacity-80 hover:opacity-100'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${r.iconColor}`}>
                <r.icon className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-black text-slate-500 tracking-widest mb-1">{r.badge}</div>
              <div className="font-bold text-sm text-white">{r.label}</div>
            </button>
          ))}
        </div>

        {active && (
          <div className="p-6 rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active.iconColor}`}>
                    <active.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-black text-white">{active.label}</div>
                    <div className="text-[10px] text-slate-400">{active.capabilities.length} capabilities included</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {active.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      {cap}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => navigate(active.loginPath)}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold rounded-xl hover:opacity-90 flex items-center gap-2 transition-opacity whitespace-nowrap">
                  Sign In <ArrowRight className="w-3 h-3" />
                </button>
                <button onClick={() => setActiveRole(null)} className="px-4 py-2.5 bg-slate-800 text-slate-400 text-xs font-bold rounded-xl hover:bg-slate-700 flex items-center gap-2 justify-center">
                  <X className="w-3 h-3" /> Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Tech Stack Section ───────────────────────────────────────────────────────
function TechStackSection() {
  const techs = [
    { name: 'React 18', sub: 'Frontend UI', color: 'text-blue-400', emoji: '⚛️' },
    { name: 'FastAPI', sub: 'REST Backend', color: 'text-teal-400', emoji: '🚀' },
    { name: 'PostgreSQL', sub: 'Primary DB', color: 'text-sky-400', emoji: '🐘' },
    { name: 'Apache Spark', sub: 'ETL Engine', color: 'text-orange-400', emoji: '⚡' },
    { name: 'Apache Airflow', sub: 'Orchestration', color: 'text-emerald-400', emoji: '🌊' },
    { name: 'Docker', sub: 'Container', color: 'text-blue-300', emoji: '🐳' },
    { name: 'Redis', sub: 'Cache Layer', color: 'text-rose-400', emoji: '🔴' },
    { name: 'JWT Auth', sub: 'Security', color: 'text-purple-400', emoji: '🔐' },
    { name: 'AWS Cloud', sub: 'Deployment', color: 'text-amber-400', emoji: '☁️' },
    { name: 'Power BI', sub: 'Dashboards', color: 'text-yellow-400', emoji: '📊' },
    { name: 'Tailwind CSS', sub: 'Styling', color: 'text-cyan-400', emoji: '🎨' },
    { name: 'Python 3.12', sub: 'ML Engine', color: 'text-green-400', emoji: '🐍' },
  ];

  return (
    <section id="stack" className="py-24 px-6 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <SectionBadge>Enterprise Technology Stack</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-black text-white">Built With Production-Grade Technology</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {techs.map((t, i) => (
            <div key={i} className="p-4 rounded-2xl border border-slate-700/50 bg-slate-900/60 text-center hover:border-slate-600 hover:scale-105 transition-all duration-300 cursor-default">
              <div className="text-2xl mb-2">{t.emoji}</div>
              <div className={`font-bold text-xs ${t.color}`}>{t.name}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{t.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Security Section ─────────────────────────────────────────────────────────
function SecuritySection() {
  const items = [
    { icon: Lock, title: 'JWT Authentication', desc: 'Stateless JSON Web Tokens with role, user_id, doctor_id, and patient_id claims for zero-trust identity validation.', color: 'text-blue-400 bg-blue-500/10' },
    { icon: ShieldCheck, title: 'Role-Based Access Control', desc: 'Admin, Doctor, Physician, Patient, and Analyst portals enforce strict data isolation at the API middleware layer.', color: 'text-emerald-400 bg-emerald-500/10' },
    { icon: Eye, title: 'Password Hashing', desc: 'bcrypt SHA-256 password hashing ensures plaintext credentials never persist in the database.', color: 'text-purple-400 bg-purple-500/10' },
    { icon: FileText, title: 'Audit Logs', desc: 'Immutable PostgreSQL audit trail records every admin action, data modification, and login event with timestamps.', color: 'text-amber-400 bg-amber-500/10' },
    { icon: Database, title: 'Data Encryption', desc: 'End-to-end TLS encryption for all API traffic. Sensitive fields encrypted at the application layer.', color: 'text-rose-400 bg-rose-500/10' },
    { icon: AlertTriangle, title: 'HIPAA-Inspired Design', desc: 'Designed following HIPAA-inspired security principles: access control, audit controls, integrity, and transmission security.', color: 'text-teal-400 bg-teal-500/10' },
  ];

  return (
    <section id="security" className="py-24 px-6 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <SectionBadge>Security & Governance</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-black text-white">Enterprise-Grade Security</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">Built on production security principles ensuring healthcare data remains protected, isolated, and auditable at every layer.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <div key={i} className="p-5 rounded-2xl border border-slate-700/50 bg-slate-900/60 hover:border-slate-600 transition-all duration-300 space-y-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Capabilities', id: 'capabilities' },
    { label: 'Data Pipeline', id: 'pipeline' },
    { label: 'Architecture', id: 'architecture' },
    { label: 'Analytics', id: 'analytics' },
    { label: 'AI Engine', id: 'ai' },
    { label: 'Portals', id: 'portals' },
    { label: 'Security', id: 'security' },
  ];

  const capabilities = [
    { icon: Building2, title: 'Hospital Management', desc: 'Manage hospitals, departments, wards, beds, and operational parameters across your healthcare network.', accent: 'blue' },
    { icon: Users, title: 'Patient Management', desc: 'Full patient lifecycle management: admission, discharge, medical history, billing, and insurance.', accent: 'teal' },
    { icon: Stethoscope, title: 'Doctor & Physician Console', desc: 'Clinical workflow management with patient rosters, appointment scheduling, and prescription tools.', accent: 'emerald' },
    { icon: CalendarCheck, title: 'Appointment Engine', desc: 'Smart appointment scheduling with time-slot conflict detection and automated patient notifications.', accent: 'purple' },
    { icon: FileText, title: 'Medical Records', desc: 'Structured EHR with diagnosis history, clinical notes, treatment plans, and discharge summaries.', accent: 'amber' },
    { icon: FlaskConical, title: 'Laboratory System', desc: 'Lab test order management, result tracking, and automated critical value alerts to clinicians.', accent: 'rose' },
    { icon: Pill, title: 'Pharmacy & Inventory', desc: 'Medication dispensing, stock management, expiry tracking, and controlled substance monitoring.', accent: 'teal' },
    { icon: CreditCard, title: 'Billing & Insurance', desc: 'Invoice generation, insurance claim processing, payment tracking, and financial reconciliation.', accent: 'emerald' },
    { icon: Layers, title: 'Data Warehouse', desc: 'Star Schema warehouse with Fact and Dimension tables serving enterprise BI and reporting needs.', accent: 'blue' },
    { icon: BarChart3, title: 'Analytics Engine', desc: 'Multi-dimensional analytics across patient demographics, disease trends, revenue, and operational KPIs.', accent: 'purple' },
    { icon: Brain, title: 'AI Insights', desc: 'Embedded ML models providing disease prediction, risk scoring, and readmission probability in real time.', accent: 'rose' },
    { icon: Bell, title: 'Notification Center', desc: 'Real-time event-driven alerts for appointments, lab results, prescriptions, and emergency incidents.', accent: 'amber' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500 selection:text-white overflow-x-hidden">

      {/* ── Ambient Background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-60 -left-60 w-[700px] h-[700px] bg-blue-600/8 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 -right-60 w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-teal-600/6 rounded-full blur-[110px]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,1) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,1) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* ── Sticky Navigation ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/60 shadow-2xl shadow-black/40' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center font-black text-base shadow-lg shadow-blue-500/30">H</div>
            <div>
              <div className="font-black text-lg leading-none bg-gradient-to-r from-blue-400 via-teal-300 to-teal-400 bg-clip-text text-transparent">HealthFlow AI</div>
              <div className="text-[9px] text-slate-500 tracking-widest uppercase font-bold mt-0.5">Enterprise Healthcare Data Platform</div>
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">{l.label}</button>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/portals')} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-700 transition-colors">
              Sign In
            </button>
            <button onClick={() => navigate('/admin/login')} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white text-xs font-bold rounded-xl hover:opacity-90 shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-opacity">
              Launch Platform <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 text-slate-400 hover:text-white">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-6 py-4 space-y-3">
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} className="block w-full text-left text-sm font-semibold text-slate-400 hover:text-white py-2 transition-colors">{l.label}</button>
            ))}
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-800">
              <button onClick={() => navigate('/portals')} className="px-4 py-2.5 bg-slate-800 text-slate-300 text-sm font-bold rounded-xl">Sign In</button>
              <button onClick={() => navigate('/admin/login')} className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 text-white text-sm font-bold rounded-xl">Launch Platform</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Production-Grade Healthcare Data Engineering Platform
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                Enterprise{' '}
                <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  AI Healthcare
                </span>
                {' '}Data Platform
              </h1>

              <p className="text-slate-400 text-base leading-relaxed max-w-lg">
                Automate hospital data ingestion, transform raw EHR files through
                <span className="text-blue-300 font-bold"> Bronze → Silver → Gold</span> Medallion pipelines,
                and power clinical AI intelligence with a fully integrated, role-isolated enterprise platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigate('/admin/login')}
                  className="px-7 py-3.5 bg-gradient-to-r from-blue-600 to-teal-600 font-extrabold text-sm rounded-2xl shadow-2xl shadow-blue-500/30 hover:opacity-95 flex items-center justify-center gap-2.5 transition-opacity">
                  <Play className="w-4 h-4" />
                  Launch Platform
                </button>
                <button onClick={() => scrollTo('architecture')}
                  className="px-7 py-3.5 bg-slate-800/80 border border-slate-700 text-slate-300 font-bold text-sm rounded-2xl hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors">
                  View Architecture
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-4 pt-2">
                {[
                  { icon: Check, text: 'JWT-Isolated Role Portals' },
                  { icon: Check, text: 'Live PostgreSQL Data' },
                  { icon: Check, text: 'Medallion Architecture' },
                  { icon: Check, text: 'HIPAA-Inspired Security' },
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <t.icon className="w-3.5 h-3.5 text-emerald-400" />
                    {t.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: animated dashboard widget */}
            <div className="relative h-[420px] lg:h-[480px]">
              <HeroDashboardWidget />
              {/* Floating accent badges */}
              <div className="absolute -top-4 -right-4 px-3 py-1.5 rounded-xl bg-emerald-500/90 text-emerald-950 text-[10px] font-black shadow-lg shadow-emerald-500/30 backdrop-blur-sm">
                ✓ 99.8% Data Quality
              </div>
              <div className="absolute -bottom-4 -left-4 px-3 py-1.5 rounded-xl bg-blue-500/90 text-blue-950 text-[10px] font-black shadow-lg shadow-blue-500/30 backdrop-blur-sm">
                ⚡ PySpark ETL Active
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Live Platform Statistics ── */}
      <section className="relative z-10 py-16 px-6 border-t border-b border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center justify-items-center">
            <StatCard value={8} label="Hospitals" suffix="+" color="text-blue-400" />
            <StatCard value={386} label="Doctors" suffix="+" color="text-teal-400" delay={200} />
            <StatCard value={10247} label="Patients" color="text-purple-400" delay={400} />
            <StatCard value={44021} label="Appointments" color="text-amber-400" delay={600} />
            <StatCard value={25830} label="Lab Reports" color="text-rose-400" delay={800} />
            <StatCard value={128.5} label="Revenue ($M)" prefix="$" suffix="M" color="text-emerald-400" delay={1000} />
            <StatCard value={99.8} label="AI Accuracy" suffix="%" color="text-indigo-400" delay={1200} />
          </div>
        </div>
      </section>

      {/* ── Platform Capabilities ── */}
      <section id="capabilities" className="relative z-10 py-24 px-6 border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <SectionBadge>Platform Capabilities</SectionBadge>
            <h2 className="text-3xl md:text-5xl font-black text-white">Everything Healthcare Needs</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              A unified platform spanning clinical operations, data engineering, and AI-powered insights.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {capabilities.map((c, i) => <CapabilityCard key={i} {...c} />)}
          </div>
        </div>
      </section>

      {/* ── Pipeline ── */}
      <div className="relative z-10"><PipelineSection /></div>

      {/* ── Architecture ── */}
      <div className="relative z-10"><ArchitectureSection /></div>

      {/* ── Analytics Showcase ── */}
      <div className="relative z-10"><AnalyticsSection /></div>

      {/* ── AI Intelligence ── */}
      <div className="relative z-10"><AISection /></div>

      {/* ── Role Portals ── */}
      <div className="relative z-10"><RolesSection navigate={navigate} /></div>

      {/* ── Tech Stack ── */}
      <div className="relative z-10"><TechStackSection /></div>

      {/* ── Security ── */}
      <div className="relative z-10"><SecuritySection /></div>

      {/* ── CTA Banner ── */}
      <section className="relative z-10 py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center space-y-7">
          <SectionBadge>Get Started Today</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-black text-white">Ready to Explore HealthFlow AI?</h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            Choose your portal and experience fully live, database-driven healthcare data management — no hardcoded demo data, no static mocks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/admin/login')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 font-extrabold text-sm rounded-2xl shadow-2xl shadow-blue-500/30 hover:opacity-95 flex items-center gap-2.5 transition-opacity">
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </button>
            <button onClick={() => navigate('/doctor/login')}
              className="px-8 py-4 bg-slate-800 border border-slate-700 text-slate-300 font-bold text-sm rounded-2xl hover:bg-slate-700 flex items-center gap-2 transition-colors">
              <Stethoscope className="w-4 h-4" />
              Doctor Portal
            </button>
            <button onClick={() => navigate('/patient/login')}
              className="px-8 py-4 bg-slate-800 border border-slate-700 text-slate-300 font-bold text-sm rounded-2xl hover:bg-slate-700 flex items-center gap-2 transition-colors">
              <User className="w-4 h-4" />
              Patient Portal
            </button>
            <button onClick={() => navigate('/analyst/login')}
              className="px-8 py-4 bg-slate-800 border border-slate-700 text-slate-300 font-bold text-sm rounded-2xl hover:bg-slate-700 flex items-center gap-2 transition-colors">
              <BarChart3 className="w-4 h-4" />
              Analyst Portal
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-slate-800/60 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center font-black shadow-lg">H</div>
                <span className="font-black text-base bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">HealthFlow AI</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Enterprise Healthcare Data Engineering & Clinical Intelligence Platform. Built for production-scale capstone and enterprise deployments.</p>
              <div className="text-[10px] text-slate-600 font-mono">v2.0.0 — Production Release</div>
            </div>
            {/* Portals */}
            <div>
              <h4 className="text-xs font-black text-slate-300 mb-3 tracking-widest uppercase">Portals</h4>
              <ul className="space-y-2">
                {[['Admin Portal', '/admin/login'], ['Doctor Portal', '/doctor/login'], ['Patient Portal', '/patient/login'], ['Analyst Portal', '/analyst/login']].map(([l, p]) => (
                  <li key={p}><button onClick={() => navigate(p)} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">{l}</button></li>
                ))}
              </ul>
            </div>
            {/* Platform */}
            <div>
              <h4 className="text-xs font-black text-slate-300 mb-3 tracking-widest uppercase">Platform</h4>
              <ul className="space-y-2">
                {[['Data Pipeline', 'pipeline'], ['Architecture', 'architecture'], ['Analytics', 'analytics'], ['AI Engine', 'ai'], ['Security', 'security']].map(([l, id]) => (
                  <li key={id}><button onClick={() => scrollTo(id)} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">{l}</button></li>
                ))}
              </ul>
            </div>
            {/* Legal */}
            <div>
              <h4 className="text-xs font-black text-slate-300 mb-3 tracking-widest uppercase">Legal & Info</h4>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'Documentation', 'GitHub Repository'].map(l => (
                  <li key={l}><span className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">{l}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-slate-600">© 2026 HealthFlow AI. All rights reserved. Built as an Enterprise Healthcare Data Platform capstone project.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                All systems operational
              </span>
              <span className="text-[11px] text-slate-600 font-mono">v2.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
