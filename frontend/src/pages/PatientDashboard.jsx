import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { portalsAPI } from '../services/api';
import {
  Calendar, Heart, Pill, FlaskConical, CreditCard, Activity,
  Clock, ArrowRight, ChevronRight, Stethoscope, Bell,
  Sparkles, TrendingUp, TrendingDown, AlertCircle, CheckCircle2,
  RefreshCw, Shield, MessageSquare, FileText, User, Droplets,
  Thermometer, Weight, Zap, Eye, Wind
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function PatientSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-28 bg-dark-section rounded-2xl border border-white/[0.05]" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-dark-section rounded-2xl border border-white/[0.05]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-dark-section rounded-2xl border border-white/[0.05]" />
        <div className="h-80 bg-dark-section rounded-2xl border border-white/[0.05]" />
      </div>
    </div>
  );
}

// ─── Health Score Ring ────────────────────────────────────────────────────────
function HealthScoreRing({ score = 82 }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444';
  const label = score >= 80 ? 'Good' : score >= 60 ? 'Fair' : 'Needs Attention';

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} strokeWidth="8" stroke="#1E293B" fill="none" />
          <circle
            cx="48" cy="48" r={radius} strokeWidth="8"
            stroke={color} fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-txt-primary leading-none">{score}</span>
          <span className="text-[9px] text-txt-muted font-bold">/ 100</span>
        </div>
      </div>
      <span className="text-[10px] font-bold" style={{ color }}>{label}</span>
    </div>
  );
}

// ─── KPI Health Card ──────────────────────────────────────────────────────────
function HealthKpiCard({ icon: Icon, title, value, sub, accent, onClick, badge }) {
  return (
    <div
      onClick={onClick}
      className={`relative p-4 rounded-2xl border border-white/[0.08] bg-dark-section cursor-pointer
        hover:border-white/[0.15] hover:bg-dark-card transition-all duration-200 group overflow-hidden`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${accent.replace('from-', 'bg-').split(' ')[0].replace('bg-', 'bg-').replace('/30', '/15')}`}>
            <Icon className="w-4.5 h-4.5" style={{ color: 'var(--accent)' }} />
          </div>
          {badge && (
            <span className="px-1.5 py-0.5 bg-emerald-500/20 text-accent-emerald text-[9px] font-black rounded-full border border-emerald-500/20">
              {badge}
            </span>
          )}
        </div>
        <div className="text-lg font-black text-txt-primary leading-none">{value}</div>
        <div className="text-[10px] font-bold text-txt-muted mt-0.5 truncate">{title}</div>
        {sub && <div className="text-[10px] text-txt-disabled mt-1 truncate">{sub}</div>}
      </div>
    </div>
  );
}

// ─── Upcoming Appointment Card ────────────────────────────────────────────────
function UpcomingAppointmentCard({ appointments = [], onNavigate }) {
  const next = appointments[0] || null;

  if (!next) return (
    <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-black text-sm text-txt-primary">Upcoming Appointment</div>
        <button onClick={onNavigate} className="text-[11px] text-accent-emerald font-bold flex items-center gap-1 hover:opacity-80">
          Book <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Calendar className="w-10 h-10 text-txt-muted/30 mb-2" />
        <p className="text-xs text-txt-muted">No upcoming appointments</p>
        <button onClick={onNavigate} className="mt-3 px-4 py-2 bg-accent-emerald text-white text-xs font-bold rounded-xl hover:opacity-90 transition">
          Book Appointment
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-5 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-black text-sm text-txt-primary">Next Appointment</div>
        <button onClick={onNavigate} className="text-[11px] text-accent-emerald font-bold flex items-center gap-1 hover:opacity-80">
          View All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-accent-emerald/10 border border-emerald-500/30 flex flex-col items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-accent-emerald">
            {new Date(next.date || next.appointment_date || Date.now()).toLocaleDateString('en-US', { month: 'short' })}
          </span>
          <span className="text-xl font-black text-accent-emerald leading-none">
            {new Date(next.date || next.appointment_date || Date.now()).getDate()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-txt-primary text-sm">{next.doctor || next.doctor_name || 'Assigned Doctor'}</div>
          <div className="text-xs text-txt-muted mt-0.5">{next.department || 'General Medicine'}</div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 text-[11px] text-txt-secondary">
              <Clock className="w-3 h-3" />
              {next.time || next.time_slot || '10:00 AM'}
            </div>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full
              ${(next.status || '').toLowerCase() === 'completed' ? 'bg-emerald-500/20 text-accent-emerald' : 'bg-blue-500/20 text-accent-blue'}`}>
              {next.status || 'Scheduled'}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={onNavigate}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-accent-emerald hover:opacity-90 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-500/20"
      >
        <Calendar className="w-3.5 h-3.5" />
        View Appointment Details
      </button>
    </div>
  );
}

