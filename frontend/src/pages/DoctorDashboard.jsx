import React, { useState, useEffect } from 'react';
import { Stethoscope, Users, Calendar, Clock, LogOut, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { portalsAPI } from '../services/api';

export const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    portalsAPI.getDoctorPatients().then(res => setData(res));
  }, []);

  if (!data) {
    return <div className="p-8 text-center text-slate-400">Loading Physician Workstation...</div>;
  }

  const { doctor_info, today_schedule, assigned_patients } = data;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-6 space-y-6">
      {/* Top Doctor Header */}
      <div className="glass-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-teal-500">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-300 flex items-center justify-center font-bold text-xl shadow-inner">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold">{doctor_info.name}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Department: <span className="font-semibold text-slate-700 dark:text-slate-200">{doctor_info.specialization}</span> • Facility: <span className="font-semibold text-slate-700 dark:text-slate-200">{doctor_info.hospital}</span>
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-rose-500 hover:text-white transition-colors self-start md:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Grid Layout: Today's Appointments & Patient Roster */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Clinical Schedule */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-teal-500" />
            <h3 className="font-bold text-base">Today's Appointment Schedule</h3>
          </div>
          <div className="space-y-3">
            {today_schedule.map(apt => (
              <div key={apt.id} className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">{apt.patient_name}</span>
                  <span className="text-slate-400">{apt.time} • {apt.type}</span>
                </div>
                <span className="px-2.5 py-1 bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300 font-bold text-[10px] rounded-lg">
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Patients */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-teal-500" />
            <h3 className="font-bold text-base">Assigned Patient Roster</h3>
          </div>
          <div className="space-y-3">
            {assigned_patients.map(p => (
              <div key={p.id} className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">{p.name} ({p.age} Yrs, {p.gender})</span>
                  <span className="text-teal-600 dark:text-teal-400 font-medium">{p.condition}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">{p.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
