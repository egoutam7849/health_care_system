import React from 'react';
import { FileText, Download, FileSpreadsheet, Printer, Share2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const Reports = () => {
  const reportsList = [
    { title: 'Patient Executive Admissions & Financial Summary', category: 'Patient Analytics', records: 9805, format: 'CSV / Excel / PDF' },
    { title: 'Hospital Network Bed Occupancy & Revenue Report', category: 'Hospital Operations', records: 8, format: 'CSV / PDF' },
    { title: 'Epidemiological Disease Prevalence & Readmission Study', category: 'Disease Analytics', records: 12, format: 'CSV / PDF' },
    { title: 'Q2 Enterprise Healthcare Financial Run-Rate Summary', category: 'Financial Audit', records: 45, format: 'PDF / Excel' },
  ];

  const handleDownload = (name) => {
    toast.success(`Generating & downloading ${name}...`);
    window.open('http://localhost:8000/api/v1/reports/export/patients', '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Healthcare Analytical Reports & PDF Exports</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Generate Executive PDF Summaries, Financial Audits & Raw CSV Datasets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportsList.map((report, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-health-500/10 text-health-600 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-tealAccent-600 uppercase tracking-wider">{report.category}</span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">{report.title}</h3>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">{report.records} Data Rows</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownload(report.title)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-health-500 hover:bg-health-600 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
