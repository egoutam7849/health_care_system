import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function MiniSparkline({ values = [], color = '#3b82f6' }) {
  if (!values.length) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 64;
  const h = 24;
  const step = w / (values.length - 1);
  const points = values
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(' ');
  const areaPoints = `0,${h} ${points} ${(values.length - 1) * step},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-16 h-6 overflow-visible">
      <defs>
        <linearGradient id={`spark-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#spark-${color.replace('#','')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {values.length > 0 && (() => {
        const lx = (values.length - 1) * step;
        const lv = values[values.length - 1];
        const ly = h - ((lv - min) / range) * h;
        return <circle cx={lx} cy={ly} r="2" fill={color} />;
      })()}
    </svg>
  );
}

export function KpiCard({
  title,
  value,
  unit = '',
  prefix = '',
  icon: Icon,
  iconBg = 'bg-blue-500/10',
  iconColor = 'text-blue-400',
  trend = 'up',
  change = '',
  changeLabel = '',
  updatedAt = '',
  sparkline = [],
  sparkColor = '#3b82f6',
  accentGradient = 'from-blue-500/40 via-blue-500/10 to-transparent',
  valueColor = 'text-txt-primary',
  onClick,
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-accent-emerald' : trend === 'down' ? 'text-accent-red' : 'text-txt-muted';

  return (
    <div
      onClick={onClick}
      className={`group relative p-5 rounded-2xl border border-white/[0.08] bg-dark-card
        hover:border-white/20 hover:bg-dark-hover transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''} overflow-hidden shadow-xl shadow-black/20`}
    >
      {/* Gradient top bar accent */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accentGradient}`} />

      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
        </div>
        {sparkline.length > 0 && (
          <MiniSparkline values={sparkline} color={sparkColor} />
        )}
      </div>

      <div className="space-y-1">
        <div className={`text-2xl font-black tabular-nums leading-none ${valueColor}`}>
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{unit}
        </div>
        <div className="text-xs text-txt-muted font-semibold">{title}</div>
      </div>

      {(change || changeLabel) && (
        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/[0.05]">
          <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
          {change && <span className={`text-[11px] font-bold ${trendColor}`}>{change}</span>}
          {changeLabel && <span className="text-[11px] text-txt-disabled">{changeLabel}</span>}
        </div>
      )}

      {updatedAt && (
        <div className="mt-1 text-[10px] text-txt-disabled">
          Updated {updatedAt}
        </div>
      )}
    </div>
  );
}
