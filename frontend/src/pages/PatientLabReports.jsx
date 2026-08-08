import React, { useState } from 'react';
import {
  FlaskConical, Download, Eye, AlertTriangle, CheckCircle2, Clock,
  Search, ChevronRight, X, Calendar, User, FileText, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const LAB_DATA = [
  { id: 'LAB-2026-001', name: 'Comprehensive Metabolic Panel (CMP)', date: '2026-07-15', ordered_by: 'Dr. John Smith', department: 'Cardiology', status: 'Pending', critical: false, tests: ['Sodium', 'Potassium', 'Glucose', 'BUN', 'Creatinine', 'ALT', 'AST'] },
  { id: 'LAB-2026-002', name: 'Lipid Panel (Full)', date: '2026-07-01', ordered_by: 'Dr. John Smith', department: 'Cardiology', status: 'Completed', critical: false, result_summary: 'LDL: 125 mg/dL (Borderline). HDL: 55 mg/dL (Normal). Triglycerides: 148 mg/dL (Normal).', tests: ['Total Cholesterol', 'LDL', 'HDL', 'Triglycerides'] },
  { id: 'LAB-2026-003', name: 'Complete Blood Count (CBC)', date: '2026-06-28', ordered_by: 'Dr. John Smith', department: 'Cardiology', status: 'Completed', critical: false, result_summary: 'All values within normal range. Hemoglobin: 14.2 g/dL. WBC: 6.8 K/µL.', tests: ['WBC', 'RBC', 'Hemoglobin', 'Hematocrit', 'Platelets'] },
  { id: 'LAB-2026-004', name: 'Potassium Level (Critical)', date: '2026-06-12', ordered_by: 'Dr. John Smith', department: 'Cardiology', status: 'Completed', critical: true, result_summary: 'Potassium: 5.9 mEq/L — CRITICAL HIGH. Immediate physician review required.', tests: ['Potassium', 'Sodium'] },
  { id: 'LAB-2026-005', name: 'HbA1c (Glycated Hemoglobin)', date: '2026-05-20', ordered_by: 'Dr. Sarah Lee', department: 'General Medicine', status: 'Completed', critical: false, result_summary: 'HbA1c: 5.4% — Normal (Non-diabetic range). No further action required.', tests: ['HbA1c'] },
  { id: 'LAB-2026-006', name: 'Thyroid Function (TSH, T3, T4)', date: '2026-07-20', ordered_by: 'Dr. Sarah Lee', department: 'General Medicine', status: 'Pending', critical: false, tests: ['TSH', 'Free T3', 'Free T4'] },
];

function LabDrawer({ lab, onClose }) {
  if (!lab) return null;
  const isCritical = lab.critical;
  const isPending = lab.status === 'Pending';

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-dark-shell border-l border-white/[0.08] flex flex-col animate-slide-in-right overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08] shrink-0">
          <div>
            <h2 className="font-black text-sm text-txt-primary">{lab.name}</h2>
            <p className="text-[11px] text-txt-muted mt-0.5 font-mono">{lab.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-dark-hover text-txt-muted hover:text-txt-primary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 p-5 space-y-4">
          {isCritical && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30">
              <AlertTriangle className="w-4 h-4 text-accent-red shrink-0 mt-0.5 animate-pulse" />
              <div>
                <div className="font-black text-sm text-accent-red">Critical Result</div>
                <p className="text-[11px] text-rose-300/80 mt-0.5">Contact your doctor immediately regarding this result.</p>
              </div>
            </div>
          )}

          <div className={`p-3.5 rounded-xl border flex items-center gap-2.5 ${isPending ? 'bg-amber-500/10 border-amber-500/25' : 'bg-emerald-500/10 border-emerald-500/25'}`}>
            {isPending ? <Clock className="w-4 h-4 text-accent-orange" /> : <CheckCircle2 className="w-4 h-4 text-accent-emerald" />}
            <div>
              <div className={`font-black text-sm ${isPending ? 'text-accent-orange' : 'text-accent-emerald'}`}>{lab.status}</div>
              <div className="text-[10px] text-txt-muted">{isPending ? 'Results pending from lab' : 'Results available'}</div>
            </div>
          </div>

          {[
            { label: 'Date Ordered', value: lab.date },
            { label: 'Ordered By', value: lab.ordered_by },
            { label: 'Department', value: lab.department },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2.5 border-b border-white/[0.06] last:border-0">
              <span className="text-[11px] text-txt-muted">{label}</span>
              <span className="text-[11px] font-bold text-txt-primary">{value}</span>
            </div>
          ))}

          {lab.result_summary && (
            <div className="p-4 rounded-xl bg-dark-section border border-white/[0.08]">
              <div className="text-[10px] font-black uppercase tracking-widest text-txt-muted mb-2">Result Summary</div>
              <p className="text-xs text-txt-secondary leading-relaxed">{lab.result_summary}</p>
            </div>
          )}

          <div className="p-4 rounded-xl bg-dark-section border border-white/[0.08]">
            <div className="text-[10px] font-black uppercase tracking-widest text-txt-muted mb-2">Tests Included</div>
            <div className="flex flex-wrap gap-1.5">
              {lab.tests.map(t => (
                <span key={t} className="px-2 py-0.5 bg-dark-card border border-white/[0.08] rounded-lg text-[10px] text-txt-secondary">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {!isPending && (
          <div className="p-5 border-t border-white/[0.08] shrink-0">
            <button onClick={() => { toast.success('Downloading lab report...'); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-accent-emerald text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition">
              <Download className="w-4 h-4" /> Download PDF Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function LabCard({ lab, onClick }) {
  const isCritical = lab.critical;
  const isPending = lab.status === 'Pending';

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-lg group
        ${isCritical ? 'border-rose-500/40 bg-rose-500/5 hover:border-rose-500/60' : isPending ? 'border-amber-500/25 bg-amber-500/5 hover:border-amber-500/40' : 'border-white/[0.08] bg-dark-section hover:border-white/[0.18]'}`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0
          ${isCritical ? 'bg-rose-500/15' : isPending ? 'bg-amber-500/15' : 'bg-emerald-500/10'}`}>
          <FlaskConical className={`w-5 h-5 ${isCritical ? 'text-accent-red' : isPending ? 'text-accent-orange' : 'text-accent-emerald'}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              {isCritical && (
                <div className="flex items-center gap-1 mb-1">
                  <AlertTriangle className="w-3 h-3 text-accent-red" />
                  <span className="text-[9px] font-black text-accent-red uppercase tracking-wide animate-pulse">Critical Result</span>
                </div>
              )}
              <h3 className="font-black text-sm text-txt-primary">{lab.name}</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[11px] text-txt-muted flex items-center gap-1"><Calendar className="w-3 h-3" />{lab.date}</span>
                <span className="text-[11px] text-txt-muted flex items-center gap-1"><User className="w-3 h-3" />{lab.ordered_by}</span>
              </div>
              {lab.result_summary && (
                <p className="text-[11px] text-txt-secondary mt-2 line-clamp-2 leading-relaxed">{lab.result_summary}</p>
              )}
            </div>
            <span className={`px-2.5 py-1 text-[10px] font-black rounded-full shrink-0 border
              ${isCritical ? 'bg-rose-500/20 text-accent-red border-rose-500/30' : isPending ? 'bg-amber-500/15 text-accent-orange border-amber-500/25' : 'bg-emerald-500/15 text-accent-emerald border-emerald-500/25'}`}>
              {lab.status}
            </span>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-txt-muted group-hover:text-txt-primary group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>

      {!isPending && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.06]">
          <button onClick={e => { e.stopPropagation(); toast.success('Downloading...'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-card border border-white/[0.08] hover:bg-dark-hover text-txt-muted hover:text-txt-primary text-[11px] font-bold rounded-xl transition">
            <Download className="w-3.5 h-3.5" /> Download PDF
          </button>
          <button onClick={e => { e.stopPropagation(); onClick(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-emerald/10 border border-emerald-500/20 hover:bg-accent-emerald hover:text-white text-accent-emerald text-[11px] font-bold rounded-xl transition">
            <Eye className="w-3.5 h-3.5" /> View Details
          </button>
        </div>
      )}
    </div>
  );
}

export const PatientLabReports = () => {
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const TABS = ['All', 'Pending', 'Completed', 'Critical'];
  const counts = {
    All: LAB_DATA.length,
    Pending: LAB_DATA.filter(l => l.status === 'Pending').length,
    Completed: LAB_DATA.filter(l => l.status === 'Completed').length,
    Critical: LAB_DATA.filter(l => l.critical).length,
  };

  const filtered = LAB_DATA.filter(l => {
    if (tab === 'Pending') return l.status === 'Pending';
    if (tab === 'Completed') return l.status === 'Completed';
    if (tab === 'Critical') return l.critical;
    return true;
  }).filter(l => !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.ordered_by.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
      {selected && <LabDrawer lab={selected} onClose={() => setSelected(null)} />}

      <div>
        <h1 className="text-xl font-black text-txt-primary">Lab Reports</h1>
        <p className="text-xs text-txt-muted mt-0.5">{counts.Pending} pending • {counts.Completed} completed{counts.Critical > 0 ? ` • ${counts.Critical} critical` : ''}</p>
      </div>

      {counts.Critical > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
          <AlertTriangle className="w-4 h-4 text-accent-red shrink-0 mt-0.5 animate-pulse" />
          <p className="text-xs text-txt-secondary">
            <span className="font-black text-accent-red">{counts.Critical} critical result{counts.Critical > 1 ? 's' : ''}</span> require your immediate attention. Please contact your doctor.
          </p>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted" />
        <input type="text" placeholder="Search lab reports..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-dark-section border border-white/[0.08] rounded-xl text-xs text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-accent-emerald/50 transition-colors"
        />
      </div>

      <div className="flex items-center gap-1 p-1 bg-dark-section rounded-xl border border-white/[0.08]">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all duration-150
              ${tab === t ? (t === 'Critical' ? 'bg-accent-red text-white shadow-lg shadow-rose-500/20' : 'bg-accent-emerald text-white shadow-lg shadow-emerald-500/20') : 'text-txt-muted hover:text-txt-primary hover:bg-dark-hover'}`}>
            {t}
            {counts[t] > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${tab === t ? 'bg-white/20 text-white' : 'bg-dark-card text-txt-muted'}`}>
                {counts[t]}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <FlaskConical className="w-12 h-12 text-txt-muted/30 mb-3" />
          <p className="font-black text-sm text-txt-primary">No lab reports found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(lab => <LabCard key={lab.id} lab={lab} onClick={() => setSelected(lab)} />)}
        </div>
      )}
    </div>
  );
};

export default PatientLabReports;
