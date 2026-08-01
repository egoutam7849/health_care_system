import React, { useState } from 'react';
import { Plus, Trash2, AlertTriangle, FileText, ChevronDown } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

const TEMPLATES = [
  { name: 'Hypertension Pack', meds: [
    { medicine: 'Amlodipine', dosage: '5mg', frequency: 'Once Daily', duration: '30 Days', instructions: 'Take in the morning' },
    { medicine: 'Losartan', dosage: '50mg', frequency: 'Once Daily', duration: '30 Days', instructions: 'Take with or without food' },
  ]},
  { name: 'Diabetes Pack', meds: [
    { medicine: 'Metformin', dosage: '500mg', frequency: 'Twice Daily', duration: '30 Days', instructions: 'Take after meals' },
    { medicine: 'Glibenclamide', dosage: '5mg', frequency: 'Once Daily', duration: '30 Days', instructions: 'Take before breakfast' },
  ]},
  { name: 'Respiratory Pack', meds: [
    { medicine: 'Salbutamol', dosage: '100mcg', frequency: 'As Needed', duration: '60 Days', instructions: 'Use inhaler when symptomatic' },
    { medicine: 'Budesonide', dosage: '200mcg', frequency: 'Twice Daily', duration: '30 Days', instructions: 'Rinse mouth after use' },
  ]},
];

const COMMON_MEDS = [
  'Paracetamol', 'Amoxicillin', 'Atorvastatin', 'Metformin', 'Amlodipine',
  'Omeprazole', 'Aspirin', 'Ibuprofen', 'Lisinopril', 'Doxycycline',
  'Salbutamol', 'Prednisolone', 'Azithromycin', 'Losartan', 'Ciprofloxacin'
];

const FREQUENCIES = ['Once Daily', 'Twice Daily', 'Three Times Daily', 'Four Times Daily', 'As Needed', 'Weekly', 'Every 8 Hours', 'Every 12 Hours'];
const DURATIONS = ['3 Days', '5 Days', '7 Days', '10 Days', '14 Days', '30 Days', '60 Days', '90 Days', 'Ongoing'];

const emptyRow = () => ({
  id: Date.now(),
  medicine: '',
  dosage: '',
  frequency: 'Once Daily',
  duration: '7 Days',
  instructions: '',
});

export function PrescriptionBuilder({ onChange }) {
  const [rows, setRows] = useState([emptyRow()]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [drugAlert, setDrugAlert] = useState(null);

  const update = (id, field, value) => {
    const updated = rows.map(r => r.id === id ? { ...r, [field]: value } : r);
    setRows(updated);
    onChange?.(updated);
  };

  const addRow = () => {
    const updated = [...rows, emptyRow()];
    setRows(updated);
    onChange?.(updated);
  };

  const removeRow = (id) => {
    if (rows.length === 1) return;
    const updated = rows.filter(r => r.id !== id);
    setRows(updated);
    onChange?.(updated);
  };

  const loadTemplate = (tmpl) => {
    const loaded = tmpl.meds.map(m => ({ ...m, id: Date.now() + Math.random() }));
    setRows(loaded);
    onChange?.(loaded);
    setShowTemplates(false);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-txt-secondary bg-dark-card border border-white/[0.08] hover:bg-dark-hover rounded-xl transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-accent-blue" />
              Quick Templates
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showTemplates && (
              <div className="absolute top-9 left-0 z-10 w-56 bg-dark-section border border-white/[0.08] rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                {TEMPLATES.map(t => (
                  <button
                    key={t.name}
                    onClick={() => loadTemplate(t)}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-txt-secondary hover:text-txt-primary hover:bg-dark-hover transition-colors"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drug Interaction Placeholder */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] text-amber-400 font-bold">
          <AlertTriangle className="w-3 h-3" />
          Drug Check: Active
        </div>
      </div>

      {/* Prescription Table */}
      <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="grid grid-cols-12 gap-0 bg-dark-shell px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-txt-muted border-b border-white/[0.08]">
          <div className="col-span-3">Medicine</div>
          <div className="col-span-2">Dosage</div>
          <div className="col-span-2">Frequency</div>
          <div className="col-span-2">Duration</div>
          <div className="col-span-2">Instructions</div>
          <div className="col-span-1"></div>
        </div>

        <div className="divide-y divide-white/[0.05] bg-dark-section">
          {rows.map((row, idx) => (
            <div key={row.id} className="grid grid-cols-12 gap-2 px-3 py-2 items-center hover:bg-dark-card/50 transition-colors">
              {/* Medicine */}
              <div className="col-span-3">
                <input
                  list={`med-list-${row.id}`}
                  value={row.medicine}
                  onChange={e => update(row.id, 'medicine', e.target.value)}
                  placeholder="Medicine name..."
                  className="w-full bg-dark-shell border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-txt-primary dark-input focus:outline-none focus:border-accent-blue"
                />
                <datalist id={`med-list-${row.id}`}>
                  {COMMON_MEDS.map(m => <option key={m} value={m} />)}
                </datalist>
              </div>

              {/* Dosage */}
              <div className="col-span-2">
                <input
                  value={row.dosage}
                  onChange={e => update(row.id, 'dosage', e.target.value)}
                  placeholder="e.g. 500mg"
                  className="w-full bg-dark-shell border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-txt-primary dark-input focus:outline-none focus:border-accent-blue"
                />
              </div>

              {/* Frequency */}
              <div className="col-span-2">
                <select
                  value={row.frequency}
                  onChange={e => update(row.id, 'frequency', e.target.value)}
                  className="w-full bg-dark-shell border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-txt-primary appearance-none dark-input focus:outline-none focus:border-accent-blue"
                >
                  {FREQUENCIES.map(f => <option key={f} className="bg-dark-shell" value={f}>{f}</option>)}
                </select>
              </div>

              {/* Duration */}
              <div className="col-span-2">
                <select
                  value={row.duration}
                  onChange={e => update(row.id, 'duration', e.target.value)}
                  className="w-full bg-dark-shell border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-txt-primary appearance-none dark-input focus:outline-none focus:border-accent-blue"
                >
                  {DURATIONS.map(d => <option key={d} className="bg-dark-shell" value={d}>{d}</option>)}
                </select>
              </div>

              {/* Instructions */}
              <div className="col-span-2">
                <input
                  value={row.instructions}
                  onChange={e => update(row.id, 'instructions', e.target.value)}
                  placeholder="Special instructions..."
                  className="w-full bg-dark-shell border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-txt-primary dark-input focus:outline-none focus:border-accent-blue"
                />
              </div>

              {/* Delete */}
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => removeRow(row.id)}
                  className="p-1.5 text-txt-muted hover:text-accent-red hover:bg-dark-hover rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={addRow}
        className="flex items-center gap-2 text-xs font-bold text-accent-blue hover:text-blue-400 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Medication
      </button>
    </div>
  );
}
