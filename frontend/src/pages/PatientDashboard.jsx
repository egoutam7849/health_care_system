import React, { useState, useEffect } from 'react';
import { User, Calendar, FileText, Pill, CreditCard, ShieldCheck, Download, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { portalsAPI } from '../services/api';
import toast from 'react-hot-toast';

export const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    portalsAPI.getPatientSummary().then(res => setData(res));
  }, []);

  if (!data) {
    return <div className="p-8 text-center text-slate-400">Loading Patient Records...</div>;
  }

  const { profile, medical_history, appointments, prescriptions, billing_history } = data;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-6 space-y-6">
      {/* Top Patient Header */}
      <div className="glass-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-purple-500">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center font-bold text-xl shadow-inner">
            {profile.name[0]}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold">{profile.name}</h1>
              <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-bold rounded-full">
                ID: {profile.patient_id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Primary Facility: <span className="font-semibold text-slate-700 dark:text-slate-200">{profile.primary_hospital}</span> • Attending Physician: <span className="font-semibold text-slate-700 dark:text-slate-200">{profile.attending_doctor}</span>
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-rose-500 hover:text-white transition-colors self-start md:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Secure Logout</span>
        </button>
      </div>

      {/* Grid Layout: Medical History & Prescriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appointments & History */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            <h3 className="font-bold text-base">Appointments & Clinical History</h3>
          </div>
          <div className="space-y-3">
            {appointments.map(apt => (
              <div key={apt.id} className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">{apt.doctor} ({apt.department})</span>
                  <span className="text-slate-400">{apt.date} at {apt.time}</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px] rounded-lg">
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Prescriptions */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <Pill className="w-5 h-5 text-purple-500" />
            <h3 className="font-bold text-base">Active Prescriptions</h3>
          </div>
          <div className="space-y-3">
            {prescriptions.map((rx, idx) => (
              <div key={idx} className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">{rx.medication}</span>
                  <span className="text-slate-400">{rx.dosage} • Prescribed by {rx.doctor}</span>
                </div>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold text-[10px] rounded-lg">
                  {rx.refills_remaining} Refills
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Billing Invoices */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-purple-500" />
          <h3 className="font-bold text-base">Billing Statements & Insurance Coverage</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
              <tr>
                <th className="pb-3">INVOICE ID</th>
                <th className="pb-3">DESCRIPTION</th>
                <th className="pb-3">TOTAL COST</th>
                <th className="pb-3">INSURANCE COVERED</th>
                <th className="pb-3">PATIENT RESPONSIBILITY</th>
                <th className="pb-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {billing_history.map(inv => (
                <tr key={inv.invoice_id}>
                  <td className="py-3 font-mono font-bold text-purple-600">{inv.invoice_id}</td>
                  <td className="py-3 font-medium">{inv.description}</td>
                  <td className="py-3 font-bold">${inv.amount.toLocaleString()}</td>
                  <td className="py-3 text-emerald-600 font-bold">${inv.insurance_covered.toLocaleString()}</td>
                  <td className="py-3 font-bold text-slate-800 dark:text-slate-200">${inv.patient_paid.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px] rounded-lg">
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
