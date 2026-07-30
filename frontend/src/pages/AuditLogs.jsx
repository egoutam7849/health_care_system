import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Clock, Globe, Activity, Search } from 'lucide-react';
import { auditAPI } from '../services/api';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auditAPI.getLogs().then((data) => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  const filtered = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) || 
    l.user_email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Security & Platform Audit Logs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Immutable Trail of User Logins, Dataset Ingestions, Pipeline Triggers & Report Downloads</p>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search action or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-health-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="pb-3">TIMESTAMP</th>
                <th className="pb-3">USER ACCOUNT</th>
                <th className="pb-3">ACTION CATEGORY</th>
                <th className="pb-3">ACTION DETAILS</th>
                <th className="pb-3">IP ADDRESS</th>
                <th className="pb-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 text-slate-400 font-mono">{log.timestamp}</td>
                  <td className="py-3 font-bold text-slate-800 dark:text-slate-200">{log.user_email}</td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-health-100 text-health-700 dark:bg-health-950 dark:text-health-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">{log.details}</td>
                  <td className="py-3 text-slate-400 font-mono">{log.ip_address}</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {log.status}
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
