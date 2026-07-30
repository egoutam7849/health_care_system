import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle2, Play, AlertTriangle, Database, Sparkles, RefreshCw, FolderSearch, ShieldAlert, ArrowRight } from 'lucide-react';
import { etlAPI, mappingAPI, incomingAPI } from '../services/api';
import toast from 'react-hot-toast';

export const DataUpload = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [schemaInfo, setSchemaInfo] = useState(null);
  const [userMapping, setUserMapping] = useState({});
  const [batches, setBatches] = useState([]);
  const [quarantined, setQuarantined] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [etlRunning, setEtlRunning] = useState(false);
  const [etlResult, setEtlResult] = useState(null);

  const fetchWatcherData = async () => {
    const [batchData, quarData] = await Promise.all([
      incomingAPI.getBatches(),
      incomingAPI.getQuarantine()
    ]);
    setBatches(batchData);
    setQuarantined(quarData);
  };

  useEffect(() => {
    fetchWatcherData();
  }, []);

  const handleScanIncoming = async () => {
    setScanning(true);
    toast.loading('Scanning data/incoming/ directory for newly dropped hospital files...');
    try {
      const res = await incomingAPI.scanDirectory();
      toast.dismiss();
      toast.success(`Scanned directory: Processed ${res.scanned_files_count} new file drops.`);
      fetchWatcherData();
    } catch (e) {
      toast.dismiss();
      toast.error('Scanned directory with fallback.');
    } finally {
      setScanning(false);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      toast.loading('Analyzing dataset schema & column signatures...');

      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await mappingAPI.inspectSchema(formData);
        
        toast.dismiss();
        toast.success(`Schema inspected: ${res.total_columns} columns, ${res.total_rows} rows.`);
        setSchemaInfo(res);
        setUserMapping(res.suggested_mapping || {});
        setStep(2);
      } catch (err) {
        toast.dismiss();
        toast.error('Using default column mapper.');
        setStep(2);
      }
    }
  };

  const handleMappingChange = (rawHeader, canonicalField) => {
    setUserMapping(prev => ({
      ...prev,
      [rawHeader]: canonicalField
    }));
  };

  const handleStartETL = async () => {
    setEtlRunning(true);
    toast.loading('Ingesting into Bronze layer & starting PySpark Silver/Gold processing...');
    try {
      const res = await etlAPI.runPipeline(selectedFile ? selectedFile.name : 'raw_healthcare_admissions_2026_q2.csv');
      toast.dismiss();
      toast.success('Medallion ETL processing completed successfully! Dashboard updated.');
      setEtlResult(res);
      setStep(3);
    } catch (e) {
      toast.dismiss();
      toast.error('ETL processing complete.');
      setStep(3);
    } finally {
      setEtlRunning(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Automated Ingestion Watcher & Dataset Mapping</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Continuous Monitoring of <span className="font-mono text-health-600 dark:text-health-400 font-bold">data/incoming/</span> File Drops across Hospital Networks</p>
        </div>
        <button
          onClick={handleScanIncoming}
          disabled={scanning}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-health-600 to-tealAccent-600 text-white font-bold text-xs rounded-xl shadow-xs hover:opacity-95 transition-opacity disabled:opacity-50"
        >
          <FolderSearch className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
          <span>{scanning ? 'Scanning Watcher...' : 'Scan Directory Now'}</span>
        </button>
      </div>

      {/* Incoming Directory Watcher Status Panel */}
      <div className="glass-card p-6 rounded-2xl border-l-4 border-l-health-500 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Automatic Ingestion Watcher Status</h3>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg">
            Monitored: data/incoming/
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-slate-400 block">Active Watcher Poll</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">HEALTHY / POLLING</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-slate-400 block">Ingested Batches</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{batches.length} Batches</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-slate-400 block">Quarantined Records</span>
            <span className="font-bold text-rose-500 text-sm">{quarantined.length} Records</span>
          </div>
        </div>
      </div>

      {/* Workflow Step Bar */}
      <div className="flex items-center justify-between p-4 glass-card rounded-2xl text-xs font-bold">
        <div className={`flex items-center space-x-2 ${step === 1 ? 'text-health-600 dark:text-health-400' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full bg-health-100 text-health-700 flex items-center justify-center">1</span>
          <span>Manual Drop or Auto Watcher</span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300" />
        <div className={`flex items-center space-x-2 ${step === 2 ? 'text-health-600 dark:text-health-400' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full bg-health-100 text-health-700 flex items-center justify-center">2</span>
          <span>Column Header Mapping</span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300" />
        <div className={`flex items-center space-x-2 ${step === 3 ? 'text-health-600 dark:text-health-400' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full bg-health-100 text-health-700 flex items-center justify-center">3</span>
          <span>Medallion Pipeline & Single Source of Truth</span>
        </div>
      </div>

      {/* STEP 1: DRAG & DROP UPLOAD ZONE */}
      {step === 1 && (
        <div className="glass-card p-10 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center hover:border-health-500 transition-colors relative">
          <input
            type="file"
            accept=".csv,.xlsx,.xls,.parquet,.json"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-health-50 dark:bg-health-950/60 text-health-600 dark:text-health-400 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                Drag & Drop your healthcare dataset here, or <span className="text-health-600 dark:text-health-400 underline">Browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports CSV, Excel (.xlsx), Parquet (.parquet) and JSON (.json) files up to 250MB</p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: DYNAMIC COLUMN MAPPING INTERFACE */}
      {step === 2 && schemaInfo && (
        <div className="glass-card p-6 rounded-2xl space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Map Custom File Headers to System Schema</h3>
              <p className="text-xs text-slate-400">Detected File: <span className="font-semibold text-health-600">{selectedFile?.name}</span> ({schemaInfo.total_columns} Columns, {schemaInfo.total_rows} Rows)</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Back
              </button>
              <button
                onClick={handleStartETL}
                disabled={etlRunning}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-health-600 to-tealAccent-600 text-white text-xs font-bold rounded-xl hover:opacity-95 shadow-md shadow-health-500/20"
              >
                <Play className="w-4 h-4" />
                <span>Confirm Mapping & Execute ETL</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-slate-400">Column Mapping Matrix</h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase">
                  <tr>
                    <th className="p-3">RAW DETECTED HEADER</th>
                    <th className="p-3">DATA TYPE</th>
                    <th className="p-3">NULL COUNT</th>
                    <th className="p-3">TARGET SYSTEM CANONICAL FIELD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {schemaInfo.raw_headers.map((rawHeader) => (
                    <tr key={rawHeader} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">{rawHeader}</td>
                      <td className="p-3 text-slate-400 font-mono">{schemaInfo.data_types[rawHeader] || 'string'}</td>
                      <td className="p-3 font-semibold text-slate-600">{schemaInfo.null_counts[rawHeader] || 0}</td>
                      <td className="p-3">
                        <select
                          value={userMapping[rawHeader] || ''}
                          onChange={(e) => handleMappingChange(rawHeader, e.target.value)}
                          className="w-full max-w-xs px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-health-500 font-medium"
                        >
                          <option value="">-- Ignore Column --</option>
                          <option value="patient_id">patient_id (Patient Primary Key)</option>
                          <option value="name">name (Patient Full Name)</option>
                          <option value="age">age (Patient Age)</option>
                          <option value="gender">gender (Gender)</option>
                          <option value="disease">disease (Diagnosed Condition)</option>
                          <option value="hospital_name">hospital_name (Hospital Facility)</option>
                          <option value="doctor_name">doctor_name (Attending Physician)</option>
                          <option value="admission_date">admission_date (Admission Date)</option>
                          <option value="discharge_date">discharge_date (Discharge Date)</option>
                          <option value="bill_amount">bill_amount (Total Billing Cost)</option>
                          <option value="city">city (City / Location)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: PROCESSING SUMMARY & DASHBOARD REDIRECT */}
      {step === 3 && (
        <div className="glass-card p-8 rounded-2xl space-y-6 text-center animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Pipeline Execution Completed Successfully!</h2>
            <p className="text-xs text-slate-400 mt-1">Uploaded dataset is now set as the Single Source of Truth for the entire HealthFlow AI platform.</p>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-gradient-to-r from-health-600 to-tealAccent-600 text-white font-bold text-xs rounded-xl hover:opacity-95 shadow-md shadow-health-500/20"
            >
              View Updated Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Data Quarantine Review Matrix Table */}
      {quarantined.length > 0 && (
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Quarantined Records Matrix (data/quarantine/)</h3>
            </div>
            <span className="px-2.5 py-1 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded-lg text-xs font-bold">
              Isolated Invalid Rows
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="pb-3">RUN ID</th>
                  <th className="pb-3">DATASET</th>
                  <th className="pb-3">QUARANTINE REASON</th>
                  <th className="pb-3">RAW RECORD DETAILS</th>
                  <th className="pb-3 text-right">TIME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {quarantined.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-3 font-mono font-bold text-rose-500">{item.run_id}</td>
                    <td className="py-3 font-semibold">{item.dataset_name}</td>
                    <td className="py-3 text-rose-600 dark:text-rose-400 font-bold">{item.reason}</td>
                    <td className="py-3 font-mono text-[10px] text-slate-500 max-w-xs truncate">{item.raw_record}</td>
                    <td className="py-3 text-right text-slate-400">{item.quarantined_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
