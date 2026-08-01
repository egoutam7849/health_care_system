import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, User, 
  Stethoscope, Building2, Plus, Edit, Trash2, X, Check, Search, Filter, RefreshCw
} from 'lucide-react';
import { entitiesAPI } from '../services/api';
import toast from 'react-hot-toast';

export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [hospitalsList, setHospitalsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingApt, setEditingApt] = useState(null);
  const [deletingApt, setDeletingApt] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const initialForm = {
    appointment_id: '',
    patient_name: '',
    doctor_name: '',
    hospital_name: 'Metro General Hospital',
    department: 'Cardiology',
    appointment_date: new Date().toISOString().split('T')[0],
    time_slot: '10:00 AM',
    reason: 'Specialist Consultation and follow-up review',
    status: 'Upcoming'
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const [aptsData, patsData, docsData, hospsData] = await Promise.all([
        entitiesAPI.getAppointments({ search: search || undefined, status: activeTab === 'All' ? undefined : activeTab }),
        entitiesAPI.getPatients(),
        entitiesAPI.getDoctors(),
        entitiesAPI.getHospitals()
      ]);
      setAppointments(aptsData);
      setPatientsList(patsData);
      setDoctorsList(docsData);
      setHospitalsList(hospsData);
    } catch (err) {
      toast.error('Failed to load appointments timeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [activeTab, search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenAdd = () => {
    const defaultPat = patientsList[0]?.name || 'Emily Watson';
    const defaultDoc = doctorsList[0]?.name || 'Dr. Alexander Wright';
    const defaultHosp = hospitalsList[0]?.name || 'Metro General Hospital';
    
    setFormData({
      ...initialForm,
      appointment_id: `APT-${Math.floor(9000 + Math.random() * 999)}`,
      patient_name: defaultPat,
      doctor_name: defaultDoc,
      hospital_name: defaultHosp
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (apt) => {
    setEditingApt(apt);
    setFormData({
      appointment_id: apt.appointment_id || '',
      patient_name: apt.patient_name || '',
      doctor_name: apt.doctor_name || '',
      hospital_name: apt.hospital_name || 'Metro General Hospital',
      department: apt.department || 'General Medicine',
      appointment_date: apt.appointment_date || new Date().toISOString().split('T')[0],
      time_slot: apt.time_slot || '10:00 AM',
      reason: apt.reason || '',
      status: apt.status || 'Upcoming'
    });
  };

  const handleSaveAppointment = async (e) => {
    e.preventDefault();
    if (!formData.patient_name || !formData.doctor_name || !formData.appointment_date) {
      toast.error('Please specify Patient, Doctor, and Appointment Date');
      return;
    }

    setSaving(true);
    const toastId = toast.loading(editingApt ? 'Updating Appointment...' : 'Scheduling Appointment...');
    try {
      if (editingApt) {
        await entitiesAPI.updateAppointment(editingApt.id, formData);
        toast.success('Appointment updated successfully in PostgreSQL!', { id: toastId });
        setEditingApt(null);
      } else {
        await entitiesAPI.createAppointment(formData);
        toast.success('New Appointment scheduled successfully!', { id: toastId });
        setIsAddOpen(false);
      }
      fetchAppointments();
    } catch (err) {
      toast.error('Failed to save appointment.', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatusUpdate = async (apt, newStatus) => {
    const toastId = toast.loading(`Updating status to ${newStatus}...`);
    try {
      await entitiesAPI.updateAppointment(apt.id, { status: newStatus });
      toast.success(`Appointment marked as ${newStatus}!`, { id: toastId });
      fetchAppointments();
    } catch (err) {
      toast.error('Failed to update status', { id: toastId });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingApt) return;
    const toastId = toast.loading(`Deleting appointment ${deletingApt.appointment_id}...`);
    try {
      await entitiesAPI.deleteAppointment(deletingApt.id);
      toast.success('Appointment deleted successfully!', { id: toastId });
      setDeletingApt(null);
      fetchAppointments();
    } catch (err) {
      toast.error('Failed to delete appointment', { id: toastId });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Patient Appointments Schedule</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time Appointment Calendar & Doctor Allocation synced with PostgreSQL</p>
        </div>
        
        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-health-600 to-tealAccent-600 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Appointment</span>
        </button>
      </div>

      {/* Filter & Status Toolbar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Patient, Doctor, ID, Department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-health-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold shrink-0">
          {['All', 'Upcoming', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setActiveTab(st)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === st ? 'bg-white dark:bg-slate-900 text-health-600 dark:text-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List View */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        {loading ? (
          <div className="py-12 text-center text-slate-400 animate-pulse">Loading Appointments Timeline...</div>
        ) : appointments.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <p className="font-bold text-sm">No Appointments Found</p>
            <p className="text-xs">Click "Create Appointment" to schedule a patient consultation.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-health-500/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-health-100 text-health-600 dark:bg-health-950 dark:text-health-400 rounded-2xl shrink-0">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] font-extrabold text-health-600 dark:text-health-400">{apt.appointment_id}</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{apt.patient_name}</h4>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Doctor: {apt.doctor_name}</span>
                      <span>•</span>
                      <span>{apt.hospital_name}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-health-500" />
                    <span className="font-bold">{apt.appointment_date} @ {apt.time_slot}</span>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {apt.department}
                  </span>

                  <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                    apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                    apt.status === 'Upcoming' ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300' :
                    'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {apt.status}
                  </span>

                  {/* Quick Action Dropdown/Buttons */}
                  <div className="flex items-center space-x-1">
                    {apt.status === 'Upcoming' && (
                      <button
                        onClick={() => handleQuickStatusUpdate(apt, 'Completed')}
                        className="px-2 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-[10px] font-bold"
                        title="Mark Completed"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenEdit(apt)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg"
                      title="Edit Appointment"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingApt(apt)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                      title="Cancel/Delete Appointment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE & EDIT APPOINTMENT MODAL */}
      {(isAddOpen || editingApt) && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {editingApt ? `Edit Appointment (${editingApt.appointment_id})` : 'Schedule New Appointment'}
              </h3>
              <button onClick={() => { setIsAddOpen(false); setEditingApt(null); }} className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAppointment} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Appointment ID *</label>
                  <input
                    type="text"
                    name="appointment_id"
                    value={formData.appointment_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono focus:border-health-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Patient Name *</label>
                  <input
                    type="text"
                    name="patient_name"
                    value={formData.patient_name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Emily Watson"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:border-health-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Doctor Name *</label>
                  <input
                    type="text"
                    name="doctor_name"
                    value={formData.doctor_name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Dr. Alexander Wright"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:border-health-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Hospital Facility *</label>
                  <input
                    type="text"
                    name="hospital_name"
                    value={formData.hospital_name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Metro General Hospital"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:border-health-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:border-health-500 focus:outline-none"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Oncology">Oncology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="General Medicine">General Medicine</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Date *</label>
                  <input
                    type="date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:border-health-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Time Slot</label>
                  <input
                    type="text"
                    name="time_slot"
                    value={formData.time_slot}
                    onChange={handleInputChange}
                    placeholder="e.g. 10:30 AM"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:border-health-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:border-health-500 focus:outline-none"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => { setIsAddOpen(false); setEditingApt(null); }}
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
                  <span>{saving ? 'Saving...' : 'Save Appointment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingApt && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm p-6 space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Delete Appointment?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to delete appointment <span className="font-bold text-slate-700 dark:text-slate-200">{deletingApt.appointment_id}</span> ({deletingApt.patient_name})?
              </p>
            </div>
            <div className="flex justify-center space-x-2 pt-2 text-xs">
              <button onClick={() => setDeletingApt(null)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 font-bold rounded-xl">
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

export default Appointments;
