import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, User, Stethoscope, Building2, Calendar, FileSpreadsheet } from 'lucide-react';
import { entitiesAPI } from '../services/api';
import toast from 'react-hot-toast';

export const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [diseaseFilter, setDiseaseFilter] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    setLoading(true);
    const data = await entitiesAPI.getPatients({
      search: search || undefined,
      gender: genderFilter || undefined,
      disease: diseaseFilter || undefined,
      hospital: hospitalFilter || undefined
    });
    setPatients(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, [search, genderFilter, diseaseFilter, hospitalFilter]);

  const handleExportCSV = () => {
    toast.success('Downloading Patient Directory CSV Export...');
    window.open('http://localhost:8000/api/v1/reports/export/patients', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Patient Record Registry</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Searchable healthcare directory synced from Silver & Gold Medallion tables</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-card p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Patient Name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-health-500 focus:outline-none"
          />
        </div>

        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-health-500 focus:outline-none"
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select
          value={diseaseFilter}
          onChange={(e) => setDiseaseFilter(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-health-500 focus:outline-none"
        >
          <option value="">All Diagnosed Diseases</option>
          <option value="Cardiovascular Disease">Cardiovascular Disease</option>
          <option value="Diabetes Mellitus Type II">Diabetes Mellitus Type II</option>
          <option value="Pneumonia">Pneumonia</option>
          <option value="Asthma">Asthma</option>
          <option value="Hypertension">Hypertension</option>
        </select>

        <select
          value={hospitalFilter}
          onChange={(e) => setHospitalFilter(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-health-500 focus:outline-none"
        >
          <option value="">All Hospitals</option>
          <option value="Metro General Hospital">Metro General</option>
          <option value="Johns Hopkins Medical Center">Johns Hopkins</option>
          <option value="Mayo Clinic Healthcare System">Mayo Clinic</option>
          <option value="St. Jude Children & Research Hospital">St. Jude</option>
        </select>
      </div>

      {/* Patient Table */}
      <div className="glass-card rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="pb-3">PATIENT ID</th>
                <th className="pb-3">NAME & AGE</th>
                <th className="pb-3">GENDER</th>
                <th className="pb-3">DIAGNOSED DISEASE</th>
                <th className="pb-3">HOSPITAL & DOCTOR</th>
                <th className="pb-3">ADMISSION / DISCHARGE</th>
                <th className="pb-3">BILL AMOUNT</th>
                <th className="pb-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-mono font-bold text-health-600 dark:text-health-400">{p.patient_id}</td>
                  <td className="py-3">
                    <p className="font-bold text-slate-900 dark:text-white">{p.name}</p>
                    <p className="text-[10px] text-slate-400">{p.age} Yrs • {p.city}</p>
                  </td>
                  <td className="py-3">{p.gender}</td>
                  <td className="py-3 font-medium text-slate-800 dark:text-slate-200">{p.disease}</td>
                  <td className="py-3">
                    <p className="font-medium">{p.hospital_name}</p>
                    <p className="text-[10px] text-slate-400">{p.doctor_name}</p>
                  </td>
                  <td className="py-3 text-slate-500">
                    <p>{p.admission_date}</p>
                    <p className="text-[10px] text-slate-400">{p.discharge_date || 'In Care'}</p>
                  </td>
                  <td className="py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ${p.bill_amount.toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'Discharged' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                    }`}>
                      {p.status}
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
