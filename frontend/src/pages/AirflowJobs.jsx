import React, { useState, useEffect } from 'react';
import { Cpu, Play, CheckCircle2, RefreshCw, GitBranch, Clock, AlertCircle } from 'lucide-react';
import { airflowAPI } from '../services/api';
import toast from 'react-hot-toast';

export const AirflowJobs = () => {
  const [dags, setDags] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDags = async () => {
    setLoading(true);
    const data = await airflowAPI.getDags();
    setDags(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDags();
  }, []);

  const handleTriggerDag = async (dagId) => {
    toast.loading(`Triggering Airflow DAG '${dagId}'...`);
    try {
      await airflowAPI.triggerDag(dagId);
      toast.dismiss();
      toast.success(`Airflow DAG '${dagId}' triggered successfully!`);
      fetchDags();
    } catch (e) {
      toast.dismiss();
      toast.error('Triggered DAG execution mock run');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Apache Airflow DAG Orchestration</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Automated Cron Scheduling & Task Dependency Graph Status</p>
        </div>
      </div>

      {/* DAGs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dags.map((dag) => (
          <div key={dag.dag_id} className="glass-card p-6 rounded-2xl space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-health-500/10 text-health-600 rounded-xl">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[160px]">{dag.dag_id}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Cron: {dag.schedule}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">{dag.description}</p>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">{dag.tasks_count} Dependent Tasks</span>
              <button
                onClick={() => handleTriggerDag(dag.dag_id)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-health-600 to-tealAccent-600 text-white font-bold text-xs rounded-xl hover:opacity-95 shadow-sm"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Trigger DAG</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DAG Graph View Visual Representation */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">DAG Graph Dependency Graph View</h3>
        <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4 text-xs font-mono text-slate-300">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>healthcare_medallion_etl_dag (State: SUCCESS)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="p-3 bg-slate-800 rounded-xl border border-emerald-500/30 text-center">
              <p className="text-emerald-400 font-bold">ingest_raw_bronze</p>
              <span className="text-[10px] text-slate-500">2.1s • success</span>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl border border-emerald-500/30 text-center">
              <p className="text-emerald-400 font-bold">pyspark_silver_clean</p>
              <span className="text-[10px] text-slate-500">6.4s • success</span>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl border border-emerald-500/30 text-center">
              <p className="text-emerald-400 font-bold">gold_aggregations</p>
              <span className="text-[10px] text-slate-500">4.2s • success</span>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl border border-emerald-500/30 text-center">
              <p className="text-emerald-400 font-bold">data_quality_assertion</p>
              <span className="text-[10px] text-slate-500">1.8s • success</span>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl border border-emerald-500/30 text-center">
              <p className="text-emerald-400 font-bold">refresh_warehouse</p>
              <span className="text-[10px] text-slate-500">1.1s • success</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
