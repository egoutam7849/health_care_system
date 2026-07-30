import React, { useState, useEffect } from 'react';
import { GitBranch, Play, CheckCircle2, RefreshCw, Terminal, Download, FileText, Database, Sparkles, Trophy, Server } from 'lucide-react';
import { etlAPI } from '../services/api';
import toast from 'react-hot-toast';

export const ETLPipeline = () => {
  const [runs, setRuns] = useState([]);
  const [activeRunId, setActiveRunId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const fetchRuns = async () => {
    const data = await etlAPI.getRuns();
    setRuns(data);
    if (data.length > 0 && !activeRunId) {
      setActiveRunId(data[0].run_id);
    }
  };

  useEffect(() => {
    fetchRuns();
  }, []);

  useEffect(() => {
    if (activeRunId) {
      etlAPI.getLogs(activeRunId).then(setLogs);
    }
  }, [activeRunId]);

  const handleRunPipeline = async () => {
    setIsRunning(true);
    toast.loading('Starting Medallion ETL Processing Pipeline...');
    try {
      const res = await etlAPI.runPipeline('raw_healthcare_admissions_2026_q2.csv');
      toast.dismiss();
      toast.success(`Pipeline ${res.run_id} executed successfully!`);
      await fetchRuns();
      setActiveRunId(res.run_id);
    } catch (e) {
      toast.dismiss();
      toast.error('Pipeline execution completed with mock fallback');
    } finally {
      setIsRunning(false);
    }
  };

  const stepsDiagram = [
    { title: 'CSV Upload', desc: 'Raw EHR File Ingestion', icon: FileText, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40 border-sky-200' },
    { title: 'Bronze Layer', desc: 'Immutable Raw Storage', icon: Database, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200' },
    { title: 'Spark Cleaning', desc: 'Deduplication & Nulls', icon: Sparkles, color: 'text-health-500 bg-health-50 dark:bg-health-950/40 border-health-200' },
    { title: 'Silver Layer', desc: 'Cleaned Parquet Datasets', icon: Sparkles, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40 border-teal-200' },
    { title: 'Business Rules', desc: 'Hospital Aggregations', icon: GitBranch, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200' },
    { title: 'Gold Layer', desc: 'Analytics Summary Tables', icon: Trophy, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200' },
    { title: 'Warehouse', desc: 'PostgreSQL / SQLite Sync', icon: Server, color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/40 border-violet-200' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">ETL Medallion Data Pipeline Visualizer</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            CSV Upload → Bronze → PySpark Cleaning → Silver → Business Rules → Gold → Warehouse
          </p>
        </div>
        <button
          onClick={handleRunPipeline}
          disabled={isRunning}
          className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-health-600 to-tealAccent-600 text-white text-xs font-bold rounded-xl hover:opacity-95 shadow-md shadow-health-500/20 disabled:opacity-50"
        >
          <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Running PySpark Engine...' : 'Run Pipeline'}</span>
        </button>
      </div>

      {/* Medallion Pipeline Flow Step Visualizer Diagram */}
      <div className="glass-card p-6 rounded-2xl overflow-x-auto">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">Medallion Data Architecture Execution Flow</h3>
        <div className="flex items-center space-x-3 min-w-[900px] py-2">
          {stepsDiagram.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={idx}>
                <div className={`flex-1 p-4 rounded-xl border ${step.color} space-y-2 text-center relative`}>
                  <div className="w-8 h-8 rounded-lg mx-auto flex items-center justify-center bg-white dark:bg-slate-900 shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{step.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
                {idx < stepsDiagram.length - 1 && (
                  <span className="text-slate-300 dark:text-slate-700 font-bold text-lg">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Terminal Log Console & Run Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Run Selector */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Pipeline Run History</h3>
          <div className="space-y-2">
            {runs.map((r) => (
              <button
                key={r.run_id}
                onClick={() => setActiveRunId(r.run_id)}
                className={`w-full p-3 rounded-xl text-left border text-xs transition-colors ${
                  activeRunId === r.run_id
                    ? 'border-health-500 bg-health-50 dark:bg-health-950/40 text-health-700 dark:text-white font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono">{r.run_id}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-bold">
                    {r.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>{r.records_processed} Records</span>
                  <span>{r.execution_time_sec}s</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Terminal Log Console */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-tealAccent-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">ETL Step Execution Logs</h3>
            </div>
            <span className="font-mono text-xs text-slate-400">{activeRunId}</span>
          </div>

          <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl space-y-2 max-h-80 overflow-y-auto shadow-inner">
            <p className="text-slate-500">// Healthcare Data Engineering Pipeline Execution Console</p>
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-slate-500">[{log.timestamp}]</span>
                <span className="text-amber-400 font-bold">[{log.step}]</span>
                <span className={log.status === 'SUCCESS' ? 'text-emerald-400' : 'text-rose-400'}>{log.message}</span>
                <span className="text-slate-600">({log.duration_sec}s)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
