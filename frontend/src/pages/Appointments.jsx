import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, User, Stethoscope, Building2 } from 'lucide-react';
import { entitiesAPI } from '../services/api';

export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    entitiesAPI.getAppointments().then(setAppointments);
  }, []);

  const filtered = activeTab === 'All' ? appointments : appointments.filter(a => a.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Patient Appointments Timeline</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Schedule, Status Updates & Department Allocations</p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
          {['All', 'Upcoming', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === status ? 'bg-white dark:bg-slate-900 text-health-600 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List / Timeline View */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="space-y-3">
          {filtered.map((apt) => (
            <div key={apt.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-health-500 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-health-100 text-health-600 dark:bg-health-950 dark:text-health-400 rounded-xl shrink-0">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{apt.patient_name}</h4>
                  <p className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                    <span>Doctor: {apt.doctor_name}</span>
                    <span>•</span>
                    <span>{apt.hospital_name}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-xs">
                <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-health-500" />
                  <span className="font-bold">{apt.appointment_date} @ {apt.time_slot}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {apt.department}
                </span>
                <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                  apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                  apt.status === 'Upcoming' ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300' :
                  'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {apt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
