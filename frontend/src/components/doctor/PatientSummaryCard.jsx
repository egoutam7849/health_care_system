import React from 'react';
import { 
  AlertTriangle, Droplets, Stethoscope, Building2, Clock, 
  ChevronRight, Activity, Calendar
} from 'lucide-react';
import { Badge } from '../common/Badge';

const RISK_CONFIG = {
  Critical: { variant: 'red', label: 'Critical' },
  High:     { variant: 'red', label: 'High Risk' },
  Medium:   { variant: 'amber', label: 'Medium' },
  Low:      { variant: 'emerald', label: 'Low' },
};

export function PatientSummaryCard({ patient, onClick, compact = false }) {
  if (!patient) return null;

  const risk = RISK_CONFIG[patient.risk_level] || RISK_CONFIG['Low'];
  const initials = patient.name
    ? (patient.name.split(' ')[1]?.[0] || '') + patient.name[0]
    : 'P';

  if (compact) {
    return (
      <div
        onClick={onClick}
        className="flex items-center gap-3 p-3 rounded-xl bg-dark-card border border-white/[0.08] hover:bg-dark-hover cursor-pointer transition-colors group"
      >
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md shadow-blue-500/20">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-txt-primary text-xs truncate">{patient.name}</div>
          <div className="text-[10px] text-txt-muted font-mono">{patient.patient_id} • {patient.disease}</div>
        </div>
        <Badge variant={risk.variant} size="sm">{risk.label}</Badge>
        <ChevronRight className="w-3.5 h-3.5 text-txt-muted group-hover:text-txt-primary transition-colors shrink-0" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="p-4 rounded-2xl bg-dark-card border border-white/[0.08] hover:border-white/20 hover:bg-dark-hover cursor-pointer transition-all duration-200 group space-y-3 shadow-lg shadow-black/20"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md shadow-blue-500/20">
            {initials}
          </div>
          <div>
            <div className="font-bold text-txt-primary">{patient.name}</div>
            <div className="text-[10px] text-txt-muted font-mono">{patient.patient_id}</div>
          </div>
        </div>
        <Badge variant={risk.variant} size="sm">{risk.label}</Badge>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-txt-secondary">
          <Activity className="w-3 h-3 text-txt-muted" />
          {patient.disease}
        </div>
        <div className="flex items-center gap-1.5 text-txt-secondary">
          <Droplets className="w-3 h-3 text-accent-red" />
          {patient.blood_group || 'N/A'}
        </div>
        <div className="flex items-center gap-1.5 text-txt-secondary">
          <Clock className="w-3 h-3 text-txt-muted" />
          {patient.last_visit || patient.admission_date || 'N/A'}
        </div>
        <div className="flex items-center gap-1.5 text-txt-secondary">
          <Calendar className="w-3 h-3 text-accent-blue" />
          {patient.next_visit || 'TBD'}
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
        <Badge variant={patient.status === 'Admitted' ? 'amber' : 'emerald'} size="sm">
          {patient.status}
        </Badge>
        <span className="text-[10px] text-txt-muted font-bold">
          {patient.age}Y • {patient.gender}
        </span>
      </div>
    </div>
  );
}
