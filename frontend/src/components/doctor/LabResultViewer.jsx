import React from 'react';
import { AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from '../common/Badge';

const REF_COLORS = {
  normal: { badge: 'emerald', label: 'Normal', icon: CheckCircle2, color: 'text-accent-emerald' },
  high: { badge: 'red', label: 'High', icon: TrendingUp, color: 'text-accent-red' },
  low: { badge: 'amber', label: 'Low', icon: TrendingDown, color: 'text-accent-orange' },
  critical: { badge: 'red', label: 'Critical', icon: AlertTriangle, color: 'text-accent-red' },
};

function ResultRow({ test, value, unit, reference, status = 'normal' }) {
  const cfg = REF_COLORS[status] || REF_COLORS.normal;
  const Icon = cfg.icon;
  const isAbnormal = status !== 'normal';

  return (
    <div className={`grid grid-cols-12 gap-3 px-4 py-2.5 items-center text-xs transition-colors
      ${isAbnormal ? 'bg-rose-500/5 hover:bg-rose-500/10' : 'hover:bg-dark-hover'}`}>
      <div className="col-span-4 font-medium text-txt-primary">{test}</div>
      <div className={`col-span-2 font-bold font-mono ${isAbnormal ? cfg.color : 'text-txt-primary'}`}>
        <div className="flex items-center gap-1.5">
          {isAbnormal && <Icon className="w-3.5 h-3.5 shrink-0" />}
          {value}
        </div>
      </div>
      <div className="col-span-2 text-txt-muted font-mono">{unit}</div>
      <div className="col-span-2 text-txt-muted text-[10px]">{reference}</div>
      <div className="col-span-2">
        <Badge variant={cfg.badge} size="sm">{cfg.label}</Badge>
      </div>
    </div>
  );
}

export function LabResultViewer({ report, onApprove, onComment }) {
  if (!report) return (
    <div className="py-12 text-center text-txt-muted text-xs">
      No lab report selected.
    </div>
  );

  const results = report.results || [
    { test: 'Hemoglobin (Hb)', value: '11.2', unit: 'g/dL', reference: '13.0 – 17.0', status: 'low' },
    { test: 'White Blood Cells', value: '9.5', unit: '×10³/μL', reference: '4.0 – 11.0', status: 'normal' },
    { test: 'Platelets', value: '145', unit: '×10³/μL', reference: '150 – 400', status: 'low' },
    { test: 'Fasting Glucose', value: '186', unit: 'mg/dL', reference: '70 – 100', status: 'high' },
    { test: 'HbA1c', value: '8.2', unit: '%', reference: '< 5.7', status: 'critical' },
    { test: 'Creatinine', value: '0.9', unit: 'mg/dL', reference: '0.7 – 1.3', status: 'normal' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="font-black text-txt-primary text-sm">{report.test_name || 'Complete Blood Panel'}</div>
          <div className="text-xs text-txt-muted mt-0.5 font-mono">{report.lab_id || 'LAB-0000'} • {report.date || 'Today'}</div>
        </div>
        <div className="flex items-center gap-2">
          {onComment && (
            <button
              onClick={onComment}
              className="px-3 py-1.5 text-xs font-bold text-txt-secondary bg-dark-card border border-white/[0.08] hover:bg-dark-hover rounded-xl transition-colors"
            >
              Add Comment
            </button>
          )}
          {onApprove && (
            <button
              onClick={onApprove}
              className="px-3 py-1.5 text-xs font-bold text-white bg-accent-emerald hover:bg-emerald-600 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approve Report
            </button>
          )}
        </div>
      </div>

      {/* Abnormal Alert Banner */}
      {results.some(r => r.status !== 'normal') && (
        <div className="flex items-center gap-2.5 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-accent-red shrink-0" />
          <p className="text-xs font-bold text-rose-400">
            {results.filter(r => r.status !== 'normal').length} abnormal result(s) detected. Immediate clinical review recommended.
          </p>
        </div>
      )}

      {/* Results Table */}
      <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-4 py-2 bg-dark-shell border-b border-white/[0.08] text-[10px] font-bold uppercase tracking-wider text-txt-muted">
          <div className="col-span-4">Test Parameter</div>
          <div className="col-span-2">Result</div>
          <div className="col-span-2">Unit</div>
          <div className="col-span-2">Reference</div>
          <div className="col-span-2">Status</div>
        </div>
        <div className="divide-y divide-white/[0.04] bg-dark-section">
          {results.map((r, i) => (
            <ResultRow key={i} {...r} />
          ))}
        </div>
      </div>

      {/* Interpretation Note */}
      {report.interpretation && (
        <div className="p-4 bg-dark-shell rounded-xl border border-white/[0.06]">
          <div className="text-[10px] text-txt-muted font-bold uppercase mb-1">Lab Interpretation</div>
          <p className="text-xs text-txt-secondary leading-relaxed">{report.interpretation}</p>
        </div>
      )}
    </div>
  );
}
