import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { portalsAPI } from '../services/api';
import {
  Calendar, Clock, MapPin, Stethoscope, ChevronRight, X,
  Video, Phone, RefreshCw, AlertCircle, CheckCircle2,
  XCircle, Search, Filter, Plus, User, Building2,
  RotateCcw, ArrowRight, Clipboard
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Status Config ─────────────────────────────────────────────────────────────
const STATUS = {
  Upcoming:  { color: 'text-accent-blue',    bg: 'bg-blue-500/15',    border: 'border-blue-500/30',    icon: Clock },
  Scheduled: { color: 'text-accent-blue',    bg: 'bg-blue-500/15',    border: 'border-blue-500/30',    icon: Clock },
  Confirmed: { color: 'text-accent-emerald', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', icon: CheckCircle2 },
  Completed: { color: 'text-txt-muted',      bg: 'bg-white/[0.05]',   border: 'border-white/[0.08]',   icon: CheckCircle2 },
  Cancelled: { color: 'text-accent-red',     bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    icon: XCircle },
  Pending:   { color: 'text-accent-orange',  bg: 'bg-amber-500/15',   border: 'border-amber-500/30',   icon: AlertCircle },
};

const DEPT_COLORS = {
  Cardiology: 'text-rose-400',
  Neurology: 'text-purple-400',
  Orthopedics: 'text-amber-400',
  Pediatrics: 'text-teal-400',
  General: 'text-accent-blue',
  Medicine: 'text-accent-blue',
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function AptSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-32 bg-dark-section rounded-2xl border border-white/[0.05]" />
      ))}
    </div>
  );
}

