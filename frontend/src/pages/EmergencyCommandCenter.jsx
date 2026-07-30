import React from 'react';
import { Siren, Activity, BedDouble, AlertTriangle, ShieldAlert, HeartPulse, Stethoscope, Clock } from 'lucide-react';

export const EmergencyCommandCenter = () => {
  const icuUnits = [
    { id: 1, hospital: 'Metro General Hospital', total_icu: 40, occupied_icu: 34, ventilators_in_use: 22, emergency_wait_min: 14, status: 'CRITICAL' },
    { id: 2, hospital: 'Johns Hopkins Medical Center', total_icu: 60, occupied_icu: 51, ventilators_in_use: 38, emergency_wait_min: 18, status: 'HIGH LOAD' },
    { id: 3, hospital: 'Mayo Clinic Healthcare System', total_icu: 50, occupied_icu: 38, ventilators_in_use: 20, emergency_wait_min: 8, status: 'OPTIMAL' },
    { id: 4, hospital: 'Cleveland Clinic', total_icu: 45, occupied_icu: 32, ventilators_in_use: 16, emergency_wait_min: 10, status: 'OPTIMAL' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <Siren className="w-7 h-7 text-rose-500 animate-pulse" />
            <span>Emergency & ICU Command Center</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time ICU ventilator telemetry, triage response metrics, and emergency bed availability</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold">
          <span className="px-3 py-1 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded-full flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Network ICU Load: 84%</span>
          </span>
        </div>
      </div>

      {/* Top Telemetry KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-rose-500">
          <span className="text-xs font-bold text-slate-400 block">Total Active ICU Beds</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">155 / 195</span>
          <span className="text-[10px] text-rose-500 font-bold">84% Occupancy Rate</span>
        </div>
        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-amber-500">
          <span className="text-xs font-bold text-slate-400 block">Ventilators In Use</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">96 Units</span>
          <span className="text-[10px] text-amber-500 font-bold">78% Telemetry Usage</span>
        </div>
        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-emerald-500">
          <span className="text-xs font-bold text-slate-400 block">Avg Triage Response Time</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">12.5 Mins</span>
          <span className="text-[10px] text-emerald-500 font-bold">within SLA Target</span>
        </div>
        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-purple-500">
          <span className="text-xs font-bold text-slate-400 block">Trauma Admissions Today</span>
          <span className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 block">96 Patients</span>
          <span className="text-[10px] text-purple-500 font-bold">Across 5 Facilities</span>
        </div>
      </div>

      {/* ICU Unit Status Table */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Facility ICU Telemetry Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
              <tr>
                <th className="pb-3">HOSPITAL FACILITY</th>
                <th className="pb-3">ICU OCCUPANCY</th>
                <th className="pb-3">VENTILATORS IN USE</th>
                <th className="pb-3">EMERGENCY WAIT TIME</th>
                <th className="pb-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {icuUnits.map(unit => (
                <tr key={unit.id} className="hover:bg-slate-50/50">
                  <td className="py-3 font-bold text-slate-800 dark:text-slate-200">{unit.hospital}</td>
                  <td className="py-3 font-semibold">{unit.occupied_icu} / {unit.total_icu} Beds</td>
                  <td className="py-3 font-bold text-amber-600">{unit.ventilators_in_use} Units</td>
                  <td className="py-3 font-semibold text-slate-600">{unit.emergency_wait_min} Mins</td>
                  <td className="py-3 text-right">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${unit.status === 'CRITICAL' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                      {unit.status}
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
