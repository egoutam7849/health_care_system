import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Building2, UserCheck, DollarSign, PieChart as PieIcon, Award } from 'lucide-react';
import { medallionAPI } from '../services/api';

export const GoldLayer = () => {
  const [goldData, setGoldData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    medallionAPI.getGold().then((data) => {
      setGoldData(data);
      setLoading(false);
    });
  }, []);

  if (loading || !goldData) {
    return <div className="p-8 text-center text-sm text-slate-500">Loading Gold Business Layer...</div>;
  }

  const { reports, gold_tables } = goldData;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500 text-white shadow-sm">
          GOLD LAYER
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Business-Ready Analytical Models</h1>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Aggregated, high-performance data models powering hospital executive dashboards and financial reports
      </p>

      {/* Gold Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Processed Gold Records</span>
          <p className="text-2xl font-extrabold text-health-600 dark:text-health-400 mt-1">
            {gold_tables.patient_summary.total_patients.toLocaleString()}
          </p>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Network Readmission Rate</span>
          <p className="text-2xl font-extrabold text-emerald-500 mt-1">
            {gold_tables.patient_summary.readmission_rate}%
          </p>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Avg Patient Bill</span>
          <p className="text-2xl font-extrabold text-indigo-500 mt-1">
            ${gold_tables.patient_summary.avg_billing.toLocaleString()}
          </p>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Top Diagnosis</span>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-2 truncate">
            {gold_tables.patient_summary.top_disease}
          </p>
        </div>
      </div>

      {/* Hospital Rankings Gold Table */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Hospital Revenue & Rating Leaderboard</h3>
          <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-lg">
            Gold Aggregated Table
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
              <tr>
                <th className="p-3">RANK</th>
                <th className="p-3">HOSPITAL FACILITY</th>
                <th className="p-3">TOTAL REVENUE ($)</th>
                <th className="p-3">RATING</th>
                <th className="p-3">OCCUPANCY RATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {gold_tables.hospital_rankings.map((hosp, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-400">#{idx + 1}</td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-health-500" />
                    <span>{hosp.hospital}</span>
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ${(hosp.revenue / 1000000).toFixed(2)}M
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                      ⭐ {hosp.rating}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">{hosp.occupancy_rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gold Reports Registry */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Generated Gold Layer Report Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <div key={report.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-health-600 dark:text-health-400">{report.category}</span>
                <span className="text-[10px] text-slate-400">{report.created_at}</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{report.report_name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{report.metrics_summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
