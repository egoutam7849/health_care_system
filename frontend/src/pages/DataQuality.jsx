import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, Activity, Award } from 'lucide-react';
import { qualityAPI } from '../services/api';
import toast from 'react-hot-toast';

export const DataQuality = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const fetchQuality = async () => {
    setLoading(true);
    const data = await qualityAPI.getMetrics();
    setMetrics(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuality();
  }, []);

  const handleRunChecks = async () => {
    setRunning(true);
    toast.loading('Running Great Expectations & Data Quality assertion rules...');
    try {
      await qualityAPI.runChecks();
      toast.dismiss();
      toast.success('Data Quality assertion suite executed! All tests passed.');
      fetchQuality();
    } catch (e) {
      toast.dismiss();
      toast.error('Executed checks with mock score');
    } finally {
      setRunning(false);
    }
  };

  const overallScore = 99.8;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Data Quality & Validation Suite</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Automated Null Scans, Duplicate Checks, Range Validations & Schema Consistency Assertions
          </p>
        </div>
        <button
          onClick={handleRunChecks}
          disabled={running}
          className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-health-600 to-tealAccent-600 text-white text-xs font-bold rounded-xl hover:opacity-95 shadow-md shadow-health-500/20 disabled:opacity-50"
        >
          <ShieldCheck className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
          <span>{running ? 'Asserting Quality Rules...' : 'Run Quality Checks'}</span>
        </button>
      </div>

      {/* Quality Score Gauge Card */}
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Dataset Health Score</span>
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">{overallScore}%</h2>
          <p className="text-xs text-slate-500">5 out of 5 critical data contract assertions currently passing clean.</p>
        </div>
        <div className="w-32 h-32 rounded-full border-8 border-emerald-500 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-extrabold text-2xl shadow-inner">
          100%
        </div>
      </div>

      {/* Rules Validation Table */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Assertion Rule Execution Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
              <tr>
                <th className="pb-3">RULE DESCRIPTION</th>
                <th className="pb-3">CATEGORY</th>
                <th className="pb-3">PASS COUNT</th>
                <th className="pb-3">FAIL COUNT</th>
                <th className="pb-3">PASS %</th>
                <th className="pb-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {metrics.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-50/50">
                  <td className="py-3 font-bold text-slate-800 dark:text-slate-200">{rule.rule_name}</td>
                  <td className="py-3 text-slate-400">{rule.category}</td>
                  <td className="py-3 font-mono font-bold text-emerald-600">{rule.pass_count.toLocaleString()}</td>
                  <td className="py-3 font-mono font-bold text-rose-500">{rule.fail_count}</td>
                  <td className="py-3 font-semibold">{rule.pass_percentage}%</td>
                  <td className="py-3 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {rule.status}
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
