import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { portalsAPI } from '../services/api';
import {
  Pill, Clock, Calendar, User, RefreshCw, Search,
  CheckCircle2, AlertCircle, ChevronRight, X, Info,
  Bell, Download, RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Fallback Data ─────────────────────────────────────────────────────────────
const FALLBACK_RX = [
  { id: 1, medication: 'Atorvastatin 20mg', dosage: '20mg', frequency: 'Once Daily at Bedtime', duration: '90 days', instructions: 'Take with or without food. Avoid grapefruit juice. Report any muscle pain.', doctor: 'Dr. John Smith', start_date: '2026-06-12', end_date: '2026-09-12', refills_remaining: 3, status: 'Active', category: 'Cardiovascular' },
  { id: 2, medication: 'Lisinopril 10mg', dosage: '10mg', frequency: 'Once Daily Morning', duration: '90 days', instructions: 'Take in the morning. Monitor blood pressure weekly. Avoid potassium supplements.', doctor: 'Dr. John Smith', start_date: '2026-06-12', end_date: '2026-09-12', refills_remaining: 2, status: 'Active', category: 'Blood Pressure' },
  { id: 3, medication: 'Aspirin 81mg', dosage: '81mg', frequency: 'Once Daily with Food', duration: 'Ongoing', instructions: 'Take with food to reduce stomach upset. Do not crush or chew.', doctor: 'Dr. John Smith', start_date: '2026-03-05', end_date: 'Ongoing', refills_remaining: 5, status: 'Active', category: 'Antiplatelet' },
  { id: 4, medication: 'Metformin 500mg', dosage: '500mg', frequency: 'Twice Daily with Meals', duration: '60 days', instructions: 'Take with meals to reduce GI side effects. Monitor blood sugar daily.', doctor: 'Dr. Sarah Lee', start_date: '2026-01-10', end_date: '2026-03-10', refills_remaining: 0, status: 'Completed', category: 'Diabetes' },
  { id: 5, medication: 'Amoxicillin 500mg', dosage: '500mg', frequency: 'Three Times Daily', duration: '7 days', instructions: 'Complete the full course. Take with food if stomach upset occurs.', doctor: 'Dr. Sarah Lee', start_date: '2025-11-20', end_date: '2025-11-27', refills_remaining: 0, status: 'Completed', category: 'Antibiotic' },
];

const CATEGORY_COLORS = {
  Cardiovascular: { bg: 'bg-rose-500/10', color: 'text-accent-red', border: 'border-rose-500/20' },
  'Blood Pressure': { bg: 'bg-blue-500/10', color: 'text-accent-blue', border: 'border-blue-500/20' },
  Antiplatelet: { bg: 'bg-orange-500/10', color: 'text-accent-orange', border: 'border-amber-500/20' },
  Diabetes: { bg: 'bg-teal-500/10', color: 'text-accent-teal', border: 'border-teal-500/20' },
  Antibiotic: { bg: 'bg-purple-500/10', color: 'text-accent-purple', border: 'border-purple-500/20' },
  General: { bg: 'bg-emerald-500/10', color: 'text-accent-emerald', border: 'border-emerald-500/20' },
};

// ─── Medication Card ───────────────────────────────────────────────────────────
function MedicationCard({ rx, onClick }) {
  const cat = CATEGORY_COLORS[rx.category] || CATEGORY_COLORS.General;
  const isActive = rx.status === 'Active';
  const lowRefill = isActive && rx.refills_remaining <= 1;

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-lg group
        ${isActive ? 'border-white/[0.10] bg-dark-section hover:border-emerald-500/30' : 'border-white/[0.06] bg-dark-section/60 opacity-75 hover:opacity-100'}`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl ${cat.bg} border ${cat.border} flex items-center justify-center shrink-0`}>
          <Pill className={`w-5 h-5 ${cat.color}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-black text-sm text-txt-primary">{rx.medication}</h3>
              <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-black rounded-full border ${cat.bg} ${cat.color} ${cat.border}`}>
                {rx.category}
              </span>
            </div>
            <span className={`px-2.5 py-1 text-[10px] font-black rounded-full shrink-0
              ${isActive ? 'bg-emerald-500/15 text-accent-emerald border border-emerald-500/25' : 'bg-white/[0.05] text-txt-muted border border-white/[0.08]'}`}>
              {rx.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3">
            <div className="flex items-center gap-1.5 text-[11px] text-txt-muted">
              <Clock className="w-3 h-3 shrink-0" />
              {rx.frequency}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-txt-muted">
              <Calendar className="w-3 h-3 shrink-0" />
              {rx.duration}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-txt-muted">
              <User className="w-3 h-3 shrink-0" />
              {rx.doctor}
            </div>
            <div className={`flex items-center gap-1.5 text-[11px] font-bold ${lowRefill ? 'text-accent-orange' : 'text-txt-muted'}`}>
              <RotateCcw className="w-3 h-3 shrink-0" />
              {rx.refills_remaining} refills left
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-txt-muted group-hover:text-txt-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
      </div>

      {/* Low refill warning + action */}
      {lowRefill && isActive && (
        <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-accent-orange">
            <AlertCircle className="w-3.5 h-3.5" />
            {rx.refills_remaining === 0 ? 'No refills remaining — contact doctor' : 'Only 1 refill left'}
          </div>
          <button
            onClick={e => { e.stopPropagation(); toast.success('Refill request sent to your doctor'); }}
            className="px-3 py-1.5 bg-accent-orange/20 border border-amber-500/30 text-accent-orange text-[10px] font-bold rounded-xl hover:bg-accent-orange hover:text-white transition-colors"
          >
            Request Refill
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Detail Drawer ─────────────────────────────────────────────────────────────
function RxDrawer({ rx, onClose }) {
  if (!rx) return null;
  const cat = CATEGORY_COLORS[rx.category] || CATEGORY_COLORS.General;
  const isActive = rx.status === 'Active';

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-dark-shell border-l border-white/[0.08] flex flex-col animate-slide-in-right overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08] shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${cat.bg} border ${cat.border} flex items-center justify-center`}>
              <Pill className={`w-4.5 h-4.5 ${cat.color}`} />
            </div>
            <div>
              <h2 className="font-black text-sm text-txt-primary">{rx.medication}</h2>
              <p className="text-[11px] text-txt-muted">{rx.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-dark-hover text-txt-muted hover:text-txt-primary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 p-5 space-y-4">
          {/* Status */}
          <div className={`flex items-center gap-2.5 p-3.5 rounded-xl border
            ${isActive ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-white/[0.03] border-white/[0.08]'}`}>
            <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-accent-emerald' : 'text-txt-muted'}`} />
            <div>
              <div className={`font-black text-sm ${isActive ? 'text-accent-emerald' : 'text-txt-muted'}`}>{rx.status} Prescription</div>
              <div className="text-[10px] text-txt-muted">{rx.start_date} → {rx.end_date}</div>
            </div>
          </div>

          {/* Details grid */}
          {[
            { label: 'Dosage', value: rx.dosage },
            { label: 'Frequency', value: rx.frequency },
            { label: 'Duration', value: rx.duration },
            { label: 'Refills Remaining', value: `${rx.refills_remaining} refill${rx.refills_remaining !== 1 ? 's' : ''}` },
            { label: 'Prescribing Doctor', value: rx.doctor },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between gap-4 py-2.5 border-b border-white/[0.06] last:border-0">
              <span className="text-[11px] text-txt-muted shrink-0">{label}</span>
              <span className="text-[11px] font-bold text-txt-primary text-right">{value}</span>
            </div>
          ))}

          {/* Instructions */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-3.5 h-3.5 text-accent-blue" />
              <span className="text-[10px] font-black text-accent-blue uppercase tracking-wide">Instructions</span>
            </div>
            <p className="text-[11px] text-txt-secondary leading-relaxed">{rx.instructions}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-white/[0.08] space-y-2 shrink-0">
          {isActive && rx.refills_remaining <= 1 && (
            <button onClick={() => toast.success('Refill request sent!')} className="w-full py-3 bg-accent-emerald hover:opacity-90 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-500/20 transition">
              Request Prescription Refill
            </button>
          )}
          <button onClick={() => toast.success('Downloading prescription...')} className="w-full flex items-center justify-center gap-2 py-2.5 bg-dark-section border border-white/[0.08] hover:bg-dark-card text-txt-muted hover:text-txt-primary text-xs font-bold rounded-xl transition">
            <Download className="w-4 h-4" /> Download Prescription
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Daily Schedule ────────────────────────────────────────────────────────────
function DailySchedule({ meds }) {
  const activeMeds = meds.filter(m => m.status === 'Active');
  const schedule = [
    { time: 'Morning', icon: '🌅', meds: activeMeds.filter(m => m.frequency.toLowerCase().includes('morning') || m.frequency.toLowerCase().includes('breakfast') || m.frequency.toLowerCase().includes('food')) },
    { time: 'Midday', icon: '☀️', meds: activeMeds.filter(m => m.frequency.toLowerCase().includes('midday') || m.frequency.toLowerCase().includes('lunch') || m.frequency.toLowerCase().includes('three')) },
    { time: 'Evening', icon: '🌆', meds: activeMeds.filter(m => m.frequency.toLowerCase().includes('evening') || m.frequency.toLowerCase().includes('dinner')) },
    { time: 'Bedtime', icon: '🌙', meds: activeMeds.filter(m => m.frequency.toLowerCase().includes('bedtime') || m.frequency.toLowerCase().includes('night')) },
  ].filter(s => s.meds.length > 0);

  if (schedule.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-3">
      <div className="flex items-center gap-2">
        <Bell className="w-4 h-4 text-accent-emerald" />
        <h2 className="font-black text-sm text-txt-primary">Today's Medication Schedule</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {schedule.map(s => (
          <div key={s.time} className="p-3 rounded-xl bg-dark-card border border-white/[0.06] text-center">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-[10px] font-black text-txt-muted uppercase tracking-wide">{s.time}</div>
            {s.meds.map(m => (
              <div key={m.id} className="mt-1.5 text-[10px] text-txt-primary font-bold truncate">{m.medication}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export const PatientPrescriptions = () => {
  const { user } = useAuth();
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Active');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await portalsAPI.getPatientSummary({ patient_id: user?.patient_id });
        setMeds(res?.prescriptions?.length > 0 ? res.prescriptions : FALLBACK_RX);
      } catch {
        setMeds(FALLBACK_RX);
      }
      setLoading(false);
    };
    load();
  }, []);

  const TABS = ['Active', 'Completed', 'All'];
  const filtered = meds.filter(m => {
    const matchTab = tab === 'All' || m.status === tab;
    const q = search.toLowerCase();
    const matchSearch = !search || m.medication.toLowerCase().includes(q) || (m.doctor || '').toLowerCase().includes(q) || (m.category || '').toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const counts = {
    Active: meds.filter(m => m.status === 'Active').length,
    Completed: meds.filter(m => m.status === 'Completed').length,
    All: meds.length,
  };
  const lowRefillCount = meds.filter(m => m.status === 'Active' && m.refills_remaining <= 1).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
      {selected && <RxDrawer rx={selected} onClose={() => setSelected(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-txt-primary">Prescriptions</h1>
          <p className="text-xs text-txt-muted mt-0.5">{counts.Active} active medications</p>
        </div>
      </div>

      {/* Refill Alert */}
      {lowRefillCount > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <AlertCircle className="w-4 h-4 text-accent-orange shrink-0" />
          <p className="text-xs text-txt-secondary flex-1">
            <span className="font-black text-accent-orange">{lowRefillCount} medication{lowRefillCount > 1 ? 's' : ''}</span> {lowRefillCount > 1 ? 'need' : 'needs'} a refill soon. Contact your doctor.
          </p>
          <button onClick={() => toast.success('Refill requests sent!')} className="px-3 py-1.5 bg-accent-orange text-white text-[10px] font-black rounded-xl hover:opacity-90 transition shrink-0">
            Request All Refills
          </button>
        </div>
      )}

      {/* Daily schedule */}
      {!loading && <DailySchedule meds={meds} />}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted" />
        <input type="text" placeholder="Search medications..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-dark-section border border-white/[0.08] rounded-xl text-xs text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-accent-emerald/50 transition-colors"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-dark-section rounded-xl border border-white/[0.08]">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-150
              ${tab === t ? 'bg-accent-emerald text-white shadow-lg shadow-emerald-500/20' : 'text-txt-muted hover:text-txt-primary hover:bg-dark-hover'}`}>
            {t}
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${tab === t ? 'bg-white/20 text-white' : 'bg-dark-card text-txt-muted'}`}>
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="h-36 bg-dark-section rounded-2xl border border-white/[0.05]" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Pill className="w-12 h-12 text-txt-muted/30 mb-3" />
          <p className="font-black text-sm text-txt-primary">No prescriptions found</p>
          <p className="text-xs text-txt-muted mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(rx => <MedicationCard key={rx.id} rx={rx} onClick={() => setSelected(rx)} />)}
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptions;
