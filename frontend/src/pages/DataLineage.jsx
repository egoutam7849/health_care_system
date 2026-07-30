import React, { useState, useEffect } from 'react';
import { GitBranch, Clock, User, CheckCircle2, ArrowRight, Database, Sparkles, Trophy, Server, Layout } from 'lucide-react';
import { lineageAPI } from '../services/api';

export const DataLineage = () => {
  const [lineage, setLineage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lineageAPI.getGraph().then((data) => {
      setLineage(data);
      setLoading(false);
    });
  }, []);

  if (loading || !lineage) {
    return <div className="p-8 text-center text-sm text-slate-500">Loading Data Lineage Graph...</div>;
  }

  const { nodes, edges, recent_traces } = lineage;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">End-to-End Data Lineage & Provenance Visualizer</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Complete Graph Traceability: Ingestion Feed → Bronze Parquet → PySpark Clean → Silver Parquet → Gold Summary → Star Schema Warehouse → Dashboard
        </p>
      </div>

      {/* Visual Lineage Node Graph Diagram */}
      <div className="glass-card p-6 rounded-2xl overflow-x-auto">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-6">Medallion Data Flow Lineage DAG Graph</h3>
        <div className="flex items-center space-x-3 min-w-[1000px] py-4">
          {nodes.map((node, idx) => (
            <React.Fragment key={node.id}>
              <div className="flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-center relative shadow-xs hover:border-health-500 transition-colors">
                <div className="w-8 h-8 rounded-lg mx-auto flex items-center justify-center bg-health-500 text-white font-bold text-xs shadow-sm">
                  #{idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{node.label}</h4>
                  <span className="text-[10px] font-mono text-health-600 dark:text-health-400 block mt-1">{node.layer}</span>
                </div>
              </div>
              {idx < nodes.length - 1 && (
                <div className="flex flex-col items-center">
                  <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600 animate-pulse" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Recent Lineage Execution Traces Table */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Execution Provenance Audit Trail</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="pb-3">RUN ID</th>
                <th className="pb-3">DATASET</th>
                <th className="pb-3">TRANSFORMATION STEP</th>
                <th className="pb-3">RECORDS (IN → OUT)</th>
                <th className="pb-3">DURATION</th>
                <th className="pb-3">VERSION</th>
                <th className="pb-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recent_traces.map((trace) => (
                <tr key={trace.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-mono font-bold text-health-600 dark:text-health-400">{trace.run_id}</td>
                  <td className="py-3 font-medium">{trace.dataset}</td>
                  <td className="py-3 text-slate-700 dark:text-slate-300 font-semibold">{trace.step}</td>
                  <td className="py-3 font-mono">{trace.records_in.toLocaleString()} → <span className="font-bold text-emerald-600">{trace.records_out.toLocaleString()}</span></td>
                  <td className="py-3 text-slate-400">{trace.duration_sec}s</td>
                  <td className="py-3 font-mono text-[10px]">{trace.pipeline_version}</td>
                  <td className="py-3 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {trace.status}
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
