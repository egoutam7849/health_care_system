import React, { useState, useEffect } from 'react';
import { Building2, BedDouble, DollarSign, Star, MapPin, Users, Activity } from 'lucide-react';
import { entitiesAPI } from '../services/api';

export const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    entitiesAPI.getHospitals().then((data) => {
      setHospitals(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Healthcare Facilities & Hospitals</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bed Occupancy Rates, Financial Performance, and Ratings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hosp) => {
          const occupancyPct = Math.round((hosp.occupied_beds / hosp.total_beds) * 100);
          return (
            <div key={hosp.id} className="glass-card p-6 rounded-2xl space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{hosp.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{hosp.city}</span>
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-xs">
                  ⭐ {hosp.rating}
                </span>
              </div>

              {/* Occupancy Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Bed Occupancy</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{hosp.occupied_beds} / {hosp.total_beds} ({occupancyPct}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-health-500 to-tealAccent-500 rounded-full" style={{ width: `${occupancyPct}%` }} />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Revenue</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">${(hosp.total_revenue / 1000000).toFixed(1)}M</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Doctors</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{hosp.doctors_count}</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Patients</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{hosp.patients_count}</span>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="h-24 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-semibold relative overflow-hidden">
                <div className="absolute inset-0 bg-radial from-transparent to-slate-900/10 pointer-events-none" />
                <span className="flex items-center space-x-1"><MapPin className="w-4 h-4 text-rose-500 animate-bounce" /> <span>GIS Facility Map View</span></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
