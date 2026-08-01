import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { portalsAPI } from '../services/api';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Calendar, Clock, MapPin, User, FileText, ChevronRight, Video, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  Upcoming: { variant: 'blue' },
  Completed: { variant: 'emerald' },
  Cancelled: { variant: 'slate' },
};

export const PatientAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    const fetchApts = async () => {
      try {
        const res = await portalsAPI.getPatientAppointments({ email: user?.email, patient_id: user?.patient_id });
        setAppointments(res?.appointments || res || []);
      } catch {
        // Fallback mock data
        setAppointments([
          { id: 1, doctor: 'Dr. Sarah Wilson', department: 'Cardiology', date: '2026-08-05', time: '10:00 AM', status: 'Upcoming', type: 'In-Person', location: 'Clinic 3A' },
          { id: 2, doctor: 'Dr. John Smith', department: 'General Medicine', date: '2026-08-12', time: '02:30 PM', status: 'Upcoming', type: 'Telehealth', location: 'Online Video' },
          { id: 3, doctor: 'Dr. Emily Chen', department: 'Dermatology', date: '2026-07-10', time: '09:15 AM', status: 'Completed', type: 'In-Person', location: 'Clinic 2B', notes: 'Routine skin check. No concerns.' },
          { id: 4, doctor: 'Dr. Sarah Wilson', department: 'Cardiology', date: '2026-06-22', time: '11:00 AM', status: 'Completed', type: 'In-Person', location: 'Clinic 3A', notes: 'ECG normal. Blood pressure slightly elevated.' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchApts();
  }, [user]);

  const displayed = appointments.filter(a => filter === 'all' || (filter === 'upcoming' ? a.status === 'Upcoming' : a.status !== 'Upcoming'));

  return (
    <div className="max-w-[1200px] mx-auto pb-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-txt-primary">My Appointments</h1>
          <p className="text-xs text-txt-muted mt-1">Manage your clinical schedule and telehealth visits</p>
        </div>
        <Button variant="primary" icon={Calendar} onClick={() => toast.success('Booking modal coming soon')}>
          Book New Appointment
        </Button>
      </div>

      <div className="flex items-center gap-1 p-1 bg-dark-section rounded-xl border border-white/[0.08] w-fit">
        {['upcoming', 'past', 'all'].map(v => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
              filter === v ? 'bg-accent-blue text-white shadow-md shadow-blue-500/20' : 'text-txt-muted hover:text-txt-primary hover:bg-dark-hover'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-txt-muted text-xs">Loading appointments...</div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-12 text-txt-muted text-xs bg-dark-section rounded-2xl border border-white/[0.08]">
            No {filter} appointments found.
          </div>
        ) : (
          displayed.map(apt => (
            <div key={apt.id} className="p-5 bg-dark-section rounded-2xl border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-white/20 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 ${
                  apt.status === 'Upcoming' ? 'bg-blue-500/10 text-accent-blue' : 'bg-dark-card border border-white/[0.08] text-txt-muted'
                }`}>
                  <span className="text-[10px] font-bold uppercase leading-none">{new Date(apt.date).toLocaleString('en-US', { month: 'short' })}</span>
                  <span className="text-lg font-black leading-none mt-1">{new Date(apt.date).getDate()}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-txt-primary text-base">{apt.doctor}</h3>
                    <Badge variant={STATUS_CONFIG[apt.status]?.variant || 'slate'} size="sm">{apt.status}</Badge>
                  </div>
                  <div className="text-xs text-txt-secondary mt-1">{apt.department}</div>
                  
                  <div className="flex items-center gap-4 mt-3 text-[11px] text-txt-muted">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {apt.time}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {apt.type === 'Telehealth' ? <Video className="w-3.5 h-3.5 text-accent-emerald" /> : <MapPin className="w-3.5 h-3.5" />}
                      {apt.type} • {apt.location}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 md:w-48 justify-end">
                {apt.status === 'Upcoming' ? (
                  <>
                    <button className="px-3 py-1.5 text-[11px] font-bold text-txt-secondary border border-white/[0.08] hover:bg-dark-hover rounded-lg transition-colors">
                      Reschedule
                    </button>
                    {apt.type === 'Telehealth' && (
                      <button className="px-3 py-1.5 text-[11px] font-bold bg-accent-emerald text-white rounded-lg shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-colors">
                        Join Call
                      </button>
                    )}
                  </>
                ) : (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-txt-secondary bg-dark-card hover:bg-dark-hover border border-white/[0.08] rounded-lg transition-colors">
                    <FileText className="w-3.5 h-3.5" /> View Summary
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientAppointments;
