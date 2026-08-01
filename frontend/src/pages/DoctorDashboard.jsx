import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { portalsAPI } from '../services/api';
import { KpiCard } from '../components/common/KpiCard';
import { PatientSummaryCard } from '../components/doctor/PatientSummaryCard';
import { ConsultationWorkspace } from '../components/doctor/ConsultationWorkspace';
import {
  Calendar, Users, CheckCircle2, FlaskConical, AlertTriangle,
  MessageSquare, Clock, Stethoscope, Activity, ArrowRight,
  Bell, Play, Sparkles, TrendingUp, Heart, RefreshCw,
  UserPlus, Pill, ChevronRight
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import toast from 'react-hot-toast';

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
function DoctorSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-24 bg-dark-section rounded-2xl border border-white/[0.05]" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-dark-section rounded-2xl border border-white/[0.05]" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 bg-dark-section rounded-2xl border border-white/[0.05]" />
        <div className="h-72 bg-dark-section rounded-2xl border border-white/[0.05]" />
      </div>
    </div>
  );
}

// ─── Today's Schedule Timeline ────────────────────────────────────────────────
function ScheduleTimeline({ appointments, onStartConsultation }) {
  const STATUS_CONFIG = {
    Scheduled: { badge: 'blue', dot: 'bg-accent-blue' },
    'In Progress': { badge: 'amber', dot: 'bg-accent-orange' },
    Completed: { badge: 'emerald', dot: 'bg-accent-emerald' },
    Cancelled: { badge: 'slate', dot: 'bg-txt-muted' },
  };

  const defaultApts = [
    { id: 1, patient_name: 'Alice Johnson', time: '09:00 AM', type: 'Follow-up', room: 'Clinic 3A', status: 'Completed', patient_id: 'PAT-001' },
    { id: 2, patient_name: 'Bob Smith', time: '10:30 AM', type: 'Consultation', room: 'Clinic 3A', status: 'In Progress', patient_id: 'PAT-002' },
    { id: 3, patient_name: 'Charlie Davis', time: '11:45 AM', type: 'Routine Check', room: 'Clinic 3A', status: 'Scheduled', patient_id: 'PAT-003' },
    { id: 4, patient_name: 'Diana Khan', time: '02:00 PM', type: 'Lab Review', room: 'Clinic 3A', status: 'Scheduled', patient_id: 'PAT-004' },
    { id: 5, patient_name: 'Ethan Roy', time: '03:30 PM', type: 'Consultation', room: 'Clinic 3A', status: 'Scheduled', patient_id: 'PAT-005' },
  ];

  const items = appointments?.length > 0 ? appointments : defaultApts;

  return (
    <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="font-black text-sm text-txt-primary">Today's Schedule</div>
        <div className="flex items-center gap-1.5 text-[10px] text-accent-blue font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
          {items.filter(a => a.status === 'In Progress').length} Active
        </div>
      </div>
      <div className="relative">
        <div className="absolute left-[5.5rem] top-0 bottom-0 w-px bg-white/[0.06]" />
        <div className="space-y-3">
          {items.map((apt) => {
            const cfg = STATUS_CONFIG[apt.status] || STATUS_CONFIG['Scheduled'];
            return (
              <div key={apt.id} className={`flex items-center gap-4 p-3 rounded-xl border transition-all group ${
                apt.status === 'In Progress' 
                  ? 'border-amber-500/30 bg-amber-500/10' 
                  : 'border-transparent hover:border-white/[0.08] hover:bg-dark-card'
              }`}>
                <div className="w-20 shrink-0 text-right">
                  <span className="text-[11px] font-mono font-bold text-txt-secondary">{apt.time}</span>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${cfg.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-txt-primary text-xs">{apt.patient_name}</div>
                  <div className="text-[10px] text-txt-muted">{apt.type} • {apt.room}</div>
                </div>
                <Badge variant={cfg.badge} size="sm">{apt.status}</Badge>
                {apt.status === 'Scheduled' && (
                  <button
                    onClick={() => onStartConsultation?.(apt)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-accent-blue text-white text-[10px] font-bold rounded-lg shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-colors shrink-0"
                  >
                    <Play className="w-3 h-3" />
                    Start
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── AI Clinical Insights Widget ──────────────────────────────────────────────
function AiInsightsWidget() {
  const insights = [
    { type: 'warning', icon: AlertTriangle, color: 'text-accent-orange', bg: 'bg-amber-500/10 border-amber-500/20', text: "Bob Smith's HbA1c elevated (8.2%). Consider adjusting Metformin dosage." },
    { type: 'alert', icon: Heart, color: 'text-accent-red', bg: 'bg-rose-500/10 border-rose-500/20', text: 'Alice Johnson: Diastolic BP trend increasing. Schedule cardiac review within 7 days.' },
    { type: 'info', icon: FlaskConical, color: 'text-accent-blue', bg: 'bg-blue-500/10 border-blue-500/20', text: '3 lab reports pending your review from yesterday. Abnormal values flagged.' },
    { type: 'success', icon: CheckCircle2, color: 'text-accent-emerald', bg: 'bg-emerald-500/10 border-emerald-500/20', text: "Charlie Davis's Pneumonia resolved. Consider step-down therapy today." },
  ];

  return (
    <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-md shadow-purple-500/20">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <div className="font-black text-sm text-txt-primary">AI Clinical Insights</div>
          <div className="text-[10px] text-txt-muted">Gemini analysis — today's patient roster</div>
        </div>
      </div>
      <div className="space-y-2">
        {insights.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl border ${item.bg}`}>
              <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${item.color}`} />
              <p className="text-[11px] text-txt-secondary leading-relaxed">{item.text}</p>
            </div>
          );
        })}
      </div>
      <button
        className="mt-3 text-xs text-accent-blue font-bold hover:text-blue-400 flex items-center gap-1 transition-colors"
        onClick={() => {}}
      >
        Full AI Clinical Analysis <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Patient Queue Widget ─────────────────────────────────────────────────────
function PatientQueueWidget({ patients, onSelectPatient }) {
  const defaultQueue = [
    { id: 1, name: 'Bob Smith', patient_id: 'PAT-002', disease: 'Diabetes Mellitus', age: 52, gender: 'Male', status: 'Waiting', blood_group: 'B+', wait: '12 min', risk_level: 'High' },
    { id: 2, name: 'Charlie Davis', patient_id: 'PAT-003', disease: 'Pneumonia', age: 38, gender: 'Male', status: 'Waiting', blood_group: 'O+', wait: '34 min', risk_level: 'Medium' },
    { id: 3, name: 'Diana Khan', patient_id: 'PAT-004', disease: 'Hypertension', age: 64, gender: 'Female', status: 'Waiting', blood_group: 'A+', wait: '1h 5m', risk_level: 'Low' },
  ];

  const queue = (patients?.length > 0 ? patients : defaultQueue).slice(0, 4);

  return (
    <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="font-black text-sm text-txt-primary">Patient Queue</div>
        <Badge variant="amber">{queue.length} Waiting</Badge>
      </div>
      <div className="space-y-2">
        {queue.map(p => (
          <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-dark-card border border-white/[0.08] hover:bg-dark-hover cursor-pointer transition-colors group" onClick={() => onSelectPatient?.(p)}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md shadow-blue-500/20">
              {p.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-txt-primary text-xs">{p.name}</div>
              <div className="text-[10px] text-txt-muted truncate">{p.disease}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] text-txt-muted font-mono">Wait: {p.wait}</div>
              <Badge variant={p.risk_level === 'High' ? 'red' : p.risk_level === 'Medium' ? 'amber' : 'emerald'} size="sm">{p.risk_level}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Critical Alerts Widget ───────────────────────────────────────────────────
function CriticalAlertsWidget() {
  const alerts = [
    { patient: 'Alice Johnson', type: 'Lab Critical', msg: 'Potassium: 5.8 mEq/L — Hyperkalemia. Urgent action required.', time: '8m ago' },
    { patient: 'Ethan Roy', type: 'Vital Alert', msg: 'SpO2 dropping: 91% — Respiratory distress suspected.', time: '22m ago' },
  ];

  return (
    <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-accent-red" />
        <div className="font-black text-sm text-accent-red">Critical Alerts</div>
        <div className="ml-auto w-2 h-2 rounded-full bg-accent-red animate-pulse" />
      </div>
      <div className="space-y-3">
        {alerts.map((a, i) => (
          <div key={i} className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-rose-300">{a.patient}</span>
              <span className="text-[10px] text-txt-muted font-mono">{a.time}</span>
            </div>
            <Badge variant="red" size="sm">{a.type}</Badge>
            <p className="mt-1 text-rose-300/80 leading-relaxed">{a.msg}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Recent Lab Reports Widget ────────────────────────────────────────────────
function RecentLabsWidget({ onNavigate }) {
  const reports = [
    { id: 1, patient: 'Alice Johnson', test: 'CBC + Metabolic Panel', date: 'Today', status: 'Pending Review', hasAbnormal: true },
    { id: 2, patient: 'Bob Smith', test: 'HbA1c + Lipid Panel', date: 'Yesterday', status: 'Pending Review', hasAbnormal: true },
    { id: 3, patient: 'Charlie Davis', test: 'Chest X-Ray', date: 'Yesterday', status: 'Reviewed', hasAbnormal: false },
  ];

  return (
    <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="font-black text-sm text-txt-primary">Lab Reports</div>
        <button onClick={onNavigate} className="text-xs text-accent-blue font-bold hover:text-blue-400 flex items-center gap-1">View All <ArrowRight className="w-3.5 h-3.5" /></button>
      </div>
      <div className="space-y-2">
        {reports.map(r => (
          <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-dark-card border border-white/[0.08] hover:bg-dark-hover cursor-pointer transition-colors">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${r.hasAbnormal ? 'bg-rose-500/15 text-accent-red' : 'bg-emerald-500/15 text-accent-emerald'}`}>
              <FlaskConical className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-txt-primary text-xs">{r.patient}</div>
              <div className="text-[10px] text-txt-muted">{r.test}</div>
            </div>
            <div className="text-right shrink-0">
              <Badge variant={r.status === 'Reviewed' ? 'emerald' : 'amber'} size="sm">{r.status === 'Reviewed' ? 'Reviewed' : 'Pending'}</Badge>
              <div className="text-[10px] text-txt-muted mt-1">{r.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Doctor Dashboard ────────────────────────────────────────────────────
export const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const doctorId = user?.doctor_id || user?.id;
  const doctorName = user?.name || 'Doctor';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await portalsAPI.getDoctorDashboard({ doctor_id: doctorId, doctor_name: doctorName });
      setData(res);
    } catch (err) {
      console.error('Doctor dashboard load error', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStartConsultation = (appointment) => {
    // Find patient matching appointment
    const patient = data?.assigned_patients?.find(p => 
      p.name === appointment.patient_name || p.id === appointment.patient_id
    ) || { 
      name: appointment.patient_name, 
      patient_id: appointment.patient_id,
      age: 45, gender: 'N/A', disease: 'General Consultation',
      blood_group: 'N/A'
    };
    setActiveConsultation({ patient, appointment });
  };

  const handleSaveConsultation = async (consultData) => {
    toast.success('Consultation saved successfully');
    setActiveConsultation(null);
  };

  if (loading) return (
    <div className="max-w-[1600px] mx-auto">
      <DoctorSkeleton />
    </div>
  );

  const profile = data?.doctor_profile || {};
  const appointments = data?.today_schedule || [];
  const patients = data?.assigned_patients || [];
  const notifications = data?.notifications || [];

  const todayApts = appointments.length > 0 ? appointments.length : 5;
  const completedApts = appointments.filter(a => a.status === 'Completed').length || 1;
  const waitingPatients = appointments.filter(a => a.status === 'Scheduled').length || 3;

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-12">

      {/* Active Consultation Overlay */}
      {activeConsultation && (
        <ConsultationWorkspace
          patient={activeConsultation.patient}
          appointment={activeConsultation.appointment}
          onClose={() => setActiveConsultation(null)}
          onSave={handleSaveConsultation}
        />
      )}

      {/* Doctor Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/20 shrink-0">
            {doctorName[0] || 'D'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-black text-txt-primary">{doctorName}</h1>
              <Badge variant="blue">{profile.doc_id || user?.doc_id || 'DOC-000'}</Badge>
              <Badge variant="emerald">On Duty</Badge>
            </div>
            <p className="text-xs text-txt-muted mt-1">
              {profile.specialization || user?.specialization || 'Cardiology'} •{' '}
              {profile.hospital_name || user?.hospital_name || 'Metro General Hospital'} •{' '}
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setRefreshing(true); fetchData(); }}
            className="p-2 rounded-xl text-txt-muted hover:text-txt-primary hover:bg-dark-hover border border-white/[0.08] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/doctor/appointments')}
            className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            View Full Schedule
          </button>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard
          title="Today's Appointments"
          value={todayApts}
          icon={Calendar}
          iconBg="bg-blue-500/10" iconColor="text-accent-blue"
          trend="up" change={`${completedApts} Done`}
          sparkline={[3,4,5,4,6,5,todayApts]} sparkColor="#3b82f6"
          accentGradient="from-blue-500/40 via-blue-500/10 to-transparent"
          onClick={() => navigate('/doctor/appointments')}
        />
        <KpiCard
          title="Waiting Patients"
          value={waitingPatients}
          icon={Users}
          iconBg="bg-amber-500/10" iconColor="text-accent-orange"
          trend="neutral" change="In Queue"
          sparkline={[2,3,3,4,3,3,waitingPatients]} sparkColor="#f59e0b"
          accentGradient="from-amber-500/40 via-amber-500/10 to-transparent"
          onClick={() => navigate('/doctor/patients')}
        />
        <KpiCard
          title="Completed"
          value={completedApts}
          icon={CheckCircle2}
          iconBg="bg-emerald-500/10" iconColor="text-accent-emerald"
          trend="up" change="Today"
          sparkline={[0,1,1,2,2,2,completedApts]} sparkColor="#10b981"
          accentGradient="from-emerald-500/40 via-emerald-500/10 to-transparent"
          valueColor="text-accent-emerald"
        />
        <KpiCard
          title="Pending Lab Reviews"
          value={3}
          icon={FlaskConical}
          iconBg="bg-purple-500/10" iconColor="text-accent-purple"
          trend="down" change="2 Critical"
          sparkline={[5,4,3,4,3,4,3]} sparkColor="#8b5cf6"
          accentGradient="from-purple-500/40 via-purple-500/10 to-transparent"
          onClick={() => navigate('/doctor/laboratory')}
        />
        <KpiCard
          title="Critical Patients"
          value={2}
          icon={AlertTriangle}
          iconBg="bg-rose-500/10" iconColor="text-accent-red"
          trend="up" change="Alert Active"
          sparkline={[1,0,1,1,2,1,2]} sparkColor="#ef4444"
          accentGradient="from-rose-500/40 via-rose-500/10 to-transparent"
          valueColor="text-accent-red"
        />
        <KpiCard
          title="Unread Messages"
          value={notifications.length > 0 ? notifications.length : 4}
          icon={MessageSquare}
          iconBg="bg-teal-500/10" iconColor="text-accent-teal"
          trend="neutral" change="New"
          sparkline={[2,3,4,3,5,4,4]} sparkColor="#14b8a6"
          accentGradient="from-teal-500/40 via-teal-500/10 to-transparent"
          onClick={() => navigate('/doctor/messages')}
        />
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule (2 cols wide) */}
        <div className="lg:col-span-2">
          <ScheduleTimeline appointments={appointments} onStartConsultation={handleStartConsultation} />
        </div>
        {/* Patient Queue */}
        <PatientQueueWidget patients={patients} onSelectPatient={(p) => navigate('/doctor/patients')} />
      </div>

      {/* ── AI Insights + Critical Alerts + Labs ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AiInsightsWidget />
        <CriticalAlertsWidget />
        <RecentLabsWidget onNavigate={() => navigate('/doctor/laboratory')} />
      </div>

      {/* ── Assigned Patients Summary ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-black text-txt-primary">Assigned Patient Roster</h2>
            <p className="text-[11px] text-txt-muted mt-0.5">Role-isolated to your JWT — {patients.length > 0 ? patients.length : 'No'} patients assigned</p>
          </div>
          <button onClick={() => navigate('/doctor/patients')} className="text-xs text-accent-blue font-bold hover:text-blue-400 flex items-center gap-1">
            Full Patient List <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(patients.length > 0 ? patients.slice(0, 6) : [
            { id: 1, name: 'Alice Johnson', patient_id: 'PAT-001', disease: 'Hypertension', age: 45, gender: 'Female', status: 'Admitted', blood_group: 'O+', risk_level: 'Medium' },
            { id: 2, name: 'Bob Smith', patient_id: 'PAT-002', disease: 'Diabetes Mellitus', age: 52, gender: 'Male', status: 'Admitted', blood_group: 'B+', risk_level: 'High' },
            { id: 3, name: 'Charlie Davis', patient_id: 'PAT-003', disease: 'Pneumonia', age: 38, gender: 'Male', status: 'Recovering', blood_group: 'A+', risk_level: 'Medium' },
          ]).map(p => (
            <PatientSummaryCard
              key={p.id || p.patient_id}
              patient={p}
              onClick={() => navigate('/doctor/patients')}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default DoctorDashboard;
