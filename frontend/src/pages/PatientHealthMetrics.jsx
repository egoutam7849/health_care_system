import React, { useState } from 'react';
import {
  Activity, Heart, Droplets, Wind, Weight, TrendingUp,
  TrendingDown, Minus, ArrowUp, ArrowDown
} from 'lucide-react';

// ─── SVG Line Chart ───────────────────────────────────────────────────────────
function LineChart({ data, color, height = 80, normalMin, normalMax }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data) - 5;
  const max = Math.max(...data) + 5;
  const range = max - min || 1;
  const w = 400;
  const h = height;
  const pad = 4;
  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - ((v - min) / range) * (h - pad * 2)
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${h} L ${pts[0].x} ${h} Z`;

  // Normal range band
  const normalMinY = normalMin ? h - pad - ((normalMin - min) / range) * (h - pad * 2) : null;
  const normalMaxY = normalMax ? h - pad - ((normalMax - min) / range) * (h - pad * 2) : null;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      {normalMinY && normalMaxY && (
        <rect x={0} y={normalMaxY} width={w} height={normalMinY - normalMaxY} fill={color} fillOpacity={0.06} />
      )}
      <path d={areaD} fill={color} fillOpacity={0.08} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 4 : 2.5} fill={color} />
      ))}
    </svg>
  );
}

// ─── Metric Panel ─────────────────────────────────────────────────────────────
function MetricPanel({ icon: Icon, label, unit, currentValue, data, color, hexColor, bg, border, normalRange, normalMin, normalMax, status, trend, periodLabel }) {
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend === 0 ? 'text-txt-muted' : (trend > 0 ? 'text-accent-red' : 'text-accent-emerald');
  const statusColor = status === 'Normal' ? 'text-accent-emerald' : status === 'High' ? 'text-accent-red' : 'text-accent-orange';

  return (
    <div className={`p-5 rounded-2xl border ${border} ${bg} space-y-4`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <div className="font-black text-sm text-txt-primary">{label}</div>
            <div className="text-[10px] text-txt-muted mt-0.5">Normal: {normalRange}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-txt-primary">{currentValue}</span>
            <span className="text-xs text-txt-muted">{unit}</span>
          </div>
          <div className={`text-[10px] font-black mt-0.5 ${statusColor}`}>{status}</div>
        </div>
      </div>

      {/* Chart */}
      <LineChart data={data} color={hexColor} height={64} normalMin={normalMin} normalMax={normalMax} />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06]">
        <div className="text-center">
          <div className="text-[10px] text-txt-muted">Min ({periodLabel})</div>
          <div className="text-xs font-black text-txt-primary mt-0.5">{Math.min(...data)}</div>
        </div>
        <div className="text-center border-x border-white/[0.06]">
          <div className="text-[10px] text-txt-muted">Average</div>
          <div className="text-xs font-black text-txt-primary mt-0.5">{(data.reduce((a, b) => a + b, 0) / data.length).toFixed(1)}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-txt-muted">Max ({periodLabel})</div>
          <div className="text-xs font-black text-txt-primary mt-0.5">{Math.max(...data)}</div>
        </div>
      </div>

      {/* Trend */}
      <div className={`flex items-center gap-1.5 text-[11px] font-bold ${trendColor}`}>
        <TrendIcon className="w-3.5 h-3.5" />
        <span>{trend === 0 ? 'Stable' : trend > 0 ? `+${Math.abs(trend)} since last period` : `-${Math.abs(trend)} since last period`}</span>
      </div>
    </div>
  );
}

// ─── Period Selector Data ─────────────────────────────────────────────────────
const METRIC_DATA = {
  week: {
    bp_sys: [132, 128, 124, 130, 122, 119, 120],
    bp_dia: [88, 85, 82, 86, 80, 78, 80],
    heartRate: [78, 75, 74, 80, 72, 71, 72],
    bloodSugar: [112, 108, 102, 106, 100, 99, 98],
    weight: [73.2, 73.0, 72.8, 72.9, 72.6, 72.5, 72.5],
    bmi: [23.6, 23.5, 23.5, 23.5, 23.4, 23.4, 23.4],
    spo2: [97, 98, 97, 98, 98, 99, 98],
  }
};

export const PatientHealthMetrics = () => {
  const [period, setPeriod] = useState('week');
  const d = METRIC_DATA.week;
  const periodLabel = period === 'week' ? '7d' : period === 'month' ? '30d' : '3m';

  const metrics = [
    { icon: Activity, label: 'Systolic Blood Pressure', unit: 'mmHg', currentValue: d.bp_sys[d.bp_sys.length - 1], data: d.bp_sys, color: 'text-accent-blue', hexColor: '#3B82F6', bg: 'bg-blue-500/10', border: 'border-blue-500/20', normalRange: '90–120 mmHg', normalMin: 90, normalMax: 120, status: 'Normal', trend: -12 },
    { icon: Heart, label: 'Heart Rate', unit: 'bpm', currentValue: d.heartRate[d.heartRate.length - 1], data: d.heartRate, color: 'text-accent-red', hexColor: '#EF4444', bg: 'bg-rose-500/10', border: 'border-rose-500/20', normalRange: '60–100 bpm', normalMin: 60, normalMax: 100, status: 'Normal', trend: -6 },
    { icon: Droplets, label: 'Blood Sugar (Fasting)', unit: 'mg/dL', currentValue: d.bloodSugar[d.bloodSugar.length - 1], data: d.bloodSugar, color: 'text-accent-orange', hexColor: '#F59E0B', bg: 'bg-amber-500/10', border: 'border-amber-500/20', normalRange: '70–100 mg/dL', normalMin: 70, normalMax: 100, status: 'Normal', trend: -14 },
    { icon: Weight, label: 'Body Weight', unit: 'kg', currentValue: d.weight[d.weight.length - 1], data: d.weight, color: 'text-accent-purple', hexColor: '#8B5CF6', bg: 'bg-purple-500/10', border: 'border-purple-500/20', normalRange: '60–80 kg (est.)', normalMin: 60, normalMax: 80, status: 'Normal', trend: -0.7 },
    { icon: TrendingUp, label: 'BMI', unit: 'kg/m²', currentValue: d.bmi[d.bmi.length - 1], data: d.bmi, color: 'text-accent-emerald', hexColor: '#10B981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', normalRange: '18.5–24.9', normalMin: 18.5, normalMax: 24.9, status: 'Normal', trend: -0.2 },
    { icon: Wind, label: 'Oxygen Saturation', unit: '%', currentValue: d.spo2[d.spo2.length - 1], data: d.spo2, color: 'text-accent-teal', hexColor: '#14B8A6', bg: 'bg-teal-500/10', border: 'border-teal-500/20', normalRange: '95–100%', normalMin: 95, normalMax: 100, status: 'Normal', trend: 0 },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-txt-primary">Health Metrics</h1>
          <p className="text-xs text-txt-muted mt-0.5">Track your health trends over time</p>
        </div>
        <div className="flex items-center gap-2">
          {[['week', '7 Days'], ['month', '30 Days'], ['3m', '3 Months']].map(([v, l]) => (
            <button key={v} onClick={() => setPeriod(v)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors
                ${period === v ? 'bg-accent-emerald text-white shadow-lg shadow-emerald-500/20' : 'bg-dark-section border border-white/[0.08] text-txt-muted hover:bg-dark-card hover:text-txt-primary'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Trend Summary */}
      <div className="p-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-600/10 to-teal-600/5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
            <span className="text-xs font-black text-txt-primary">All metrics in normal range</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-[11px] text-txt-muted">Blood pressure trending down ✓ Blood sugar improving ✓ Weight reducing ✓</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {metrics.map((m, i) => <MetricPanel key={i} {...m} periodLabel={periodLabel} />)}
      </div>

      <div className="p-4 rounded-xl bg-dark-section/50 border border-white/[0.05] text-center">
        <p className="text-[11px] text-txt-disabled">Health metrics are based on your recorded readings. Log readings manually or sync with a health device for real-time tracking. Consult your doctor for clinical interpretation.</p>
      </div>
    </div>
  );
};

export default PatientHealthMetrics;
