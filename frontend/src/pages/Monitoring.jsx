import React, { useState, useEffect } from 'react';
import { Activity, Server, Cpu, HardDrive, Database, Clock, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import { monitoringAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Monitoring = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    monitoringAPI.getMetrics().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return <div className="p-8 text-center text-sm text-slate-500">Loading System Infrastructure Monitoring...</div>;
  }

  const { infrastructure, history } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Infrastructure & Platform Health Monitoring</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time Metrics for PySpark Master, Airflow Orchestrator, PostgreSQL Storage & API Response Latencies</p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Pipeline Success Rate</span>
          <p className="text-2xl font-extrabold text-emerald-500 mt-1">{infrastructure.pipeline_success_rate}%</p>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Avg Job Runtime</span>
          <p className="text-2xl font-extrabold text-health-600 dark:text-health-400 mt-1">{infrastructure.avg_runtime_sec}s</p>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Parquet Storage Usage</span>
          <p className="text-2xl font-extrabold text-indigo-500 mt-1">{infrastructure.storage_usage_mb} MB</p>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">API Response Latency</span>
          <p className="text-2xl font-extrabold text-tealAccent-500 mt-1">{infrastructure.api_response_time_ms} ms</p>
        </div>
      </div>

      {/* Historical Response Time & CPU Usage Line Chart */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">API Response Latency & CPU Workload History</h3>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg text-xs font-bold">
            Server: ONLINE
          </span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="latency_ms" stroke="#0c8de4" strokeWidth={3} name="Latency (ms)" />
              <Line type="monotone" dataKey="cpu_usage" stroke="#14b8a6" strokeWidth={3} name="CPU Usage (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Service Health Badges */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Service Health Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-xs text-slate-800 dark:text-slate-200">Apache Airflow 2.9</p>
              <p className="text-[10px] text-slate-400">Scheduler & Webserver</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {infrastructure.airflow_health}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-xs text-slate-800 dark:text-slate-200">PySpark Cluster Engine</p>
              <p className="text-[10px] text-slate-400">Distributed Worker Pool</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {infrastructure.spark_job_status}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-xs text-slate-800 dark:text-slate-200">PostgreSQL / SQLite Warehouse</p>
              <p className="text-[10px] text-slate-400">Star Schema Database</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              HEALTHY ({infrastructure.database_size_mb} MB)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
