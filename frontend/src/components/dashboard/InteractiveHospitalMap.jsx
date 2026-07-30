import React, { useState } from 'react';
import { MapPin, Building2, Activity, BedDouble, DollarSign, Star, ShieldAlert } from 'lucide-react';

export const InteractiveHospitalMap = () => {
  const [selectedHospital, setSelectedHospital] = useState({
    id: 'HOSP-101',
    name: 'Metro General Hospital',
    city: 'New York, NY',
    total_beds: 450,
    occupied_beds: 395,
    available_beds: 55,
    occupancy_rate: 87.8,
    emergency_cases: 24,
    revenue: 14250000,
    rating: 4.8,
    status: 'OPTIMAL',
    coordinates: { x: '78%', y: '32%' }
  });

  const hospitals = [
    {
      id: 'HOSP-101',
      name: 'Metro General Hospital',
      city: 'New York, NY',
      total_beds: 450,
      occupied_beds: 395,
      available_beds: 55,
      occupancy_rate: 87.8,
      emergency_cases: 24,
      revenue: 14250000,
      rating: 4.8,
      status: 'OPTIMAL',
      coordinates: { x: '78%', y: '32%' }
    },
    {
      id: 'HOSP-102',
      name: 'Johns Hopkins Medical Center',
      city: 'Baltimore, MD',
      total_beds: 600,
      occupied_beds: 520,
      available_beds: 80,
      occupancy_rate: 86.7,
      emergency_cases: 31,
      revenue: 22500000,
      rating: 4.9,
      status: 'HIGH LOAD',
      coordinates: { x: '74%', y: '42%' }
    },
    {
      id: 'HOSP-103',
      name: 'Mayo Clinic Healthcare System',
      city: 'Rochester, MN',
      total_beds: 550,
      occupied_beds: 480,
      available_beds: 70,
      occupancy_rate: 87.2,
      emergency_cases: 18,
      revenue: 19800000,
      rating: 4.9,
      status: 'OPTIMAL',
      coordinates: { x: '52%', y: '28%' }
    },
    {
      id: 'HOSP-104',
      name: 'Cleveland Clinic',
      city: 'Cleveland, OH',
      total_beds: 500,
      occupied_beds: 410,
      available_beds: 90,
      occupancy_rate: 82.0,
      emergency_cases: 15,
      revenue: 16400000,
      rating: 4.8,
      status: 'OPTIMAL',
      coordinates: { x: '68%', y: '36%' }
    },
    {
      id: 'HOSP-105',
      name: 'Massachusetts General Hospital',
      city: 'Boston, MA',
      total_beds: 480,
      occupied_beds: 430,
      available_beds: 50,
      occupancy_rate: 89.5,
      emergency_cases: 28,
      revenue: 17800000,
      rating: 4.9,
      status: 'HIGH LOAD',
      coordinates: { x: '84%', y: '26%' }
    }
  ];

  return (
    <div className="glass-card p-6 rounded-3xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-health-600 dark:text-health-400" />
            <span>Interactive Hospital Command Center Map</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Real-time bed availability, emergency capacity & regional revenue distribution</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            5 Facilities Active
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            ICU Occupancy: 84%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* US GIS Map Canvas Container */}
        <div className="lg:col-span-2 relative h-80 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 p-4 flex items-center justify-center">
          {/* Grid Blueprint Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40" />

          {/* SVG US Continent Contour */}
          <svg className="w-full h-full opacity-20 text-health-500 fill-current" viewBox="0 0 1000 600">
            <path d="M150,150 Q200,80 400,100 Q600,60 850,120 Q950,200 900,350 Q800,500 600,480 Q400,550 200,450 Q80,350 150,150 Z" />
          </svg>

          {/* Map Hospital Pin Markers */}
          {hospitals.map((h) => {
            const isSelected = selectedHospital.id === h.id;
            return (
              <button
                key={h.id}
                onClick={() => setSelectedHospital(h)}
                style={{ left: h.coordinates.x, top: h.coordinates.y }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group z-20`}
              >
                <div className="relative">
                  <span className={`w-4 h-4 rounded-full block ${isSelected ? 'bg-health-500 animate-ping' : 'bg-teal-400'}`} />
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center -mt-5 -ml-1 ${isSelected ? 'bg-health-600 text-white shadow-lg shadow-health-500/50 scale-125' : 'bg-slate-800 text-teal-400 border border-teal-500/40'}`}>
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950 text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-800 shadow-xl pointer-events-none z-30">
                    {h.name} ({h.city})
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Hospital Facility Card */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-health-100 text-health-700 dark:bg-health-950 dark:text-health-300 font-bold text-[10px] rounded-lg uppercase">
                {selectedHospital.id}
              </span>
              <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{selectedHospital.rating}</span>
              </div>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">{selectedHospital.name}</h4>
              <span className="text-xs text-slate-400">{selectedHospital.city}</span>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between items-center text-slate-500">
                <span>Bed Occupancy</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedHospital.occupied_beds} / {selectedHospital.total_beds} ({selectedHospital.occupancy_rate}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div style={{ width: `${selectedHospital.occupancy_rate}%` }} className="h-full bg-gradient-to-r from-health-500 to-tealAccent-500 rounded-full" />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Available Beds</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedHospital.available_beds} Beds</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Emergency Cases</span>
                  <span className="font-bold text-rose-500">{selectedHospital.emergency_cases} Cases</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">YTD Revenue</span>
            <span className="font-bold text-health-600 dark:text-health-400">${(selectedHospital.revenue / 1e6).toFixed(1)}M</span>
          </div>
        </div>
      </div>
    </div>
  );
};
