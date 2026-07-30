import React, { useState } from 'react';
import { Search, X, User, Building2, Stethoscope, Activity, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const mockResults = [
    { type: 'patient', name: 'Emily Watson', detail: 'ID: PAT-1001 • Cardiovascular Disease', url: '/patients' },
    { type: 'doctor', name: 'Dr. Alexander Wright', detail: 'Cardiology • Metro General Hospital', url: '/doctors' },
    { type: 'hospital', name: 'Metro General Hospital', detail: 'New York • 450 Beds (87.8% Occupancy)', url: '/hospitals' },
    { type: 'dataset', name: 'patients_clean.parquet', detail: 'Silver Layer • 9,805 Processed Rows', url: '/silver' },
    { type: 'report', name: 'hospitals_summary_report.pdf', detail: 'Gold Executive Report Export', url: '/reports' }
  ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()) || item.detail.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (url) => {
    onClose();
    navigate(url);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
      <div className="glass-card w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Patients, Doctors, Hospitals, Datasets, Reports..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-medium"
            autoFocus
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {mockResults.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No matching healthcare entities found for "{query}"</div>
          ) : (
            mockResults.map((res, idx) => (
              <div
                key={idx}
                onClick={() => handleSelect(res.url)}
                className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition-colors text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{res.name}</span>
                  <span className="text-slate-400 text-[11px]">{res.detail}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
