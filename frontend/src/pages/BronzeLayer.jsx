import React, { useState, useEffect } from 'react';
import { Database, Download, FileCode, HardDrive, Layers, Table } from 'lucide-react';
import { medallionAPI } from '../services/api';

export const BronzeLayer = () => {
  const [bronzeData, setBronzeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    medallionAPI.getBronze().then((data) => {
      setBronzeData(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              BRONZE LAYER
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Raw Unmodified Datasets</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Exact immutable raw data ingested from source feeds (CSV, Parquet, EHR Extract)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Total Raw Ingested Files</span>
          <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{bronzeData.length}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Total Raw Rows Tracked</span>
          <p className="text-2xl font-extrabold text-health-600 dark:text-health-400 mt-1">
            {bronzeData.reduce((acc, curr) => acc + curr.row_count, 0).toLocaleString()}
          </p>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Storage Location</span>
          <p className="text-sm font-bold font-mono text-slate-600 dark:text-slate-300 mt-2 truncate">
            /uploads/bronze/
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-6">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Ingested Raw Datasets Registry</h3>
        <div className="space-y-6">
          {bronzeData.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.filename}</h4>
                    <p className="text-xs text-slate-400">Source: {item.source} • Ingested: {item.upload_time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg">{item.format}</span>
                  <button className="flex items-center space-x-1 px-3 py-1 bg-health-500 text-white font-semibold rounded-lg hover:bg-health-600 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Raw</span>
                  </button>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div><span className="text-slate-400 block">Row Count</span> <span className="font-semibold">{item.row_count.toLocaleString()}</span></div>
                <div><span className="text-slate-400 block">Columns</span> <span className="font-semibold">{item.column_count}</span></div>
                <div><span className="text-slate-400 block">File Size</span> <span className="font-semibold">{item.file_size_kb} KB</span></div>
                <div><span className="text-slate-400 block">Storage Path</span> <span className="font-mono text-[10px] truncate block">{item.storage_path}</span></div>
              </div>

              {/* Schema JSON Viewer */}
              {item.schema && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Inferred Ingestion Schema:</span>
                  <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto">
                    <pre>{JSON.stringify(item.schema, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
