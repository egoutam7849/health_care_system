import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Stethoscope, User, BarChart3, Database, ArrowRight, Activity, Sparkles, CheckCircle2, Server, Lock, Layers } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-health-500 selection:text-white relative overflow-hidden">
      {/* Background Particle Gradients */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-health-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-teal-600/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <nav className="max-w-7xl mx-auto w-full p-6 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-health-600 to-tealAccent-500 flex items-center justify-center font-black text-xl shadow-lg shadow-health-500/30">
            H
          </div>
          <div>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-health-600 via-teal-400 to-tealAccent-400 bg-clip-text text-transparent">HealthFlow AI</span>
            <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Enterprise Healthcare Data Platform</span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-xs font-bold text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#medallion" className="hover:text-white transition-colors">Medallion Architecture</a>
          <a href="#portals" className="hover:text-white transition-colors">Portals</a>
        </div>

        <button
          onClick={() => navigate('/admin/login')}
          className="px-5 py-2.5 bg-gradient-to-r from-health-600 to-tealAccent-600 text-white text-xs font-bold rounded-xl hover:opacity-95 shadow-lg shadow-health-500/20 flex items-center space-x-2"
        >
          <span>Launch Platform</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto w-full px-6 py-16 text-center space-y-8 relative z-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-health-400">
          <Sparkles className="w-4 h-4" />
          <span>Enterprise Medallion Data Engineering & Analytics Platform</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-white max-w-4xl mx-auto">
          Unified Healthcare Data Engineering & Predictive Analytics
        </h1>

        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Automate healthcare dataset ingestion from hospital EHR systems, validate data contracts, process raw files through PySpark <span className="text-health-400 font-bold">Bronze → Silver → Gold</span> layers, and populate Star Schema Data Warehouses in real time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/admin/login')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-health-600 to-tealAccent-600 font-extrabold text-sm rounded-2xl shadow-xl shadow-health-500/30 hover:opacity-95 flex items-center justify-center space-x-2"
          >
            <span>Enter Administrator Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/patient/login')}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 text-slate-300 font-bold text-sm rounded-2xl hover:bg-slate-800 flex items-center justify-center space-x-2"
          >
            <span>Patient Health Portal</span>
          </button>
        </div>

        {/* Animated Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-2xl font-black text-health-400 block">10,000+</span>
            <span className="text-[11px] text-slate-400 font-semibold">Ingested Records / Run</span>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-2xl font-black text-teal-400 block">99.8%</span>
            <span className="text-[11px] text-slate-400 font-semibold">Data Quality Score</span>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-2xl font-black text-amber-400 block">$128.5M</span>
            <span className="text-[11px] text-slate-400 font-semibold">Tracked Revenue</span>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-2xl font-black text-purple-400 block">5 Facilities</span>
            <span className="text-[11px] text-slate-400 font-semibold">Active Command GIS</span>
          </div>
        </div>
      </section>

      {/* Medallion Architecture Showcase */}
      <section id="medallion" className="max-w-6xl mx-auto w-full px-6 py-16 space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-health-400 uppercase tracking-widest">Medallion Data Pipeline</span>
          <h2 className="text-3xl font-black">Bronze → Silver → Gold Architecture</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">1</div>
            <h3 className="font-bold text-lg text-white">Bronze Storage Layer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Stores raw, immutable Parquet dataset feeds directly from incoming hospital file drops with zero transformation.</p>
          </div>
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">2</div>
            <h3 className="font-bold text-lg text-white">Silver PySpark Clean Layer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Executes PySpark window deduplication, statistical median null imputation, ISO-8601 date casting, and invalid record quarantine.</p>
          </div>
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">3</div>
            <h3 className="font-bold text-lg text-white">Gold Business Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Builds aggregated business summary Parquet models and populates Star Schema Data Warehouse Fact and Dimension tables.</p>
          </div>
        </div>
      </section>

      {/* Portals Showcase */}
      <section id="portals" className="max-w-6xl mx-auto w-full px-6 py-16 space-y-8 relative z-10 border-t border-slate-800">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-health-400 uppercase tracking-widest">Enterprise Access Portals</span>
          <h2 className="text-3xl font-black">Tailored Portals for Every Healthcare Role</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div onClick={() => navigate('/admin/login')} className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-health-500 cursor-pointer space-y-3">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
            <h4 className="font-bold text-sm text-white">Admin & Data Engineer</h4>
            <p className="text-[11px] text-slate-400">Full Medallion ETL, Airflow, Monitoring & Warehouse Control</p>
          </div>
          <div onClick={() => navigate('/doctor/login')} className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-health-500 cursor-pointer space-y-3">
            <Stethoscope className="w-8 h-8 text-teal-400" />
            <h4 className="font-bold text-sm text-white">Physician & Doctor</h4>
            <p className="text-[11px] text-slate-400">Clinical schedule, assigned patients, lab results & prescriptions</p>
          </div>
          <div onClick={() => navigate('/patient/login')} className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-health-500 cursor-pointer space-y-3">
            <User className="w-8 h-8 text-purple-400" />
            <h4 className="font-bold text-sm text-white">Patient Portal</h4>
            <p className="text-[11px] text-slate-400">Personal medical history, appointments, billing & PDF receipts</p>
          </div>
          <div onClick={() => navigate('/analyst/login')} className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-health-500 cursor-pointer space-y-3">
            <BarChart3 className="w-8 h-8 text-amber-400" />
            <h4 className="font-bold text-sm text-white">Healthcare Analyst</h4>
            <p className="text-[11px] text-slate-400">Gold layer queries, AI Summaries & financial trend analytics</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full p-6 text-center text-xs text-slate-500 border-t border-slate-900 relative z-10">
        <p>© 2026 HealthFlow AI Platform. Full-Stack Data Engineering & Healthcare Analytics Engine.</p>
      </footer>
    </div>
  );
};
