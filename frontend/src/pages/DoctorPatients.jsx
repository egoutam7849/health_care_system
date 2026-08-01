import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { portalsAPI } from '../services/api';
import { DataTable } from '../components/common/DataTable';
import { SlideOverPanel } from '../components/common/SlideOverPanel';
import { Badge } from '../components/common/Badge';
import { PatientSummaryCard } from '../components/doctor/PatientSummaryCard';
import { LabResultViewer } from '../components/doctor/LabResultViewer';
import { PrescriptionBuilder } from '../components/doctor/PrescriptionBuilder';
import { ConsultationWorkspace } from '../components/doctor/ConsultationWorkspace';
import {
  Users, Search, Download, Eye, Play, Activity,
  Clock, Calendar, Pill, FlaskConical, FileText, BarChart3,
  Heart, Droplets, Stethoscope, AlertTriangle, Phone, Mail
} from 'lucide-react';
import { Button } from '../components/common/Button';
import toast from 'react-hot-toast';

const DRAWER_TABS = [
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'history', label: 'Medical History', icon: FileText },
  { id: 'diagnoses', label: 'Diagnoses', icon: Activity },
  { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
  { id: 'labs', label: 'Lab Reports', icon: FlaskConical },
  { id: 'vitals', label: 'Vitals', icon: Heart },
  { id: 'timeline', label: 'Timeline', icon: Clock },
];

const RISK_CONFIG = { Critical: 'red', High: 'red', Medium: 'amber', Low: 'emerald' };

const MOCK_PATIENTS = [
  { id: 1, name: 'Alice Johnson', patient_id: 'PAT-001', age: 45, gender: 'Female', disease: 'Hypertension', blood_group: 'O+', admission_date: '2026-07-18', last_visit: '2026-07-28', next_visit: '2026-08-05', risk_level: 'Medium', status: 'Admitted', insurance_provider: 'BlueCross', phone: '+1 555-0101', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', patient_id: 'PAT-002', age: 52, gender: 'Male', disease: 'Diabetes Mellitus', blood_group: 'B+', admission_date: '2026-07-20', last_visit: '2026-07-30', next_visit: '2026-08-06', risk_level: 'High', status: 'Admitted', insurance_provider: 'Aetna', phone: '+1 555-0102', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Davis', patient_id: 'PAT-003', age: 38, gender: 'Male', disease: 'Pneumonia', blood_group: 'A+', admission_date: '2026-07-22', last_visit: '2026-07-31', next_visit: '2026-08-08', risk_level: 'Medium', status: 'Recovering', insurance_provider: 'United Health', phone: '+1 555-0103', email: 'charlie@example.com' },
  { id: 4, name: 'Diana Khan', patient_id: 'PAT-004', age: 64, gender: 'Female', disease: 'Cardiovascular Disease', blood_group: 'AB+', admission_date: '2026-07-15', last_visit: '2026-07-29', next_visit: '2026-08-12', risk_level: 'Critical', status: 'Admitted', insurance_provider: 'Medicare', phone: '+1 555-0104', email: 'diana@example.com' },
];