// ─── Medication Reminder Widget ───────────────────────────────────────────────
function MedicationWidget({ prescriptions = [], onNavigate }) {
  const meds = prescriptions.length > 0 ? prescriptions : [
    { medication: 'Atorvastatin 20mg', dosage: 'Once Daily at Bedtime', doctor: 'Assigned Doctor', refills_remaining: 3 },
    { medication: 'Lisinopril 10mg', dosage: 'Once Daily Morning', doctor: 'Assigned Doctor', refills_remaining: 2 },
  ];

  const times = ['8:00 AM', '1:00 PM', '8:00 PM'];

  return (
    <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pill className="w-4 h-4 text-accent-emerald" />
          <div className="font-black text-sm text-txt-primary">Medication Reminders</div>
        </div>
        <button onClick={onNavigate} className="text-[11px] text-accent-emerald font-bold flex items-center gap-1">
          View All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-2">
        {meds.slice(0, 3).map((med, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-dark-card border border-white/[0.06] hover:border-emerald-500/20 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Pill className="w-4 h-4 text-accent-emerald" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-txt-primary text-xs truncate">{med.medication}</div>
              <div className="text-[10px] text-txt-muted">{med.dosage}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] font-mono text-accent-emerald">{times[i] || '8:00 AM'}</div>
              <div className="text-[9px] text-txt-muted">{med.refills_remaining} refills</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Recent Lab Results Widget ────────────────────────────────────────────────
function LabResultsWidget({ onNavigate }) {
  const labs = [
    { name: 'Comprehensive Metabolic Panel', date: 'Today', status: 'Pending', critical: false },
    { name: 'Complete Blood Count (CBC)', date: 'Yesterday', status: 'Completed', critical: false },
    { name: 'HbA1c Level', date: '3 days ago', status: 'Completed', critical: false },
  ];

  return (
    <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-accent-purple" />
          <div className="font-black text-sm text-txt-primary">Recent Lab Results</div>
        </div>
        <button onClick={onNavigate} className="text-[11px] text-accent-emerald font-bold flex items-center gap-1">
          View All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-2">
        {labs.map((lab, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-dark-card border border-white/[0.06] hover:border-purple-500/20 transition-colors cursor-pointer">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
              ${lab.status === 'Pending' ? 'bg-amber-500/15 text-accent-orange' : 'bg-emerald-500/15 text-accent-emerald'}`}>
              <FlaskConical className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-txt-primary text-xs truncate">{lab.name}</div>
              <div className="text-[10px] text-txt-muted">{lab.date}</div>
            </div>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0
              ${lab.status === 'Pending' ? 'bg-amber-500/20 text-accent-orange' : 'bg-emerald-500/20 text-accent-emerald'}`}>
              {lab.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Health Vitals Widget ─────────────────────────────────────────────────────
function HealthVitalsWidget() {
  const vitals = [
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Activity, color: 'text-accent-blue', bg: 'bg-blue-500/10', status: 'Normal' },
    { label: 'Heart Rate', value: '72', unit: 'bpm', icon: Heart, color: 'text-accent-red', bg: 'bg-rose-500/10', status: 'Normal' },
    { label: 'Blood Sugar', value: '98', unit: 'mg/dL', icon: Droplets, color: 'text-accent-orange', bg: 'bg-amber-500/10', status: 'Normal' },
    { label: 'Oxygen Level', value: '98', unit: '%', icon: Wind, color: 'text-accent-teal', bg: 'bg-teal-500/10', status: 'Normal' },
  ];

  return (
    <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-3">
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-accent-emerald" />
        <div className="font-black text-sm text-txt-primary">Today's Health Vitals</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {vitals.map((v, i) => {
          const Icon = v.icon;
          return (
            <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl ${v.bg} border border-white/[0.05]`}>
              <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${v.color}`} />
              <div className="min-w-0">
                <div className="text-[10px] text-txt-muted">{v.label}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-black text-txt-primary">{v.value}</span>
                  <span className="text-[9px] text-txt-muted">{v.unit}</span>
                </div>
                <span className="text-[9px] font-bold text-accent-emerald">{v.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── AI Health Suggestions ────────────────────────────────────────────────────
function AIHealthSuggestions({ onNavigate }) {
  const suggestions = [
    { icon: Pill, color: 'text-accent-emerald', bg: 'bg-emerald-500/10', text: 'Medication reminder: Atorvastatin due tonight at 8:00 PM.', type: 'Reminder' },
    { icon: Calendar, color: 'text-accent-blue', bg: 'bg-blue-500/10', text: 'Your next check-up is in 3 days. Prepare your health questions.', type: 'Appointment' },
    { icon: Activity, color: 'text-accent-orange', bg: 'bg-amber-500/10', text: '30 minutes of light walking daily can improve your cardiovascular health.', type: 'Wellness' },
    { icon: Droplets, color: 'text-accent-teal', bg: 'bg-teal-500/10', text: 'Stay hydrated: Aim for 8 glasses of water today.', type: 'Lifestyle' },
  ];

  return (
    <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="font-black text-sm text-txt-primary">AI Health Assistant</div>
            <div className="text-[10px] text-txt-muted">Personalized suggestions</div>
          </div>
        </div>
        <button onClick={onNavigate} className="text-[11px] text-accent-emerald font-bold flex items-center gap-1">
          Open <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-2">
        {suggestions.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl ${s.bg} border border-white/[0.05]`}>
              <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${s.color}`} />
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold text-txt-muted uppercase tracking-wide">{s.type} • </span>
                <span className="text-[11px] text-txt-secondary leading-relaxed">{s.text}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-txt-disabled italic px-1">
        ⚠ AI-generated suggestions. Not a substitute for professional medical advice.
      </p>
    </div>
  );
}

// ─── Recent Medical Activity ──────────────────────────────────────────────────
function RecentActivityWidget({ onNavigate }) {
  const activities = [
    { icon: Stethoscope, label: 'Consultation completed', sub: 'Dr. John Smith • Cardiology', time: '2 days ago', color: 'text-accent-blue', bg: 'bg-blue-500/10' },
    { icon: FlaskConical, label: 'Lab report uploaded', sub: 'CBC + Metabolic Panel', time: '3 days ago', color: 'text-accent-purple', bg: 'bg-purple-500/10' },
    { icon: Pill, label: 'Prescription renewed', sub: 'Atorvastatin 20mg', time: '1 week ago', color: 'text-accent-emerald', bg: 'bg-emerald-500/10' },
    { icon: FileText, label: 'Discharge summary added', sub: 'Metro General Hospital', time: '2 weeks ago', color: 'text-accent-orange', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-black text-sm text-txt-primary">Recent Medical Activity</div>
        <button onClick={onNavigate} className="text-[11px] text-accent-emerald font-bold flex items-center gap-1">
          View Records <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="relative">
        <div className="absolute left-[18px] top-0 bottom-0 w-px bg-white/[0.06]" />
        <div className="space-y-3">
          {activities.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className="flex items-start gap-3 pl-1">
                <div className={`w-9 h-9 rounded-lg ${a.bg} flex items-center justify-center shrink-0 z-10 border border-white/[0.06]`}>
                  <Icon className={`w-4 h-4 ${a.color}`} />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="font-bold text-txt-primary text-xs">{a.label}</div>
                  <div className="text-[10px] text-txt-muted">{a.sub}</div>
                </div>
                <div className="text-[10px] text-txt-disabled shrink-0 pt-1">{a.time}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Billing Summary ──────────────────────────────────────────────────────────
function BillingSummaryWidget({ billing = [], onNavigate }) {
  const pending = billing.filter(b => b.status !== 'PAID').length;
  const totalPending = billing.filter(b => b.status !== 'PAID').reduce((s, b) => s + (b.patient_paid || b.amount || 0), 0);

  return (
    <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-accent-orange" />
          <div className="font-black text-sm text-txt-primary">Billing & Insurance</div>
        </div>
        <button onClick={onNavigate} className="text-[11px] text-accent-emerald font-bold flex items-center gap-1">
          View All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      {pending > 0 ? (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-accent-orange" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-txt-primary text-sm">${totalPending.toLocaleString()} due</div>
            <div className="text-[11px] text-txt-muted">{pending} pending payment{pending > 1 ? 's' : ''}</div>
          </div>
          <button onClick={onNavigate} className="px-3 py-1.5 bg-accent-orange text-white text-xs font-bold rounded-xl hover:opacity-90 transition">
            Pay Now
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4">
          <CheckCircle2 className="w-5 h-5 text-accent-emerald shrink-0" />
          <div>
            <div className="font-bold text-txt-primary text-sm">All bills paid</div>
            <div className="text-[11px] text-txt-muted">No outstanding balance</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Patient Dashboard ───────────────────────────────────────────────────
export const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const patientId = user?.patient_id;
  const patientName = user?.name || 'Patient';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await portalsAPI.getPatientSummary({ patient_id: patientId, email: user?.email });
      setData(res);
    } catch (err) {
      console.error('Patient dashboard load error', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    toast.success('Health data refreshed');
  };

  if (loading) return (
    <div className="max-w-[1600px] mx-auto">
      <PatientSkeleton />
    </div>
  );

  const profile = data?.profile || {};
  const appointments = data?.appointments || [];
  const prescriptions = data?.prescriptions || [];
  const billing = data?.billing_history || [];
  const medHistory = data?.medical_history || [];
  const notifications = data?.notifications || [];

  const upcomingApts = appointments.filter(a => a.status?.toLowerCase() !== 'completed' && a.status?.toLowerCase() !== 'cancelled');
  const activeRx = prescriptions.filter(p => !p.status || p.status === 'Active');
  const pendingLabs = 1; // derive from data when available
  const pendingBills = billing.filter(b => b.status !== 'PAID').length;
  const healthScore = 82;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">

      {/* ── Greeting Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-500/30">
              {patientName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent-emerald border-2 border-dark-section flex items-center justify-center">
              <span className="text-[8px] font-black text-white">✓</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-txt-primary">{patientName}</h1>
              <span className="px-2 py-0.5 bg-emerald-500/15 text-accent-emerald text-[10px] font-black rounded-full border border-emerald-500/20 font-mono">
                {profile.patient_id || user?.patient_id || 'PAT-000'}
              </span>
              <span className="px-2 py-0.5 bg-dark-card text-txt-muted text-[10px] font-bold rounded-full border border-white/[0.08]">
                {profile.blood_type || profile.blood_group || 'Blood Type N/A'}
              </span>
            </div>
            <p className="text-xs text-txt-muted mt-1">
              {profile.primary_hospital || profile.hospital_name || 'Healthcare Facility'} •{' '}
              {profile.attending_doctor || profile.doctor_name || 'Assigned Doctor'} •{' '}
              {today}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {profile.disease && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-dark-card text-txt-muted text-[10px] rounded-lg border border-white/[0.08]">
                  <Stethoscope className="w-2.5 h-2.5" /> {profile.disease}
                </span>
              )}
              <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-accent-emerald text-[10px] rounded-lg border border-emerald-500/20">
                <Shield className="w-2.5 h-2.5" /> Insured
              </span>
            </div>
          </div>
        </div>

        {/* Health Score + Actions */}
        <div className="flex items-center gap-4 self-start md:self-auto">
          <HealthScoreRing score={healthScore} />
          <div className="flex flex-col gap-2">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 py-2 border border-white/[0.08] text-txt-muted hover:text-txt-primary hover:bg-dark-hover rounded-xl text-xs font-bold transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => navigate('/patient/appointments')}
              className="flex items-center gap-2 px-3 py-2 bg-accent-emerald text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition"
            >
              <Calendar className="w-3.5 h-3.5" />
              My Appointments
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-600/20 to-emerald-500/5 cursor-pointer hover:border-emerald-500/40 transition group"
          onClick={() => navigate('/patient/appointments')}>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center mb-3">
            <Calendar className="w-4.5 h-4.5 text-accent-emerald" />
          </div>
          <div className="text-2xl font-black text-accent-emerald">{upcomingApts.length || 1}</div>
          <div className="text-[10px] font-bold text-txt-muted mt-0.5">Upcoming Appts</div>
          <div className="text-[10px] text-txt-disabled mt-0.5">
            {upcomingApts[0] ? `Next: ${upcomingApts[0].date || upcomingApts[0].appointment_date || 'Soon'}` : 'View schedule'}
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/15 to-blue-500/5 cursor-pointer hover:border-blue-500/40 transition group"
          onClick={() => navigate('/patient/profile')}>
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center mb-3">
            <Stethoscope className="w-4.5 h-4.5 text-accent-blue" />
          </div>
          <div className="text-base font-black text-accent-blue leading-tight truncate">
            {(profile.attending_doctor || profile.doctor_name || 'Dr. Assigned').split(' ').slice(0, 2).join(' ')}
          </div>
          <div className="text-[10px] font-bold text-txt-muted mt-0.5">Assigned Doctor</div>
          <div className="text-[10px] text-txt-disabled mt-0.5">{profile.department || 'General Medicine'}</div>
        </div>

        <div className="p-4 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-600/15 to-purple-500/5 cursor-pointer hover:border-purple-500/40 transition group"
          onClick={() => navigate('/patient/prescriptions')}>
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center mb-3">
            <Pill className="w-4.5 h-4.5 text-accent-purple" />
          </div>
          <div className="text-2xl font-black text-accent-purple">{prescriptions.length || 2}</div>
          <div className="text-[10px] font-bold text-txt-muted mt-0.5">Active Prescriptions</div>
          <div className="text-[10px] text-txt-disabled mt-0.5">Tap to view all</div>
        </div>

        <div className="p-4 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-600/15 to-amber-500/5 cursor-pointer hover:border-amber-500/40 transition group"
          onClick={() => navigate('/patient/lab-reports')}>
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center mb-3">
            <FlaskConical className="w-4.5 h-4.5 text-accent-orange" />
          </div>
          <div className="text-2xl font-black text-accent-orange">{pendingLabs}</div>
          <div className="text-[10px] font-bold text-txt-muted mt-0.5">Pending Lab Reports</div>
          <div className="text-[10px] text-txt-disabled mt-0.5">Awaiting results</div>
        </div>

        <div className={`p-4 rounded-2xl border cursor-pointer transition group
          ${pendingBills > 0
            ? 'border-rose-500/20 bg-gradient-to-br from-rose-600/15 to-rose-500/5 hover:border-rose-500/40'
            : 'border-emerald-500/20 bg-gradient-to-br from-emerald-600/10 to-emerald-500/5 hover:border-emerald-500/40'
          }`}
          onClick={() => navigate('/patient/billing')}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3
            ${pendingBills > 0 ? 'bg-rose-500/15' : 'bg-emerald-500/15'}`}>
            <CreditCard className={`w-4.5 h-4.5 ${pendingBills > 0 ? 'text-accent-red' : 'text-accent-emerald'}`} />
          </div>
          <div className={`text-2xl font-black ${pendingBills > 0 ? 'text-accent-red' : 'text-accent-emerald'}`}>
            {pendingBills > 0 ? pendingBills : '✓'}
          </div>
          <div className="text-[10px] font-bold text-txt-muted mt-0.5">Outstanding Bills</div>
          <div className="text-[10px] text-txt-disabled mt-0.5">{pendingBills > 0 ? 'Payment due' : 'All cleared'}</div>
        </div>

        <div className="p-4 rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-600/15 to-teal-500/5 cursor-pointer hover:border-teal-500/40 transition group"
          onClick={() => navigate('/patient/my-health')}>
          <div className="w-9 h-9 rounded-xl bg-teal-500/15 flex items-center justify-center mb-3">
            <Activity className="w-4.5 h-4.5 text-accent-teal" />
          </div>
          <div className="text-2xl font-black text-accent-teal">{healthScore}</div>
          <div className="text-[10px] font-bold text-txt-muted mt-0.5">Health Score</div>
          <div className="text-[10px] text-accent-emerald mt-0.5">Good condition</div>
        </div>
      </div>

      {/* ── Row 2: Appointment + Health Vitals ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingAppointmentCard appointments={upcomingApts} onNavigate={() => navigate('/patient/appointments')} />
        </div>
        <HealthVitalsWidget />
      </div>

      {/* ── Row 3: Medications + Lab Results ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MedicationWidget prescriptions={prescriptions} onNavigate={() => navigate('/patient/prescriptions')} />
        <LabResultsWidget onNavigate={() => navigate('/patient/lab-reports')} />
      </div>

      {/* ── Row 4: AI Suggestions + Recent Activity + Billing ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AIHealthSuggestions onNavigate={() => navigate('/patient/ai-assistant')} />
        <RecentActivityWidget onNavigate={() => navigate('/patient/records')} />
        <BillingSummaryWidget billing={billing} onNavigate={() => navigate('/patient/billing')} />
      </div>

      {/* ── Notifications ── */}
      {notifications.length > 0 && (
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-accent-emerald" />
              <div className="font-black text-sm text-txt-primary">Recent Notifications</div>
            </div>
            <button onClick={() => navigate('/patient/notifications')} className="text-[11px] text-accent-emerald font-bold flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            {notifications.slice(0, 3).map((n, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-dark-card border border-white/[0.06]">
                <div className="w-2 h-2 rounded-full bg-accent-emerald mt-1.5 shrink-0 animate-pulse" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-txt-primary text-xs">{n.title}</div>
                  <div className="text-[11px] text-txt-muted mt-0.5">{n.message}</div>
                </div>
                <div className="text-[10px] text-txt-disabled shrink-0">{n.created_at || 'Now'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientDashboard;
