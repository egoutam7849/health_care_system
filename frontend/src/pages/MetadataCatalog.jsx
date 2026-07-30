import React from 'react';
import { Database, FileCode, Layers, ShieldCheck, Sparkles } from 'lucide-react';

export const MetadataCatalog = () => {
  const schemas = [
    { name: 'patients_raw.parquet', layer: 'Bronze', columns: 11, rows: 10000, version: 'v1.0', checksum: 'e10adc3949ba59abbe56e057f20f883e', owner: 'Data Engineering Team' },
    { name: 'patients_clean.parquet', layer: 'Silver', columns: 11, rows: 9805, version: 'v1.1-pyspark', checksum: 'c33367701511b4f6020ec61ded352059', owner: 'PySpark Cleaning Engine' },
    { name: 'hospital_summary.parquet', layer: 'Gold', columns: 8, rows: 8, version: 'v2.0-gold', checksum: 'fb25a13346f140ef87a4128f7e6f98c4', owner: 'Gold Aggregation Engine' },
    { name: 'FactAdmissions', layer: 'Warehouse', columns: 9, rows: 441225, version: 'Star Schema v1', checksum: 'a1b2c3d4e5f67890123456789abcdef0', owner: 'Star Schema Warehouse' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
          <Database className="w-7 h-7 text-health-600 dark:text-health-400" />
          <span>Metadata Catalog & Schema Registry</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enterprise catalog tracking Medallion datasets, column definitions, checksums, and schema evolution</p>
      </div>

      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Registered Data Objects</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
              <tr>
                <th className="pb-3">DATASET OBJECT</th>
                <th className="pb-3">MEDALLION LAYER</th>
                <th className="pb-3">SCHEMA VERSION</th>
                <th className="pb-3">COLUMNS / ROWS</th>
                <th className="pb-3">MD5 CHECKSUM</th>
                <th className="pb-3 text-right">OWNER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {schemas.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 font-mono font-bold text-slate-800 dark:text-slate-200">{s.name}</td>
                  <td className="py-3 font-bold text-health-600 dark:text-health-400">{s.layer}</td>
                  <td className="py-3 font-medium">{s.version}</td>
                  <td className="py-3 font-bold">{s.columns} Cols / {s.rows.toLocaleString()} Rows</td>
                  <td className="py-3 font-mono text-[10px] text-slate-400">{s.checksum.substring(0, 16)}...</td>
                  <td className="py-3 text-right font-medium text-slate-600">{s.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
