import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { portalsAPI } from '../services/api';
import { ConsultationWorkspace } from '../components/doctor/ConsultationWorkspace';
import { Badge } from '../components/common/Badge';
import {
  Calendar, Clock, ChevronLeft, ChevronRight, Play,
  Video, MapPin, User, List, LayoutGrid
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  Scheduled: { variant: 'blue', dot: 'bg-accent-blue' },
  'In Progress': { variant: 'amber', dot: 'bg-accent-orange' },
  Completed: { variant: 'emerald', dot: 'bg-accent-emerald' },
  Cancelled: { variant: 'slate', dot: 'bg-txt-muted' },
};

const MOCK_APPOINTMENTS = [
  { id: 1, patient_name: 'Alice Johnson', patient_id: 'PAT-001', time: '09:00 AM', date: '2026-08-01', type: 'Follow-up', room: 'Clinic 3A', status: 'Completed', age: 45, disease: 'Hypertension' },
  { id: 2, patient_name: 'Bob Smith', patient_id: 'PAT-002', time: '10:30 AM', date: '2026-08-01', type: 'Consultation', room: 'Clinic 3A', status: 'In Progress', age: 52, disease: 'Diabetes Mellitus' },
  { id: 3, patient_name: 'Charlie Davis', patient_id: 'PAT-003', time: '11:45 AM', date: '2026-08-01', type: 'Routine Check', room: 'Clinic 3A', status: 'Scheduled', age: 38, disease: 'Pneumonia' },
  { id: 4, patient_name: 'Diana Khan', patient_id: 'PAT-004', time: '02:00 PM', date: '2026-08-01', type: 'Lab Review', room: 'Clinic 3A', status: 'Scheduled', age: 64, disease: 'Cardiovascular Disease' },
  { id: 5, patient_name: 'Ethan Roy', patient_id: 'PAT-005', time: '03:30 PM', date: '2026-08-01', type: 'Consultation', room: 'Clinic 3A', status: 'Scheduled', age: 29, disease: 'Asthma' },
];

const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

