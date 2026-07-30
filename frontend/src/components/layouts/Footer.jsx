import React from 'react';

export const Footer = () => {
  return (
    <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500">
      <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-6 gap-2">
        <p>© 2026 HealthFlow AI – Enterprise Healthcare Data Engineering & Analytics Platform</p>
        <div className="flex items-center space-x-4">
          <span className="hover:text-health-500 cursor-pointer">Medallion Engine (PySpark)</span>
          <span>•</span>
          <span className="hover:text-health-500 cursor-pointer">Airflow DAG Orchestrator</span>
          <span>•</span>
          <span className="hover:text-health-500 cursor-pointer">Data Quality Suite</span>
        </div>
      </div>
    </footer>
  );
};