// ─── Appointment Detail Drawer ────────────────────────────────────────────────
function AppointmentDrawer({ appointment: apt, onClose }) {
  if (!apt) return null;
  const cfg = STATUS[apt.status] || STATUS.Upcoming;
  const StatusIcon = cfg.icon;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-dark-shell border-l border-white/[0.08] flex flex-col animate-slide-in-right overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08] shrink-0">
          <div>
            <h2 className="font-black text-sm text-txt-primary">Appointment Details</h2>
            <p className="text-[11px] text-txt-muted mt-0.5 font-mono">{apt.id || apt.appointment_id || 'APT-000'}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-dark-hover text-txt-muted hover:text-txt-primary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 space-y-5">
          {/* Status Banner */}
          <div className={`flex items-center gap-2.5 p-3.5 rounded-xl border ${cfg.bg} ${cfg.border}`}>
            <StatusIcon className={`w-4 h-4 shrink-0 ${cfg.color}`} />
            <div>
              <div className={`font-black text-sm ${cfg.color}`}>{apt.status}</div>
              <div className="text-[10px] text-txt-muted">Appointment status</div>
            </div>
          </div>

          {/* Date/Time */}
          <div className="p-4 rounded-xl bg-dark-section border border-white/[0.08] space-y-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-txt-muted">Schedule</div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent-emerald/10 border border-emerald-500/20 flex flex-col items-center justify-center shrink-0">
                <span className="text-[9px] font-bold text-accent-emerald uppercase">
                  {new Date(apt.date || apt.appointment_date || Date.now()).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="text-lg font-black text-accent-emerald leading-none">
                  {new Date(apt.date || apt.appointment_date || Date.now()).getDate()}
                </span>
              </div>
              <div>
                <div className="font-bold text-txt-primary text-sm">
                  {new Date(apt.date || apt.appointment_date || Date.now()).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-txt-muted">
                  <Clock className="w-3.5 h-3.5" />
                  {apt.time || apt.time_slot || '10:00 AM'}
                </div>
              </div>
            </div>
          </div>

          {/* Doctor */}
          <div className="p-4 rounded-xl bg-dark-section border border-white/[0.08] space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-txt-muted">Physician</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-black text-base shrink-0">
                {(apt.doctor || apt.doctor_name || 'D')[0]}
              </div>
              <div>
                <div className="font-bold text-txt-primary text-sm">{apt.doctor || apt.doctor_name || 'Assigned Doctor'}</div>
                <div className="text-[11px] text-txt-muted">{apt.department || 'General Medicine'}</div>
              </div>
            </div>
          </div>

          {/* Hospital */}
          <div className="p-4 rounded-xl bg-dark-section border border-white/[0.08]">
            <div className="text-[10px] font-black uppercase tracking-widest text-txt-muted mb-2">Facility</div>
            <div className="flex items-center gap-2 text-sm text-txt-primary">
              <Building2 className="w-4 h-4 text-txt-muted shrink-0" />
              <span className="font-bold">{apt.hospital || apt.hospital_name || 'Metro General Hospital'}</span>
            </div>
          </div>

          {/* Reason */}
          {apt.reason && (
            <div className="p-4 rounded-xl bg-dark-section border border-white/[0.08]">
              <div className="text-[10px] font-black uppercase tracking-widest text-txt-muted mb-2">Reason / Notes</div>
              <p className="text-xs text-txt-secondary leading-relaxed">{apt.reason}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-white/[0.08] space-y-2 shrink-0">
          {(apt.status === 'Upcoming' || apt.status === 'Scheduled' || apt.status === 'Confirmed') && (
            <>
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-accent-emerald hover:opacity-90 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-500/20 transition">
                <Video className="w-4 h-4" />
                Join Online Consultation
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-1.5 py-2.5 bg-dark-section border border-white/[0.08] hover:bg-dark-card text-txt-muted hover:text-txt-primary text-xs font-bold rounded-xl transition">
                  <RotateCcw className="w-3.5 h-3.5" /> Reschedule
                </button>
                <button
                  onClick={() => { toast.error('Cancellation requires 24h notice'); onClose(); }}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-accent-red text-xs font-bold rounded-xl transition"
                >
                  <XCircle className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            </>
          )}
          {apt.status === 'Completed' && (
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-dark-section border border-white/[0.08] hover:bg-dark-card text-txt-muted hover:text-txt-primary text-xs font-bold rounded-xl transition">
              <Clipboard className="w-4 h-4" /> View Clinical Notes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Appointment Card ─────────────────────────────────────────────────────────
function AppointmentCard({ appointment: apt, onClick }) {
  const cfg = STATUS[apt.status] || STATUS.Upcoming;
  const StatusIcon = cfg.icon;
  const deptColor = DEPT_COLORS[apt.department] || 'text-accent-blue';

  const aptDate = new Date(apt.date || apt.appointment_date || Date.now());
  const isToday = aptDate.toDateString() === new Date().toDateString();
  const isTomorrow = aptDate.toDateString() === new Date(Date.now() + 86400000).toDateString();
  const dateLabel = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : aptDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 group hover:shadow-lg
        ${cfg.border} ${cfg.bg} hover:scale-[1.01]`}
    >
      <div className="flex items-start gap-4">
        {/* Date Widget */}
        <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 border
          ${apt.status === 'Cancelled' ? 'bg-dark-card border-white/[0.08]' : 'bg-accent-emerald/10 border-emerald-500/20'}`}>
          <span className="text-[9px] font-black uppercase text-accent-emerald">
            {aptDate.toLocaleDateString('en-US', { month: 'short' })}
          </span>
          <span className={`text-xl font-black leading-none ${apt.status === 'Cancelled' ? 'text-txt-muted' : 'text-accent-emerald'}`}>
            {aptDate.getDate()}
          </span>
        </div>

        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-txt-primary">{apt.doctor || apt.doctor_name || 'Assigned Doctor'}</h3>
                {isToday && <span className="px-1.5 py-0.5 bg-accent-emerald text-white text-[9px] font-black rounded-full animate-pulse">TODAY</span>}
              </div>
              <div className={`text-xs font-bold mt-0.5 ${deptColor}`}>{apt.department || 'General Medicine'}</div>
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black shrink-0 ${cfg.color} ${cfg.bg} ${cfg.border}`}>
              <StatusIcon className="w-3 h-3" />
              {apt.status}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
            <div className="flex items-center gap-1 text-[11px] text-txt-muted">
              <Clock className="w-3 h-3" />
              {dateLabel} at {apt.time || apt.time_slot || '10:00 AM'}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-txt-muted">
              <Building2 className="w-3 h-3" />
              {apt.hospital || apt.hospital_name || 'Metro General'}
            </div>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-txt-muted group-hover:text-txt-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
      </div>

      {/* Quick Actions */}
      {(apt.status === 'Upcoming' || apt.status === 'Scheduled' || apt.status === 'Confirmed') && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.06]">
          <button
            onClick={e => { e.stopPropagation(); toast.success('Joining consultation...'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-emerald hover:opacity-90 text-white text-[11px] font-bold rounded-xl shadow-md shadow-emerald-500/20 transition"
          >
            <Video className="w-3.5 h-3.5" /> Join Consultation
          </button>
          <button
            onClick={e => { e.stopPropagation(); onClick(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-card border border-white/[0.08] hover:bg-dark-hover text-txt-muted hover:text-txt-primary text-[11px] font-bold rounded-xl transition"
          >
            View Details <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ tab }) {
  const msgs = {
    Upcoming: { icon: Calendar, title: 'No upcoming appointments', sub: 'Book an appointment with your doctor to get started.' },
    Past: { icon: CheckCircle2, title: 'No past appointments', sub: 'Your completed appointments will appear here.' },
    Cancelled: { icon: XCircle, title: 'No cancelled appointments', sub: "You haven't cancelled any appointments." },
  };
  const m = msgs[tab] || msgs.Upcoming;
  const Icon = m.icon;
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-dark-section border border-white/[0.08] flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-txt-muted/40" />
      </div>
      <h3 className="font-black text-sm text-txt-primary">{m.title}</h3>
      <p className="text-xs text-txt-muted mt-1 max-w-xs">{m.sub}</p>
      {tab === 'Upcoming' && (
        <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-accent-emerald text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition">
          <Plus className="w-3.5 h-3.5" /> Book Appointment
        </button>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export const PatientAppointments = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const TABS = ['Upcoming', 'Past', 'Cancelled'];

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await portalsAPI.getPatientSummary({ patient_id: user?.patient_id, email: user?.email });
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const allApts = data?.appointments || [
    { id: 'APT-001', doctor: 'Dr. John Smith', department: 'Cardiology', hospital: 'Metro General Hospital', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '10:30 AM', status: 'Upcoming', reason: 'Routine cardiac follow-up' },
    { id: 'APT-002', doctor: 'Dr. Sarah Lee', department: 'General Medicine', hospital: 'Metro General Hospital', date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], time: '2:00 PM', status: 'Scheduled', reason: 'Annual wellness check' },
    { id: 'APT-003', doctor: 'Dr. John Smith', department: 'Cardiology', hospital: 'Metro General Hospital', date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0], time: '9:00 AM', status: 'Completed', reason: 'Hypertension management' },
    { id: 'APT-004', doctor: 'Dr. Priya Nair', department: 'Neurology', hospital: 'City Medical Center', date: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0], time: '11:00 AM', status: 'Completed', reason: 'Migraine consultation' },
    { id: 'APT-005', doctor: 'Dr. Alan Raj', department: 'Orthopedics', hospital: 'Metro General Hospital', date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], time: '3:30 PM', status: 'Cancelled', reason: 'Knee pain evaluation' },
  ];

  const filterApts = (tab) => {
    const isUpcoming = a => ['Upcoming', 'Scheduled', 'Confirmed'].includes(a.status);
    const isPast = a => a.status === 'Completed';
    const isCancelled = a => a.status === 'Cancelled';

    let filtered;
    if (tab === 'Upcoming') filtered = allApts.filter(isUpcoming);
    else if (tab === 'Past') filtered = allApts.filter(isPast);
    else filtered = allApts.filter(isCancelled);

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(a =>
        (a.doctor || a.doctor_name || '').toLowerCase().includes(q) ||
        (a.department || '').toLowerCase().includes(q) ||
        (a.hospital || a.hospital_name || '').toLowerCase().includes(q)
      );
    }
    return filtered;
  };

  const upcomingCount = allApts.filter(a => ['Upcoming', 'Scheduled', 'Confirmed'].includes(a.status)).length;
  const pastCount = allApts.filter(a => a.status === 'Completed').length;
  const cancelledCount = allApts.filter(a => a.status === 'Cancelled').length;
  const counts = { Upcoming: upcomingCount, Past: pastCount, Cancelled: cancelledCount };

  const displayed = filterApts(activeTab);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
      {selected && <AppointmentDrawer appointment={selected} onClose={() => setSelected(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-txt-primary">Appointments</h1>
          <p className="text-xs text-txt-muted mt-0.5">{upcomingCount} upcoming • {pastCount} completed</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setRefreshing(true); fetchData(); }}
            className="p-2 rounded-xl border border-white/[0.08] bg-dark-section text-txt-muted hover:text-txt-primary hover:bg-dark-card transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent-emerald text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition">
            <Plus className="w-3.5 h-3.5" /> Book Appointment
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted" />
        <input
          type="text"
          placeholder="Search by doctor, department, or hospital..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-dark-section border border-white/[0.08] rounded-xl text-xs text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-accent-emerald/50 transition-colors"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-dark-section rounded-xl border border-white/[0.08]">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-150
              ${activeTab === tab
                ? 'bg-accent-emerald text-white shadow-lg shadow-emerald-500/20'
                : 'text-txt-muted hover:text-txt-primary hover:bg-dark-hover'
              }`}
          >
            {tab}
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black
              ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-dark-card text-txt-muted'}`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {loading ? <AptSkeleton /> : (
        displayed.length === 0
          ? <EmptyState tab={activeTab} />
          : (
            <div className="space-y-3">
              {displayed.map((apt, i) => (
                <AppointmentCard key={apt.id || i} appointment={apt} onClick={() => setSelected(apt)} />
              ))}
            </div>
          )
      )}
    </div>
  );
};

export default PatientAppointments;
