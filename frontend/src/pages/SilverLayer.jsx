import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Filter } from 'lucide-react';
import { medallionAPI } from '../services/api';

export const SilverLayer = () => {
  const [silverData, setSilverData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    medallionAPI.getSilver().then((data) => {
      setSilverData(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          SILVER LAYER
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">PySpark Cleaned & Standardized Datasets</h1>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Cleaned datasets: Deduplicated, missing values imputed, negative numbers dropped, and dates cast to ISO-8601
      </p>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Duplicates Removed</span>
          <p className="text-2xl font-extrabold text-rose-500 mt-1">142</p>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Nulls Imputed</span>
          <p className="text-2xl font-extrabold text-amber-500 mt-1">38</p>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Invalid Dropped</span>
          <p className="text-2xl font-extrabold text-indigo-500 mt-1">15</p>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Valid Cleaned Rows</span>
          <p className="text-2xl font-extrabold text-emerald-500 mt-1">9,805</p>
        </div>
      </div>

      {/* Before vs After Cleaning Comparison */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Before vs. After Data Cleaning Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl space-y-3">
            <h4 className="font-bold text-xs text-amber-800 dark:text-amber-300 uppercase tracking-wider">Before (Raw Bronze Data)</h4>
            <ul className="text-xs space-y-1.5 text-amber-900 dark:text-amber-200">
              <li>• Total Input Records: 10,000</li>
              <li>• Duplicate Patient IDs: 142 rows</li>
              <li>• Missing Patient Ages & Diseases: 38 fields</li>
              <li>• Invalid Bill Amounts (&lt; $0): 15 rows</li>
              <li>• Heterogeneous Date Formats (MM/DD/YY, YY-MM-DD)</li>
            </ul>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl space-y-3">
            <h4 className="font-bold text-xs text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">After (Cleaned Silver Parquet)</h4>
            <ul className="text-xs space-y-1.5 text-emerald-900 dark:text-emerald-200">
              <li>• Total Valid Records: 9,805 (100% Schema Valid)</li>
              <li>• Unique Primary Key Constraint Enforced</li>
              <li>• Nulls Imputed via Statistical Median</li>
              <li>• Range Checks Asserted (Bill &ge; $0, Age 0-120)</li>
              <li>• Standardized ISO-8601 Timestamps</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cleaning Logs & Processed Datasets */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Silver Pipeline Cleaning Execution Registry</h3>
        {silverData.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-health-500/10 text-health-600 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.silver_filename}</h4>
                  <p className="text-xs text-slate-400">Processed from: {item.bronze_filename}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs rounded-lg">
                PARQUET FORMAT
              </span>
            </div>
            <div className="p-3 bg-slate-900 text-slate-300 font-mono text-xs rounded-xl">
              <p className="text-slate-400 mb-1">// PySpark Engine Log Output:</p>
              <p>{item.cleaning_logs}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
