import React from 'react';
import { Activity, ShieldAlert, Heart, Brain, Flame, Thermometer } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const diseaseData = [
  { disease: 'Cardiovascular', cases: 3140, readmission: 8.2, severity: 88 },
  { disease: 'Diabetes Type II', cases: 2450, readmission: 5.4, severity: 72 },
  { disease: 'Pneumonia', cases: 1820, readmission: 6.8, severity: 80 },
  { disease: 'Hypertension', cases: 1395, readmission: 4.1, severity: 60 },
  { disease: 'Osteoarthritis', cases: 1000, readmission: 3.2, severity: 52 },
  { disease: 'Asthma', cases: 940, readmission: 4.8, severity: 58 }
];

const radarData = [
  { subject: 'Cardiology', A: 120, B: 110, fullMark: 150 },
  { subject: 'Neurology', A: 98, B: 130, fullMark: 150 },
  { subject: 'Oncology', A: 86, B: 130, fullMark: 150 },
  { subject: 'Pediatrics', A: 99, B: 100, fullMark: 150 },
  { subject: 'Orthopedics', A: 85, B: 90, fullMark: 150 },
  { subject: 'Pulmonology', A: 65, B: 85, fullMark: 150 }
];

const COLORS = ['#0c8de4', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#0270c1'];

export const DiseaseAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Disease Analytics & Epidemiological Insights</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Multi-dimensional Disease Prevalence, Severity Radar & Readmission Metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Diagnosed Diseases Bar Chart */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Top Diagnosed Conditions (Total Cases)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseaseData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="disease" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="cases" fill="#0c8de4" radius={[6, 6, 0, 0]} name="Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Clinical Department Utilization Radar Chart */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Specialty Department Resource Allocation Radar</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid opacity={0.2} />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis />
                <Radar name="Q1 Volume" dataKey="A" stroke="#0c8de4" fill="#0c8de4" fillOpacity={0.5} />
                <Radar name="Q2 Volume" dataKey="B" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Disease Risk & Severity Scorecard Grid */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">Condition Readmission & Severity Heatmap Grid</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {diseaseData.map((item, idx) => (
            <div key={item.disease} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{item.disease}</span>
                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-[10px]">
                  {item.readmission}% Readmission
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Severity Index</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{item.severity} / 100</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-health-500 to-rose-500 rounded-full" style={{ width: `${item.severity}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
