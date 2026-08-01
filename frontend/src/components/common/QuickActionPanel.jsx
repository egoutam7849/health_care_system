import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Stethoscope, Calendar, Receipt, FlaskConical, FileText,
  Plus, X, ChevronRight
} from 'lucide-react';

const actions = [
  { id: 'patient', label: 'Create Patient', icon: Users, color: 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30', path: '/patients' },
  { id: 'doctor', label: 'Add Doctor', icon: Stethoscope, color: 'text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/30', path: '/doctors' },
  { id: 'appointment', label: 'Schedule Appointment', icon: Calendar, color: 'text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30', path: '/appointments' },
  { id: 'bill', label: 'Generate Bill', icon: Receipt, color: 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30', path: '/billing' },
  { id: 'lab', label: 'Upload Lab Report', icon: FlaskConical, color: 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30', path: '/lab-reports' },
  { id: 'report', label: 'Create Report', icon: FileText, color: 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30', path: '/reports' },
];

export function QuickActionPanel() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
      {/* Action List */}
      {open && (
        <div className="flex flex-col gap-2 items-end animate-in slide-in-from-bottom-4">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.id}
                onClick={() => { navigate(a.path); setOpen(false); }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border backdrop-blur-sm
                  text-xs font-bold transition-all duration-200 shadow-lg
                  bg-slate-900/95 ${a.color} hover:scale-105`}
              >
                <Icon className="w-4 h-4" />
                <span>{a.label}</span>
                <ChevronRight className="w-3 h-3 opacity-50" />
              </button>
            );
          })}
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300
          ${open
            ? 'bg-slate-700 text-slate-200 rotate-45 shadow-slate-500/20'
            : 'bg-gradient-to-tr from-blue-600 to-teal-500 text-white shadow-blue-500/40 hover:scale-110 hover:shadow-blue-500/60'
          }`}
        title="Quick Actions"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
