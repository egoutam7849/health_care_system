import React, { useState } from 'react';
import {
  FolderOpen, FileText, Download, Search, Eye, Filter,
  Shield, Pill, FlaskConical, CreditCard, Award, Heart
} from 'lucide-react';
import toast from 'react-hot-toast';

const DOCUMENTS = [
  { id: 1, name: 'Cardiology Consultation Summary.pdf', category: 'Medical Certificates', type: 'PDF', size: '2.4 MB', date: '2026-07-15', doctor: 'Dr. John Smith', icon: FileText },
  { id: 2, name: 'Prescription_Atorvastatin_Lisinopril.pdf', category: 'Prescriptions', type: 'PDF', size: '1.1 MB', date: '2026-06-12', doctor: 'Dr. John Smith', icon: Pill },
  { id: 3, name: 'Comprehensive_Metabolic_Panel_Lab_Report.pdf', category: 'Lab Reports', type: 'PDF', size: '3.8 MB', date: '2026-06-28', doctor: 'Dr. John Smith', icon: FlaskConical },
  { id: 4, name: 'Hospital_Discharge_Summary_MetroGeneral.pdf', category: 'Discharge Summaries', type: 'PDF', size: '4.5 MB', date: '2026-06-15', doctor: 'Dr. John Smith', icon: Heart },
  { id: 5, name: 'Insurance_Claim_Invoice_INV-2026-001.pdf', category: 'Invoices', type: 'PDF', size: '1.8 MB', date: '2026-07-15', doctor: 'Metro General Hospital', icon: CreditCard },
  { id: 6, name: 'Health_Insurance_Policy_Card_2026.pdf', category: 'Insurance Documents', type: 'PDF', size: '2.1 MB', date: '2026-01-01', doctor: 'BlueCross BlueShield', icon: Shield },
  { id: 7, name: 'COVID19_Flu_Vaccination_Certificate.pdf', category: 'Vaccination Records', type: 'PDF', size: '1.4 MB', date: '2025-10-10', doctor: 'City Clinic', icon: Award }
];

export const PatientDocuments = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const CATEGORIES = [
    'All', 'Prescriptions', 'Lab Reports', 'Medical Certificates',
    'Insurance Documents', 'Invoices', 'Vaccination Records', 'Discharge Summaries'
  ];

  const filtered = DOCUMENTS.filter(d => {
    const matchCat = category === 'All' || d.category === category;
    const matchQuery = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.doctor.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleDownload = (doc) => {
    toast.success(`Downloading ${doc.name}...`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      <div>
        <h1 className="text-xl font-black text-txt-primary">Documents</h1>
        <p className="text-xs text-txt-muted mt-0.5">Securely store and access your medical documents</p>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted" />
          <input
            type="text"
            placeholder="Search documents by name or doctor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-section border border-white/[0.08] rounded-xl text-xs text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-accent-emerald/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                category === cat
                  ? 'bg-accent-emerald text-white border-emerald-500/50 shadow-md shadow-emerald-500/20'
                  : 'bg-dark-section border-white/[0.08] text-txt-muted hover:text-txt-primary hover:bg-dark-card'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <FolderOpen className="w-12 h-12 text-txt-muted/30 mb-3" />
          <p className="font-black text-sm text-txt-primary">No documents found</p>
          <p className="text-xs text-txt-muted mt-1">Try adjusting your search or category filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(doc => {
            const Icon = doc.icon;
            return (
              <div
                key={doc.id}
                className="p-4 rounded-2xl border border-white/[0.08] bg-dark-section hover:border-white/[0.15] hover:bg-dark-card transition-all flex items-start gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-accent-emerald" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xs text-txt-primary truncate group-hover:text-accent-emerald transition-colors">
                    {doc.name}
                  </h3>
                  <div className="text-[10px] text-txt-muted mt-1 flex items-center gap-2">
                    <span>{doc.date}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                  </div>
                  <div className="text-[10px] text-txt-disabled mt-0.5 truncate">
                    Provider: {doc.doctor}
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(doc)}
                  className="p-2 rounded-xl bg-dark-card border border-white/[0.08] text-txt-muted hover:text-accent-emerald hover:bg-emerald-500/10 transition-colors shrink-0"
                  title="Download Document"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PatientDocuments;
