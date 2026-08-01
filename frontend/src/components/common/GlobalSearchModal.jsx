import React, { useState, useEffect } from 'react';
import { Search, X, User, Building2, Stethoscope, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { entitiesAPI } from '../../services/api';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ patients: [], doctors: [], hospitals: [], appointments: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setResults({ patients: [], doctors: [], hospitals: [], appointments: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await entitiesAPI.globalSearch(query);
        setResults(data || { patients: [], doctors: [], hospitals: [], appointments: [] });
      } catch (err) {
        console.error("Global search error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (url) => {
    onClose();
    navigate(url);
  };

  const hasAnyResults = Boolean(
    results.patients.length > 0 ||
    results.doctors.length > 0 ||
    results.hospitals.length > 0 ||
    results.appointments.length > 0
  );

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4">
      <div className="glass-card w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <Search className="w-5 h-5 text-health-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Patients, Doctors, Hospitals, Appointments, Diseases..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-medium"
            autoFocus
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Results List */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-3">
          {loading ? (
            <div className="p-6 text-center text-xs text-slate-400 animate-pulse">Searching PostgreSQL Database...</div>
          ) : !query ? (
            <div className="p-6 text-center text-xs text-slate-400">Type to search Patients, Doctors, Hospitals & Appointments across the platform.</div>
          ) : !hasAnyResults ? (
            <div className="p-6 text-center text-xs text-slate-400">No matching healthcare records found for "{query}"</div>
          ) : (
            <>
              {/* Patient Results */}
              {results.patients.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-health-500 uppercase tracking-wider px-2">Patients</span>
                  {results.patients.map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleSelect('/patients')}
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition-colors text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-health-500" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{p.name} ({p.patient_id})</span>
                          <span className="text-slate-400 text-[11px]">{p.disease} • {p.hospital_name}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Doctor Results */}
              {results.doctors.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-teal-500 uppercase tracking-wider px-2">Doctors</span>
                  {results.doctors.map(d => (
                    <div
                      key={d.id}
                      onClick={() => handleSelect('/doctors')}
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition-colors text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <Stethoscope className="w-4 h-4 text-teal-500" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{d.name} ({d.doc_id})</span>
                          <span className="text-slate-400 text-[11px]">{d.specialization} • {d.hospital_name}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Hospital Results */}
              {results.hospitals.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-purple-500 uppercase tracking-wider px-2">Hospitals</span>
                  {results.hospitals.map(h => (
                    <div
                      key={h.id}
                      onClick={() => handleSelect('/hospitals')}
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition-colors text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-purple-500" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{h.name}</span>
                          <span className="text-slate-400 text-[11px]">{h.city} • {h.total_beds} Total Beds</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Appointment Results */}
              {results.appointments.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-sky-500 uppercase tracking-wider px-2">Appointments</span>
                  {results.appointments.map(a => (
                    <div
                      key={a.id}
                      onClick={() => handleSelect('/appointments')}
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition-colors text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-sky-500" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{a.patient_name} with {a.doctor_name}</span>
                          <span className="text-slate-400 text-[11px]">{a.appointment_date} @ {a.time_slot} ({a.status})</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
