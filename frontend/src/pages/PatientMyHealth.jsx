import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Heart, Activity, Droplets, Wind, Thermometer, Weight, TrendingUp, TrendingDown,
  Minus, RefreshCw, Plus, Calendar, ChevronRight, AlertCircle, CheckCircle2, Info
} from 'lucide-react';

// Simple line spark chart
function SparkChart({ data, color, height = 48 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 200;
  const h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(',')[0]} cy={pts[pts.length - 1].split(',')[1]} r="3" fill={color} />
    </svg>
  );
}

// Vital Metric Card
function VitalCard({ icon: Icon, label, value, unit, status, trend, sparkData, color, bg, borderColor, range }) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const statusColor = status === 'Normal' ? 'text-accent-emerald' : status === 'High' ? 'text-accent-red' : 'text-accent-orange';

  return (
    <div className={`p-5 rounded-2xl border ${borderColor} ${bg} space-y-3 hover:border-opacity-60 transition-all`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl ${bg} border ${borderColor} flex items-center justify-center`}>
            <Icon className={`w-4.5 h-4.5 ${color}`} />
          </div>
          <div>
            <div className="text-[10px] text-txt-muted font-bold uppercase tracking-wide">{label}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-txt-primary">{value}</span>
              <span className="text-xs text-txt-muted">{unit}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-[10px] font-black ${statusColor}`}>{status}</span>
          <div className={`flex items-center gap-1 justify-end mt-0.5 ${color}`}>
            <TrendIcon className="w-3 h-3" />
            <span className="text-[9px] font-bold">{trend}</span>
          </div>
        </div>
      </div>
      {sparkData && <SparkChart data={sparkData} color={color.replace('text-', '').replace('accent-blue', '#3B82F6').replace('accent-red', '#EF4444').replace('accent-orange', '#F59E0B').replace('accent-teal', '#14B8A6').replace('accent-emerald', '#10B981').replace('accent-purple', '#8B5CF6')} />}
      {range && (
        <div className="flex items-center justify-between text-[10px] text-txt-disabled">
          <span>Normal range: {range}</span>
        </div>
      )}
    </div>
  );
}

