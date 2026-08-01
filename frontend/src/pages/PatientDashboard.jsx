import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { portalsAPI } from '../services/api';
import { Badge } from '../components/common/Badge';
import {
  Calendar, Pill, FileText, Activity, CreditCard, HeartPulse,
  Droplets, Wind, Thermometer, ArrowRight, ShieldCheck, Clock
} from 'lucide-react';

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
function PatientSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-24 bg-dark-section rounded-2xl border border-white/[0.05]" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-dark-section rounded-2xl border border-white/[0.05]" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-72 bg-dark-section rounded-2xl border border-white/[0.05]" />
        <div className="h-72 bg-dark-section rounded-2xl border border-white/[0.05]" />
      </div>
    </div>
  );
}

function VitalChip({ icon: Icon, label, value, unit, color }) {
  return (
    <div className="p-3 bg-dark-card rounded-xl border border-white/[0.06] flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color} bg-current/10 shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="text-[10px] text-txt-muted uppercase font-bold">{label}</div>
        <div className="text-sm font-black text-txt-primary">
          {value} <span className="text-[10px] font-normal text-txt-muted">{unit}</span>
        </div>
      </div>
    </div>
  );
}

export const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await portalsAPI.getPatientSummary({ email: user?.email, patient_id: user?.patient_id });
        setData(res);
      } catch (err) {
        console.error('Patient dashboard load error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="max-w-[1400px] mx-auto"><PatientSkeleton /></div>;

  const profile = data?.profile || {
    name: user?.name || 'Alice Johnson',
    patient_id: user?.patient_id || 'PAT-001',
    primary_hospital: 'Metro General Hospital',
    attending_doctor: 'Dr. Sarah Wilson'
  };

  const appointments = data?.appointments || [
    { id: 1, doctor: 'Dr. Sarah Wilson', department: 'Cardiology', date: '2026-08-05', time: '10:00 AM', status: 'Upcoming' },
  ];

  const prescriptions = data?.prescriptions || [
    { medication: 'Amlodipine', dosage: '5mg', doctor: 'Dr. Sarah Wilson', refills_remaining: 2 },
    { medication: 'Atorvastatin', dosage: '20mg', doctor: 'Dr. Sarah Wilson', refills_remaining: 1 },
  ];

  return (
    <div className="max-w-[1400px] mx-auto pb-12 space-y-6">
      
      {/* ── Patient Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-emerald-500/20 shrink-0">
            {profile?.name?.[0] || 'P'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-txt-primary">Welcome, {profile.name}</h1>
              <Badge variant="emerald">{profile.patient_id}</Badge>
            </div>
            <div className="flex items-center gap-4 mt-1.5 text-xs text-txt-secondary">
              <div className="flex items-center gap-1.5"><HeartPulse className="w-3.5 h-3.5 text-accent-emerald" /> {profile.primary_hospital}</div>
              <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-txt-muted" /> Insured Active</div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/patient/appointments')} className="px-4 py-2 bg-accent-emerald text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors">
            Book Appointment
          </button>
        </div>
      </div>

      {/* ── Quick Stats Vitals ── */}
      <div>
        <h2 className="text-sm font-black text-txt-primary mb-3">Latest Vitals <span className="text-[10px] text-txt-muted font-normal ml-2">Recorded: Today</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <VitalChip icon={Activity} label="Blood Pressure" value="122/80" unit="mmHg" color="text-accent-blue" />
          <VitalChip icon={HeartPulse} label="Heart Rate" value="72" unit="bpm" color="text-accent-red" />
          <VitalChip icon={Wind} label="SpO2" value="98" unit="%" color="text-accent-emerald" />
          <VitalChip icon={Thermometer} label="Temperature" value="98.6" unit="°F" color="text-accent-orange" />
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Appointments Widget */}
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent-blue" />
              <h3 className="font-black text-sm text-txt-primary">Appointments</h3>
            </div>
            <button onClick={() => navigate('/patient/appointments')} className="text-xs text-accent-blue font-bold hover:text-blue-400 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3 flex-1">
            {appointments.map(apt => (
              <div key={apt.id} className="p-3 bg-dark-card rounded-xl border border-white/[0.06] flex items-center justify-between group hover:border-white/[0.12] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-accent-blue flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold uppercase leading-none">{new Date(apt.date).toLocaleString('en-US', { month: 'short' })}</span>
                    <span className="text-sm font-black leading-none mt-0.5">{new Date(apt.date).getDate()}</span>
                  </div>
                  <div>
                    <div className="font-bold text-txt-primary text-xs">{apt.doctor}</div>
                    <div className="text-[10px] text-txt-muted">{apt.department} • {apt.time}</div>
                  </div>
                </div>
                <Badge variant={apt.status === 'Upcoming' ? 'blue' : 'emerald'} size="sm">{apt.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Prescriptions Widget */}
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-accent-purple" />
              <h3 className="font-black text-sm text-txt-primary">Active Prescriptions</h3>
            </div>
            <button onClick={() => navigate('/patient/prescriptions')} className="text-xs text-accent-purple font-bold hover:text-purple-400 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3 flex-1">
            {prescriptions.map((rx, i) => (
              <div key={i} className="p-3 bg-dark-card rounded-xl border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-accent-purple flex items-center justify-center shrink-0">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-txt-primary text-xs">{rx.medication}</div>
                    <div className="text-[10px] text-txt-muted">{rx.dosage} • {rx.doctor}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-accent-emerald">{rx.refills_remaining} Refills Left</div>
                  <button className="text-[10px] text-txt-muted hover:text-txt-primary underline mt-0.5">Request Refill</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Recent Lab Results & Billing ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Lab Results */}
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent-orange" />
              <h3 className="font-black text-sm text-txt-primary">Recent Lab Results</h3>
            </div>
            <button onClick={() => navigate('/patient/records')} className="text-xs text-accent-orange font-bold hover:text-orange-400 flex items-center gap-1">
              View Records <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-4 bg-dark-card rounded-xl border border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="font-bold text-txt-primary text-xs">Complete Blood Count (CBC)</div>
              <div className="text-[10px] text-txt-muted mt-0.5">Tested: July 28, 2026</div>
            </div>
            <Badge variant="emerald" size="sm">Normal</Badge>
          </div>
        </div>

        {/* Billing Overview */}
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent-teal" />
              <h3 className="font-black text-sm text-txt-primary">Billing & Insurance</h3>
            </div>
            <button onClick={() => navigate('/patient/billing')} className="text-xs text-accent-teal font-bold hover:text-teal-400 flex items-center gap-1">
              View Statement <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-dark-card rounded-xl border border-white/[0.06]">
            <div>
              <div className="text-[10px] text-txt-muted uppercase font-bold">Outstanding Balance</div>
              <div className="text-xl font-black text-txt-primary mt-0.5">$0.00</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-txt-muted uppercase font-bold">Next Premium Due</div>
              <div className="text-sm font-bold text-txt-secondary mt-0.5">Aug 15, 2026</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;