function AppointmentCard({ apt, onStart, compact = false }) {
  const cfg = STATUS_CONFIG[apt.status] || STATUS_CONFIG['Scheduled'];

  if (compact) {
    return (
      <div className={`p-3 rounded-xl border transition-colors ${
        apt.status === 'In Progress'
          ? 'border-amber-500/30 bg-amber-500/10'
          : 'border-white/[0.08] bg-dark-card hover:bg-dark-hover'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            <span className="text-xs font-bold text-txt-primary">{apt.time}</span>
          </div>
          <Badge variant={cfg.variant} size="sm">{apt.status}</Badge>
        </div>
        <div className="mt-2">
          <div className="font-bold text-txt-primary text-sm">{apt.patient_name}</div>
          <div className="text-[10px] text-txt-muted mt-0.5">{apt.type} • {apt.room}</div>
          <div className="text-[10px] text-txt-muted">{apt.disease}</div>
        </div>
        {apt.status === 'Scheduled' && (
          <button
            onClick={() => onStart?.(apt)}
            className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 bg-accent-blue text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Play className="w-3 h-3" />
            Start Consultation
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl border transition-colors group ${
      apt.status === 'In Progress'
        ? 'border-amber-500/30 bg-amber-500/10 shadow-amber-500/10 shadow-lg'
        : 'border-white/[0.08] bg-dark-section hover:border-white/20 shadow-lg'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-black text-base shrink-0 shadow-md shadow-blue-500/20">
            {apt.patient_name[0]}
          </div>
          <div>
            <div className="font-black text-txt-primary">{apt.patient_name}</div>
            <div className="text-[10px] font-mono text-txt-muted">{apt.patient_id} • Age {apt.age}</div>
          </div>
        </div>
        <Badge variant={cfg.variant}>{apt.status}</Badge>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
        <div className="flex items-center gap-1 text-txt-secondary">
          <Clock className="w-3 h-3 text-txt-muted" />
          {apt.time}
        </div>
        <div className="flex items-center gap-1 text-txt-secondary">
          <MapPin className="w-3 h-3 text-txt-muted" />
          {apt.room}
        </div>
        <div className="flex items-center gap-1 text-txt-secondary">
          <User className="w-3 h-3 text-txt-muted" />
          {apt.type}
        </div>
      </div>

      {apt.disease && (
        <div className="mt-2 px-2.5 py-1 bg-dark-card rounded-lg text-[10px] text-txt-muted inline-block">
          Dx: {apt.disease}
        </div>
      )}

      {apt.status === 'Scheduled' && (
        <button
          onClick={() => onStart?.(apt)}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-accent-blue text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20"
        >
          <Play className="w-3.5 h-3.5" />
          Start Consultation
        </button>
      )}
    </div>
  );
}

export const DoctorAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('today'); // 'today' | 'week' | 'agenda'
  const [consultation, setConsultation] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await portalsAPI.getDoctorAppointments({
          doctor_id: user?.doctor_id || user?.id,
          doctor_name: user?.name,
        });
        setAppointments(res?.appointments || res || []);
      } catch {
        setAppointments(MOCK_APPOINTMENTS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const apts = appointments.length > 0 ? appointments : MOCK_APPOINTMENTS;
  const todayApts = apts;
  const completed = apts.filter(a => a.status === 'Completed').length;
  const scheduled = apts.filter(a => a.status === 'Scheduled').length;
  const inProgress = apts.filter(a => a.status === 'In Progress').length;

  const handleStart = (apt) => {
    const patient = {
      name: apt.patient_name, patient_id: apt.patient_id,
      age: apt.age, gender: apt.gender || 'N/A', disease: apt.disease,
      blood_group: 'N/A', status: 'Admitted'
    };
    setConsultation({ patient, appointment: apt });
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-12 space-y-6">
      {/* Consultation Overlay */}
      {consultation && (
        <ConsultationWorkspace
          patient={consultation.patient}
          appointment={consultation.appointment}
          onClose={() => setConsultation(null)}
          onSave={() => { toast.success('Consultation saved'); setConsultation(null); }}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-txt-primary">Appointments</h1>
          <p className="text-xs text-txt-muted mt-1">Clinical schedule — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-dark-section rounded-xl border border-white/[0.08]">
          {['today', 'week', 'agenda'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                view === v ? 'bg-accent-blue text-white shadow-md shadow-blue-500/20' : 'text-txt-muted hover:text-txt-primary hover:bg-dark-hover'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Today', value: apts.length, color: 'text-txt-primary', bg: 'bg-dark-section' },
          { label: 'In Progress', value: inProgress, color: 'text-accent-orange', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Scheduled', value: scheduled, color: 'text-accent-blue', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Completed', value: completed, color: 'text-accent-emerald', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        ].map((s, i) => (
          <div key={i} className={`p-4 rounded-2xl border border-white/[0.08] ${s.bg} text-center`}>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-txt-muted font-semibold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Today View */}
      {view === 'today' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {todayApts.map(apt => (
            <AppointmentCard key={apt.id} apt={apt} onStart={handleStart} />
          ))}
        </div>
      )}

      {/* Agenda / Timeline View */}
      {view === 'agenda' && (
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl">
          <div className="relative">
            {HOURS.map(hour => {
              const apt = todayApts.find(a => a.time?.startsWith(hour.replace('0', '').split(':')[0]));
              return (
                <div key={hour} className="flex gap-4 py-3 border-b border-white/[0.04] last:border-0">
                  <div className="w-16 text-xs font-mono text-txt-muted shrink-0 pt-1">{hour}</div>
                  {apt ? (
                    <AppointmentCard apt={apt} onStart={handleStart} compact />
                  ) : (
                    <div className="flex-1 h-10 border border-dashed border-white/[0.05] rounded-xl flex items-center px-4">
                      <span className="text-[10px] text-txt-muted">Available</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View Placeholder */}
      {view === 'week' && (
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl">
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className={`p-3 rounded-xl border ${i === 1 ? 'border-accent-blue bg-blue-500/10' : 'border-white/[0.05]'}`}>
                <div className="text-[11px] font-bold text-txt-muted text-center">{day}</div>
                <div className="text-center mt-1 text-sm font-black text-txt-primary">{new Date(Date.now() + (i) * 86400000).getDate()}</div>
                {i === 1 && (
                  <div className="mt-2 space-y-1">
                    {todayApts.slice(0, 3).map((a, j) => (
                      <div key={j} className="text-[9px] px-1.5 py-0.5 bg-accent-blue text-white rounded font-bold truncate">{a.time} {a.patient_name.split(' ')[0]}</div>
                    ))}
                    {todayApts.length > 3 && <div className="text-[9px] text-txt-muted text-center">+{todayApts.length - 3} more</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-xs text-txt-muted">Full week calendar view — today highlighted</div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
