import React, { useState, useEffect } from 'react';
import { 
  Building2, BedDouble, DollarSign, Star, MapPin, Users, Activity, 
  Plus, Edit, Trash2, X, Check, Search, Phone, Mail, RefreshCw
} from 'lucide-react';
import { entitiesAPI } from '../services/api';
import toast from 'react-hot-toast';

export const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingHosp, setEditingHosp] = useState(null);
  const [deletingHosp, setDeletingHosp] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const initialForm = {
    hospital_id: '',
    name: '',
    address: '',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    email: '',
    phone: '',
    available_beds: 50,
    total_beds: 400,
    occupied_beds: 350,
    icu_beds: 25,
    departments_json: '["Cardiology", "Neurology", "Emergency"]',
    total_revenue: 15000000.0,
    rating: 4.8,
    doctors_count: 35,
    patients_count: 650
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const data = await entitiesAPI.getHospitals({ search: search || undefined, city: cityFilter || undefined });
      setHospitals(data);
    } catch (err) {
      toast.error('Failed to load hospitals data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [search, cityFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenAdd = () => {
    setFormData({
      ...initialForm,
      hospital_id: `HOSP-${Math.floor(100 + Math.random() * 900)}`
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (hosp) => {
    setEditingHosp(hosp);
    setFormData({
      hospital_id: hosp.hospital_id || '',
      name: hosp.name || '',
      address: hosp.address || '',
      city: hosp.city || 'New York',
      state: hosp.state || 'NY',
      country: hosp.country || 'USA',
      email: hosp.email || '',
      phone: hosp.phone || '',
      available_beds: hosp.available_beds || 50,
      total_beds: hosp.total_beds || 400,
      occupied_beds: hosp.occupied_beds || 350,
      icu_beds: hosp.icu_beds || 25,
      departments_json: hosp.departments_json || '[]',
      total_revenue: hosp.total_revenue || 0.0,
      rating: hosp.rating || 4.5,
      doctors_count: hosp.doctors_count || 15,
      patients_count: hosp.patients_count || 250
    });
  };

  const handleSaveHospital = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.city || !formData.total_beds) {
      toast.error('Please fill in required fields (Hospital Name, City, Total Beds)');
      return;
    }

    setSaving(true);
    const toastId = toast.loading(editingHosp ? 'Updating Hospital Facility...' : 'Adding Hospital Facility...');
    try {
      const payload = {
        ...formData,
        total_beds: parseInt(formData.total_beds || 400),
        occupied_beds: parseInt(formData.occupied_beds || 350),
        available_beds: Math.max(0, parseInt(formData.total_beds || 400) - parseInt(formData.occupied_beds || 350)),
        icu_beds: parseInt(formData.icu_beds || 20),
        rating: parseFloat(formData.rating || 4.5),
        total_revenue: parseFloat(formData.total_revenue || 0)
      };

      if (editingHosp) {
        await entitiesAPI.updateHospital(editingHosp.id, payload);
        toast.success('Hospital facility updated in PostgreSQL!', { id: toastId });
        setEditingHosp(null);
      } else {
        await entitiesAPI.createHospital(payload);
        toast.success('New Hospital facility added to network!', { id: toastId });
        setIsAddOpen(false);
      }
      fetchHospitals();
    } catch (err) {
      toast.error('Failed to save hospital record.', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingHosp) return;
    const toastId = toast.loading(`Deleting ${deletingHosp.name}...`);
    try {
      await entitiesAPI.deleteHospital(deletingHosp.id);
      toast.success(`Hospital facility ${deletingHosp.name} deleted successfully!`, { id: toastId });
      setDeletingHosp(null);
      fetchHospitals();
    } catch (err) {
      toast.error('Failed to delete hospital facility', { id: toastId });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Healthcare Facilities & Hospitals</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Bed Occupancy Rates, ICU Capacities & Financial Revenue metrics synced with PostgreSQL</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-health-600 to-tealAccent-600 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Hospital</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="glass-card p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Hospital Name, ID, City..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-health-500 focus:outline-none"
          />
        </div>

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-health-500 focus:outline-none"
        >
          <option value="">All Cities</option>
          <option value="New York">New York</option>
          <option value="Boston">Boston</option>
          <option value="Baltimore">Baltimore</option>
          <option value="Rochester">Rochester</option>
          <option value="Cleveland">Cleveland</option>
          <option value="Palo Alto">Palo Alto</option>
          <option value="Los Angeles">Los Angeles</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 animate-pulse">Loading Hospital Facilities...</div>
      ) : hospitals.length === 0 ? (
        <div className="py-12 text-center text-slate-400 space-y-2 glass-card rounded-3xl">
          <p className="font-bold text-sm">No Hospitals Found</p>
          <p className="text-xs">Click "Add New Hospital" above to add a healthcare facility.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hosp) => {
            const totalBeds = hosp.total_beds || 1;
            const occupied = hosp.occupied_beds || 0;
            const occupancyPct = Math.min(100, Math.round((occupied / totalBeds) * 100));
            return (
              <div key={hosp.id} className="glass-card p-6 rounded-3xl space-y-4 hover:shadow-xl transition-all duration-300 relative border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-extrabold text-health-600 dark:text-health-400 block">{hosp.hospital_id}</span>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">{hosp.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{hosp.city}, {hosp.state || 'NY'}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-xs">
                      ⭐ {hosp.rating}
                    </span>
                    <button onClick={() => handleOpenEdit(hosp)} className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeletingHosp(hosp)} className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bed Occupancy Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Total Bed Occupancy</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{occupied} / {totalBeds} ({occupancyPct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-health-500 to-tealAccent-500 rounded-full" style={{ width: `${occupancyPct}%` }} />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">ICU Beds</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{hosp.icu_beds || 20}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Doctors</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{hosp.doctors_count}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Patients</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{hosp.patients_count}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Annual Revenue</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">${(hosp.total_revenue / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE & EDIT HOSPITAL MODAL */}
      {(isAddOpen || editingHosp) && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {editingHosp ? `Edit Hospital Facility (${editingHosp.hospital_id})` : 'Add New Hospital Facility'}
              </h3>
              <button onClick={() => { setIsAddOpen(false); setEditingHosp(null); }} className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHospital} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Facility ID *</label>
                  <input
                    type="text"
                    name="hospital_id"
                    value={formData.hospital_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono focus:border-health-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Hospital Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Metro General Hospital"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:border-health-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. New York"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:border-health-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. NY"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:border-health-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Rating (1.0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:border-health-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Total Beds *</label>
                  <input
                    type="number"
                    name="total_beds"
                    value={formData.total_beds}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:border-health-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Occupied Beds</label>
                  <input
                    type="number"
                    name="occupied_beds"
                    value={formData.occupied_beds}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:border-health-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">ICU Beds</label>
                  <input
                    type="number"
                    name="icu_beds"
                    value={formData.icu_beds}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:border-health-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Total Revenue ($)</label>
                  <input
                    type="number"
                    step="1000"
                    name="total_revenue"
                    value={formData.total_revenue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:border-health-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 212-555-0100"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:border-health-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => { setIsAddOpen(false); setEditingHosp(null); }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-health-500 hover:bg-health-600 text-white font-bold rounded-xl shadow-md flex items-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Hospital Facility'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingHosp && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm p-6 space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Delete Hospital Facility?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to delete <span className="font-bold text-slate-700 dark:text-slate-200">{deletingHosp.name}</span> ({deletingHosp.hospital_id}) from PostgreSQL?
              </p>
            </div>
            <div className="flex justify-center space-x-2 pt-2 text-xs">
              <button onClick={() => setDeletingHosp(null)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 font-bold rounded-xl">
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md">
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hospitals;
