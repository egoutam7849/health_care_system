import React, { useState } from 'react';
import {
  X, Activity, Heart, Thermometer, Droplets, Wind, Clock,
  FileText, Pill, FlaskConical, ClipboardList, Save, AlertTriangle,
  CheckCircle2, User, Stethoscope, Calendar
} from 'lucide-react';
import { PrescriptionBuilder } from './PrescriptionBuilder';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import toast from 'react-hot-toast';

const ICD_SUGGESTIONS = [
  { code: 'I10', desc: 'Essential Hypertension' },
  { code: 'E11', desc: 'Type 2 Diabetes Mellitus' },
  { code: 'J18.9', desc: 'Pneumonia, Unspecified' },
  { code: 'J45', desc: 'Asthma' },
  { code: 'I25', desc: 'Chronic Ischemic Heart Disease' },
  { code: 'N18', desc: 'Chronic Kidney Disease' },
  { code: 'F32', desc: 'Major Depressive Episode' },
  { code: 'M54.5', desc: 'Low Back Pain' },
];

const TAB_ITEMS = [
  { id: 'diagnosis', label: 'Diagnosis', icon: Stethoscope },
  { id: 'prescription', label: 'Rx', icon: Pill },
  { id: 'lab', label: 'Lab Requests', icon: FlaskConical },
  { id: 'notes', label: 'Clinical Notes', icon: ClipboardList },
];

function VitalChip({ icon: Icon, label, value, unit, status = 'normal' }) {
  const color = status === 'critical' ? 'text-accent-red border-rose-500/20 bg-rose-500/10' 
    : status === 'warning' ? 'text-accent-orange border-amber-500/20 bg-amber-500/10'
    : 'text-txt-secondary border-white/[0.08] bg-dark-card';
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${color}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <div>
        <div className="font-bold text-txt-primary">{value} <span className="font-normal text-[10px]">{unit}</span></div>
        <div className="text-[10px] opacity-70">{label}</div>
      </div>
    </div>
  );
}

