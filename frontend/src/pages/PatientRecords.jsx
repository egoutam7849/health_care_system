import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { portalsAPI } from '../services/api';
import {
  FileText, Stethoscope, Pill, FlaskConical, Activity, Calendar,
  ChevronRight, X, Clock, Search, Filter, Tag, Heart
} from 'lucide-react';

// ─── Event Type Config ─────────────────────────────────────────────────────────
const EVENT_TYPES = {
  Consultation: { icon: Stethoscope, color: 'text-accent-blue',    bg: 'bg-blue-500/15',    border: 'border-blue-500/30',    dot: 'bg-accent-blue' },
  Diagnosis:    { icon: Activity,    color: 'text-accent-red',     bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    dot: 'bg-accent-red' },
  Prescription: { icon: Pill,        color: 'text-accent-purple',  bg: 'bg-purple-500/15',  border: 'border-purple-500/25',  dot: 'bg-accent-purple' },
  'Lab Test':   { icon: FlaskConical, color: 'text-accent-orange', bg: 'bg-amber-500/15',   border: 'border-amber-500/25',   dot: 'bg-accent-orange' },
  Procedure:    { icon: Heart,        color: 'text-accent-teal',   bg: 'bg-teal-500/15',    border: 'border-teal-500/25',    dot: 'bg-accent-teal' },
  'Follow-up':  { icon: Calendar,    color: 'text-accent-emerald', bg: 'bg-emerald-500/15', border: 'border-emerald-500/25', dot: 'bg-accent-emerald' },
};

// ─── Fallback Timeline Data ───────────────────────────────────────────────────
const FALLBACK_EVENTS = [
  { id: 1, year: '2026', date: '2026-07-15', type: 'Consultation', title: 'Cardiology Follow-up', doctor: 'Dr. John Smith', facility: 'Metro General Hospital', department: 'Cardiology', notes: 'Blood pressure stable. Continue current medication. Review in 3 months.', status: 'Completed' },
  { id: 2, year: '2026', date: '2026-07-15', type: 'Prescription', title: 'Atorvastatin 20mg Prescribed', doctor: 'Dr. John Smith', facility: 'Metro General Hospital', notes: 'Take once daily at bedtime. Avoid grapefruit. Monitor for muscle pain.', status: 'Active' },
  { id: 3, year: '2026', date: '2026-06-28', type: 'Lab Test', title: 'Comprehensive Metabolic Panel', doctor: 'Dr. John Smith', facility: 'Metro General Hospital', notes: 'All values within normal range. Potassium slightly low — dietary adjustments recommended.', status: 'Completed', result: 'Normal' },
  { id: 4, year: '2026', date: '2026-06-12', type: 'Diagnosis', title: 'Hypertension — Stage 1', doctor: 'Dr. John Smith', facility: 'Metro General Hospital', notes: 'Blood pressure readings consistently 130–139/80–89 mmHg over 3 visits. Lifestyle modifications and medication initiated.', status: 'Active' },
  { id: 5, year: '2026', date: '2026-04-10', type: 'Consultation', title: 'Initial Cardiac Assessment', doctor: 'Dr. John Smith', facility: 'Metro General Hospital', department: 'Cardiology', notes: 'Referred by GP for elevated BP. ECG normal. Echocardiogram ordered.', status: 'Completed' },
  { id: 6, year: '2026', date: '2026-03-05', type: 'Procedure', title: 'Echocardiogram', doctor: 'Dr. John Smith', facility: 'Metro General Hospital', notes: 'Ejection fraction 62%, normal left ventricular function. No structural abnormalities.', status: 'Completed', result: 'Normal' },
  { id: 7, year: '2025', date: '2025-11-20', type: 'Follow-up', title: 'Annual Physical Examination', doctor: 'Dr. Sarah Lee', facility: 'City Clinic', notes: 'Overall health good. Recommended vitamin D supplementation. Suggested cardiac screening due to family history.', status: 'Completed' },
  { id: 8, year: '2025', date: '2025-09-14', type: 'Lab Test', title: 'Lipid Panel & HbA1c', doctor: 'Dr. Sarah Lee', facility: 'City Clinic', notes: 'LDL elevated at 145 mg/dL. HbA1c 5.4% (normal). Dietary counseling initiated.', status: 'Completed', result: 'Borderline' },
];

