import React, { useState, useEffect } from 'react';
import { Stethoscope, Award, Users, Star, Mail, Phone, Building2 } from 'lucide-react';
import { entitiesAPI } from '../services/api';

export const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    entitiesAPI.getDoctors().then((data) => {
      setDoctors(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Physicians & Specialists</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Medical Staff Profiles, Experience & Patient Success Rates</p>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div key={doc.id} className="glass-card p-6 rounded-2xl space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-health-500 to-tealAccent-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {doc.name.split(' ')[1]?.[0] || 'D'}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{doc.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-health-100 text-health-700 dark:bg-health-950 dark:text-health-300">
                    {doc.specialization}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-500 flex items-center space-x-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{doc.success_rate}%</span>
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Building2 className="w-4 h-4 text-health-500" />
              <span className="truncate">{doc.hospital_name}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block">Experience</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{doc.experience_years} Years</span>
              </div>
              <div>
                <span className="text-slate-400 block">Patients Treated</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{doc.total_patients}</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p className="flex items-center space-x-1.5"><Mail className="w-3 h-3" /> <span>{doc.email}</span></p>
              <p className="flex items-center space-x-1.5"><Phone className="w-3 h-3" /> <span>{doc.phone}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