export function ConsultationWorkspace({ patient, appointment, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState('diagnosis');
  const [diagnosis, setDiagnosis] = useState('');
  const [selectedICD, setSelectedICD] = useState(null);
  const [notes, setNotes] = useState('');
  const [labRequests, setLabRequests] = useState([]);
  const [labInput, setLabInput] = useState('');
  const [prescription, setPrescription] = useState([]);
  const [followUpDays, setFollowUpDays] = useState('7');
  const [saving, setSaving] = useState(false);

  const addLabRequest = () => {
    if (!labInput.trim()) return;
    setLabRequests(prev => [...prev, { id: Date.now(), test: labInput }]);
    setLabInput('');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave?.({ diagnosis, selectedICD, notes, prescription, labRequests, followUpDays });
      toast.success('Consultation saved to clinical records');
    } catch {
      toast.error('Failed to save consultation');
    } finally {
      setSaving(false);
    }
  };

  if (!patient) return null;

  const vitals = patient.vitals || {
    bp: '128/84', hr: '72', spo2: '98', temp: '98.6', rr: '16'
  };

  return (
    <div className="fixed inset-0 z-50 bg-dark-canvas/95 backdrop-blur-sm flex flex-col animate-fade-in">
      {/* Top Bar */}
      <div className="h-14 border-b border-white/[0.08] bg-dark-shell flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-black text-sm">
            {patient.name?.[0] || 'P'}
          </div>
          <div>
            <div className="font-black text-txt-primary text-sm">{patient.name} — Active Consultation</div>
            <div className="text-[10px] text-txt-muted font-mono">{patient.patient_id} • {patient.disease}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" icon={Save} size="sm" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save & Close Consultation'}
          </Button>
          <button onClick={onClose} className="p-2 rounded-xl text-txt-muted hover:text-txt-primary hover:bg-dark-hover transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 grid grid-cols-5 overflow-hidden">

        {/* ── Left Panel: Patient Summary (2 cols) ── */}
        <div className="col-span-2 border-r border-white/[0.08] bg-dark-section overflow-y-auto p-5 space-y-5">
          {/* Patient Bio */}
          <div className="p-4 bg-dark-card rounded-2xl border border-white/[0.08] space-y-3">
            <div className="text-[10px] font-bold uppercase text-txt-muted tracking-wider">Patient Summary</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><div className="text-txt-muted text-[10px]">Age / Gender</div><div className="font-bold text-txt-primary">{patient.age}Y • {patient.gender}</div></div>
              <div><div className="text-txt-muted text-[10px]">Blood Group</div><div className="font-bold text-accent-red">{patient.blood_group || 'N/A'}</div></div>
              <div><div className="text-txt-muted text-[10px]">Admission</div><div className="font-bold text-txt-primary">{patient.admission_date || 'OPD'}</div></div>
              <div><div className="text-txt-muted text-[10px]">Insurance</div><div className="font-bold text-txt-primary truncate">{patient.insurance_provider || 'N/A'}</div></div>
            </div>
          </div>

          {/* Vitals Grid */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase text-txt-muted tracking-wider">Current Vitals</div>
            <div className="grid grid-cols-2 gap-2">
              <VitalChip icon={Activity} label="Blood Pressure" value={vitals.bp} unit="mmHg" status={vitals.bp?.split('/')[0] > 140 ? 'warning' : 'normal'} />
              <VitalChip icon={Heart} label="Heart Rate" value={vitals.hr} unit="bpm" />
              <VitalChip icon={Wind} label="SpO2" value={vitals.spo2} unit="%" status={vitals.spo2 < 95 ? 'critical' : 'normal'} />
              <VitalChip icon={Thermometer} label="Temperature" value={vitals.temp} unit="°F" />
            </div>
          </div>

          {/* Allergies */}
          <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-accent-red" />
              <div className="text-[10px] font-bold uppercase text-accent-red tracking-wider">Known Allergies</div>
            </div>
            <div className="text-xs text-rose-300 font-medium">{patient.allergies || 'Penicillin, Sulfonamides'}</div>
          </div>

          {/* Past Diagnoses */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase text-txt-muted tracking-wider">Chronic Conditions</div>
            <div className="flex flex-wrap gap-2">
              {(patient.past_diagnoses || ['Hypertension', 'Type 2 Diabetes']).map((d, i) => (
                <Badge key={i} variant="blue" size="sm">{d}</Badge>
              ))}
            </div>
          </div>

          {/* Previous Consultations */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase text-txt-muted tracking-wider">Recent Visits</div>
            <div className="space-y-2">
              {(patient.recent_visits || [
                { date: '2026-07-15', notes: 'Follow-up — BP controlled. Medication adjusted.' },
                { date: '2026-06-28', notes: 'Routine check — Lab results reviewed.' },
              ]).map((v, i) => (
                <div key={i} className="p-3 bg-dark-card rounded-xl border border-white/[0.06] text-xs">
                  <div className="font-mono text-txt-muted text-[10px]">{v.date}</div>
                  <div className="text-txt-secondary mt-1">{v.notes}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Panel: Consultation Workspace (3 cols) ── */}
        <div className="col-span-3 bg-dark-section flex flex-col overflow-hidden">
          {/* Tab Bar */}
          <div className="flex items-center gap-1 px-5 py-3 border-b border-white/[0.08] bg-dark-shell shrink-0">
            {TAB_ITEMS.map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-accent-blue text-white shadow-lg shadow-blue-500/20'
                      : 'text-txt-muted hover:text-txt-primary hover:bg-dark-hover'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">

            {/* ─ Diagnosis Tab ─ */}
            {activeTab === 'diagnosis' && (
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold uppercase text-txt-muted tracking-wider block mb-2">Primary Complaint</label>
                  <input
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                    placeholder="Enter patient's presenting complaint..."
                    className="w-full dark-input rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-txt-muted tracking-wider block mb-2">ICD-10 Code Search</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ICD_SUGGESTIONS.map(s => (
                      <button
                        key={s.code}
                        onClick={() => setSelectedICD(s)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs text-left transition-colors ${
                          selectedICD?.code === s.code
                            ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                            : 'bg-dark-card border-white/[0.08] text-txt-secondary hover:bg-dark-hover hover:text-txt-primary'
                        }`}
                      >
                        <span className="font-mono font-bold text-[10px] text-accent-blue">{s.code}</span>
                        <span className="truncate">{s.desc}</span>
                        {selectedICD?.code === s.code && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-accent-blue" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-txt-muted tracking-wider block mb-2">Follow-up Plan</label>
                  <div className="flex items-center gap-3">
                    <select
                      value={followUpDays}
                      onChange={e => setFollowUpDays(e.target.value)}
                      className="dark-input rounded-xl px-3 py-2 text-xs w-40 appearance-none focus:outline-none"
                    >
                      {['3', '7', '14', '30', '60', '90'].map(d => (
                        <option key={d} className="bg-dark-shell" value={d}>Follow up in {d} days</option>
                      ))}
                    </select>
                    <span className="text-xs text-txt-muted">
                      Next visit: {new Date(Date.now() + parseInt(followUpDays) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ─ Prescription Tab ─ */}
            {activeTab === 'prescription' && (
              <div>
                <div className="text-[10px] font-bold uppercase text-txt-muted tracking-wider mb-4">Prescription Builder</div>
                <PrescriptionBuilder onChange={setPrescription} />
              </div>
            )}

            {/* ─ Lab Requests Tab ─ */}
            {activeTab === 'lab' && (
              <div className="space-y-4">
                <div className="text-[10px] font-bold uppercase text-txt-muted tracking-wider">Request Laboratory Tests</div>
                <div className="flex items-center gap-2">
                  <input
                    value={labInput}
                    onChange={e => setLabInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addLabRequest()}
                    placeholder="Enter test name (e.g. CBC, HbA1c, Lipid Panel)..."
                    className="flex-1 dark-input rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  />
                  <Button variant="primary" size="sm" onClick={addLabRequest}>Add Test</Button>
                </div>

                {/* Quick Test Presets */}
                <div>
                  <div className="text-[10px] text-txt-muted mb-2">Common tests:</div>
                  <div className="flex flex-wrap gap-2">
                    {['CBC', 'HbA1c', 'Lipid Panel', 'LFT', 'KFT', 'Thyroid Panel', 'Urine Analysis', 'ECG', 'Chest X-Ray'].map(t => (
                      <button
                        key={t}
                        onClick={() => setLabRequests(prev => [...prev, { id: Date.now() + Math.random(), test: t }])}
                        className="px-2.5 py-1 text-[10px] font-bold text-accent-blue bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
                      >
                        + {t}
                      </button>
                    ))}
                  </div>
                </div>

                {labRequests.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] text-txt-muted">Requested ({labRequests.length}):</div>
                    {labRequests.map(r => (
                      <div key={r.id} className="flex items-center justify-between px-3 py-2 bg-dark-card rounded-xl border border-white/[0.08]">
                        <span className="text-xs text-txt-primary font-medium">{r.test}</span>
                        <button onClick={() => setLabRequests(prev => prev.filter(x => x.id !== r.id))} className="text-txt-muted hover:text-accent-red transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─ Clinical Notes Tab ─ */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="text-[10px] font-bold uppercase text-txt-muted tracking-wider">Clinical Notes</div>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Document clinical observations, physical examination findings, assessment, and plan..."
                  rows={14}
                  className="w-full dark-input rounded-xl px-4 py-3 text-sm focus:outline-none resize-none font-mono leading-relaxed"
                />
                <div className="text-[10px] text-txt-muted">
                  SOAP format recommended: Subjective → Objective → Assessment → Plan
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
