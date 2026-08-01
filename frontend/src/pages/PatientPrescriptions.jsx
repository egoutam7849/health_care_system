import React, { useState } from 'react';
import { Badge } from '../components/common/Badge';
import { Pill, RotateCcw, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_PRESCRIPTIONS = [
  { id: 1, medication: 'Amlodipine', dosage: '5mg', frequency: 'Once Daily', doctor: 'Dr. Sarah Wilson', date: '2026-07-10', refills_remaining: 2, status: 'Active', instructions: 'Take in the morning with or without food' },
  { id: 2, medication: 'Atorvastatin', dosage: '20mg', frequency: 'Once Daily', doctor: 'Dr. Sarah Wilson', date: '2026-06-15', refills_remaining: 0, status: 'Refill Needed', instructions: 'Take in the evening' },
  { id: 3, medication: 'Amoxicillin', dosage: '500mg', frequency: 'Three Times Daily', doctor: 'Dr. John Smith', date: '2026-01-10', refills_remaining: 0, status: 'Completed', instructions: 'Finish entire course' },
];

export const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState(MOCK_PRESCRIPTIONS);

  const handleRefill = (id) => {
    toast.success('Refill request sent to your pharmacy');
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-12 space-y-6">
      <div>
        <h1 className="text-xl font-black text-txt-primary">My Prescriptions</h1>
        <p className="text-xs text-txt-muted mt-1">Manage your active medications and request refills</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prescriptions.map(rx => (
          <div key={rx.id} className="p-5 bg-dark-section rounded-2xl border border-white/[0.08] shadow-xl flex flex-col h-full hover:border-white/20 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  rx.status === 'Active' ? 'bg-emerald-500/10 text-accent-emerald' : 
                  rx.status === 'Refill Needed' ? 'bg-amber-500/10 text-accent-orange' : 'bg-dark-card border border-white/[0.08] text-txt-muted'
                }`}>
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-txt-primary text-base">{rx.medication} {rx.dosage}</h3>
                  <div className="text-xs text-txt-muted mt-0.5">{rx.frequency}</div>
                </div>
              </div>
              <Badge variant={rx.status === 'Active' ? 'emerald' : rx.status === 'Refill Needed' ? 'amber' : 'slate'}>{rx.status}</Badge>
            </div>

            <div className="flex-1 bg-dark-card rounded-xl border border-white/[0.06] p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-txt-muted" />
                <span className="text-[10px] text-txt-muted font-bold uppercase">Instructions</span>
              </div>
              <p className="text-xs text-txt-secondary">{rx.instructions}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.04] mt-auto">
              <div className="flex items-center gap-4 text-[11px] text-txt-muted">
                <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> {rx.doctor}</div>
                <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {rx.date}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold ${rx.refills_remaining === 0 && rx.status !== 'Completed' ? 'text-accent-orange' : 'text-txt-muted'}`}>
                  {rx.refills_remaining} Refills Left
                </span>
                {rx.status !== 'Completed' && (
                  <button
                    onClick={() => handleRefill(rx.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-card border border-white/[0.08] text-[11px] font-bold text-txt-secondary hover:text-txt-primary hover:bg-dark-hover rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Request Refill
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientPrescriptions;