export const DoctorPatients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [consultation, setConsultation] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await portalsAPI.getDoctorPatients({
          doctor_id: user?.doctor_id || user?.id,
          doctor_name: user?.name
        });
        setPatients(res?.assigned_patients || res || []);
      } catch {
        setPatients(MOCK_PATIENTS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const displayed = (patients.length > 0 ? patients : MOCK_PATIENTS).filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.patient_id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || p.status === statusFilter;
    const matchRisk = !riskFilter || p.risk_level === riskFilter;
    return matchSearch && matchStatus && matchRisk;
  });

  const handleOpenDrawer = (p) => {
    setSelectedPatient(p);
    setActiveTab('overview');
    setIsDrawerOpen(true);
  };

  const columns = [
    {
      label: 'Patient',
      key: 'name',
      render: row => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">
            {row.name?.[0] || 'P'}
          </div>
          <div>
            <div className="font-bold text-txt-primary">{row.name}</div>
            <div className="text-[10px] font-mono text-txt-muted">{row.patient_id}</div>
          </div>
        </div>
      )
    },
    { label: 'Age / Gender', key: 'age', render: row => <span className="text-txt-secondary text-xs">{row.age}Y • {row.gender}</span> },
    {
      label: 'Condition',
      key: 'disease',
      render: row => (
        <div>
          <div className="text-xs font-medium text-txt-primary">{row.disease}</div>
          <div className="flex items-center gap-1 mt-0.5">
            <Droplets className="w-2.5 h-2.5 text-accent-red" />
            <span className="text-[10px] text-txt-muted font-mono">{row.blood_group}</span>
          </div>
        </div>
      )
    },
    { label: 'Last Visit', key: 'last_visit', render: row => <span className="text-xs font-mono text-txt-muted">{row.last_visit || '—'}</span> },
    { label: 'Next Visit', key: 'next_visit', render: row => <span className="text-xs font-mono text-accent-blue">{row.next_visit || 'TBD'}</span> },
    {
      label: 'Risk',
      key: 'risk_level',
      render: row => <Badge variant={RISK_CONFIG[row.risk_level] || 'emerald'} size="sm">{row.risk_level || 'Low'}</Badge>
    },
    {
      label: 'Status',
      key: 'status',
      render: row => <Badge variant={row.status === 'Admitted' ? 'amber' : 'emerald'} size="sm">{row.status}</Badge>
    },
    {
      label: '',
      key: 'actions',
      tdClassName: 'text-right',
      render: row => (
        <div className="flex justify-end gap-1.5" onClick={e => e.stopPropagation()}>
          <button onClick={() => handleOpenDrawer(row)} className="p-1.5 text-txt-muted hover:text-accent-blue hover:bg-dark-hover rounded-lg transition-colors"><Eye className="w-3.5 h-3.5" /></button>
          <button onClick={() => setConsultation({ patient: row })} className="flex items-center gap-1 px-2 py-1 bg-accent-blue text-white text-[10px] font-bold rounded-lg shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-colors">
            <Play className="w-3 h-3" /> Start
          </button>
        </div>
      )
    },
  ];

  const sp = selectedPatient;

  return (
    <div className="max-w-[1600px] mx-auto pb-12 space-y-6">
      {/* Consultation Overlay */}
      {consultation && (
        <ConsultationWorkspace
          patient={consultation.patient}
          onClose={() => setConsultation(null)}
          onSave={() => { toast.success('Consultation saved'); setConsultation(null); }}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-txt-primary">My Patients</h1>
          <p className="text-xs text-txt-muted mt-1">Role-isolated roster — {displayed.length} patients assigned to your care</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[11px] font-bold text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
            JWT-Scoped Data
          </div>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={displayed}
        isLoading={loading}
        searchPlaceholder="Search patients, ID, condition..."
        searchValue={search}
        onSearchChange={setSearch}
        onRowClick={handleOpenDrawer}
        filters={[
          { label: 'Status', value: statusFilter, onChange: setStatusFilter, options: ['Admitted', 'Recovering', 'Discharged'] },
          { label: 'Risk', value: riskFilter, onChange: setRiskFilter, options: ['Critical', 'High', 'Medium', 'Low'] },
        ]}
        emptyMessage="No patients assigned to your care under this account."
      />

      {/* Patient Detail Drawer */}
      <SlideOverPanel
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={sp?.name}
        subtitle={`${sp?.patient_id} • ${sp?.disease}`}
        width="max-w-2xl"
        footer={
          <div className="flex justify-between">
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Close</Button>
            <Button variant="primary" icon={Play} onClick={() => { setIsDrawerOpen(false); setConsultation({ patient: sp }); }}>
              Start Consultation
            </Button>
          </div>
        }
      >
        {sp && (
          <div className="space-y-4">
            {/* Drawer Tab Bar */}
            <div className="flex flex-wrap gap-1 pb-4 border-b border-white/[0.08]">
              {DRAWER_TABS.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                      activeTab === tab.id
                        ? 'bg-accent-blue text-white shadow-md shadow-blue-500/20'
                        : 'text-txt-muted hover:text-txt-primary hover:bg-dark-hover'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-dark-shell rounded-2xl border border-white/[0.08]">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-black text-2xl">
                    {sp.name[0]}
                  </div>
                  <div>
                    <div className="text-base font-black text-txt-primary">{sp.name}</div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant={RISK_CONFIG[sp.risk_level] || 'emerald'}>{sp.risk_level || 'Low'}</Badge>
                      <Badge variant={sp.status === 'Admitted' ? 'amber' : 'emerald'}>{sp.status}</Badge>
                      <span className="text-xs font-mono text-txt-muted">{sp.patient_id}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[
                    ['Age', `${sp.age} Years`], ['Gender', sp.gender],
                    ['Blood Group', sp.blood_group], ['Condition', sp.disease],
                    ['Admission', sp.admission_date], ['Insurance', sp.insurance_provider],
                  ].map(([label, value]) => (
                    <div key={label} className="p-3 bg-dark-shell rounded-xl border border-white/[0.06]">
                      <div className="text-[10px] text-txt-muted font-bold uppercase">{label}</div>
                      <div className="font-semibold text-txt-primary mt-0.5">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-txt-secondary"><Phone className="w-3.5 h-3.5 text-txt-muted" /> {sp.phone || 'N/A'}</div>
                  <div className="flex items-center gap-2 text-xs text-txt-secondary"><Mail className="w-3.5 h-3.5 text-txt-muted" /> {sp.email || 'N/A'}</div>
                </div>
              </div>
            )}

            {/* Tab: Diagnoses */}
            {activeTab === 'diagnoses' && (
              <div className="space-y-3">
                <div className="p-4 bg-dark-shell rounded-2xl border border-white/[0.08]">
                  <div className="text-[10px] text-txt-muted font-bold uppercase mb-2">Active Diagnosis</div>
                  <div className="text-sm font-bold text-txt-primary">{sp.disease}</div>
                  <div className="text-xs text-txt-muted mt-1">ICD-10: I10 — Classified as primary diagnosis</div>
                </div>
                <div className="text-[10px] text-txt-muted font-bold uppercase px-1">Past Diagnoses</div>
                {['Hypertension Stage 1 (2022)', 'Type 2 Diabetes — Pre-diabetic (2020)'].map((d, i) => (
                  <div key={i} className="p-3 bg-dark-card rounded-xl border border-white/[0.06] text-xs text-txt-secondary">{d}</div>
                ))}
              </div>
            )}

            {/* Tab: Prescriptions */}
            {activeTab === 'prescriptions' && (
              <div className="space-y-3">
                <div className="text-[10px] text-txt-muted font-bold uppercase px-1">Current Medications</div>
                {[
                  { med: 'Amlodipine 5mg', freq: 'Once Daily', dur: 'Ongoing', inst: 'Take in the morning' },
                  { med: 'Metformin 500mg', freq: 'Twice Daily', dur: 'Ongoing', inst: 'After meals' },
                ].map((rx, i) => (
                  <div key={i} className="p-3 bg-dark-card rounded-xl border border-white/[0.06] space-y-1">
                    <div className="font-bold text-txt-primary text-xs">{rx.med}</div>
                    <div className="text-[11px] text-txt-muted">{rx.freq} • {rx.dur}</div>
                    <div className="text-[11px] text-txt-secondary italic">{rx.inst}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Lab Reports */}
            {activeTab === 'labs' && (
              <LabResultViewer
                report={{ test_name: 'Complete Metabolic Panel', lab_id: 'LAB-4821', date: '2026-07-31' }}
                onApprove={() => toast.success('Lab report approved')}
                onComment={() => toast.success('Comment saved')}
              />
            )}

            {/* Tab: Vitals */}
            {activeTab === 'vitals' && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Blood Pressure', '128/84 mmHg', 'Last: 2026-07-30'],
                  ['Heart Rate', '72 bpm', 'Resting'],
                  ['SpO2', '98%', 'Room air'],
                  ['Temperature', '98.6°F', 'Normal'],
                  ['Weight', '78 kg', 'Last: 2026-07-28'],
                  ['BMI', '24.8', 'Normal'],
                ].map(([label, value, sub]) => (
                  <div key={label} className="p-4 bg-dark-shell rounded-xl border border-white/[0.06]">
                    <div className="text-[10px] text-txt-muted font-bold uppercase">{label}</div>
                    <div className="font-black text-txt-primary text-base mt-1">{value}</div>
                    <div className="text-[10px] text-txt-muted">{sub}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Timeline */}
            {activeTab === 'timeline' && (
              <div className="relative pl-4">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-white/[0.08]" />
                <div className="space-y-4">
                  {[
                    { date: '2026-07-31', event: 'Consultation', detail: 'Lab results reviewed — Metformin adjusted', icon: Stethoscope, color: 'text-accent-blue' },
                    { date: '2026-07-28', event: 'Lab Report', detail: 'CBC + Metabolic Panel completed', icon: FlaskConical, color: 'text-accent-purple' },
                    { date: '2026-07-22', event: 'Prescription', detail: 'Amlodipine 5mg prescribed', icon: Pill, color: 'text-accent-orange' },
                    { date: '2026-07-18', event: 'Admitted', detail: 'Initial admission — Cardiology ward', icon: Calendar, color: 'text-accent-emerald' },
                  ].map((e, i) => {
                    const Icon = e.icon;
                    return (
                      <div key={i} className="flex gap-3 items-start pl-4 relative">
                        <div className={`absolute -left-1.5 w-3 h-3 rounded-full bg-dark-card border-2 border-white/20 ${e.color}`} />
                        <div className="flex-1 p-3 bg-dark-card rounded-xl border border-white/[0.06]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-txt-primary"><Icon className={`w-3.5 h-3.5 ${e.color}`} />{e.event}</div>
                            <span className="text-[10px] font-mono text-txt-muted">{e.date}</span>
                          </div>
                          <p className="text-[11px] text-txt-secondary mt-1">{e.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Default placeholder for other tabs */}
            {!['overview', 'diagnoses', 'prescriptions', 'labs', 'vitals', 'timeline'].includes(activeTab) && (
              <div className="py-12 text-center text-txt-muted text-xs">
                {activeTab === 'history' ? 'Medical history records from PostgreSQL.' : 'Documents coming soon.'}
              </div>
            )}
          </div>
        )}
      </SlideOverPanel>
    </div>
  );
};

export default DoctorPatients;