export const PatientMyHealth = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('week');

  const vitals = [
    {
      icon: Activity, label: 'Blood Pressure', value: '120/80', unit: 'mmHg',
      status: 'Normal', trend: 'stable',
      sparkData: [130, 125, 122, 128, 120, 118, 120],
      color: 'text-accent-blue', bg: 'bg-blue-500/10', borderColor: 'border-blue-500/20',
      range: '90/60 – 120/80 mmHg'
    },
    {
      icon: Heart, label: 'Heart Rate', value: '72', unit: 'bpm',
      status: 'Normal', trend: 'stable',
      sparkData: [78, 75, 74, 72, 76, 71, 72],
      color: 'text-accent-red', bg: 'bg-rose-500/10', borderColor: 'border-rose-500/20',
      range: '60–100 bpm'
    },
    {
      icon: Droplets, label: 'Blood Sugar', value: '98', unit: 'mg/dL',
      status: 'Normal', trend: 'down',
      sparkData: [112, 108, 104, 102, 100, 99, 98],
      color: 'text-accent-orange', bg: 'bg-amber-500/10', borderColor: 'border-amber-500/20',
      range: '70–100 mg/dL (fasting)'
    },
    {
      icon: Wind, label: 'Oxygen Saturation', value: '98', unit: '%',
      status: 'Normal', trend: 'stable',
      sparkData: [97, 98, 97, 98, 98, 99, 98],
      color: 'text-accent-teal', bg: 'bg-teal-500/10', borderColor: 'border-teal-500/20',
      range: '95–100%'
    },
    {
      icon: Weight, label: 'Weight', value: '72.5', unit: 'kg',
      status: 'Normal', trend: 'down',
      sparkData: [75, 74.5, 74, 73.5, 73, 72.8, 72.5],
      color: 'text-accent-purple', bg: 'bg-purple-500/10', borderColor: 'border-purple-500/20',
      range: 'BMI 18.5–24.9 kg/m²'
    },
    {
      icon: TrendingUp, label: 'BMI', value: '23.4', unit: 'kg/m²',
      status: 'Normal', trend: 'down',
      sparkData: [24.1, 24.0, 23.9, 23.7, 23.6, 23.5, 23.4],
      color: 'text-accent-emerald', bg: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20',
      range: '18.5–24.9 kg/m²'
    },
  ];

  // Overall health score
  const healthScore = 82;
  const scoreColor = healthScore >= 80 ? '#10B981' : healthScore >= 60 ? '#F59E0B' : '#EF4444';
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-txt-primary">My Health</h1>
          <p className="text-xs text-txt-muted mt-0.5">Personal health overview — {user?.name || 'Patient'}</p>
        </div>
        <div className="flex items-center gap-2">
          {['week', 'month', '3m'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors
                ${period === p ? 'bg-accent-emerald text-white' : 'bg-dark-section text-txt-muted hover:bg-dark-card border border-white/[0.08]'}`}>
              {p === 'week' ? '7 Days' : p === 'month' ? '30 Days' : '3 Months'}
            </button>
          ))}
        </div>
      </div>

      {/* Health Score + Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Ring */}
        <div className="p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-600/15 to-teal-600/5 flex flex-col items-center gap-4">
          <div className="text-xs font-black text-txt-muted uppercase tracking-widest">Overall Health Score</div>
          <div className="relative w-36 h-36">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 144 144">
              <circle cx="72" cy="72" r={radius} strokeWidth="10" stroke="#1E293B" fill="none" />
              <circle cx="72" cy="72" r={radius} strokeWidth="10"
                stroke={scoreColor} fill="none"
                strokeDasharray={circumference} strokeDashoffset={offset}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.2s ease-out' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-txt-primary">{healthScore}</span>
              <span className="text-xs text-txt-muted">out of 100</span>
            </div>
          </div>
          <div className="text-center">
            <div className="font-black text-sm" style={{ color: scoreColor }}>Good Health</div>
            <div className="text-[11px] text-txt-muted mt-1">Based on your recent vitals & history</div>
          </div>
          <div className="w-full space-y-2">
            {[
              { label: 'Vitals', val: 90 },
              { label: 'Lifestyle', val: 75 },
              { label: 'Medication Adherence', val: 88 },
            ].map(m => (
              <div key={m.label}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-txt-muted">{m.label}</span>
                  <span className="text-accent-emerald font-bold">{m.val}%</span>
                </div>
                <div className="h-1.5 bg-dark-card rounded-full overflow-hidden">
                  <div className="h-full bg-accent-emerald rounded-full" style={{ width: `${m.val}%`, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="md:col-span-2 p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-4">
          <div className="font-black text-sm text-txt-primary">Health Insights</div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
              <p className="text-xs text-txt-secondary">Your blood pressure is within the ideal range. Keep maintaining your current lifestyle habits.</p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Info className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
              <p className="text-xs text-txt-secondary">Blood sugar levels have been trending down over the last 7 days. Continue dietary adherence.</p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="w-4 h-4 text-accent-orange shrink-0 mt-0.5" />
              <p className="text-xs text-txt-secondary">BMI is in the normal range. Your doctor recommends 150 min of moderate exercise per week.</p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <Heart className="w-4 h-4 text-accent-purple shrink-0 mt-0.5" />
              <p className="text-xs text-txt-secondary">Resting heart rate is excellent at 72 bpm. Good cardiovascular fitness indicated.</p>
            </div>
          </div>
          <p className="text-[10px] text-txt-disabled italic">⚠ AI-generated insights based on your latest recorded vitals. Consult your doctor for clinical advice.</p>
        </div>
      </div>

      {/* Vitals Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-txt-primary">Health Vitals & Trends</h2>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-dark-section border border-white/[0.08] text-txt-muted hover:text-txt-primary rounded-xl text-xs font-bold transition-colors">
            <Plus className="w-3.5 h-3.5" /> Log Reading
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {vitals.map((v, i) => <VitalCard key={i} {...v} />)}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-2xl border border-white/[0.06] bg-dark-section/50 text-center">
        <p className="text-[11px] text-txt-disabled">
          Health metrics shown are based on your last recorded readings. For accurate health assessment,
          consult your assigned physician. <span className="text-accent-emerald font-bold">HealthFlow AI</span> does not provide medical diagnosis.
        </p>
      </div>
    </div>
  );
};

export default PatientMyHealth;
