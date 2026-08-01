import React, { useState } from 'react';
import { Badge } from '../components/common/Badge';
import { FileText, Download, Activity, FlaskConical, Stethoscope, ChevronDown } from 'lucide-react';
import { LabResultViewer } from '../components/doctor/LabResultViewer';
import toast from 'react-hot-toast';

const MOCK_RECORDS = [
  { id: 1, type: 'Lab Report', title: 'Complete Blood Count (CBC)', date: '2026-07-28', provider: 'Metro General Lab', status: 'Available', data: { test_name: 'CBC', lab_id: 'LAB-9921', date: '2026-07-28', results: [{ test: 'Hemoglobin', value: '14.2', unit: 'g/dL', reference: '13.0-17.0', status: 'normal' }] } },
  { id: 2, type: 'Clinical Note', title: 'Cardiology Follow-up', date: '2026-06-22', provider: 'Dr. Sarah Wilson', status: 'Available' },
  { id: 3, type: 'Imaging', title: 'Chest X-Ray', date: '2026-01-15', provider: 'Metro Imaging Center', status: 'Available' },
];

export const PatientRecords = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleDownload = (e) => {
    e.stopPropagation();
    toast.success('Document download started');
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-12 space-y-6">
      <div>
        <h1 className="text-xl font-black text-txt-primary">Medical Records</h1>
        <p className="text-xs text-txt-muted mt-1">Access your clinical notes, lab reports, and imaging results</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Record List */}
        <div className="space-y-3">
          {MOCK_RECORDS.map(record => (
            <div
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className={`p-4 rounded-2xl border cursor-pointer transition-colors ${
                selectedRecord?.id === record.id ? 'bg-blue-500/10 border-accent-blue shadow-md shadow-blue-500/10' : 'bg-dark-section border-white/[0.08] hover:border-white/20 hover:bg-dark-hover'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  record.type === 'Lab Report' ? 'bg-orange-500/10 text-accent-orange' :
                  record.type === 'Imaging' ? 'bg-purple-500/10 text-accent-purple' : 'bg-blue-500/10 text-accent-blue'
                }`}>
                  {record.type === 'Lab Report' ? <FlaskConical className="w-5 h-5" /> :
                   record.type === 'Imaging' ? <Activity className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-txt-primary text-sm truncate">{record.title}</div>
                  <div className="text-[10px] text-txt-muted mt-0.5">{record.type} • {record.provider}</div>
                  <div className="text-[10px] font-mono text-txt-muted mt-2">{record.date}</div>
                </div>
                <button onClick={handleDownload} className="p-2 text-txt-muted hover:text-accent-blue transition-colors rounded-lg hover:bg-dark-card">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Record Viewer */}
        <div className="lg:col-span-2">
          {selectedRecord ? (
            <div className="p-5 bg-dark-section rounded-2xl border border-white/[0.08] shadow-xl min-h-[400px]">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-lg font-black text-txt-primary">{selectedRecord.title}</h2>
                  <div className="text-xs text-txt-muted mt-1">{selectedRecord.provider} • {selectedRecord.date}</div>
                </div>
                <button onClick={handleDownload} className="flex items-center gap-2 px-3 py-1.5 bg-dark-card border border-white/[0.08] hover:bg-dark-hover text-xs font-bold rounded-lg transition-colors">
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>

              {selectedRecord.type === 'Lab Report' && selectedRecord.data ? (
                <LabResultViewer report={selectedRecord.data} />
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <FileText className="w-12 h-12 text-txt-muted mb-4 opacity-50" />
                  <div className="font-bold text-txt-primary">Document Viewer</div>
                  <p className="text-xs text-txt-muted mt-2 max-w-sm">This document is available as a PDF download. Click the download button above to save it to your device.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 bg-dark-section rounded-2xl border border-dashed border-white/[0.08] flex flex-col items-center justify-center text-center min-h-[400px]">
              <FileText className="w-12 h-12 text-txt-muted mb-4 opacity-50" />
              <div className="font-bold text-txt-primary">Select a Record</div>
              <p className="text-xs text-txt-muted mt-2">Click on a document from the list to view its contents or download it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientRecords;
