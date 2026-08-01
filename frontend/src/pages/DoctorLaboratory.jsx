import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LabResultViewer } from '../components/doctor/LabResultViewer';
import { Badge } from '../components/common/Badge';
import { FlaskConical, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_REPORTS = [
  { id: 1, patient: 'Alice Johnson', patient_id: 'PAT-001', test_name: 'Complete Metabolic Panel', lab_id: 'LAB-4821', date: '2026-07-31', status: 'Pending Review', hasAbnormal: true, interpretation: 'Elevated HbA1c at 8.2% indicates poor glycemic control. CBC shows mild anemia with Hb 11.2 g/dL. Recommend Metformin dose adjustment and dietary counseling.' },
  { id: 2, patient: 'Bob Smith', patient_id: 'PAT-002', test_name: 'HbA1c + Lipid Panel', lab_id: 'LAB-4822', date: '2026-07-30', status: 'Pending Review', hasAbnormal: true, interpretation: 'HbA1c 8.2% — suboptimal. LDL elevated at 142 mg/dL. Consider adding statin therapy.' },
  { id: 3, patient: 'Charlie Davis', patient_id: 'PAT-003', test_name: 'Chest X-Ray + Sputum Culture', lab_id: 'LAB-4823', date: '2026-07-29', status: 'Reviewed', hasAbnormal: false, interpretation: 'Bilateral infiltrates resolving. Sputum culture negative for organisms. Continue current antibiotic regimen for 3 more days.' },
];

export const DoctorLaboratory = () => {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const displayed = MOCK_REPORTS.filter(r => {
    if (filter === 'pending') return r.status === 'Pending Review';
    if (filter === 'reviewed') return r.status === 'Reviewed';
    if (filter === 'abnormal') return r.hasAbnormal;
    return true;
  });

  const counts = {
    all: MOCK_REPORTS.length,
    pending: MOCK_REPORTS.filter(r => r.status === 'Pending Review').length,
    abnormal: MOCK_REPORTS.filter(r => r.hasAbnormal).length,
    reviewed: MOCK_REPORTS.filter(r => r.status === 'Reviewed').length,
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-12 space-y-6">
      <div>
        <h1 className="text-xl font-black text-txt-primary">Laboratory</h1>
        <p className="text-xs text-txt-muted mt-1">Patient lab reports assigned to your care</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { id: 'all', label: 'All Reports', color: 'blue' },
          { id: 'pending', label: 'Pending Review', color: 'amber' },
          { id: 'abnormal', label: 'Abnormal Values', color: 'red' },
          { id: 'reviewed', label: 'Reviewed', color: 'emerald' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => { setFilter(f.id); setSelected(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              filter === f.id
                ? 'bg-accent-blue text-white border-accent-blue shadow-md shadow-blue-500/20'
                : 'text-txt-muted border-white/[0.08] hover:bg-dark-hover'
            }`}
          >
            {f.label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filter === f.id ? 'bg-white/20 text-white' : 'bg-dark-section text-txt-muted'}`}>
              {counts[f.id]}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report List */}
        <div className="space-y-3">
          {displayed.map(r => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                selected?.id === r.id
                  ? 'border-accent-blue bg-blue-500/10 shadow-lg shadow-blue-500/10'
                  : 'border-white/[0.08] bg-dark-section hover:border-white/20 hover:bg-dark-hover'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${r.hasAbnormal ? 'bg-rose-500/15 text-accent-red' : 'bg-emerald-500/15 text-accent-emerald'}`}>
                  <FlaskConical className="w-4 h-4" />
                </div>
                <Badge variant={r.status === 'Reviewed' ? 'emerald' : 'amber'} size="sm">
                  {r.status === 'Reviewed' ? 'Reviewed' : 'Pending'}
                </Badge>
              </div>
              <div className="mt-2">
                <div className="font-bold text-txt-primary text-sm">{r.patient}</div>
                <div className="text-xs text-txt-muted mt-0.5">{r.test_name}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-mono text-txt-muted">{r.lab_id}</span>
                  <span className="text-[10px] text-txt-muted">•</span>
                  <span className="text-[10px] text-txt-muted">{r.date}</span>
                </div>
                {r.hasAbnormal && (
                  <div className="flex items-center gap-1 mt-2">
                    <AlertTriangle className="w-3 h-3 text-accent-red" />
                    <span className="text-[10px] font-bold text-accent-red">Abnormal values detected</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Lab Viewer */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl">
              <LabResultViewer
                report={selected}
                onApprove={() => {
                  toast.success(`${selected.test_name} approved and filed`);
                  setSelected(null);
                }}
                onComment={() => toast.success('Comment added to lab report')}
              />
            </div>
          ) : (
            <div className="p-12 rounded-2xl border border-dashed border-white/[0.08] bg-dark-section flex flex-col items-center justify-center text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-dark-card border border-white/[0.08] flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-txt-muted" />
              </div>
              <div className="font-bold text-txt-primary">Select a Lab Report</div>
              <p className="text-xs text-txt-muted max-w-xs">Click any report from the list to view results, flag abnormals, and approve or comment on the findings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorLaboratory;