// ─── Detail Drawer ─────────────────────────────────────────────────────────────
function RecordDrawer({ event: ev, onClose }) {
  if (!ev) return null;
  const cfg = EVENT_TYPES[ev.type] || EVENT_TYPES.Consultation;
  const Icon = cfg.icon;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-dark-shell border-l border-white/[0.08] flex flex-col animate-slide-in-right overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08] shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
              <Icon className={`w-4.5 h-4.5 ${cfg.color}`} />
            </div>
            <div>
              <h2 className="font-black text-sm text-txt-primary">{ev.type}</h2>
              <p className="text-[11px] text-txt-muted mt-0.5">{new Date(ev.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-dark-hover text-txt-muted hover:text-txt-primary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 p-5 space-y-4">
          {/* Title + Status */}
          <div className={`p-4 rounded-xl border ${cfg.bg} ${cfg.border}`}>
            <h3 className="font-black text-base text-txt-primary">{ev.title}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                {ev.status}
              </span>
              {ev.result && (
                <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-500/15 text-accent-emerald border border-emerald-500/25">
                  Result: {ev.result}
                </span>
              )}
            </div>
          </div>

          {/* Doctor */}
          <div className="p-4 rounded-xl bg-dark-section border border-white/[0.08]">
            <div className="text-[10px] font-black uppercase tracking-widest text-txt-muted mb-2">Physician</div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                {(ev.doctor || 'D')[0]}
              </div>
              <div>
                <div className="font-bold text-txt-primary text-sm">{ev.doctor || 'Doctor'}</div>
                <div className="text-[11px] text-txt-muted">{ev.department || ev.facility}</div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {ev.notes && (
            <div className="p-4 rounded-xl bg-dark-section border border-white/[0.08]">
              <div className="text-[10px] font-black uppercase tracking-widest text-txt-muted mb-2">Clinical Notes</div>
              <p className="text-xs text-txt-secondary leading-relaxed">{ev.notes}</p>
            </div>
          )}

          {/* Facility */}
          <div className="p-4 rounded-xl bg-dark-section border border-white/[0.08]">
            <div className="text-[10px] font-black uppercase tracking-widest text-txt-muted mb-1">Facility</div>
            <p className="text-xs text-txt-primary font-bold">{ev.facility}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Timeline Event Item ──────────────────────────────────────────────────────
function TimelineEvent({ event: ev, onClick, isLast }) {
  const cfg = EVENT_TYPES[ev.type] || EVENT_TYPES.Consultation;
  const Icon = cfg.icon;

  return (
    <div className="flex items-start gap-4 group">
      {/* Timeline connector */}
      <div className="flex flex-col items-center shrink-0 w-10">
        <div className={`w-10 h-10 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center z-10 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-4.5 h-4.5 ${cfg.color}`} />
        </div>
        {!isLast && <div className="w-px flex-1 min-h-[2rem] bg-white/[0.06] mt-2" />}
      </div>

      {/* Card */}
      <div
        onClick={onClick}
        className="flex-1 mb-4 p-4 rounded-xl border border-white/[0.08] bg-dark-section hover:border-white/[0.15] hover:bg-dark-card cursor-pointer transition-all duration-200 group/card"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 text-[9px] font-black rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                {ev.type}
              </span>
              {ev.result && (
                <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-emerald-500/10 text-accent-emerald border border-emerald-500/20">
                  {ev.result}
                </span>
              )}
            </div>
            <h3 className="font-black text-sm text-txt-primary mt-1.5">{ev.title}</h3>
            <p className="text-[11px] text-txt-muted mt-0.5">{ev.doctor} • {ev.facility}</p>
            {ev.notes && (
              <p className="text-[11px] text-txt-secondary mt-2 leading-relaxed line-clamp-2">{ev.notes}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] text-txt-muted font-mono">
              {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-txt-muted mt-2 ml-auto group-hover/card:text-txt-primary group-hover/card:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export const PatientRecords = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    const load = async () => {
      try {
        await portalsAPI.getPatientSummary({ patient_id: user?.patient_id });
      } catch { /* use fallback */ }
      setEvents(FALLBACK_EVENTS);
      setLoading(false);
    };
    load();
  }, []);

  const types = ['All', ...Object.keys(EVENT_TYPES)];
  const filtered = events.filter(ev => {
    const matchType = typeFilter === 'All' || ev.type === typeFilter;
    const q = search.toLowerCase();
    const matchSearch = !search || ev.title.toLowerCase().includes(q) || ev.doctor.toLowerCase().includes(q) || ev.type.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  // Group by year
  const byYear = filtered.reduce((acc, ev) => {
    const y = ev.year || ev.date?.split('-')[0] || '2026';
    if (!acc[y]) acc[y] = [];
    acc[y].push(ev);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort((a, b) => b - a);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-fade-in">
      {selected && <RecordDrawer event={selected} onClose={() => setSelected(null)} />}

      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-txt-primary">Medical Records</h1>
        <p className="text-xs text-txt-muted mt-0.5">Your complete health history • {events.length} records</p>
      </div>

      {/* Search + Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted" />
          <input
            type="text" placeholder="Search records..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-section border border-white/[0.08] rounded-xl text-xs text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-accent-emerald/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {types.map(t => {
            const cfg = EVENT_TYPES[t];
            return (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border
                  ${typeFilter === t
                    ? 'bg-accent-emerald text-white border-emerald-500/50 shadow-md shadow-emerald-500/20'
                    : 'bg-dark-section border-white/[0.08] text-txt-muted hover:text-txt-primary hover:bg-dark-card'
                  }`}>
                {cfg && <cfg.icon className="w-3 h-3" />}
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-dark-section rounded-2xl border border-white/[0.05]" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <FileText className="w-12 h-12 text-txt-muted/30 mb-3" />
          <p className="font-black text-sm text-txt-primary">No records found</p>
          <p className="text-xs text-txt-muted mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        years.map(year => (
          <div key={year}>
            {/* Year divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span className="px-3 py-1 bg-dark-section border border-white/[0.08] rounded-full text-xs font-black text-accent-emerald">{year}</span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>
            {byYear[year].map((ev, i) => (
              <TimelineEvent
                key={ev.id}
                event={ev}
                onClick={() => setSelected(ev)}
                isLast={i === byYear[year].length - 1 && year === years[years.length - 1]}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default PatientRecords;
