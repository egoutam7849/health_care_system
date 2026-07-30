import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Stethoscope, User, BarChart3, ArrowRight, Activity, Database, Lock } from 'lucide-react';

export const PortalSelector = () => {
  const navigate = useNavigate();

  const portals = [
    {
      id: 'admin',
      title: 'Administrator & Data Engineer Portal',
      url: '/admin/login',
      badge: 'System Admin / Data Engineer',
      description: 'Access Medallion ETL pipelines, PySpark data lake, Airflow DAGs, Star Schema Warehouse, and Infrastructure Monitoring.',
      icon: ShieldCheck,
      color: 'from-blue-600 to-indigo-600',
      bgLight: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600'
    },
    {
      id: 'doctor',
      title: 'Physician & Doctor Portal',
      url: '/doctor/login',
      badge: 'Healthcare Staff',
      description: 'Manage assigned patients, daily appointment schedules, diagnosis notes, lab results, and e-prescriptions.',
      icon: Stethoscope,
      color: 'from-teal-600 to-emerald-600',
      bgLight: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600'
    },
    {
      id: 'patient',
      title: 'Patient Health Portal',
      url: '/patient/login',
      badge: 'Registered Patient',
      description: 'View personal medical records, diagnostic lab reports, upcoming appointment schedule, billing statements, and prescriptions.',
      icon: User,
      color: 'from-purple-600 to-pink-600',
      bgLight: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600'
    },
    {
      id: 'analyst',
      title: 'Healthcare Analyst Portal',
      url: '/analyst/login',
      badge: 'Business Analyst',
      description: 'Query Gold layer analytics, view AI Insights clinical summaries, generate financial reports, and inspect health trends.',
      icon: BarChart3,
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between p-6 md:p-12">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-health-600 to-tealAccent-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-health-500/30">
            H
          </div>
          <div>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-health-600 to-tealAccent-500 bg-clip-text text-transparent">HealthFlow AI</span>
            <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold">Enterprise Healthcare Platform</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-xs">
          <Lock className="w-3.5 h-3.5 text-emerald-500" />
          <span>256-Bit SSL Encrypted Portal</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto w-full py-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3 py-1 bg-health-100 dark:bg-health-950 text-health-700 dark:text-health-300 rounded-full text-xs font-bold uppercase tracking-wider">
            Enterprise Portal Selection
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Select Your Dedicated Portal
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Welcome to HealthFlow AI. Please select your authorization portal to access specialized clinical, analytical, or administrative workspaces.
          </p>
        </div>

        {/* 4 Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portals.map((portal) => {
            const IconComponent = portal.icon;
            return (
              <div
                key={portal.id}
                onClick={() => navigate(portal.url)}
                className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-health-500 dark:hover:border-health-500 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:-translate-y-1 group flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl ${portal.bgLight} flex items-center justify-center shadow-inner`}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {portal.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-health-600 transition-colors">
                      {portal.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {portal.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-health-600">
                  <span>Sign In to Portal</span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-health-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-6">
        <p>© 2026 HealthFlow AI Enterprise Healthcare Platform. All rights reserved. Medallion ETL & Star Schema Analytics Engine.</p>
      </div>
    </div>
  );
};
